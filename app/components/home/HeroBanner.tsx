import React from "react";
import { Check, CheckCircle2, Clock, Zap, ShieldCheck, FileSpreadsheet } from "lucide-react";
import "./HeroBanner.css";

interface HeroBannerProps {
  isAuthenticated?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ isAuthenticated = false }) => {
  return (
    <div style={{ width: "100%", marginBottom: "24px" }}>
      <img
        src="/top-banner.png"
        alt="Rowflow Top Banner"
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "20px",
          display: "block",
          boxShadow: "0 4px 16px -2px rgba(0, 0, 0, 0.04)",
        }}
      />
    </div>
  );
};
