import crypto from "crypto";

export interface ImportDiffResult {
  isSheetUnchanged: boolean;
  newSheetHash: string;
  productUpdatesMap: Record<string, { title?: string; status?: string }>;
  productVariantMap: Record<string, Array<{ id: string; price: string; sku: string }>>;
  newSnapshotJson: string;
  modifiedCount: number;
  unchangedCount: number;
  totalRowsProcessed: number;
}

/**
 * Computes a fast, compact 8-character SHA-256 hash string for a variant row.
 */
export function computeVariantHash(title: string, status: string, price: string, sku: string): string {
  const payload = `${title.trim()}|${status.trim().toUpperCase()}|${price.trim()}|${sku.trim()}`;
  return crypto.createHash("sha256").update(payload).digest("hex").substring(0, 8);
}

/**
 * Computes a full SHA-256 hash for raw Google Sheet values.
 */
export function computeSheetHash(rows: (string | number | boolean)[][]): string {
  const payload = JSON.stringify(rows);
  return crypto.createHash("sha256").update(payload).digest("hex");
}

/**
 * Computes two-tiered diff between incoming Google Sheet rows and last saved snapshot.
 */
export function calculateImportDiff(
  rows: (string | number | boolean)[][],
  storedSheetHash: string | null,
  storedSnapshotJson: string | null,
): ImportDiffResult {
  const currentSheetHash = computeSheetHash(rows);

  // Tier 1 Check: If entire sheet hash matches stored sheet hash, return instantly
  if (storedSheetHash && storedSheetHash === currentSheetHash) {
    return {
      isSheetUnchanged: true,
      newSheetHash: currentSheetHash,
      productUpdatesMap: {},
      productVariantMap: {},
      newSnapshotJson: storedSnapshotJson || "{}",
      modifiedCount: 0,
      unchangedCount: rows.length,
      totalRowsProcessed: rows.length,
    };
  }

  // Tier 2 Check: Parse snapshot JSON map (variantId -> hash8)
  let existingSnapshotMap: Record<string, string> = {};
  if (storedSnapshotJson) {
    try {
      existingSnapshotMap = JSON.parse(storedSnapshotJson);
    } catch {
      existingSnapshotMap = {};
    }
  }

  const newSnapshotMap: Record<string, string> = { ...existingSnapshotMap };
  const productVariantMap: Record<string, Array<{ id: string; price: string; sku: string }>> = {};
  const productUpdatesMap: Record<string, { title?: string; status?: string }> = {};

  let modifiedCount = 0;
  let unchangedCount = 0;

  for (const row of rows) {
    const productId = String(row[0] || "").trim();
    const title = String(row[1] || "").trim();
    const status = String(row[3] || "").trim().toUpperCase();
    const variantId = String(row[4] || "").trim();

    let price = String(row[5] || "").replace(/[^0-9.]/g, "");
    if (price && !isNaN(parseFloat(price))) {
      price = parseFloat(price).toFixed(2);
    }

    const sku = String(row[6] || "").trim();

    if (!productId || !variantId) {
      continue;
    }

    const currentHash = computeVariantHash(title, status, price, sku);
    const existingHash = existingSnapshotMap[variantId];

    // Check if this variant row has changed or is new
    if (!existingHash || existingHash !== currentHash) {
      modifiedCount++;
      newSnapshotMap[variantId] = currentHash;

      // Queue product title / status update if provided
      if (title || status) {
        if (!productUpdatesMap[productId]) {
          productUpdatesMap[productId] = {
            ...(title ? { title } : {}),
            ...(status && ["ACTIVE", "DRAFT", "ARCHIVED"].includes(status) ? { status } : {}),
          };
        }
      }

      // Queue variant price / SKU update
      if (price) {
        if (!productVariantMap[productId]) {
          productVariantMap[productId] = [];
        }
        productVariantMap[productId].push({ id: variantId, price, sku });
      }
    } else {
      unchangedCount++;
    }
  }

  return {
    isSheetUnchanged: false,
    newSheetHash: currentSheetHash,
    productUpdatesMap,
    productVariantMap,
    newSnapshotJson: JSON.stringify(newSnapshotMap),
    modifiedCount,
    unchangedCount,
    totalRowsProcessed: rows.length,
  };
}

/**
 * Builds a snapshot map JSON string from exported products & variants.
 */
export function buildSnapshotFromProducts(products: any[]): { sheetHash: string; snapshotJson: string } {
  const snapshotMap: Record<string, string> = {};
  const rows: (string | number)[][] = [];

  for (const p of products) {
    for (const v of p.variants?.nodes || []) {
      const title = p.title || "";
      const status = p.status || "";
      const price = v.price || "0.00";
      const sku = v.sku || "";

      snapshotMap[v.id] = computeVariantHash(title, status, price, sku);

      rows.push([
        p.id,
        title,
        p.handle || "",
        status,
        v.id,
        price,
        sku,
        v.inventoryQuantity ?? 0,
        p.updatedAt || "",
      ]);
    }
  }

  const sheetHash = computeSheetHash(rows);
  return {
    sheetHash,
    snapshotJson: JSON.stringify(snapshotMap),
  };
}
