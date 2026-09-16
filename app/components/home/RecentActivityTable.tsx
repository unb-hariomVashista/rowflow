import React from "react";
import { Link } from "react-router";
import { Activity, Lock, ArrowRight } from "lucide-react";
import "./RecentActivityTable.css";

export interface SyncLogItem {
  id: string;
  type: string;
  status: string;
  details: string;
  itemCount: number;
  createdAt: string;
}

interface RecentActivityTableProps {
  logs: SyncLogItem[];
  isPaidPlan?: boolean;
}

export const RecentActivityTable: React.FC<RecentActivityTableProps> = ({ logs, isPaidPlan = true }) => {
  if (!isPaidPlan) {
    return (
      <div className="rowflow-activity-card">
        <div className="rowflow-activity-header">
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={18} />
            Recent Activity Logs
          </h3>
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600, background: "#f1f5f9", padding: "3px 8px", borderRadius: 6 }}>
            Paid Feature
          </span>
        </div>

        <div style={{ textAlign: "center", padding: "36px 20px" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#ecfdf5",
              color: "#008060",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <Lock size={20} />
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
            Sync logs are not available on the Free Plan
          </h4>
          <p style={{ fontSize: 13, color: "#64748b", maxWidth: 460, margin: "0 auto 20px", lineHeight: 1.5 }}>
            Upgrade to any paid plan to unlock real-time sync audit logs, change tracking, and troubleshooting history.
          </p>
          <Link
            to="/app/pricing"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 20px",
              background: "#008060",
              color: "#ffffff",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 13,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0,128,96,0.2)",
            }}
          >
            View Plans &amp; Upgrade <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rowflow-activity-card">
      <div className="rowflow-activity-header">
        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Activity size={18} />
          Recent Activity Logs
        </h3>
        <Link to="/app/logs" style={{ color: "#008060", fontWeight: 600, fontSize: "13px", textDecoration: "none" }}>
          View all logs →
        </Link>
      </div>

      {logs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "28px 0", color: "#64748b", fontSize: "14px" }}>
          No sync activity recorded yet. Go to <Link to="/app/sync" style={{ color: "#1a73e8", fontWeight: 600 }}>Manage Sync</Link> to run your first sync!
        </div>
      ) : (
        <table className="rowflow-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Details</th>
              <th>Items</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice(0, 5).map((log) => (
              <tr key={log.id}>
                <td style={{ fontWeight: 600 }}>
                  {log.type === "EXPORT_TO_SHEETS"
                    ? "Sync to Google Sheets"
                    : log.type === "IMPORT_FROM_SHEETS"
                    ? "Sync from Google Sheets"
                    : "Sheet Setup"}
                </td>
                <td style={{ color: "#475569" }}>{log.details}</td>
                <td>{log.itemCount}</td>
                <td>
                  <span className="rowflow-status-tag">
                    <span className={`rowflow-status-dot ${log.status === "SUCCESS" ? "green" : "red"}`} />
                    {log.status}
                  </span>
                </td>
                <td style={{ color: "#64748b" }}>{log.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
