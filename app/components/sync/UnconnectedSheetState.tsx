import React from "react";
import { FileSpreadsheet, Plus, Loader2, Zap, Lock, RefreshCw, HelpCircle, Check, ArrowRight } from "lucide-react";
import "./UnconnectedSheetState.css";

export interface AvailableSheetItem {
  id: string;
  name: string;
  url: string;
  lastModified?: string;
}

interface UnconnectedSheetStateProps {
  availableSheets?: AvailableSheetItem[];
  onSelectSheet?: (sheet: AvailableSheetItem) => void;
  isSelecting?: boolean;
  onCreateSheet: () => void;
  isCreating: boolean;
}

export const UnconnectedSheetState: React.FC<UnconnectedSheetStateProps> = ({
  availableSheets = [],
  onSelectSheet,
  isSelecting = false,
  onCreateSheet,
  isCreating,
}) => {
  const hasExistingSheets = availableSheets.length > 0;

  return (
    <div className="rowflow-no-sheet-card">
      <div className="rowflow-no-sheet-graphic-container">
        <div className="rowflow-no-sheet-circle-bg" style={{ background: "#e6f4ea", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <FileSpreadsheet size={42} />
          <div className="rowflow-no-sheet-plus-badge" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={14} strokeWidth={3} />
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>
        {hasExistingSheets ? "Connect your Google Sheet" : "No Google Sheet connected"}
      </h2>
      <p style={{ fontSize: 14, color: "#64748b", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.5 }}>
        {hasExistingSheets
          ? "Select an existing Google Sheet from your account or create a new sheet to start syncing your Shopify data."
          : "You haven't connected a Google Sheet to Rowflow yet. Create a new sheet with one click to start syncing your Shopify data."}
      </p>

      {/* Existing Sheets Picker List */}
      {hasExistingSheets && (
        <div className="rowflow-sheets-picker-container">
          <div className="rowflow-sheets-picker-header">
            <span>Select an existing sheet ({availableSheets.length})</span>
          </div>

          <div className="rowflow-sheets-list">
            {availableSheets.map((sheet) => (
              <div key={sheet.id} className="rowflow-sheet-item-card">
                <div className="rowflow-sheet-item-left">
                  <div className="rowflow-sheet-icon">
                    <FileSpreadsheet size={18} />
                  </div>
                  <div>
                    <h4 className="rowflow-sheet-title-text">{sheet.name}</h4>
                    <p className="rowflow-sheet-date-text">
                      {sheet.lastModified ? `Modified: ${sheet.lastModified} • ` : ""}
                      ID: ...{sheet.id.slice(-6)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="rowflow-btn-select-sheet"
                  onClick={() => onSelectSheet && onSelectSheet(sheet)}
                  disabled={isSelecting || isCreating}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  {isSelecting ? (
                    <Loader2 className="rowflow-spin" size={14} />
                  ) : (
                    <>
                      Connect
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="rowflow-divider-or">OR</div>
        </div>
      )}

      <button
        type="button"
        className="rowflow-btn-create-sheet"
        onClick={onCreateSheet}
        disabled={isCreating || isSelecting}
        style={{
          opacity: isCreating || isSelecting ? 0.7 : 1,
          cursor: isCreating || isSelecting ? "not-allowed" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {isCreating ? (
          <>
            <Loader2 className="rowflow-spin" size={18} />
            Creating Google Sheet...
          </>
        ) : (
          <>
            <Plus size={18} strokeWidth={3} />
            {hasExistingSheets ? "Create a New Google Sheet" : "Create Google Sheet"}
          </>
        )}
      </button>

      {/* Bottom 3-Column Info Panel */}
      <div className="rowflow-no-sheet-features-grid">
        <div className="rowflow-no-sheet-feature-item">
          <div className="rowflow-no-sheet-feature-badge green" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={20} />
          </div>
          <div className="rowflow-no-sheet-feature-info">
            <h4>Auto setup</h4>
            <p>We'll configure your Google Sheet with the right structure.</p>
          </div>
        </div>

        <div className="rowflow-no-sheet-feature-item">
          <div className="rowflow-no-sheet-feature-badge blue" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={20} />
          </div>
          <div className="rowflow-no-sheet-feature-info">
            <h4>Secure &amp; private</h4>
            <p>Your data stays in your Google account.</p>
          </div>
        </div>

        <div className="rowflow-no-sheet-feature-item">
          <div className="rowflow-no-sheet-feature-badge purple" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <RefreshCw size={20} />
          </div>
          <div className="rowflow-no-sheet-feature-info">
            <h4>Start syncing</h4>
            <p>After connection, you can sync your data to the sheet instantly.</p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="rowflow-no-sheet-footer-note" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <HelpCircle size={15} />
        You can always switch your active sheet later from{" "}
        <a href="/app/sync">Manage Sync.</a>
      </div>
    </div>
  );
};
