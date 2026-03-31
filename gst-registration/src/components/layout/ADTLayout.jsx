import { useNavigate, useLocation } from "react-router-dom";

export default function ADTLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const contactInfo = (() => {
    try { return JSON.parse(localStorage.getItem("adt_contact")) || {}; } catch { return {}; }
  })();

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FA", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", boxShadow: "0 1px 5px rgba(15,23,42,0.06)", position: "sticky", top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", minHeight: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#0F172A,#334155)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1E293B" }}>ADT-1 Portal</div>
              <div style={{ fontSize: 10.5, color: "#64748B", fontWeight: 700, letterSpacing: "0.04em" }}>APPOINTMENT OF AUDITOR</div>
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {contactInfo.mobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 12px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#475569" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1E293B" }}>+91 {contactInfo.mobile}</span>
              </div>
            )}
            <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#64748B", fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
              Exit
            </button>
          </div>
        </div>
      </header>

      <div style={{ padding: "0 24px" }}>
        {children}
      </div>
    </div>
  );
}
