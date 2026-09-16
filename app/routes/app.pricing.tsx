import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Form, redirect, useLoaderData, useRouteError } from "react-router";
import { authenticate } from "../shopify.server";
import {
  FREE_PLAN,
  STARTER_PLAN,
  PRO_PLAN,
  UNLIMITED_PLAN,
  formatPlanDisplayName,
} from "../constants/plans";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { findShopByDomain, upsertShop, updateShop } from "../repositories/shop.repository";
import { Check, AlertCircle, Sparkles } from "lucide-react";
import { getActivePlanName, getPlanLimit } from "../services/plan.server";
import "../styles/common.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing, session, admin } = await authenticate.admin(request);
  const shopDomain = session.shop;

  let shop = await findShopByDomain(shopDomain);
  if (!shop) {
    shop = await upsertShop(shopDomain);
  }

  let productCount = shop.productCount || 0;
  if (productCount === 0 && admin) {
    try {
      const countRes = await admin.graphql(`
        query {
          productsCount {
            count
          }
        }
      `);
      const countData = await countRes.json();
      if (typeof countData?.data?.productsCount?.count === "number") {
        productCount = countData.data.productsCount.count;
        await updateShop(shopDomain, { productCount });
      }
    } catch (e) {
      // ignore
    }
  }

  // Check Shopify active payment
  const activePlanName = await getActivePlanName(billing);

  // Map active plan name to tier
  let currentTier: "free" | "starter" | "pro" | "unlimited" = "free";
  if (activePlanName === UNLIMITED_PLAN || activePlanName === "Unlimited Plan") {
    currentTier = "unlimited";
  } else if (activePlanName === PRO_PLAN || activePlanName === "Pro Plan") {
    currentTier = "pro";
  } else if (activePlanName === STARTER_PLAN || activePlanName === "Starter Plan") {
    currentTier = "starter";
  } else {
    currentTier = "free";
  }

  // Determine best-fit plan tier dynamically based on store's product count
  let recommendedTier: "free" | "starter" | "pro" | "unlimited" = "free";
  if (productCount <= 10) {
    recommendedTier = "free";
  } else if (productCount <= 500) {
    recommendedTier = "starter";
  } else if (productCount <= 2000) {
    recommendedTier = "pro";
  } else {
    recommendedTier = "unlimited";
  }

  const limit = getPlanLimit(activePlanName);
  const isLimitExceeded = productCount > limit;

  return {
    shopDomain,
    productCount,
    currentTier,
    recommendedTier,
    activePlanName,
    limit: limit === Infinity ? "Unlimited" : limit,
    isLimitExceeded,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const plan = formData.get("plan") as string;

  const url = new URL(request.url);
  const returnUrl = `${url.origin}/app?shop=${encodeURIComponent(session.shop)}`;

  if (plan === STARTER_PLAN || plan === PRO_PLAN || plan === UNLIMITED_PLAN) {
    try {
      return await billing.request({
        plan,
        isTest: true,
        returnUrl,
      });
    } catch (error: any) {
      console.error("Billing request failed:", error?.message, JSON.stringify(error?.errorData || error, null, 2));
      throw error;
    }
  }

  // Cancel subscription if switching back to Free plan
  const billingCheck = await billing.check({
    plans: [STARTER_PLAN, PRO_PLAN, UNLIMITED_PLAN, "Starter Plan", "Pro Plan", "Unlimited Plan"],
    isTest: true,
  });
  if (billingCheck.hasActivePayment && billingCheck.appSubscriptions.length > 0) {
    const activeSub = billingCheck.appSubscriptions[0];
    await billing.cancel({
      subscriptionId: activeSub.id,
      isTest: true,
      prorate: true,
    });
  }

  return redirect("/app/pricing");
};

export default function PricingPage() {
  const { productCount, currentTier, recommendedTier, activePlanName, limit, isLimitExceeded } = useLoaderData<typeof loader>();

  const plans = [
    {
      id: "free",
      billingName: FREE_PLAN,
      name: "Free",
      subtitle: "Perfect for getting started",
      price: "$0",
      period: "forever",
      ctaText: "Switch to Free",
      cardFooter: "Great for testing Rowflow with a small catalog.",
      features: [
        "Up to 10 products",
        "Bi-directional sync (Shopify ↔ Google Sheets)",
        "Google Sheets integration",
        "Manual sync trigger",
        "10 recent audit logs",
      ],
    },
    {
      id: "starter",
      billingName: STARTER_PLAN,
      name: "Starter",
      subtitle: "For growing stores",
      price: "$5",
      period: "month",
      ctaText: "Upgrade to Starter",
      cardFooter: "Everything you need to keep your store in sync.",
      features: [
        "Up to 500 products",
        "Bi-directional sync",
        "Automated header styling",
        "Bulk price & SKU updates",
        "50 recent audit logs",
        "Standard support",
      ],
    },
    {
      id: "pro",
      billingName: PRO_PLAN,
      name: "Pro",
      subtitle: "For scaling businesses",
      price: "$10",
      period: "month",
      ctaText: "Upgrade to Pro",
      cardFooter: "Built for serious store owners with larger catalogs.",
      features: [
        "Up to 2,000 products",
        "Bi-directional cursor sync",
        "Product Title & Status updates",
        "Automated price sanitization",
        "Unlimited audit logs",
        "Priority email support",
      ],
    },
    {
      id: "unlimited",
      billingName: UNLIMITED_PLAN,
      name: "Unlimited",
      subtitle: "For high-volume stores",
      price: "$30",
      period: "month",
      ctaText: "Upgrade to Unlimited",
      cardFooter: "Maximum power, zero limits. Tailored for enterprise stores.",
      features: [
        "Unlimited products & variants",
        "Fast bulk GraphQL processing",
        "Custom field mapping support",
        "Dedicated sync bandwidth",
        "24/7 priority support",
        "Custom onboarding setup",
      ],
    },
  ];

  const comparisonRows = [
    {
      feature: "Product limit",
      free: "Up to 10",
      starter: "Up to 500",
      pro: "Up to 2,000",
      unlimited: "Unlimited",
    },
    {
      feature: "Bi-directional sync",
      free: true,
      starter: true,
      pro: true,
      unlimited: true,
    },
    {
      feature: "Google Sheets integration",
      free: true,
      starter: true,
      pro: true,
      unlimited: true,
    },
    {
      feature: "Manual sync trigger",
      free: true,
      starter: true,
      pro: true,
      unlimited: true,
    },
    {
      feature: "Automated header styling",
      free: false,
      starter: true,
      pro: true,
      unlimited: true,
    },
    {
      feature: "Bulk price & SKU updates",
      free: false,
      starter: true,
      pro: true,
      unlimited: true,
    },
    {
      feature: "Product Title & Status updates",
      free: false,
      starter: false,
      pro: true,
      unlimited: true,
    },
    {
      feature: "Automated price sanitization",
      free: false,
      starter: false,
      pro: true,
      unlimited: true,
    },
    {
      feature: "Custom field mapping",
      free: false,
      starter: false,
      pro: false,
      unlimited: true,
    },
    {
      feature: "Audit logs (recent)",
      free: "10",
      starter: "50",
      pro: "Unlimited",
      unlimited: "Unlimited",
    },
    {
      feature: "Support",
      free: "Community",
      starter: "Standard",
      pro: "Priority email",
      unlimited: "24/7 Priority + Onboarding",
    },
  ];

  const recommendedPlanObj = plans.find((p) => p.id === recommendedTier);

  return (
    <s-page heading="Billing">
      <div className="rowflow-container" style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        {/* Store Catalog & Recommendation Summary Banner */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "14px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 13,
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155", flexWrap: "wrap" }}>
            <span>Store catalog: <strong>{productCount.toLocaleString()} {productCount === 1 ? "product" : "products"}</strong></span>
            <span style={{ color: "#cbd5e1" }}>&bull;</span>
            <span>Active plan: <strong>{formatPlanDisplayName(activePlanName)}</strong> ({limit === "Unlimited" ? "Unlimited products" : `up to ${typeof limit === "number" ? limit.toLocaleString() : limit} products`})</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#008060", fontWeight: 700, fontSize: 13 }}>
            <Sparkles size={15} />
            <span>Best for your store: <strong>{recommendedPlanObj?.name} Plan</strong> ({recommendedPlanObj?.price === "$0" ? "Free forever" : `${recommendedPlanObj?.price}/month`})</span>
          </div>
        </div>

        {isLimitExceeded && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#991b1b",
              padding: "16px 20px",
              borderRadius: "12px",
              marginBottom: "24px",
              fontWeight: 600,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <AlertCircle size={22} style={{ flexShrink: 0 }} />
            <div>
              <strong>Plan Limit Exceeded:</strong> Your store currently has <strong>{productCount} products</strong> (note: 1 product with multiple variants counts as 1 product), which exceeds your current <strong>{formatPlanDisplayName(activePlanName)}</strong> limit of <strong>{limit} products</strong>. Sync operations are paused. Please upgrade your plan below to continue.
            </div>
          </div>
        )}

        {/* 4 Plan Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(235px, 1fr))",
            gap: 20,
            marginBottom: 48,
          }}
        >
          {plans.map((plan) => {
            const isCurrent = plan.id === currentTier;
            const isRecommended = plan.id === recommendedTier;

            return (
              <div
                key={plan.id}
                style={{
                  background: "#ffffff",
                  borderRadius: 16,
                  padding: 24,
                  border: isRecommended ? "2px solid #008060" : "1px solid #e2e8f0",
                  boxShadow: isRecommended
                    ? "0 10px 25px -5px rgba(0, 128, 96, 0.12)"
                    : "0 2px 10px rgba(0,0,0,0.03)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Recommended Badge */}
                {isRecommended && (
                  <span
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: "#e6f4ea",
                      color: "#008060",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 12,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Sparkles size={12} /> Best for your store
                  </span>
                )}

                <div>
                  {/* Plan Name & Subtitle */}
                  <h3 style={{ margin: "0 0 4px 0", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
                    {plan.name}
                  </h3>
                  <p style={{ margin: "0 0 20px 0", fontSize: 13, color: "#64748b" }}>
                    {plan.subtitle}
                  </p>

                  {/* Price */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: "#0f172a" }}>
                      {plan.price}
                    </span>
                    <span style={{ fontSize: 13, color: "#64748b" }}>/ {plan.period}</span>
                  </div>

                  {/* CTA Button */}
                  <Form method="post" style={{ width: "100%", marginBottom: 24 }}>
                    <input type="hidden" name="plan" value={plan.billingName} />
                    <button
                      type="submit"
                      disabled={isCurrent}
                      style={{
                        width: "100%",
                        padding: "11px 16px",
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 700,
                        border: isCurrent
                          ? "none"
                          : isRecommended
                          ? "none"
                          : "1px solid #cbd5e1",
                        background: isCurrent
                          ? "#f1f5f9"
                          : isRecommended
                          ? "#008060"
                          : "#ffffff",
                        color: isCurrent
                          ? "#64748b"
                          : isRecommended
                          ? "#ffffff"
                          : "#0f172a",
                        cursor: isCurrent ? "default" : "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {isCurrent ? "Current plan" : plan.ctaText}
                    </button>
                  </Form>

                  {/* Features List */}
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0" }}>
                    {plan.features.map((feat, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          fontSize: 13,
                          color: "#334155",
                          marginBottom: 12,
                          lineHeight: 1.4,
                        }}
                      >
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: "#008060",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer */}
                <div
                  style={{
                    borderTop: "1px solid #f1f5f9",
                    paddingTop: 16,
                    fontSize: 12,
                    color: "#64748b",
                    lineHeight: 1.4,
                  }}
                >
                  {plan.cardFooter}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "18px 24px",
                    fontWeight: 700,
                    color: "#0f172a",
                    width: "30%",
                  }}
                >
                  Features
                </th>
                <th
                  style={{
                    padding: "18px 16px",
                    fontWeight: 700,
                    color: recommendedTier === "free" ? "#008060" : "#0f172a",
                    background: recommendedTier === "free" ? "#f0fdf4" : undefined,
                    width: "17.5%",
                  }}
                >
                  Free {recommendedTier === "free" && "★"}
                </th>
                <th
                  style={{
                    padding: "18px 16px",
                    fontWeight: 700,
                    color: recommendedTier === "starter" ? "#008060" : "#0f172a",
                    background: recommendedTier === "starter" ? "#f0fdf4" : undefined,
                    width: "17.5%",
                  }}
                >
                  Starter {recommendedTier === "starter" && "★"}
                </th>
                <th
                  style={{
                    padding: "18px 16px",
                    fontWeight: 700,
                    color: recommendedTier === "pro" ? "#008060" : "#0f172a",
                    background: recommendedTier === "pro" ? "#f0fdf4" : undefined,
                    width: "17.5%",
                  }}
                >
                  Pro {recommendedTier === "pro" && "★"}
                </th>
                <th
                  style={{
                    padding: "18px 16px",
                    fontWeight: 700,
                    color: recommendedTier === "unlimited" ? "#008060" : "#0f172a",
                    background: recommendedTier === "unlimited" ? "#f0fdf4" : undefined,
                    width: "17.5%",
                  }}
                >
                  Unlimited {recommendedTier === "unlimited" && "★"}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: index === comparisonRows.length - 1 ? "none" : "1px solid #f1f5f9",
                  }}
                >
                  <td
                    style={{
                      textAlign: "left",
                      padding: "14px 24px",
                      color: "#334155",
                      fontWeight: 500,
                    }}
                  >
                    {row.feature}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#475569", background: recommendedTier === "free" ? "#f0fdf4" : undefined }}>
                    {typeof row.free === "boolean" ? (
                      row.free ? (
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#008060", color: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )
                    ) : (
                      row.free
                    )}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#475569", background: recommendedTier === "starter" ? "#f0fdf4" : undefined }}>
                    {typeof row.starter === "boolean" ? (
                      row.starter ? (
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#008060", color: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )
                    ) : (
                      row.starter
                    )}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#475569", background: recommendedTier === "pro" ? "#f0fdf4" : undefined }}>
                    {typeof row.pro === "boolean" ? (
                      row.pro ? (
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#008060", color: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )
                    ) : (
                      row.pro
                    )}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#475569", background: recommendedTier === "unlimited" ? "#f0fdf4" : undefined }}>
                    {typeof row.unlimited === "boolean" ? (
                      row.unlimited ? (
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#008060", color: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )
                    ) : (
                      row.unlimited
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
