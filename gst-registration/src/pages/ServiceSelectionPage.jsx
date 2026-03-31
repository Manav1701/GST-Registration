import { useNavigate } from "react-router-dom";

export default function ServiceSelectionPage() {
  const navigate = useNavigate();

  const services = [
    {
      id: "gst",
      title: "GST Registration",
      subtitle: "New Application (REG-01)",
      description: "Apply for new Goods and Services Tax registration for your business.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      color: "#1B4FD8",
      gradient: "linear-gradient(135deg, #1B4FD8, #3B82F6)",
      path: "/gst",
    },
    {
      id: "adt",
      title: "ADT-1 Form",
      subtitle: "Appointment of Auditor",
      description: "Notice to the Registrar by company for appointment of auditor u/s 139.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <polyline points="17 11 19 13 23 9" />
        </svg>
      ),
      color: "#0F172A",
      gradient: "linear-gradient(135deg, #0F172A, #334155)",
      path: "/adt",
    }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: 60, maxWidth: 600, animation: "fadeInUp 0.6s ease-out" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 800, color: "#0F172A", marginBottom: 16, letterSpacing: "-0.03em" }}>
          Select <span style={{ color: "#1B4FD8" }}>Service</span>
        </h1>
        <p style={{ fontSize: 16, color: "#64748B", fontWeight: 500, lineHeight: 1.6 }}>
          Welcome! Please choose the service you wish to proceed with today. Each service maintains its own data.
        </p>
      </div>

      {/* Cards Container */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 30, maxWidth: 840, width: "100%" }}>
        {services.map((service, index) => (
          <div
            key={service.id}
            onClick={() => navigate(service.path)}
            className="service-card"
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: 32,
              border: "1px solid #E2E8F0",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
              animation: `fadeInUp 0.6s ease-out ${0.2 + index * 0.1}s both`,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = service.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
              e.currentTarget.style.borderColor = "#E2E8F0";
            }}
          >
            {/* Icon Circle */}
            <div style={{ 
              width: 64, 
              height: 64, 
              borderRadius: 18, 
              background: service.gradient, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "#fff",
              boxShadow: `0 8px 20px -4px ${service.color}44`
            }}>
              {service.icon}
            </div>

            {/* Content */}
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", marginBottom: 4, letterSpacing: "-0.01em" }}>{service.title}</h2>
              <p style={{ fontSize: 13, fontWeight: 700, color: service.color, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>{service.subtitle}</p>
              <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, fontWeight: 500 }}>{service.description}</p>
            </div>

            {/* Bottom Arrow */}
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8, color: service.color, fontWeight: 700, fontSize: 14 }}>
              Get Started
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 60, fontSize: 14, color: "#94A3B8", fontWeight: 500 }}>
        © 2026 Multi-Service Portal • Managed by Antigravity
      </p>
    </div>
  );
}
