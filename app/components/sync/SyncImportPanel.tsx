import React from "react";
import { ArrowDownLeft, Tag, Play, Loader2, HelpCircle } from "lucide-react";

interface SyncImportPanelProps {
  onStartImport: () => void;
  isSyncing: boolean;
  isImporting: boolean;
}

export const SyncImportPanel: React.FC<SyncImportPanelProps> = ({
  onStartImport,
  isSyncing,
  isImporting,
}) => {
  return (
    <>
      <div className="rowflow-control-title-row">
        <div className="rowflow-dir-tab-icon import" style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowDownLeft size={22} />
        </div>
        <div>
          <h2>Sync from Google Sheets</h2>
          <p>Import and apply updates from your connected Google Sheet.</p>
        </div>
      </div>

      <div className="rowflow-section-label">What to import</div>
      <div className="rowflow-section-sub">Data entity configured for import from Google Sheets to Shopify.</div>

      <div className="rowflow-field-group" style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "#eff6ff",
            border: "1.5px solid #2563eb",
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
              background: "#dbeafe",
              color: "#1d4ed8",
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
              Create or update products, variants, prices, inventory, etc.
            </div>
          </div>
          <span
            style={{
              background: "#2563eb",
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

      <div className="rowflow-section-label">Import options</div>
      <div className="rowflow-section-sub">Configure how the import should run.</div>

      <div className="rowflow-options-grid" style={{ marginBottom: 12 }}>
        <div className="rowflow-field-group">
          <label>If record exists</label>
          <select className="rowflow-select-input" defaultValue="update">
            <option value="update">Update existing records</option>
            <option value="skip">Skip existing records</option>
          </select>
        </div>

        <div className="rowflow-field-group">
          <label>Create new records</label>
          <select className="rowflow-select-input" defaultValue="yes">
            <option value="yes">Yes (recommended)</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 28 }}>
        Match records using the identifier column in your sheet. New records in your sheet will be created in Shopify.
      </div>

      <div className="rowflow-action-bar">
        <button
          type="button"
          className="rowflow-btn-primary-action import-btn"
          onClick={onStartImport}
          disabled={isSyncing}
          style={{ opacity: isSyncing ? 0.7 : 1, cursor: isSyncing ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          {isImporting ? (
            <>
              <Loader2 size={16} className="rowflow-spin" />
              Importing from Sheets...
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              Start import
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
