import React from "react";
import { ArrowLeftRight, FileSpreadsheet, ShoppingBag } from "lucide-react";
import "./SyncHero.css";

interface SyncHeroProps {
  activeTab: "export" | "import";
}

export const SyncHero: React.FC<SyncHeroProps> = ({ activeTab }) => {
  return (
    <div className={`rowflow-sync-hero-card ${activeTab === "import" ? "import-theme" : ""}`}>
      <div>
        <div className="rowflow-breadcrumb">Sync &gt; Manage your sync</div>
        <h1 className="rowflow-sync-hero-title">Manage your sync</h1>
        <p className="rowflow-sync-hero-sub">
          Choose a direction and sync your Shopify data with Google Sheets.
        </p>
      </div>

      <div className="rowflow-hero-graphic" style={{ paddingLeft: 0 }}>
        <div className="rowflow-diagram" style={{ padding: "12px 20px" }}>
          {activeTab === "export" ? (
            <>
              <div className="rowflow-logo-box shopify" style={{ width: 50, height: 50, background: "#95BF47", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px" }}>
                <ShoppingBag size={28} />
              </div>
              <div className="rowflow-link-badge green" style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowLeftRight size={15} />
              </div>
              <div className="rowflow-logo-box sheets" style={{ width: 50, height: 50, background: "#0F9D58", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px" }}>
                <FileSpreadsheet size={28} />
              </div>
            </>
          ) : (
            <>
              <div className="rowflow-logo-box sheets" style={{ width: 50, height: 50, background: "#0F9D58", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px" }}>
                <FileSpreadsheet size={28} />
              </div>
              <div className="rowflow-link-badge" style={{ width: 30, height: 30, background: "#dbeafe", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowLeftRight size={15} />
              </div>
              <div className="rowflow-logo-box shopify" style={{ width: 50, height: 50, background: "#95BF47", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px" }}>
                <ShoppingBag size={28} />
              </div>
            </>
          )}
        </div>
        <div className="rowflow-doodle-note" style={{ fontSize: 18, marginTop: 8 }}>
          {activeTab === "export" ? "Same data. More possibilities." : "Update your store from your sheet."}
        </div>
      </div>
    </div>
  );
};
