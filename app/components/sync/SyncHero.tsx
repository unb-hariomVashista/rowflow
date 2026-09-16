import React from "react";
import "./SyncHero.css";

interface SyncHeroProps {
  activeTab?: "export" | "import";
}

export const SyncHero: React.FC<SyncHeroProps> = () => {
  return (
    <div className="rowflow-sync-banner-container" style={{ marginBottom: 24, borderRadius: 20, overflow: "hidden" }}>
      <img
        src="/sync-page.png"
        alt="Manage Your Sync Banner"
        style={{ width: "100%", height: "auto", display: "block", borderRadius: 20 }}
      />
    </div>
  );
};
