import React from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import "./SyncProgressBanner.css";

interface SyncProgressBannerProps {
  isSyncing: boolean;
  isExporting: boolean;
  isImporting: boolean;
  isCreating?: boolean;
  message?: string;
  error?: string;
}

export const SyncProgressBanner: React.FC<SyncProgressBannerProps> = ({
  isSyncing,
  isExporting,
  isImporting,
  isCreating,
  message,
  error,
}) => {
  return (
    <>
      {isSyncing && (
        <div className="rowflow-progress-banner">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Loader2 className="rowflow-spin" size={20} />
            <span>
              {isExporting
                ? "Sync in progress... Exporting Shopify store data to Google Sheets."
                : isImporting
                ? "Import in progress... Applying Google Sheets updates to your Shopify store."
                : isCreating
                ? "Creating your Google Sheet..."
                : "Sync operation in progress... Please wait."}
            </span>
          </div>
          <span style={{ fontSize: "12px", background: "#ffffff", padding: "4px 10px", borderRadius: "10px", color: "#2563eb", fontWeight: 700 }}>
            Processing...
          </span>
        </div>
      )}

      {!isSyncing && message && (
        <div className="rowflow-alert-banner success" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircle2 size={20} />
          {message}
        </div>
      )}

      {!isSyncing && error && (
        <div className="rowflow-alert-banner error" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}
    </>
  );
};
