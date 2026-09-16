import type { LoaderFunctionArgs } from "react-router";
import { redirect, Link } from "react-router";
import { ArrowRight, RefreshCw, FileSpreadsheet, ShieldCheck, Zap } from "lucide-react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  if (shop) {
    return redirect(`/app${url.search}`);
  }
  return { showForm: true };
};

export default function LandingPage() {
  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#0f172a",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            R
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            RowFlow
          </span>
        </div>
        <Link
          to="/auth/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: "#0284c7",
            color: "#ffffff",
            borderRadius: 10,
            fontWeight: 600,
            textDecoration: "none",
            fontSize: 14,
            boxShadow: "0 2px 4px rgba(2, 132, 199, 0.2)",
          }}
        >
          Log in with Store <ArrowRight size={16} />
        </Link>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 40px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 100,
            background: "#e0f2fe",
            color: "#0369a1",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          <Zap size={14} /> Two-Way Shopify &amp; Google Sheets Data Sync
        </div>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 54px)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            color: "#0f172a",
            maxWidth: 850,
            margin: "0 auto 20px",
          }}
        >
          Sync &amp; Manage Your Shopify Products Directly in Google Sheets
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#475569",
            maxWidth: 680,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Export catalog details, titles, SKUs, inventory, and prices to Google Sheets in one click. Make bulk edits in spreadsheets and import changes straight back to Shopify.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
          <Link
            to="/auth/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              background: "#0284c7",
              color: "#ffffff",
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 16,
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)",
            }}
          >
            Get Started with RowFlow <ArrowRight size={18} />
          </Link>
        </div>

        {/* Hero Banner Image */}
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.12)",
            border: "1px solid #e2e8f0",
            background: "#ffffff",
          }}
        >
          <img
            src="/top-banner.png"
            alt="RowFlow Overview Banner"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 800, marginBottom: 40 }}>
          Everything You Need for Effortless Bulk Edits
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          <div style={{ background: "#ffffff", padding: 28, borderRadius: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <RefreshCw size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>2-Way Data Sync</h3>
            <p style={{ color: "#64748b", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Keep your store catalog and Google Sheets updated synchronously with seamless export and import workflows.
            </p>
          </div>

          <div style={{ background: "#ffffff", padding: 28, borderRadius: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <FileSpreadsheet size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Auto Google Sheet Setup</h3>
            <p style={{ color: "#64748b", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Automatically generates a structured, pre-formatted Google Sheet linked directly to your Google Drive account.
            </p>
          </div>

          <div style={{ background: "#ffffff", padding: 28, borderRadius: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Safe &amp; Audited Edits</h3>
            <p style={{ color: "#64748b", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Track all changes with detailed sync logs, status tracking, item counts, and historical audit entries.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
          &copy; {new Date().getFullYear()} RowFlow. Designed for Shopify Store Merchants.
        </p>
      </footer>
    </div>
  );
}
