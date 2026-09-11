import React from "react";
import { ArrowUpRight, Tag, Play, Loader2, HelpCircle } from "lucide-react";
import "./SyncExportPanel.css";

interface SyncExportPanelProps {
  onStartExport: () => void;
  isSyncing: boolean;
  isExporting: boolean;
}

export const SyncExportPanel: React.FC<SyncExportPanelProps> = ({
  onStartExport,
  isSyncing,
  isExporting,
}) => {
  return (
    <>
      <div className="rowflow-control-title-row">
        <div className="rowflow-dir-tab-icon export" style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowUpRight size={22} />
        </div>
        <div>
          <h2>Sync to Google Sheets</h2>
          <p>Export your Shopify data to your connected Google Sheet.</p>
        </div>
      </div>

      <div className="rowflow-section-label">What to sync</div>
      <div className="rowflow-section-sub">Data entity configured for export to Google Sheets.</div>

      <div className="rowflow-field-group" style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "#f0fdf4",
            border: "1.5px solid #10b981",
            borderRadius: 14,
            padding: "14px 18px",
            maxWidth: 480,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#dcfce7",
              color: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Tag size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Products</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Product details, variants, inventory, prices, etc.
            </div>
          </div>
          <span
            style={{
              background: "#10b981",
              color: "#ffffff",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 12,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Prefilled
          </span>
        </div>
      </div>

      <div className="rowflow-action-bar">
        <button
          type="button"
          className="rowflow-btn-primary-action export-btn"
          onClick={onStartExport}
          disabled={isSyncing}
          style={{ opacity: isSyncing ? 0.7 : 1, cursor: isSyncing ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          {isExporting ? (
            <>
              <Loader2 size={16} className="rowflow-spin" />
              Syncing to Sheets...
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              Start sync
            </>
          )}
        </button>

        <div className="rowflow-estimate-text" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          ⏱ Estimated time: ~1-3 minutes
          <HelpCircle size={14} />
        </div>
      </div>
    </>
  );
};
