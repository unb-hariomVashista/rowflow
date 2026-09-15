import { getValidAccessToken } from "./google.server";
import { findShopByDomain, updateShop } from "../repositories/shop.repository";
import { createSyncLog } from "../repositories/syncLog.repository";
import prisma from "../db.server";

const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

export interface SheetCreationResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
}

/**
 * Creates a dedicated Google Spreadsheet with Products tab formatted with headers
 */
export async function createSpreadsheet(
  accessToken: string,
  storeDomain: string,
  customTitle?: string,
): Promise<SheetCreationResult> {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const title = customTitle || `Rowflow - ${storeDomain} (${dateStr} ${timeStr})`;

  const createBody = {
    properties: { title },
    sheets: [
      {
        properties: {
          sheetId: 0,
          title: "Products",
          gridProperties: { frozenRowCount: 1 },
        },
      },
    ],
  };

  const response = await fetch(SHEETS_API_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    // Log technical error details on the server for debugging
    console.error("[Sheets API Error] Failed to create Google Spreadsheet:", errorText);

    throw new Error("Failed to create Google Spreadsheet. Please verify your Google Account permissions and try again.");
  }

  const data = (await response.json()) as {
    spreadsheetId: string;
    spreadsheetUrl: string;
  };

  // Format headers for Products tab
  await formatSheetHeaders(accessToken, data.spreadsheetId);

  // Set permission: Anyone with link - Editor
  await setSheetPublicEditorPermission(accessToken, data.spreadsheetId);

  return {
    spreadsheetId: data.spreadsheetId,
    spreadsheetUrl: data.spreadsheetUrl,
  };
}

/**
 * Sets permission of a Google Sheet / Drive File to "Anyone with link - Editor"
 */
export async function setSheetPublicEditorPermission(
  accessToken: string,
  fileId: string,
): Promise<void> {
  const permissionUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`;

  try {
    const response = await fetch(permissionUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "writer",
        type: "anyone",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Drive API Error] Failed to set sheet permission to Anyone with link - Editor:", errorText);
    }
  } catch (err) {
    console.error("[Drive API Error] Exception setting sheet permission:", err);
  }
}

/**
 * Ensures Google Sheet exists for the shop (creates one if missing)
 */
export async function ensureGoogleSheetExists(shopDomain: string) {
  const shop = await findShopByDomain(shopDomain);

  if (!shop || !shop.googleAccount) {
    throw new Error("No Google Account linked to this store.");
  }

  if (shop.sheetId && shop.sheetUrl) {
    return { sheetId: shop.sheetId, sheetUrl: shop.sheetUrl };
  }

  // Set atomic lock
  await updateShop(shopDomain, { isSyncing: true, activeSyncType: "CREATE_SHEET" });

  try {
    const accessToken = await getValidAccessToken(shop.googleAccount.id);
    const { spreadsheetId, spreadsheetUrl } = await createSpreadsheet(accessToken, shopDomain);

    await updateShop(shopDomain, {
      sheetId: spreadsheetId,
      sheetUrl: spreadsheetUrl,
    });

    await createSyncLog({
      shopId: shop.id,
      type: "CREATE_SHEET",
      status: "SUCCESS",
      details: `Created Google Sheet: Rowflow - Store Data (${shopDomain})`,
      itemCount: 0,
    });

    return { sheetId: spreadsheetId, sheetUrl: spreadsheetUrl };
  } finally {
    await updateShop(shopDomain, { isSyncing: false, activeSyncType: null });
  }
}

/**
 * Format sheet headers with background styling, bold text, and column headers
 */
export async function formatSheetHeaders(accessToken: string, spreadsheetId: string) {
  const productHeaders = [
    "Product ID",
    "Title",
    "Handle",
    "Status",
    "Variant ID",
    "Price",
    "SKU",
    "Inventory Quantity",
    "Updated At",
  ];

  // Write header values
  await updateSheetValues(accessToken, spreadsheetId, "Products!A1:I1", [productHeaders]);

  // Format header row aesthetics (green background, white bold text)
  const batchFormatBody = {
    requests: [0].map((sheetId) => ({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.06, green: 0.62, blue: 0.35 }, // #0f9d58
            textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat)",
      },
    })),
  };

  const response = await fetch(`${SHEETS_API_BASE}/${spreadsheetId}:batchUpdate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(batchFormatBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Sheets API Error] Failed to format headers:", errorText);
  }
}

/**
 * Clear and update values in a specific sheet range
 */
export async function updateSheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: (string | number | boolean)[][],
) {
  const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Sheets API Error] Failed to update range ${range}:`, errorText);
    throw new Error("Failed to update Google Sheet values. Please try again.");
  }

  return response.json();
}

/**
 * Clear all content in a sheet tab starting from row 2 onwards
 */
export async function clearSheetDataRows(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
) {
  const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${encodeURIComponent(`${sheetName}!A2:Z100000`)}:clear`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Sheets API Error] Failed to clear ${sheetName} data rows:`, errorText);
  }
}

/**
 * Read values from a specific sheet range
 */
export async function getSheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string,
): Promise<(string | number | boolean)[][]> {
  const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Sheets API Error] Failed to get values for range ${range}:`, errorText);
    throw new Error("Failed to read Google Sheet values. Please ensure the sheet is accessible.");
  }

  const data = (await response.json()) as { values?: (string | number | boolean)[][] };
  return data.values || [];
}

export interface UserGoogleSheetItem {
  id: string;
  name: string;
  url: string;
  lastModified?: string;
}

/**
 * List Google Sheets accessible to the user via Google Drive API & database records
 */
export async function listUserGoogleSheets(
  accessToken: string,
  googleAccountId?: string,
): Promise<UserGoogleSheetItem[]> {
  const sheetMap = new Map<string, UserGoogleSheetItem>();

  // 1. Fetch from Google Drive API
  try {
    const driveUrl = "https://www.googleapis.com/drive/v3/files?" + new URLSearchParams({
      q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
      fields: "files(id,name,webViewLink,createdTime,modifiedTime)",
      orderBy: "modifiedTime desc",
      pageSize: "50",
    });

    const response = await fetch(driveUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
      const data = (await response.json()) as {
        files?: Array<{
          id: string;
          name: string;
          webViewLink?: string;
          modifiedTime?: string;
        }>;
      };

      for (const file of data.files || []) {
        if (file.id && file.name) {
          sheetMap.set(file.id, {
            id: file.id,
            name: file.name,
            url: file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}`,
            lastModified: file.modifiedTime ? new Date(file.modifiedTime).toLocaleString() : undefined,
          });
        }
      }
    }
  } catch (err) {
    console.error("[Sheets API] Error listing sheets via Google Drive API:", err);
  }

  // 2. Combine with DB records for this Google account
  if (googleAccountId) {
    try {
      const shops = await findShopByDomain; // import prisma directly if needed
      const dbShops = await prisma.shop.findMany({
        where: {
          googleAccountId,
          sheetId: { not: null },
        },
      });

      for (const s of dbShops) {
        if (s.sheetId && !sheetMap.has(s.sheetId)) {
          sheetMap.set(s.sheetId, {
            id: s.sheetId,
            name: `Rowflow - Store Data (${s.shopDomain})`,
            url: s.sheetUrl || `https://docs.google.com/spreadsheets/d/${s.sheetId}`,
            lastModified: s.lastSyncedAt ? new Date(s.lastSyncedAt).toLocaleString() : undefined,
          });
        }
      }
    } catch (err) {
      console.error("[DB] Error fetching sheets from Prisma:", err);
    }
  }

  return Array.from(sheetMap.values());
}

/**
 * Connect an existing Google Sheet to a shop
 */
export async function linkExistingSheetToShop(
  shopDomain: string,
  sheetId: string,
  sheetUrl?: string,
  sheetName?: string,
) {
  const shop = await findShopByDomain(shopDomain);
  if (!shop || !shop.googleAccount) {
    throw new Error("No Google Account connected for this store.");
  }

  const finalUrl = sheetUrl || `https://docs.google.com/spreadsheets/d/${sheetId}`;
  const accessToken = await getValidAccessToken(shop.googleAccount.id);

  // Format headers for Products tab if needed
  try {
    await formatSheetHeaders(accessToken, sheetId);
  } catch (err) {
    console.warn("Could not format headers on selected sheet:", err);
  }

  await updateShop(shopDomain, {
    sheetId,
    sheetUrl: finalUrl,
  });

  await createSyncLog({
    shopId: shop.id,
    type: "SELECT_SHEET",
    status: "SUCCESS",
    details: `Connected existing Google Sheet: ${sheetName || sheetId}`,
    itemCount: 0,
  });

  return {
    sheetId,
    sheetUrl: finalUrl,
  };
}

