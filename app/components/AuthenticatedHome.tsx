import React from "react";
import { Link } from "react-router";
import { CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownLeft, ArrowRight } from "lucide-react";
import { HeroBanner } from "./home/HeroBanner";
import { AccountStatusCard } from "./home/AccountStatusCard";
import { RecentActivityTable, type SyncLogItem } from "./home/RecentActivityTable";

interface GoogleAccountInfo {
  email: string;
  name?: string;
}

interface SheetInfo {
  sheetId: string | null;
  sheetUrl: string | null;
  sheetName: string;
  lastSyncedAt: string;
}

interface PlanInfoProp {
  activePlanName: string;
  planLimit: string | number;
  productCount: number;
  isPlanLimitExceeded: boolean;
}

interface AuthenticatedHomeProps {
  shopDomain: string;
  googleAccount: GoogleAccountInfo | null;
  sheet?: SheetInfo;
  syncLogs?: SyncLogItem[];
  planInfo?: PlanInfoProp;
  onDisconnect: () => void;
  onSwitchSheet?: () => void;
  onSyncToSheets: () => void;
  onSyncFromSheets: () => void;
  isSyncing?: boolean;
  fetcherMessage?: string;
  fetcherError?: string;
}

export function AuthenticatedHome({
  googleAccount,
  sheet = { sheetId: null, sheetUrl: null, sheetName: "Rowflow Google Sheet", lastSyncedAt: "Never" },
  syncLogs = [],
  planInfo,
  onDisconnect,
  onSwitchSheet,
  fetcherMessage,
  fetcherError,
}: AuthenticatedHomeProps) {
  return (
    <>
      {/* Plan Limit Exceeded Banner */}
      {planInfo?.isPlanLimitExceeded && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #ef4444",
            color: "#991b1b",
            padding: "14px 20px",
            borderRadius: "12px",
            marginBottom: "20px",
            fontWeight: 600,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>
              <strong>Plan Limit Exceeded:</strong> Store has {planInfo.productCount} products (1 product with variants = 1 product), which exceeds your current {planInfo.activePlanName} limit of {planInfo.planLimit} products. Sync operations are disabled.
            </span>
          </div>
          <Link
            to="/app/pricing"
            style={{
              background: "#dc2626",
              color: "#ffffff",
              padding: "7px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Upgrade Plan
          </Link>
        </div>
      )}

      {/* Status Notifications */}
      {fetcherMessage && (
        <div
          style={{
            background: "#ecfdf5",
            border: "1px solid #10b981",
            color: "#065f46",
            padding: "12px 16px",
            borderRadius: "12px",
            marginBottom: "20px",
            fontWeight: 600,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle2 size={18} />
          {fetcherMessage}
        </div>
      )}

      {fetcherError && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #ef4444",
            color: "#991b1b",
            padding: "12px 16px",
            borderRadius: "12px",
            marginBottom: "20px",
            fontWeight: 600,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AlertCircle size={18} />
          {fetcherError}
        </div>
      )}

      {/* 1. Top Authenticated Hero Banner */}
      <HeroBanner isAuthenticated={true} />

      {/* 2. Connected Account Status Bar Card */}
      <AccountStatusCard
        googleAccount={googleAccount}
        sheet={sheet}
        onDisconnect={onDisconnect}
        onSwitchSheet={onSwitchSheet}
      />

      {/* 3. 2 Action Cards Grid (Sync to Sheets & Sync from Sheets) */}
      <div className="rowflow-sync-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {/* Card 1: Sync to Google Sheets (Export) */}
        <div className="rowflow-sync-card export" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "28px" }}>
          <div>
            <div className="rowflow-sync-header" style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
              <div className="rowflow-sync-circle green" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#dcfce7", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowUpRight size={22} />
              </div>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Sync to Google Sheets</h3>
            </div>

            <p style={{ fontSize: "14px", color: "#475569", margin: "0 0 24px 0", lineHeight: 1.5 }}>
              Export your latest Shopify data (products, variants, inventory, etc.) to your connected sheet.
            </p>

            <Link
              to="/app/sync"
              style={{
                background: "#059669",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Go to Sync Data
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Card 2: Sync from Google Sheets (Import) */}
        <div className="rowflow-sync-card import" style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "20px", padding: "28px" }}>
          <div>
            <div className="rowflow-sync-header" style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
              <div className="rowflow-sync-circle blue" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#dbeafe", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowDownLeft size={22} />
              </div>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Sync from Google Sheets</h3>
            </div>

            <p style={{ fontSize: "14px", color: "#475569", margin: "0 0 24px 0", lineHeight: 1.5 }}>
              Import updates from your sheet to your Shopify store (update prices, inventory, and variants).
            </p>

            <Link
              to="/app/sync"
              style={{
                background: "#1a73e8",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Go to Sync Data
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Recent Activity Table Card */}
      <RecentActivityTable
        logs={syncLogs}
        isPaidPlan={
          planInfo.activePlanName !== "Free Plan" &&
          planInfo.activePlanName !== "free" &&
          planInfo.activePlanName !== "Free"
        }
      />
    </>
  );
}
