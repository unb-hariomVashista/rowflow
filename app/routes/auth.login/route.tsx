import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";
import { ArrowRight, Store } from "lucide-react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const errors = loginErrorMessage(await login(request));

  return { errors };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const errors = loginErrorMessage(await login(request));

  return {
    errors,
  };
};

export default function Auth() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;

  return (
    <AppProvider embedded={false}>
      <div
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#ffffff",
          borderRadius: 24,
          padding: 40,
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
          border: "1px solid #e2e8f0",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <img
            src="/logo.png"
            alt="Rowflow Logo"
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>
          Log in to Rowflow - Product Management
        </h1>
        <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 32px 0", lineHeight: 1.5 }}>
          Enter your Shopify store domain to authenticate and manage your product sync.
        </p>

        <Form method="post" style={{ textAlign: "left" }}>
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="shop"
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#334155",
                marginBottom: 8,
              }}
            >
              Shopify Store Domain
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="shop"
                type="text"
                name="shop"
                placeholder="my-store-name.myshopify.com"
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                autoComplete="on"
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 42px",
                  fontSize: 14,
                  borderRadius: 12,
                  border: errors?.shop ? "1.5px solid #ef4444" : "1px solid #cbd5e1",
                  background: "#f8fafc",
                  color: "#0f172a",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
                }}
              />
              <Store
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
            </div>
            {errors?.shop && (
              <p style={{ color: "#ef4444", fontSize: 13, marginTop: 6, marginBottom: 0 }}>
                {errors.shop}
              </p>
            )}
            <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 6, marginBottom: 0 }}>
              e.g. <code>my-store.myshopify.com</code>
            </p>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "#0284c7",
              color: "#ffffff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)",
              transition: "background 0.2s ease",
            }}
          >
            Log in with Shopify Store <ArrowRight size={18} />
          </button>
        </Form>
      </div>
    </div>
    </AppProvider>
  );
}
