import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { redirect, Link } from "react-router";
import {
  ArrowRight,
  RefreshCw,
  FileSpreadsheet,
  ShieldCheck,
  Zap,
  CheckCircle,
  Layers,
  Sparkles,
  Lock,
  ExternalLink,
  ArrowDownUp,
  Sliders,
  DollarSign
} from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Rowflow - Product Management | Shopify & Google Sheets Two-Way Sync" },
    {
      name: "description",
      content:
        "Rowflow - Product Management: Connect your Shopify store catalog directly with Google Sheets for real-time 2-way product, variant, pricing, and inventory synchronization.",
    },
  ];
};

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
      {/* Navigation Header */}
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
          <img
            src="/logo.png"
            alt="Rowflow Logo"
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              objectFit: "contain",
              display: "block",
            }}
          />
          <div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
              Rowflow - Product Management
            </span>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>
              Shopify &amp; Google Sheets Sync by Unbundl
            </div>
          </div>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="#features" style={{ color: "#475569", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            Features
          </a>
          <a href="#workflow" style={{ color: "#475569", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            How It Works
          </a>
          <a href="#oauth-transparency" style={{ color: "#475569", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            Data &amp; Security
          </a>
          <a href="#pricing" style={{ color: "#475569", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            Pricing
          </a>
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
              boxShadow: "0 2px 6px rgba(2, 132, 199, 0.25)",
            }}
          >
            Log in with Shopify <ArrowRight size={16} />
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: 1150, margin: "0 auto", padding: "64px 24px 40px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            borderRadius: 100,
            background: "#e0f2fe",
            color: "#0369a1",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 24,
            border: "1px solid #bae6fd",
          }}
        >
          <Zap size={15} /> Official App: Rowflow - Product Management
        </div>

        <h1
          style={{
            fontSize: "clamp(34px, 5.5vw, 56px)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            color: "#0f172a",
            maxWidth: 950,
            margin: "0 auto 20px",
          }}
        >
          Two-Way Shopify &amp; Google Sheets Synchronization for Fast Product Management
        </h1>

        <p
          style={{
            fontSize: 19,
            color: "#475569",
            maxWidth: 760,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          <strong>Rowflow - Product Management</strong> connects your store product catalog directly to Google Sheets. Export prices, SKUs, inventory, and variants in one click, make bulk edits in spreadsheets, and import updates straight back to Shopify.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
          <Link
            to="/auth/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              background: "#0284c7",
              color: "#ffffff",
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 16,
              boxShadow: "0 6px 20px -2px rgba(2, 132, 199, 0.35)",
            }}
          >
            Connect Your Store to Get Started <ArrowRight size={18} />
          </Link>
          <a
            href="#oauth-transparency"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 24px",
              background: "#ffffff",
              color: "#334155",
              borderRadius: 12,
              fontWeight: 600,
              textDecoration: "none",
              fontSize: 15,
              border: "1px solid #cbd5e1",
            }}
          >
            <ShieldCheck size={18} color="#0284c7" /> Google OAuth &amp; Security Policy
          </a>
        </div>

        {/* Real Product Screenshot Banner */}
        <div
          style={{
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.15)",
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            padding: 8,
          }}
        >
          <img
            src="/top-banner.png"
            alt="Rowflow - Product Management Dashboard Interface"
            style={{ width: "100%", height: "auto", display: "block", borderRadius: 16 }}
          />
        </div>
      </section>

      {/* Synchronized Columns / Data Overview */}
      <section id="features" style={{ maxWidth: 1150, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
            Complete Product Catalog Data in Your Spreadsheet
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, maxWidth: 650, margin: "0 auto" }}>
            Rowflow automatically maps all standard Shopify fields and variant attributes into formatted Google Sheets columns.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 20,
            border: "1px solid #e2e8f0",
            padding: 32,
            boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              { label: "Product & Variant IDs", desc: "Permanent Shopify GraphQL IDs for 100% collision-free updates." },
              { label: "Title, Handle & Description", desc: "Update product titles, SEO handles, and body HTML in bulk." },
              { label: "SKU & Barcodes", desc: "Easily update stock keeping units and UPC/EAN barcodes across all variants." },
              { label: "Price & Compare-At Price", desc: "Perform bulk sales, percentage discounts, and pricing formula updates." },
              { label: "Inventory Levels", desc: "Adjust available stock quantities directly from your spreadsheet." },
              { label: "Vendor, Type & Tags", desc: "Organize collections, categories, and custom filtering tags effortlessly." },
              { label: "Product Status", desc: "Switch status between ACTIVE, DRAFT, and ARCHIVED in real time." },
              { label: "Options (Color, Size, etc.)", desc: "Complete multi-variant option structure synced accurately." },
            ].map((col, idx) => (
              <div
                key={idx}
                style={{
                  background: "#f8fafc",
                  padding: 20,
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <CheckCircle size={18} color="#0284c7" />
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{col.label}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
                  {col.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Workflow */}
      <section id="workflow" style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1150, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Simplified 3-Step Process
            </span>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginTop: 8 }}>
              How Rowflow - Product Management Works
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            <div style={{ background: "#f8fafc", padding: 32, borderRadius: 20, border: "1px solid #e2e8f0" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#0284c7",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 18,
                  marginBottom: 20,
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>
                1. Connect Google Sheets
              </h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                Link your Google Drive account with secure OAuth 2.0. Rowflow automatically creates a formatted, ready-to-use Google Spreadsheet for your store.
              </p>
            </div>

            <div style={{ background: "#f8fafc", padding: 32, borderRadius: 20, border: "1px solid #e2e8f0" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#0284c7",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 18,
                  marginBottom: 20,
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>
                2. Export &amp; Bulk Edit
              </h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                Click &ldquo;Export to Google Sheets&rdquo; to populate your spreadsheet. Use powerful spreadsheet formulas, fill-handles, and filters to update hundreds of products at once.
              </p>
            </div>

            <div style={{ background: "#f8fafc", padding: 32, borderRadius: 20, border: "1px solid #e2e8f0" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#0284c7",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 18,
                  marginBottom: 20,
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>
                3. Import Back to Store
              </h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                Click &ldquo;Import from Google Sheets&rdquo;. Rowflow safely applies all modified fields directly to your live Shopify store catalog with comprehensive sync logs.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 40, borderRadius: 20, overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <img
              src="/sync-page.png"
              alt="Rowflow - Product Management Sync Workflow Banner"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* Google OAuth & Data Transparency Section (Crucial for Google OAuth Verification) */}
      <section id="oauth-transparency" style={{ maxWidth: 1150, margin: "0 auto", padding: "80px 24px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            borderRadius: 24,
            border: "1.5px solid #bae6fd",
            padding: "48px 40px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ background: "#0284c7", color: "#fff", padding: 8, borderRadius: 10 }}>
              <Lock size={22} />
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0c4a6e", margin: 0 }}>
              Google OAuth Consent &amp; Privacy Transparency
            </h2>
          </div>

          <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.7, marginBottom: 24 }}>
            <strong>Rowflow - Product Management</strong> adheres strictly to Google API Services User Data Policy, including the Limited Use requirements.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 28 }}>
            <div style={{ background: "#ffffff", padding: 20, borderRadius: 14, border: "1px solid #cbd5e1" }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>
                Google Sheets Permission
              </h4>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
                <code>https://www.googleapis.com/auth/spreadsheets</code>: Used exclusively to read product data from and write product catalog updates to the designated store spreadsheet.
              </p>
            </div>

            <div style={{ background: "#ffffff", padding: 20, borderRadius: 14, border: "1px solid #cbd5e1" }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>
                Google Drive Permission
              </h4>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
                <code>https://www.googleapis.com/auth/drive.file</code>: Used only to create and manage the specific spreadsheet created by or explicitly linked to Rowflow.
              </p>
            </div>

            <div style={{ background: "#ffffff", padding: 20, borderRadius: 14, border: "1px solid #cbd5e1" }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>
                Zero Customer PII Storage
              </h4>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
                Rowflow does NOT access, store, or share any customer personal data, customer orders, or payment details. Your data is strictly used for store catalog operations.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href="https://unbundl.com/privacy"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "#0369a1",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Privacy Policy <ExternalLink size={14} />
            </a>
            <span style={{ color: "#94a3b8" }}>&bull;</span>
            <a
              href="https://unbundl.com/terms"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "#0369a1",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Terms of Service <ExternalLink size={14} />
            </a>
            <span style={{ color: "#94a3b8" }}>&bull;</span>
            <span style={{ fontSize: 13, color: "#475569" }}>
              Developer: <strong>Unbundl</strong> &bull; Contact: <strong>support@unbundl.com</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ maxWidth: 1150, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
            Simple, Transparent Pricing
          </h2>
          <p style={{ color: "#64748b", fontSize: 16 }}>
            Scale your product sync as your Shopify store grows.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {[
            { name: "Free Plan", price: "$0", period: "forever", limit: "10 products", desc: "Perfect for testing and small boutique stores." },
            { name: "Starter Plan", price: "$5", period: "per 30 days", limit: "500 products", desc: "Great for growing stores and regular updates." },
            { name: "Pro Plan", price: "$10", period: "per 30 days", limit: "2,000 products", desc: "Ideal for large catalogs with active variant edits." },
            { name: "Unlimited Plan", price: "$30", period: "per 30 days", limit: "Unlimited products", desc: "Complete freedom for enterprise volume stores." },
          ].map((plan, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                padding: 28,
                borderRadius: 20,
                border: idx === 1 ? "2px solid #0284c7" : "1px solid #e2e8f0",
                boxShadow: idx === 1 ? "0 10px 25px -5px rgba(2, 132, 199, 0.15)" : "0 4px 12px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              {idx === 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#0284c7",
                    color: "#fff",
                    padding: "2px 12px",
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Most Popular
                </div>
              )}
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}>{plan.price}</span>
                  <span style={{ fontSize: 13, color: "#64748b" }}>/ {plan.period}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#0284c7", marginBottom: 12 }}>
                  Sync up to {plan.limit}
                </div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, margin: "0 0 20px" }}>
                  {plan.desc}
                </p>
              </div>

              <Link
                to="/auth/login"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px 16px",
                  background: idx === 1 ? "#0284c7" : "#f1f5f9",
                  color: idx === 1 ? "#ffffff" : "#0f172a",
                  borderRadius: 10,
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: 14,
                }}
              >
                Choose {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#0f172a",
          color: "#94a3b8",
          padding: "48px 24px 32px",
          borderTop: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            maxWidth: 1150,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
            borderBottom: "1px solid #1e293b",
            paddingBottom: 32,
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <img
                src="/logo.png"
                alt="Rowflow Logo"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  objectFit: "contain",
                  display: "block",
                }}
              />
              <span style={{ fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
                Rowflow - Product Management
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
              Developed by <strong>Unbundl</strong> &bull; Reliable Shopify Product Synchronization
            </p>
          </div>

          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a href="https://unbundl.com/privacy" target="_blank" rel="noreferrer" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>
              Privacy Policy
            </a>
            <a href="https://unbundl.com/terms" target="_blank" rel="noreferrer" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>
              Terms of Service
            </a>
            <Link to="/auth/login" style={{ color: "#38bdf8", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
              Store Login &rarr;
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: 1150, margin: "0 auto", textAlign: "center", fontSize: 13, color: "#64748b" }}>
          &copy; {new Date().getFullYear()} Rowflow - Product Management by Unbundl. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

