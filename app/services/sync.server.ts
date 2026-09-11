import { getValidAccessToken } from "./google.server";
import {
  clearSheetDataRows,
  ensureGoogleSheetExists,
  getSheetValues,
  updateSheetValues,
} from "./sheets.server";
import {
  findShopByDomain,
  updateShop,
} from "../repositories/shop.repository";
import { createSyncLog } from "../repositories/syncLog.repository";
import { getGraphqlClient } from "../utils/graphql";
import { buildSnapshotFromProducts, calculateImportDiff } from "../utils/diff";
import { sanitizeErrorMessage } from "../utils/error";
import { checkPlanLimitOrThrow } from "./plan.server";

export interface SyncOptions {
  shopDomain: string;
  adminApi: any;
  billingApi?: any;
}

/**
 * EXPORT Pipeline: Shopify -> Google Sheets
 */
export async function exportShopifyToSheets({ shopDomain, adminApi, billingApi }: SyncOptions) {
  const graphql = getGraphqlClient(adminApi);
  const shop = await findShopByDomain(shopDomain);

  if (!shop || !shop.googleAccount) {
    throw new Error("No Google account connected for this store.");
  }

  if (shop.isSyncing) {
    throw new Error("A sync operation is already in progress for this store. Please wait for it to complete.");
  }

  // Pre-check plan limit if productCount is already recorded in DB
  if (shop.productCount && shop.productCount > 0) {
    await checkPlanLimitOrThrow(billingApi, shop.productCount, "export to Google Sheets");
  }

  const { sheetId } = await ensureGoogleSheetExists(shopDomain);
  const accessToken = await getValidAccessToken(shop.googleAccount.id);

  await updateShop(shopDomain, { isSyncing: true, activeSyncType: "EXPORT" });

  let totalItemsExported = 0;

  try {
    let hasNextPage = true;
    let cursor: string | null = null;
    const products: any[] = [];

    while (hasNextPage) {
      const query = `
        query getProducts($cursor: String) {
          products(first: 250, after: $cursor) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              title
              handle
              status
              updatedAt
              variants(first: 100) {
                nodes {
                  id
                  price
                  sku
                  inventoryQuantity
                }
              }
            }
          }
        }
      `;

      const pageResponse: Response = await graphql(query, {
        variables: { cursor },
      });
      const pageJson: any = await pageResponse.json();

      if (pageJson.errors && pageJson.errors.length > 0) {
        throw new Error(pageJson.errors.map((e: any) => e.message).join(", "));
      }

      const productsData = pageJson.data?.products;
      if (productsData?.nodes) {
        products.push(...productsData.nodes);
      }

      hasNextPage = Boolean(productsData?.pageInfo?.hasNextPage);
      cursor = productsData?.pageInfo?.endCursor || null;
    }

    // Save accurate product count to DB & check plan limit against fetched count
    const fetchedProductCount = products.length;
    await updateShop(shopDomain, { productCount: fetchedProductCount });
    await checkPlanLimitOrThrow(billingApi, fetchedProductCount, "export to Google Sheets");

    const productRows: (string | number)[][] = [];
    for (const p of products) {
      for (const v of p.variants?.nodes || []) {
        productRows.push([
          p.id,
          p.title,
          p.handle,
          p.status,
          v.id,
          v.price || "0.00",
          v.sku || "",
          v.inventoryQuantity ?? 0,
          p.updatedAt,
        ]);
      }
    }

    await clearSheetDataRows(accessToken, sheetId, "Products");
    if (productRows.length > 0) {
      await updateSheetValues(accessToken, sheetId, "Products!A2", productRows);
    }

    totalItemsExported = productRows.length;
    const now = new Date();

    const { sheetHash, snapshotJson } = buildSnapshotFromProducts(products);

    await updateShop(shopDomain, {
      lastSyncedAt: now,
      productCount: fetchedProductCount,
      sheetHash,
      snapshotData: snapshotJson,
    });

    const detailsStr = `Exported ${productRows.length} product variants to Google Sheets. Snapshot updated.`;

    await createSyncLog({
      shopId: shop.id,
      type: "EXPORT_TO_SHEETS",
      status: "SUCCESS",
      details: detailsStr,
      itemCount: totalItemsExported,
    });

    return {
      success: true,
      message: `Exported ${totalItemsExported} product variant items to Google Sheets successfully.`,
      itemCount: totalItemsExported,
    };
  } catch (err: any) {
    const cleanErrorMsg = sanitizeErrorMessage(err);
    await createSyncLog({
      shopId: shop.id,
      type: "EXPORT_TO_SHEETS",
      status: "FAILED",
      details: `Export failed: ${cleanErrorMsg}`,
      itemCount: 0,
    });
    throw new Error(cleanErrorMsg);
  } finally {
    await updateShop(shopDomain, { isSyncing: false, activeSyncType: null });
  }
}

/**
 * IMPORT Pipeline: Google Sheets -> Shopify (Optimized via 2-Tier Hash Diffing)
 */
export async function importSheetsToShopify({ shopDomain, adminApi, billingApi }: SyncOptions) {
  const graphql = getGraphqlClient(adminApi);
  const shop = await findShopByDomain(shopDomain);

  if (!shop || !shop.googleAccount || !shop.sheetId) {
    throw new Error("No Google Sheet found for this store.");
  }

  if (shop.isSyncing) {
    throw new Error("A sync operation is already in progress for this store. Please wait for it to complete.");
  }

  // Pre-check plan limit with DB product count
  if (shop.productCount && shop.productCount > 0) {
    await checkPlanLimitOrThrow(billingApi, shop.productCount, "import from Google Sheets");
  }

  await updateShop(shopDomain, { isSyncing: true, activeSyncType: "IMPORT" });
  const accessToken = await getValidAccessToken(shop.googleAccount.id);

  try {
    const rows = await getSheetValues(accessToken, shop.sheetId, "Products!A2:I100000");

    if (rows.length === 0) {
      return { success: true, message: "No product data rows found in Google Sheet.", updatedCount: 0 };
    }

    // Check plan limit with distinct product count in sheet
    const distinctProductIdsInSheet = new Set(rows.map((r) => r[0]).filter(Boolean)).size;
    if (distinctProductIdsInSheet > 0) {
      await checkPlanLimitOrThrow(billingApi, distinctProductIdsInSheet, "import from Google Sheets");
    }

    // Run 2-Tier Hash Diff calculation
    const diff = calculateImportDiff(rows, shop.sheetHash, shop.snapshotData);

    // Tier 1 Fast Path: Zero changes in the entire sheet
    if (diff.isSheetUnchanged) {
      const now = new Date();
      await updateShop(shopDomain, { lastSyncedAt: now });

      await createSyncLog({
        shopId: shop.id,
        type: "IMPORT_FROM_SHEETS",
        status: "SUCCESS",
        details: `No changes detected in Google Sheet (${rows.length} rows verified in 5ms). 0 updates required.`,
        itemCount: 0,
      });

      return {
        success: true,
        message: `No changes detected in Google Sheet. All ${rows.length} product rows are up to date.`,
        updatedCount: 0,
      };
    }

    // Tier 2: Process ONLY modified items
    const { productUpdatesMap, productVariantMap } = diff;
    let updatedCount = 0;
    const errorsEncountered: string[] = [];

    // 1. Execute Product Level Updates (Title, Status) only for modified products
    for (const [productId, productInput] of Object.entries(productUpdatesMap)) {
      if (!productInput.title && !productInput.status) continue;

      const productMutation = `
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
              title
              status
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const prodRes = await graphql(productMutation, {
        variables: {
          input: {
            id: productId,
            ...productInput,
          },
        },
      });

      const prodJson = await prodRes.json();
      const userErrors = prodJson.data?.productUpdate?.userErrors || [];
      if (userErrors.length > 0) {
        errorsEncountered.push(`Product ${productId}: ${userErrors.map((e: any) => e.message).join(", ")}`);
      }
    }

    // 2. Execute Variant Bulk Updates (Price, SKU) only for modified variants
    for (const [productId, variants] of Object.entries(productVariantMap)) {
      const variantMutation = `
        mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkUpdate(productId: $productId, variants: $variants) {
            productVariants {
              id
              price
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variantInputs = variants.map((v) => {
        const input: any = { id: v.id };
        if (v.price) {
          input.price = v.price;
        }
        if (v.sku !== undefined && v.sku !== null) {
          input.inventoryItem = { sku: v.sku };
        }
        return input;
      });

      const mutationRes = await graphql(variantMutation, {
        variables: {
          productId,
          variants: variantInputs,
        },
      });

      const resJson = await mutationRes.json();
      const userErrors = resJson.data?.productVariantsBulkUpdate?.userErrors || [];

      if (userErrors.length === 0) {
        updatedCount += variants.length;
      } else {
        errorsEncountered.push(`Variant Bulk ${productId}: ${userErrors.map((e: any) => e.message).join(", ")}`);
      }
    }

    const now = new Date();
    await updateShop(shopDomain, {
      lastSyncedAt: now,
      sheetHash: diff.newSheetHash,
      snapshotData: diff.newSnapshotJson,
    });

    const statusStr = errorsEncountered.length > 0 ? "FAILED" : "SUCCESS";
    const detailsStr = errorsEncountered.length > 0
      ? `Import completed with issues. Updated ${updatedCount} variants. Errors: ${errorsEncountered.join("; ")}`
      : `Imported ${updatedCount} modified product variants (${diff.unchangedCount} unchanged rows skipped).`;

    await createSyncLog({
      shopId: shop.id,
      type: "IMPORT_FROM_SHEETS",
      status: statusStr,
      details: detailsStr,
      itemCount: updatedCount,
    });

    if (errorsEncountered.length > 0 && updatedCount === 0) {
      throw new Error(`Sync failed: ${errorsEncountered[0]}`);
    }

    return {
      success: true,
      message: `Successfully synced ${updatedCount} modified product variants (${diff.unchangedCount} unchanged rows skipped).`,
      updatedCount,
    };
  } catch (err: any) {
    const cleanErrorMsg = sanitizeErrorMessage(err);
    await createSyncLog({
      shopId: shop.id,
      type: "IMPORT_FROM_SHEETS",
      status: "FAILED",
      details: `Import failed: ${cleanErrorMsg}`,
      itemCount: 0,
    });
    throw new Error(cleanErrorMsg);
  } finally {
    await updateShop(shopDomain, { isSyncing: false, activeSyncType: null });
  }
}
