import React from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import "./DirectionTabSwitcher.css";

interface DirectionTabSwitcherProps {
  activeTab: "export" | "import";
  onTabChange: (tab: "export" | "import") => void;
}

export const DirectionTabSwitcher: React.FC<DirectionTabSwitcherProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="rowflow-direction-tabs">
      <button
        type="button"
        className={`rowflow-dir-tab ${activeTab === "export" ? "active-export" : ""}`}
        onClick={() => onTabChange("export")}
      >
        <div className="rowflow-dir-tab-icon export" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowUpRight size={22} />
        </div>
        <div className="rowflow-dir-tab-info">
          <h4>Sync to Google Sheets</h4>
          <p>Export data from your Shopify store to Google Sheets</p>
        </div>
      </button>

      <button
        type="button"
        className={`rowflow-dir-tab ${activeTab === "import" ? "active-import" : ""}`}
        onClick={() => onTabChange("import")}
      >
        <div className="rowflow-dir-tab-icon import" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowDownLeft size={22} />
        </div>
        <div className="rowflow-dir-tab-info">
          <h4>Sync from Google Sheets</h4>
          <p>Import data from Google Sheets to your Shopify store</p>
        </div>
      </button>
    </div>
  );
};
