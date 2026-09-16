import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useLoaderData, useFetcher, useSubmit, redirect } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { disconnectGoogleAccount } from "../services/google.server";
import {
  exportShopifyToSheets,
  importSheetsToShopify,
} from "../services/sync.server";
import {
  findShopByDomain,
  updateShop,
  upsertShop,
} from "../repositories/shop.repository";
import { UnauthenticatedHome } from "../components/UnauthenticatedHome";
import { AuthenticatedHome } from "../components/AuthenticatedHome";
import { sanitizeErrorMessage } from "../utils/error";
import { getActivePlanName, getPlanLimit } from "../services/plan.server";
import { formatPlanDisplayName } from "../constants/plans";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  let shop = await findShopByDomain(shopDomain, 10);
  if (!shop) {
    shop = await upsertShop(shopDomain);
  }

  const googleAccount = shop.googleAccount;
  const isAuthenticated = Boolean(googleAccount && googleAccount.accessToken);

  const activePlanName = await getActivePlanName(billing);
  const planLimit = getPlanLimit(activePlanName);
  const productCount = shop.productCount || 0;
  const isPlanLimitExceeded = productCount > planLimit;

  return {
    shopDomain,
    isAuthenticated,
    isShopSyncing: Boolean(shop.isSyncing),
    planInfo: {
      activePlanName: formatPlanDisplayName(activePlanName),
      planLimit: planLimit === Infinity ? "Unlimited" : planLimit,
      productCount,
      isPlanLimitExceeded,
    },
    shop: {
      sheetId: shop.sheetId,
      sheetUrl: shop.sheetUrl || (shop.sheetId ? `https://docs.google.com/spreadsheets/d/${shop.sheetId}` : null),
      sheetName: shop.sheetId ? `Rowflow - Store Data (${shopDomain})` : "Not Created Yet",
      lastSyncedAt: shop.lastSyncedAt ? new Date(shop.lastSyncedAt).toLocaleString() : "Never",
      productCount: shop.productCount,
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

    if (intent === "clear_sheet_selection") {
      await updateShop(shopDomain, { sheetId: null, sheetUrl: null });
      return redirect("/app/sync");
    }

    if (intent === "disconnect") {
      await disconnectGoogleAccount(shopDomain);
      return { success: true, isAuthenticated: false };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: sanitizeErrorMessage(error) };
  }
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const submit = useSubmit();

  const isAuthenticated =
    fetcher.data?.isAuthenticated ?? loaderData.isAuthenticated;

  const isSyncing = fetcher.state !== "idle" || loaderData.isShopSyncing;

  const handleDisconnectGoogle = () => {
    fetcher.submit({ intent: "disconnect" }, { method: "POST" });
  };

  const handleSwitchSheet = () => {
    submit({ intent: "clear_sheet_selection" }, { method: "POST" });
  };

  const handleSyncToSheets = () => {
    fetcher.submit({ intent: "export_to_sheets" }, { method: "POST" });
  };

  const handleSyncFromSheets = () => {
    fetcher.submit({ intent: "import_from_sheets" }, { method: "POST" });
  };

  return (
    <s-page heading="Home">
      <div className="rowflow-container">
        {isAuthenticated ? (
          <AuthenticatedHome
            shopDomain={loaderData.shopDomain}
            googleAccount={loaderData.googleAccount}
            sheet={loaderData.shop}
            syncLogs={loaderData.syncLogs}
            planInfo={loaderData.planInfo}
            onDisconnect={handleDisconnectGoogle}
            onSwitchSheet={handleSwitchSheet}
            onSyncToSheets={handleSyncToSheets}
            onSyncFromSheets={handleSyncFromSheets}
            isSyncing={isSyncing}
            fetcherMessage={fetcher.data?.message}
            fetcherError={fetcher.data?.error}
          />
        ) : (
          <UnauthenticatedHome shopDomain={loaderData.shopDomain} />
        )}
      </div>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
