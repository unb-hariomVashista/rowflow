import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { AlertCircle } from "lucide-react";
import { authenticate } from "../shopify.server";
import { getGoogleAuthUrl, getGoogleClientId } from "../services/google.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  let shop = url.searchParams.get("shop");

  if (!shop) {
    try {
      const { session } = await authenticate.admin(request);
      shop = session?.shop;
    } catch {
      // In top-level request, session might not be attached to headers
    }
  }

  const clientId = getGoogleClientId();

  if (!clientId) {
    return {
      error: "GOOGLE_CLIENT_ID is missing",
      message: "Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file to enable Google authentication.",
      shop: shop || "",
    };
  }

  if (!shop) {
    return {
      error: "Missing shop parameter",
      message: "Could not identify the Shopify store domain. Please launch this action from within Shopify Admin.",
      shop: "",
    };
  }

  const authUrl = getGoogleAuthUrl(shop);

  // Perform direct 302 redirect to Google OAuth consent page
  return Response.redirect(authUrl, 302);
};

export default function AuthGoogle() {
  const data = useLoaderData<typeof loader>();

  // Only renders if there was an error (e.g. missing credentials)
  if (!data || !("error" in data)) {
    return null;
  }

  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        maxWidth: 600,
        margin: "60px auto",
        padding: 32,
        background: "#ffffff",
        borderRadius: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
        color: "#0f172a",
      }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fee2e2", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <AlertCircle size={24} />
      </div>

      <h2 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 700 }}>
        Google OAuth Configuration Required
      </h2>

      <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.5, margin: "0 0 20px 0" }}>
        {data.message}
      </p>

      <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 8, padding: 16, fontSize: 13, fontFamily: "monospace", color: "#334155" }}>
        <div>GOOGLE_CLIENT_ID="your-google-client-id"</div>
        <div>GOOGLE_CLIENT_SECRET="your-google-client-secret"</div>
      </div>
    </div>
  );
}
