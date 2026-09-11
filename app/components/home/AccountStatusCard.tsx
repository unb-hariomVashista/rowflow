import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Check, ExternalLink, FileSpreadsheet, Settings, ChevronDown, LogOut, RefreshCw, PlusCircle } from "lucide-react";
import "./AccountStatusCard.css";

interface GoogleAccount {
  email: string;
  name?: string;
}

interface Sheet {
  sheetId: string | null;
  sheetUrl: string | null;
  sheetName: string | null;
  lastSyncedAt: string;
}

interface AccountStatusCardProps {
  googleAccount: GoogleAccount | null;
  sheet: Sheet;
  onDisconnect?: () => void;
  onSwitchSheet?: () => void;
}

export const AccountStatusCard: React.FC<AccountStatusCardProps> = ({
  googleAccount,
  sheet,
  onDisconnect,
  onSwitchSheet,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hasSheet = Boolean(sheet.sheetId);

  return (
    <div className="rowflow-auth-status-card">
      <div className="rowflow-account-left">
        <div className="rowflow-google-avatar-wrapper">
          <div className="rowflow-google-avatar">
            <svg width="26" height="26" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>
          <div className="rowflow-check-badge">
            <Check size={12} strokeWidth={3} />
          </div>
        </div>

        <div className="rowflow-account-info">
          <h3>Connected Account</h3>
          <p>{googleAccount?.email || "Google Account Connected"}</p>
        </div>
      </div>

      <div className="rowflow-sheet-middle">
        <div className="rowflow-sheet-icon-box">
          <FileSpreadsheet size={22} />
        </div>

        <div style={{ minWidth: 0, overflow: "hidden" }}>
          <div className="rowflow-sheet-label">Target Google Sheet</div>
          {sheet.sheetUrl ? (
            <a
              href={sheet.sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="rowflow-sheet-title"
              title={sheet.sheetName || "Rowflow Google Sheet"}
            >
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {sheet.sheetName || "Rowflow Google Sheet"}
              </span>
              <ExternalLink size={13} style={{ flexShrink: 0 }} />
            </a>
          ) : (
            <span className="rowflow-sheet-title" style={{ color: "#64748b" }}>
              No Sheet Connected Yet
            </span>
          )}
          <div className="rowflow-sheet-updated">Last updated: {sheet.lastSyncedAt}</div>
        </div>
      </div>

      {/* Dropdown Menu for Manage Sync, Switch/Connect Sheet, & Disconnect */}
      <div className="rowflow-manage-dropdown-wrapper" ref={dropdownRef}>
        <button
          type="button"
          className="rowflow-btn-manage"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <Settings size={15} />
          <span>Manage Sync</span>
          <ChevronDown
            size={14}
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>

        {isOpen && (
          <div className="rowflow-dropdown-menu">
            {onSwitchSheet ? (
              <button
                type="button"
                className="rowflow-dropdown-item"
                onClick={() => {
                  setIsOpen(false);
                  onSwitchSheet();
                }}
              >
                {hasSheet ? <RefreshCw size={15} /> : <PlusCircle size={15} />}
                <span>{hasSheet ? "Change Sheet" : "Create Sheet"}</span>
              </button>
            ) : (
              <Link
                to="/app/sync"
                className="rowflow-dropdown-item"
                onClick={() => setIsOpen(false)}
              >
                {hasSheet ? <RefreshCw size={15} /> : <PlusCircle size={15} />}
                <span>{hasSheet ? "Change Sheet" : "Create Sheet"}</span>
              </Link>
            )}

            {onDisconnect && (
              <button
                type="button"
                className="rowflow-dropdown-item danger"
                onClick={() => {
                  setIsOpen(false);
                  onDisconnect();
                }}
              >
                <LogOut size={15} />
                <span>Disconnect Account</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
