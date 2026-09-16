import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { redirect, Link } from "react-router";
import {
  ArrowRight,
  Check,
  Play,
  FileSpreadsheet,
  Layers,
  Sparkles,
  History,
  Zap,
  Users,
  BarChart3,
  Heart,
  Mail,
  ExternalLink,
  Lock,
  ShoppingBag,
  ArrowLeftRight,
  Box,
  FileText
} from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Rowflow - Product Management | Manage your Shopify products with ease." },
    {
      name: "description",
      content:
        "Sync your Shopify product data with Google Sheets, update products in bulk, and keep your store data organized.",
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
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        color: "#111827",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER / NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #f1f5f9",
          padding: "16px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Brand */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <img
            src="/logo.png"
            alt="Rowflow Logo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const nextEl = e.currentTarget.nextElementSibling;
              if (nextEl) (nextEl as HTMLElement).style.display = "flex";
            }}
            style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain", display: "block" }}
          />
          <div
            style={{
              display: "none",
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "#008060",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            R
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <span style={{ fontSize: 19, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
              Rowflow
            </span>
            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>
              - Product Management
            </div>
          </div>
        </Link>

        {/* Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="#product" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            Product
          </a>
          <a href="#how-it-works" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            How it works
          </a>
          <a href="#pricing" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            Pricing
          </a>
          <a href="#privacy" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            Privacy
          </a>
        </nav>

        {/* CTA */}
        <Link
          to="/auth/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 22px",
            background: "#008060",
            color: "#ffffff",
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: "none",
            fontSize: 14,
            transition: "background 0.2s ease",
          }}
        >
          Get started <ArrowRight size={16} />
        </Link>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section
        id="product"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "60px 24px 70px",
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        {/* Left Column */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              borderRadius: 20,
              background: "#ecfdf5",
              border: "1px solid #d1fae5",
              color: "#059669",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            Rowflow - Product Management
          </div>

          <h1
            style={{
              fontSize: "clamp(38px, 4.5vw, 54px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#0f172a",
              margin: "0 0 20px 0",
            }}
          >
            Manage your Shopify products with ease.
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "#475569",
              lineHeight: 1.6,
              margin: "0 0 32px 0",
              maxWidth: 480,
            }}
          >
            Sync your Shopify product data with Google Sheets, update products in bulk, and keep your store data organized.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
            <Link
              to="/auth/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 26px",
                background: "#008060",
                color: "#ffffff",
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: "none",
                fontSize: 15,
                boxShadow: "0 2px 8px rgba(0, 128, 96, 0.2)",
              }}
            >
              Get started <ArrowRight size={17} />
            </Link>

            <a
              href="#how-it-works"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 22px",
                background: "#ffffff",
                color: "#1e293b",
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: "none",
                fontSize: 15,
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#0f172a",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Play size={10} fill="#ffffff" style={{ marginLeft: 1 }} />
              </div>
              See how it works
            </a>
          </div>

          {/* Trust Checkmarks */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", fontSize: 13, color: "#475569", fontWeight: 500 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#a7f3d0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={11} color="#065f46" strokeWidth={3} />
              </div>
              No credit card required
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#a7f3d0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={11} color="#065f46" strokeWidth={3} />
              </div>
              Quick setup
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#a7f3d0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={11} color="#065f46" strokeWidth={3} />
              </div>
              Trusted by merchants
            </div>
          </div>
        </div>

        {/* Right Column: Dashboard Mockup + Floating Badges */}
        <div style={{ position: "relative" }}>
          {/* Floating Shopify Badge */}
          <div
            style={{
              position: "absolute",
              top: -30,
              left: -35,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 14,
                background: "#ecfdf5",
                border: "1.5px solid #a7f3d0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 20px -5px rgba(0,0,0,0.06)",
              }}
            >
              <ShoppingBag size={26} color="#008060" />
            </div>
            <div
              style={{
                fontFamily: "cursive, sans-serif",
                fontSize: 13,
                color: "#1e293b",
                fontWeight: 600,
                marginTop: 4,
                textAlign: "center",
                lineHeight: 1.1,
              }}
            >
              Your<br />Shopify Store
            </div>
          </div>

          {/* Floating Google Sheets Badge */}
          <div
            style={{
              position: "absolute",
              top: "40%",
              right: -32,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "#ecfdf5",
                border: "1.5px solid #a7f3d0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 20px -5px rgba(0,0,0,0.06)",
              }}
            >
              <FileSpreadsheet size={26} color="#0f9d58" />
            </div>
            <div
              style={{
                fontFamily: "cursive, sans-serif",
                fontSize: 12,
                color: "#1e293b",
                fontWeight: 600,
                marginTop: 4,
                textAlign: "center",
                lineHeight: 1.1,
                maxWidth: 90,
              }}
            >
              Google Sheets<br /><span style={{ fontSize: 10, color: "#64748b" }}>Keep your data in sync</span>
            </div>
          </div>

          {/* Realistic Dashboard Frame */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: 20,
              border: "1px solid #e2e8f0",
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.12)",
              overflow: "hidden",
            }}
          >
            {/* Window Header */}
            <div
              style={{
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, background: "#008060", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 800 }}>
                  R
                </div>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>Rowflow</span>
                <span style={{ color: "#64748b" }}>- Product Management</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  padding: "3px 10px",
                  borderRadius: 6,
                  color: "#334155",
                  fontWeight: 500,
                }}
              >
                <ShoppingBag size={12} color="#008060" /> My Store ⌄
              </div>
            </div>

            {/* App Body (Sidebar + Content) */}
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", minHeight: 330 }}>
              {/* Sidebar */}
              <div style={{ background: "#f8fafc", borderRight: "1px solid #e2e8f0", padding: "12px 8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", background: "#d1fae5", color: "#065f46", borderRadius: 6, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                  <Box size={13} /> Products
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", color: "#64748b", fontSize: 11, fontWeight: 500, marginBottom: 4 }}>
                  <RefreshCw size={13} /> Sync
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", color: "#64748b", fontSize: 11, fontWeight: 500, marginBottom: 4 }}>
                  <FileText size={13} /> Logs
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", color: "#64748b", fontSize: 11, fontWeight: 500 }}>
                  <Zap size={13} /> Settings
                </div>
              </div>

              {/* Main Content Area */}
              <div style={{ padding: "16px 20px" }}>
                {/* Title & Sync button */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Products</h3>
                    <div style={{ fontSize: 10, color: "#64748b" }}>Sync and manage your Shopify products with Google Sheets.</div>
                  </div>
                  <div
                    style={{
                      background: "#008060",
                      color: "#ffffff",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "5px 10px",
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <RefreshCw size={10} /> Sync Now
                  </div>
                </div>

                {/* 4 Stat Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "8px", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>248</div>
                    <div style={{ fontSize: 9, color: "#64748b", fontWeight: 500 }}>Total Products</div>
                  </div>
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "8px", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#059669" }}>196</div>
                    <div style={{ fontSize: 9, color: "#64748b", fontWeight: 500 }}>Published</div>
                  </div>
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "8px", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#d97706" }}>32</div>
                    <div style={{ fontSize: 9, color: "#64748b", fontWeight: 500 }}>Drafts</div>
                  </div>
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "8px", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#dc2626" }}>20</div>
                    <div style={{ fontSize: 9, color: "#64748b", fontWeight: 500 }}>Out of Stock</div>
                  </div>
                </div>

                {/* Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: 600 }}>
                      <th style={{ padding: "4px 0", fontWeight: 600 }}>Product</th>
                      <th style={{ padding: "4px 6px", fontWeight: 600 }}>SKU</th>
                      <th style={{ padding: "4px 6px", fontWeight: 600 }}>Price</th>
                      <th style={{ padding: "4px 6px", fontWeight: 600 }}>Status</th>
                      <th style={{ padding: "4px 0", fontWeight: 600, textAlign: "right" }}>Last Synced</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Classic Hoodie", sku: "HD-001", price: "$49.00", status: "Published", color: "#059669", bg: "#d1fae5", time: "2 mins ago" },
                      { name: "Minimal Tee", sku: "MT-002", price: "$29.00", status: "Published", color: "#059669", bg: "#d1fae5", time: "2 mins ago" },
                      { name: "Canvas Cap", sku: "CC-003", price: "$19.00", status: "Draft", color: "#b45309", bg: "#fef3c7", time: "5 mins ago" },
                      { name: "Everyday Backpack", sku: "EB-004", price: "$79.00", status: "Published", color: "#059669", bg: "#d1fae5", time: "10 mins ago" },
                      { name: "Ceramic Mug", sku: "CM-005", price: "$15.00", status: "Out of stock", color: "#b91c1c", bg: "#fee2e2", time: "12 mins ago" },
                    ].map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "6px 0", fontWeight: 600, color: "#1e293b" }}>{item.name}</td>
                        <td style={{ padding: "6px 6px", color: "#64748b" }}>{item.sku}</td>
                        <td style={{ padding: "6px 6px", color: "#0f172a", fontWeight: 600 }}>{item.price}</td>
                        <td style={{ padding: "6px 6px" }}>
                          <span style={{ background: item.bg, color: item.color, padding: "2px 6px", borderRadius: 100, fontSize: 9, fontWeight: 700 }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: "6px 0", color: "#94a3b8", textAlign: "right" }}>{item.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Doodled text */}
          <div
            style={{
              textAlign: "right",
              marginTop: 16,
              fontFamily: "cursive, sans-serif",
              fontSize: 18,
              color: "#008060",
              fontWeight: 700,
            }}
          >
            Two-way sync. More possibilities. ✦
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. THREE FEATURE CARDS
      ───────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
          {/* Card 1 */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 20,
              padding: 36,
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "#ecfdf5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <ArrowLeftRight size={24} color="#008060" />
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0" }}>
              Shopify ↔ Google Sheets Sync
            </h3>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Automatically sync your product data between Shopify and Google Sheets with bi-directional updates.
            </p>
          </div>

          {/* Card 2 */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 20,
              padding: 36,
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "#ecfdf5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Box size={24} color="#008060" />
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0" }}>
              Bulk Product Management
            </h3>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Update product details like price, SKU, title, and status in bulk directly from Google Sheets.
            </p>
          </div>

          {/* Card 3 */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 20,
              padding: 36,
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "#ecfdf5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <FileText size={24} color="#008060" />
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0" }}>
              Sync History &amp; Audit Logs
            </h3>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Track all your changes with detailed sync logs and easily identify what was updated.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. HOW ROWFLOW WORKS (3-STEP TIMELINE)
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ maxWidth: 1240, margin: "0 auto", padding: "20px 24px 90px" }}>
        <div style={{ position: "relative", marginBottom: 50 }}>
          <div
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: 6,
              background: "#d1fae5",
              color: "#065f46",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            SIMPLE SETUP
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>
            How Rowflow works
          </h2>
          <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
            Get started in minutes and take control of your product data.
          </p>

          <div
            style={{
              position: "absolute",
              right: 20,
              top: 10,
              fontFamily: "cursive, sans-serif",
              fontSize: 18,
              color: "#008060",
              fontWeight: 700,
              lineHeight: 1.2,
              textAlign: "right",
            }}
          >
            From your store<br />to your sheet<br />and back. ✦
          </div>
        </div>

        {/* 3 Step Timeline */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            gap: 16,
            alignItems: "center",
          }}
        >
          {/* Step 1 */}
          <div style={{ background: "#ffffff", padding: "28px 24px", borderRadius: 16, border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#008060", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                1
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingBag size={22} color="#008060" />
              </div>
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
              Connect Shopify
            </h4>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
              Install Rowflow and connect your Shopify store securely.
            </p>
          </div>

          {/* Arrow 1 */}
          <div style={{ color: "#a7f3d0", fontSize: 24, fontWeight: 700, padding: "0 8px" }}>
            ⇢
          </div>

          {/* Step 2 */}
          <div style={{ background: "#ffffff", padding: "28px 24px", borderRadius: 16, border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#008060", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                2
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileSpreadsheet size={22} color="#0f9d58" />
              </div>
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
              Connect Google Sheets
            </h4>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
              Sign in with Google and create a new sheet (or use an existing one).
            </p>
          </div>

          {/* Arrow 2 */}
          <div style={{ color: "#a7f3d0", fontSize: 24, fontWeight: 700, padding: "0 8px" }}>
            ⇢
          </div>

          {/* Step 3 */}
          <div style={{ background: "#ffffff", padding: "28px 24px", borderRadius: 16, border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#008060", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                3
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowLeftRight size={22} color="#008060" />
              </div>
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
              Sync &amp; Manage Products
            </h4>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
              Your products are synced! Start managing and updating your store data with ease.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. BUILT FOR SHOPIFY MERCHANTS CTA BANNER
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(180deg, #ecfdf5 0%, #f0fdf4 100%)",
          padding: "80px 24px 70px",
          textAlign: "center",
          borderTop: "1px solid #d1fae5",
          borderBottom: "1px solid #d1fae5",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#059669",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            BUILT FOR SHOPIFY MERCHANTS
          </div>

          <h2 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 800, color: "#0f172a", margin: "0 0 36px 0" }}>
            Save time. Stay organized. Grow faster.
          </h2>

          {/* 4 Feature Badges */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 44,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#ffffff", padding: "10px 18px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={16} color="#059669" />
              </div>
              Automate manual work
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#ffffff", padding: "10px 18px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={16} color="#059669" />
              </div>
              Keep your data in sync
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#ffffff", padding: "10px 18px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart3 size={16} color="#059669" />
              </div>
              Reduce errors
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#ffffff", padding: "10px 18px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Heart size={16} color="#059669" />
              </div>
              Focus on growing your business
            </div>
          </div>

          {/* Big CTA */}
          <Link
            to="/auth/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 36px",
              background: "#008060",
              color: "#ffffff",
              borderRadius: 8,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 16,
              boxShadow: "0 4px 14px rgba(0, 128, 96, 0.25)",
            }}
          >
            Get started <ArrowRight size={18} />
          </Link>

          <div style={{ fontSize: 13, color: "#64748b", marginTop: 12 }}>
            No credit card required.
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. PRICING SECTION (For navigation anchor)
      ───────────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ maxWidth: 1240, margin: "0 auto", padding: "70px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
            Simple, Transparent Pricing
          </h2>
          <p style={{ color: "#64748b", fontSize: 15 }}>
            Pick a plan tailored to your catalog size. Upgrade or cancel anytime.
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
                borderRadius: 16,
                border: idx === 1 ? "2px solid #008060" : "1px solid #e2e8f0",
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
                    background: "#008060",
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
                <div style={{ fontWeight: 600, fontSize: 14, color: "#008060", marginBottom: 12 }}>
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
                  background: idx === 1 ? "#008060" : "#f8fafc",
                  color: idx === 1 ? "#ffffff" : "#0f172a",
                  border: idx === 1 ? "none" : "1px solid #e2e8f0",
                  borderRadius: 8,
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

      {/* ─────────────────────────────────────────────────────────────
          7. GOOGLE OAUTH DATA & PRIVACY POLICY SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="privacy" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 80px" }}>
        <div
          style={{
            background: "#f8fafc",
            borderRadius: 20,
            border: "1px solid #e2e8f0",
            padding: "36px 32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Lock size={20} color="#008060" />
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
              Google API &amp; Data Security Policy
            </h3>
          </div>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 20px 0" }}>
            <strong>Rowflow - Product Management</strong> adheres strictly to the Google API Services User Data Policy, including the Limited Use requirements.
            Requested permissions (<code>spreadsheets</code>, <code>drive.file</code>) are used solely to read/write product catalog details into your designated spreadsheet. Rowflow does not access, store, or share customer personal information (PII) or financial transactions.
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13 }}>
            <a href="https://unbundl.com/privacy" target="_blank" rel="noreferrer" style={{ color: "#008060", fontWeight: 600, textDecoration: "none" }}>
              Privacy Policy ↗
            </a>
            <a href="https://unbundl.com/terms" target="_blank" rel="noreferrer" style={{ color: "#008060", fontWeight: 600, textDecoration: "none" }}>
              Terms of Service ↗
            </a>
            <span style={{ color: "#64748b" }}>
              Developed by <strong>Unbundl</strong> &bull; Contact: <strong>support@unbundl.com</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FOOTER (CHARCOAL DARK)
      ───────────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#0c181c",
          color: "#94a3b8",
          padding: "48px 32px 36px",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
            borderBottom: "1px solid #1e2e34",
            paddingBottom: 32,
            marginBottom: 24,
          }}
        >
          {/* Left Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <img
                src="/logo.png"
                alt="Rowflow Logo"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const nextEl = e.currentTarget.nextElementSibling;
                  if (nextEl) (nextEl as HTMLElement).style.display = "flex";
                }}
                style={{ width: 30, height: 30, borderRadius: 6, objectFit: "contain", display: "block" }}
              />
              <div
                style={{
                  display: "none",
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  background: "#008060",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 15,
                }}
              >
                R
              </div>
              <div style={{ lineHeight: 1.1 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: "#ffffff" }}>
                  Rowflow
                </span>
                <div style={{ fontSize: 10, color: "#64748b" }}>
                  - Product Management
                </div>
              </div>
            </div>
            <p style={{ margin: "6px 0 0 0", fontSize: 12, color: "#64748b" }}>
              Sync. Manage. Grow.
            </p>
          </div>

          {/* Center Links */}
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", fontSize: 13 }}>
            <a href="#product" style={{ color: "#94a3b8", textDecoration: "none" }}>
              Product
            </a>
            <a href="#pricing" style={{ color: "#94a3b8", textDecoration: "none" }}>
              Pricing
            </a>
            <a href="https://unbundl.com/privacy" target="_blank" rel="noreferrer" style={{ color: "#94a3b8", textDecoration: "none" }}>
              Privacy Policy
            </a>
            <a href="https://unbundl.com/terms" target="_blank" rel="noreferrer" style={{ color: "#94a3b8", textDecoration: "none" }}>
              Terms of Service
            </a>
            <a href="mailto:support@unbundl.com" style={{ color: "#94a3b8", textDecoration: "none" }}>
              Contact
            </a>
          </div>

          {/* Right Social Icons */}
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: "#94a3b8", textDecoration: "none", display: "flex", alignItems: "center" }} aria-label="Twitter">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: "#94a3b8", textDecoration: "none", display: "flex", alignItems: "center" }} aria-label="LinkedIn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
            <a href="mailto:support@unbundl.com" style={{ color: "#94a3b8", textDecoration: "none", display: "flex", alignItems: "center" }} aria-label="Email support">
              <Mail size={17} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ maxWidth: 1240, margin: "0 auto", textAlign: "right", fontSize: 12, color: "#64748b" }}>
          &copy; {new Date().getFullYear()} Rowflow - Product Management. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

