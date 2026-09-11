import React from "react";
import { Link } from "react-router";
import { Activity } from "lucide-react";
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
}

export const RecentActivityTable: React.FC<RecentActivityTableProps> = ({ logs }) => {
  return (
    <div className="rowflow-activity-card">
      <div className="rowflow-activity-header">
        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Activity size={18} />
          Recent Activity Logs
        </h3>
        <Link to="/app/sync">Manage Sync →</Link>
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
