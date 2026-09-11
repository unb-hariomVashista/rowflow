import React from "react";
import { Check, ArrowDownLeft, ShieldCheck } from "lucide-react";
import "./BenefitGrid.css";

export const BenefitGrid: React.FC = () => {
  return (
    <div className="rowflow-benefits-grid">
      <div className="rowflow-benefit-card">
        <div className="rowflow-benefit-badge green">
          <Check size={20} strokeWidth={2.5} />
        </div>
        <div className="rowflow-benefit-info">
          <h3>Full Store Backup</h3>
          <p>Keep a formatted live copy of your product catalogue in Google Sheets.</p>
        </div>
      </div>

      <div className="rowflow-benefit-card">
        <div className="rowflow-benefit-badge purple">
          <ArrowDownLeft size={20} strokeWidth={2.5} />
        </div>
        <div className="rowflow-benefit-info">
          <h3>Bulk Product Import</h3>
          <p>Update inventory, variant prices, and metadata directly from your spreadsheet.</p>
        </div>
      </div>

      <div className="rowflow-benefit-card">
        <div className="rowflow-benefit-badge red">
          <ShieldCheck size={20} strokeWidth={2.5} />
        </div>
        <div className="rowflow-benefit-info">
          <h3>Secure &amp; Isolated</h3>
          <p>Your store credentials and Google OAuth tokens are encrypted at rest with AES-256.</p>
        </div>
      </div>
    </div>
  );
};
