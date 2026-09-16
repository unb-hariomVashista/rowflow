/**
 * Rowflow - Dedicated Manage Your Sync Route
 */
import { useState } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { Link, useFetcher, useLoaderData, useRouteError } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import {
  exportShopifyToSheets,
  importSheetsToShopify,
} from "../services/sync.server";
import {
  ensureGoogleSheetExists,
  linkExistingSheetToShop,
  listUserGoogleSheets,
} from "../services/sheets.server";
import { getValidAccessToken } from "../services/google.server";
import {
  findShopByDomain,
  updateShop,
  upsertShop,
} from "../repositories/shop.repository";
import { sanitizeErrorMessage } from "../utils/error";
import { getActivePlanName, getPlanLimit } from "../services/plan.server";
import { formatPlanDisplayName } from "../constants/plans";
import { AlertCircle } from "lucide-react";

// Import Modular Components & Scoped Styles
import "../styles/common.css";
import { SyncHero } from "../components/sync/SyncHero";
import { DirectionTabSwitcher } from "../components/sync/DirectionTabSwitcher";
import { UnconnectedSheetState } from "../components/sync/UnconnectedSheetState";
import { SyncProgressBanner } from "../components/sync/SyncProgressBanner";
import { SyncExportPanel } from "../components/sync/SyncExportPanel";
import { SyncImportPanel } from "../components/sync/SyncImportPanel";
import { SyncSidebar } from "../components/sync/SyncSidebar";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  let shop = await findShopByDomain(shopDomain, 15);
  if (!shop) {
    shop = await upsertShop(shopDomain);
  }

  const googleAccount = shop.googleAccount;
  const isAuthenticated = Boolean(googleAccount && googleAccount.accessToken);

  const activePlanName = await getActivePlanName(billing);
  const planLimit = getPlanLimit(activePlanName);
  const productCount = shop.productCount || 0;
  const isPlanLimitExceeded = productCount > planLimit;

  let availableSheets: Array<{
    id: string;
    name: string;
    url: string;
    lastModified?: string;
  }> = [];

  if (isAuthenticated && googleAccount) {
    try {
      const accessToken = await getValidAccessToken(googleAccount.id);
      availableSheets = await listUserGoogleSheets(accessToken, googleAccount.id);
    } catch (err) {
      console.warn("Could not list user Google Sheets:", err);
    }
  }

  return {
    shopDomain,
    isAuthenticated,
    isShopSyncing: Boolean(shop.isSyncing),
    activeSyncType: shop.activeSyncType,
    productCount: shop.productCount,
    planInfo: {
      activePlanName: formatPlanDisplayName(activePlanName),
      planLimit: planLimit === Infinity ? "Unlimited" : planLimit,
      productCount,
      isPlanLimitExceeded,
    },
    availableSheets,
    sheet: {
      sheetId: shop.sheetId,
      sheetUrl:
        shop.sheetUrl ||
        (shop.sheetId ? `https://docs.google.com/spreadsheets/d/${shop.sheetId}` : null),
      sheetName: shop.sheetId ? `Rowflow - Store Data (${shopDomain})` : null,
      lastSyncedAt: shop.lastSyncedAt ? new Date(shop.lastSyncedAt).toLocaleString() : "Never",
    },
    googleAccount: googleAccount
      ? {
          email: googleAccount.email || "",
          name: googleAccount.email?.split("@")[0] || "",
        }
      : null,
    syncLogs: (shop.syncLogs || []).map((log) => ({
      id: log.id,
      type: log.type,
      status: log.status,
      details: log.details,
      itemCount: log.itemCount,
      createdAt: new Date(log.createdAt).toLocaleString(),
    })),
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, billing, session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "select_sheet") {
      const sheetId = String(formData.get("sheetId") || "");
      const sheetUrl = String(formData.get("sheetUrl") || "");
      const sheetName = String(formData.get("sheetName") || "");

      if (!sheetId) {
        throw new Error("No Google Sheet ID provided for selection.");
      }

      const result = await linkExistingSheetToShop(shopDomain, sheetId, sheetUrl, sheetName);
      return {
        success: true,
        message: "Google Sheet connected successfully!",
        sheetId: result.sheetId,
        sheetUrl: result.sheetUrl,
      };
    }

    if (intent === "clear_sheet_selection") {
      await updateShop(shopDomain, { sheetId: null, sheetUrl: null });
      return { success: true, message: "Disconnected active sheet selection.", cleared: true };
    }

    if (intent === "create_sheet") {
      const { sheetId, sheetUrl } = await ensureGoogleSheetExists(shopDomain);
      return {
        success: true,
        message: "Google Sheet created successfully!",
        sheetId,
        sheetUrl,
      };
    }

    if (intent === "export_to_sheets") {
      const result = await exportShopifyToSheets({
        shopDomain,
        adminApi: admin,
        billingApi: billing,
      });
      return { success: true, message: result.message };
    }

    if (intent === "import_from_sheets") {
      const result = await importSheetsToShopify({
        shopDomain,
        adminApi: admin,
        billingApi: billing,
      });
      return { success: true, message: result.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: sanitizeErrorMessage(error) };
  }
};

export default function SyncDataPage() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const [activeTab, setActiveTab] = useState<"export" | "import">("export");
  const isSyncing = fetcher.state !== "idle" || loaderData.isShopSyncing;
  const syncingIntent = fetcher.formData?.get("intent");
  const activeSyncType = syncingIntent
    ? (syncingIntent === "export_to_sheets" ? "EXPORT" : syncingIntent === "import_from_sheets" ? "IMPORT" : syncingIntent === "create_sheet" ? "CREATE_SHEET" : loaderData.activeSyncType)
    : loaderData.activeSyncType;

  const isExporting = isSyncing && activeSyncType === "EXPORT";
  const isImporting = isSyncing && activeSyncType === "IMPORT";
  const isCreating = isSyncing && activeSyncType === "CREATE_SHEET";
  const isSelecting = isSyncing && syncingIntent === "select_sheet";

  const handleCreateSheet = () => {
    fetcher.submit({ intent: "create_sheet" }, { method: "POST" });
  };

  const handleSelectSheet = (sheet: { id: string; name: string; url: string }) => {
    fetcher.submit(
      {
        intent: "select_sheet",
        sheetId: sheet.id,
        sheetName: sheet.name,
        sheetUrl: sheet.url,
      },
      { method: "POST" }
    );
  };

  const handleChangeSheet = () => {
    fetcher.submit({ intent: "clear_sheet_selection" }, { method: "POST" });
  };

  const handleStartExport = () => {
    fetcher.submit({ intent: "export_to_sheets" }, { method: "POST" });
  };

  const handleStartImport = () => {
    fetcher.submit({ intent: "import_from_sheets" }, { method: "POST" });
  };

  // Case 1: Google Account is not connected
  if (!loaderData.isAuthenticated) {
    return (
      <s-page heading="Manage your sync">
        <div className="rowflow-container">
          <div
            style={{
              background: "#ffffff",
              borderRadius: 20,
              padding: 48,
              textAlign: "center",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 16px -2px rgba(0,0,0,0.03)",
            }}
          >
            <h2>Google Account Not Connected</h2>
            <p style={{ color: "#64748b", margin: "12px 0 28px" }}>
              Please connect your Google Account on the Home page first before managing your sync.
            </p>
            <Link to="/app" className="rowflow-btn-primary-action export-btn" style={{ textDecoration: "none" }}>
              Go to Home Page
            </Link>
          </div>
        </div>
      </s-page>
    );
  }

  const currentSheetId = loaderData.sheet.sheetId || fetcher.data?.sheetId;
  const currentSheetUrl =
    loaderData.sheet.sheetUrl ||
    fetcher.data?.sheetUrl ||
    (currentSheetId ? `https://docs.google.com/spreadsheets/d/${currentSheetId}` : null);
  const currentSheetName =
    loaderData.sheet.sheetName ||
    (currentSheetId ? `Rowflow - Store Data (${loaderData.shopDomain})` : null);
  const hasSheet = Boolean(currentSheetId) && !(fetcher.data as any)?.cleared;

  // Case 2: Google Account IS connected, but NO Google Sheet has been selected yet
  if (!hasSheet) {
    return (
      <s-page heading="Manage your sync">
        <div className="rowflow-container">
          <SyncProgressBanner
            isSyncing={isSyncing}
            isExporting={isExporting}
            isImporting={isImporting}
            isCreating={isCreating}
            message={fetcher.data?.message}
            error={fetcher.data?.error}
          />
          <SyncHero activeTab="export" />
          <DirectionTabSwitcher activeTab="export" onTabChange={() => {}} />
          <UnconnectedSheetState
            availableSheets={loaderData.availableSheets}
            onSelectSheet={handleSelectSheet}
            isSelecting={isSelecting}
            onCreateSheet={handleCreateSheet}
            isCreating={isCreating}
          />
        </div>
      </s-page>
    );
  }

  // Case 3: Google Account IS connected AND Google Sheet IS created / selected (Full 2-Tab Sync Dashboard)
  return (
    <s-page heading="Manage your sync">
      <div className="rowflow-container">
        <SyncProgressBanner
          isSyncing={isSyncing}
          isExporting={isExporting}
          isImporting={isImporting}
          isCreating={isCreating}
          message={fetcher.data?.message}
          error={fetcher.data?.error}
        />

        <SyncHero activeTab={activeTab} />
        <DirectionTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="rowflow-sync-main-grid">
          <div className="rowflow-sync-control-card">
            {activeTab === "export" ? (
              <SyncExportPanel
                onStartExport={handleStartExport}
                isSyncing={isSyncing}
                isExporting={isExporting}
              />
            ) : (
              <SyncImportPanel
                onStartImport={handleStartImport}
                isSyncing={isSyncing}
                isImporting={isImporting}
              />
            )}
          </div>

          <SyncSidebar
            sheetName={currentSheetName}
            sheetUrl={currentSheetUrl}
            lastSyncedAt={loaderData.sheet.lastSyncedAt}
            activeTab={activeTab}
            onChangeSheet={handleChangeSheet}
          />
        </div>
      </div>
    </s-page>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
