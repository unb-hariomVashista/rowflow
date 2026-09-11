import React from "react";
import { ExternalLink, HelpCircle, Check } from "lucide-react";
import "./SyncSidebar.css";

interface SyncSidebarProps {
  sheetName: string | null;
  sheetUrl: string | null;
  lastSyncedAt: string;
  activeTab: "export" | "import";
  onChangeSheet?: () => void;
}

export const SyncSidebar: React.FC<SyncSidebarProps> = ({
  sheetName,
  sheetUrl,
  lastSyncedAt,
  activeTab,
  onChangeSheet,
}) => {
  return (
    <div>
      {/* Card 1: Connected Google Sheet Card */}
      <div className="rowflow-side-card">
        <div className="rowflow-side-card-header">
          <h3>Connected Google Sheet</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {onChangeSheet && (
              <button
                type="button"
                onClick={onChangeSheet}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#2563eb",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                Switch Sheet
              </button>
            )}
            {sheetUrl && (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noreferrer"
                className="rowflow-doc-link"
                style={{ padding: "4px 10px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }}
              >
                View Sheet
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        <div className="rowflow-meta-list">
          <div className="rowflow-meta-row">
            <span className="rowflow-meta-label">Sheet name</span>
            <span className="rowflow-meta-val" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              {sheetName}
            </span>
          </div>
          <div className="rowflow-meta-row">
            <span className="rowflow-meta-label">Spreadsheet</span>
            <span className="rowflow-meta-val">My Drive / Rowflow</span>
          </div>
          <div className="rowflow-meta-row">
            <span className="rowflow-meta-label">Last updated</span>
            <span className="rowflow-meta-val">{lastSyncedAt}</span>
          </div>
          <div className="rowflow-meta-row">
            <span className="rowflow-meta-label">Status</span>
            <span className="rowflow-status-tag" style={{ fontSize: 12 }}>
              <span className="rowflow-status-dot green" />
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Tip Callout depending on active tab */}
      {activeTab === "export" ? (
        <div className="rowflow-callout-card green">
          <div className="rowflow-callout-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <HelpCircle size={16} />
            Export Highlights
          </div>
          <ul className="rowflow-bullet-list">
            <li className="rowflow-bullet-item">
              <div className="rowflow-bullet-check">
                <Check size={12} strokeWidth={3} />
              </div>
              <span>Exports all active products and variant details into structured columns.</span>
            </li>
            <li className="rowflow-bullet-item">
              <div className="rowflow-bullet-check">
                <Check size={12} strokeWidth={3} />
              </div>
              <span>Preserves formatted green header styling automatically.</span>
            </li>
          </ul>
        </div>
      ) : (
        <div className="rowflow-callout-card blue">
          <div className="rowflow-callout-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <HelpCircle size={16} />
            Import Highlights
          </div>
          <ul className="rowflow-bullet-list">
            <li className="rowflow-bullet-item">
              <div className="rowflow-bullet-check">
                <Check size={12} strokeWidth={3} />
              </div>
              <span>Reads product variant prices and applies bulk updates directly to Shopify.</span>
            </li>
            <li className="rowflow-bullet-item">
              <div className="rowflow-bullet-check">
                <Check size={12} strokeWidth={3} />
              </div>
              <span>Uses Product ID &amp; Variant ID columns for precise matching.</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
