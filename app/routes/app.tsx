import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider embedded apiKey={apiKey}>
      <s-app-nav>
        <s-link href="/app">Home</s-link>
        <s-link href="/app/sync">Sync Data</s-link>
        <s-link href="/app/pricing">Pricing</s-link>
      </s-app-nav>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  const error = useRouteError();
  // Handle standalone browser access (when loaded directly outside Shopify Admin iframe)
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    ((error as any).data === "200" || (error as any).data === 200)
  ) {
    return (
      <div
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          maxWidth: 500,
          margin: "80px auto",
          padding: 32,
          textAlign: "center",
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
          color: "#0f172a",
        }}
      >
        <h2 style={{ margin: "0 0 12px 0", fontSize: 22, fontWeight: 700 }}>
          RowFlow Shopify App
        </h2>
        <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px 0" }}>
          RowFlow is designed to run embedded inside your Shopify Store Admin. Please open the app directly from your Shopify Admin menu or log in below.
        </p>
        <a
          href="/auth/login"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "#0284c7",
            color: "#ffffff",
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          Log in with Shopify Store
        </a>
      </div>
    );
  }
  return boundary.error(error);
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
