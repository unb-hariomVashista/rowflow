import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useRouteError, Link } from "react-router";
import { useState, useMemo } from "react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { findShopByDomain, upsertShop } from "../repositories/shop.repository";
import { getAllSyncLogsByShopId } from "../repositories/syncLog.repository";
import { getActivePlanName } from "../services/plan.server";
import { FREE_PLAN, formatPlanDisplayName } from "../constants/plans";
import {
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  RefreshCw,
  Search,
  ExternalLink,
  Lock,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import "../styles/common.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, billing } = await authenticate.admin(request);
  const shopDomain = session.shop;

  let shop = await findShopByDomain(shopDomain);
  if (!shop) {
    shop = await upsertShop(shopDomain);
  }

  const activePlanName = await getActivePlanName(billing);
  const isPaidPlan = activePlanName !== FREE_PLAN && activePlanName !== "Free" && activePlanName !== "Free Plan";

  if (!isPaidPlan) {
    return {
      shopDomain,
      isPaidPlan: false,
      activePlanName,
      sheetUrl: shop.sheetUrl || (shop.sheetId ? `https://docs.google.com/spreadsheets/d/${shop.sheetId}` : null),
      sheetName: shop.sheetId ? `Rowflow - Store Data (${shopDomain})` : null,
      logs: [],
      stats: {
        totalCount: 0,
        successCount: 0,
        failedCount: 0,
        totalItemsProcessed: 0,
      },
    };
  }

  const logs = await getAllSyncLogsByShopId(shop.id, 200);

  const formattedLogs = logs.map((log) => ({
    id: log.id,
    type: log.type,
    status: log.status,
    details: log.details,
    itemCount: log.itemCount,
    createdAt: log.createdAt.toISOString(),
    formattedTime: new Date(log.createdAt).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  }));

  const totalCount = formattedLogs.length;
  const successCount = formattedLogs.filter((l) => l.status === "SUCCESS").length;
  const failedCount = formattedLogs.filter((l) => l.status === "FAILED").length;
  const totalItemsProcessed = formattedLogs.reduce((acc, l) => acc + (l.itemCount || 0), 0);

  return {
    shopDomain,
    isPaidPlan: true,
    activePlanName,
    sheetUrl: shop.sheetUrl || (shop.sheetId ? `https://docs.google.com/spreadsheets/d/${shop.sheetId}` : null),
    sheetName: shop.sheetId ? `Rowflow - Store Data (${shopDomain})` : null,
    logs: formattedLogs,
    stats: {
      totalCount,
      successCount,
      failedCount,
      totalItemsProcessed,
    },
  };
};

export default function LogsPage() {
  const { isPaidPlan, activePlanName, logs, stats, sheetUrl, sheetName } = useLoaderData<typeof loader>();
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SUCCESS" | "FAILED">("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (statusFilter !== "ALL" && log.status !== statusFilter) return false;
      if (typeFilter !== "ALL") {
        if (typeFilter === "EXPORT" && !log.type.includes("EXPORT")) return false;
        if (typeFilter === "IMPORT" && !log.type.includes("IMPORT")) return false;
        if (typeFilter === "SETUP" && (log.type.includes("EXPORT") || log.type.includes("IMPORT"))) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.details.toLowerCase().includes(q) ||
          log.type.toLowerCase().includes(q) ||
          log.formattedTime.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, statusFilter, typeFilter, searchQuery]);

  if (!isPaidPlan) {
    return (
      <s-page heading="Sync Logs">
        <div className="rowflow-container" style={{ maxWidth: 750, margin: "40px auto", padding: "0 16px" }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: 20,
              border: "1px solid #e2e8f0",
              padding: "48px 32px",
              textAlign: "center",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#ecfdf5",
                color: "#008060",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Lock size={30} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0" }}>
              Sync Logs are available on Paid Plans
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 540, margin: "0 auto 28px" }}>
              Your store is currently on the <strong>{formatPlanDisplayName(activePlanName)}</strong>. Sync logs, product change history, and error diagnostics are reserved for paid plans (Starter, Pro, and Unlimited). Free plan stores can still sync products seamlessly.
            </p>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                padding: "20px 24px",
                maxWidth: 480,
                margin: "0 auto 32px",
                textAlign: "left",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Sparkles size={15} color="#008060" /> Unlocked with any paid plan:
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "#475569" }}>
                <li style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Check size={16} color="#008060" /> Full audit history of every import &amp; export sync
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Check size={16} color="#008060" /> Itemized product counts &amp; change summaries
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Check size={16} color="#008060" /> Exact error logs &amp; troubleshooting details
                </li>
              </ul>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <Link
                to="/app/pricing"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 28px",
                  background: "#008060",
                  color: "#ffffff",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(0,128,96,0.25)",
                }}
              >
                View Plans &amp; Upgrade <ArrowRight size={16} />
              </Link>
              <Link
                to="/app/sync"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "12px 22px",
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#334155",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                Go to Sync Data
              </Link>
            </div>
          </div>
        </div>
      </s-page>
    );
  }

  const getEventBadge = (type: string) => {
    if (type.includes("EXPORT")) {
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: 6,
            background: "#eff6ff",
            color: "#1d4ed8",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <ArrowUpRight size={14} /> Shopify → Google Sheets
        </span>
      );
    }
    if (type.includes("IMPORT")) {
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: 6,
            background: "#f0fdf4",
            color: "#15803d",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <ArrowDownLeft size={14} /> Google Sheets → Shopify
        </span>
      );
    }
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "4px 10px",
          borderRadius: 6,
          background: "#f8fafc",
          color: "#475569",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <FileSpreadsheet size={14} /> Sheet Setup
      </span>
    );
  };

  return (
    <s-page heading="Sync Logs">
      <div className="rowflow-container" style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        {/* Top Header Card */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>
              Sync Activity &amp; Audit Logs
            </h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              Track all bi-directional sync events, product count updates, and system operations in real time.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {sheetUrl && (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 14px",
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                  textDecoration: "none",
                }}
              >
                <FileSpreadsheet size={15} color="#0f9d58" /> Open Connected Sheet <ExternalLink size={13} />
              </a>
            )}
            <Link
              to="/app/sync"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 16px",
                background: "#008060",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                color: "#ffffff",
                textDecoration: "none",
                boxShadow: "0 2px 6px rgba(0,128,96,0.2)",
              }}
            >
              <RefreshCw size={14} /> Go to Sync Page
            </Link>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>
              Total Syncs
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
              {stats.totalCount}
            </div>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, color: "#059669", fontWeight: 600, textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
              <CheckCircle2 size={14} /> Successful
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#059669" }}>
              {stats.successCount}
            </div>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, color: stats.failedCount > 0 ? "#dc2626" : "#64748b", fontWeight: 600, textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
              <XCircle size={14} /> Failed / Errors
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: stats.failedCount > 0 ? "#dc2626" : "#0f172a" }}>
              {stats.failedCount}
            </div>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>
              Products Processed
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
              {stats.totalItemsProcessed.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {/* Status Pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginRight: 4, display: "flex", alignItems: "center", gap: 4 }}>
              <Filter size={14} /> Status:
            </span>
            {(["ALL", "SUCCESS", "FAILED"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  border: statusFilter === st ? "1px solid #008060" : "1px solid #e2e8f0",
                  background: statusFilter === st ? "#ecfdf5" : "#ffffff",
                  color: statusFilter === st ? "#065f46" : "#475569",
                  cursor: "pointer",
                }}
              >
                {st === "ALL" ? "All Status" : st === "SUCCESS" ? "Success Only" : "Failed Only"}
              </button>
            ))}

            <span style={{ color: "#cbd5e1", margin: "0 4px" }}>|</span>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #cbd5e1",
                fontSize: 12,
                fontWeight: 500,
                color: "#334155",
                background: "#ffffff",
                cursor: "pointer",
              }}
            >
              <option value="ALL">All Event Types</option>
              <option value="EXPORT">Shopify → Google Sheets</option>
              <option value="IMPORT">Google Sheets → Shopify</option>
              <option value="SETUP">Sheet Setup</option>
            </select>
          </div>

          {/* Search Box */}
          <div style={{ position: "relative", minWidth: 220 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 12px 7px 30px",
                borderRadius: 6,
                border: "1px solid #cbd5e1",
                fontSize: 13,
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Logs Table Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          }}
        >
          {filteredLogs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", color: "#64748b" }}>
              <Activity size={36} style={{ color: "#cbd5e1", marginBottom: 12 }} />
              <h4 style={{ margin: "0 0 6px 0", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                No sync logs found
              </h4>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                {logs.length === 0
                  ? "You haven't run any sync operations yet."
                  : "No sync records match your selected filter."}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "14px 20px", fontWeight: 700, color: "#0f172a", width: "22%" }}>
                      Event Type
                    </th>
                    <th style={{ padding: "14px 16px", fontWeight: 700, color: "#0f172a", width: "42%" }}>
                      Details
                    </th>
                    <th style={{ padding: "14px 16px", fontWeight: 700, color: "#0f172a", width: "10%" }}>
                      Items
                    </th>
                    <th style={{ padding: "14px 16px", fontWeight: 700, color: "#0f172a", width: "12%" }}>
                      Status
                    </th>
                    <th style={{ padding: "14px 20px", fontWeight: 700, color: "#0f172a", width: "14%" }}>
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, idx) => (
                    <tr
                      key={log.id}
                      style={{
                        borderBottom: idx === filteredLogs.length - 1 ? "none" : "1px solid #f1f5f9",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 20px", verticalAlign: "top" }}>
                        {getEventBadge(log.type)}
                      </td>
                      <td style={{ padding: "14px 16px", color: log.status === "FAILED" ? "#b91c1c" : "#334155", lineHeight: 1.5, verticalAlign: "top" }}>
                        <span style={{ wordBreak: "break-word" }}>{log.details}</span>
                      </td>
                      <td style={{ padding: "14px 16px", verticalAlign: "top", fontWeight: 600, color: "#0f172a" }}>
                        {log.itemCount > 0 ? (
                          <span style={{ padding: "2px 8px", background: "#f1f5f9", borderRadius: 10, fontSize: 12 }}>
                            {log.itemCount.toLocaleString()}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                        {log.status === "SUCCESS" ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              color: "#059669",
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          >
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
                            SUCCESS
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              color: "#dc2626",
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          >
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444" }} />
                            FAILED
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "14px 20px", color: "#64748b", fontSize: 12, verticalAlign: "top", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <Clock size={12} />
                          {log.formattedTime}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
