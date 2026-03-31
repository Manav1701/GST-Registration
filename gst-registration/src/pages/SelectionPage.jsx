import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGSTForm } from "../hooks/useGSTForm.js";

export default function SelectionPage() {
  const navigate = useNavigate();
  const { draftsList, submissionsList, loadDraft, loadSubmission, clearDraft, fetchDrafts, fetchSubmissionsByM, contactInfo } = useGSTForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Helper to extract name even if JSON is nested
  const getRecordName = (record) => {
    let data = record.form_data || record;
    // Walk through potential nested form_data wrappers
    while (data && data.form_data && typeof data.form_data === "object") {
      data = data.form_data;
    }
    
    const name = data?.legal_name || data?.trade_name;
    if (name && name.trim().length > 0) return name;
    
    // Fallback if no name is entered yet
    return `New Application (#${record.id || 'Draft'})`;
  };

  useEffect(() => {
    // Ensure we have the latest drafts and submissions for this user
    if (contactInfo.mobile) {
      fetchDrafts(contactInfo.mobile);
      fetchSubmissionsByM(contactInfo.mobile);
    }
  }, [fetchDrafts, fetchSubmissionsByM, contactInfo.mobile]);

  // Merge lists for searching
  const combinedRecords = useMemo(() => {
    const list = [
      ...draftsList.map(d => ({ ...d, type: 'draft' })),
      ...submissionsList.map(s => ({ ...s, type: 'submitted' }))
    ];
    
    if (!searchTerm) return list;
    
    return list.filter((r) => {
        const name = getRecordName(r).toLowerCase();
        const id = String(r.id);
        const term = searchTerm.toLowerCase();
        return name.includes(term) || id.includes(term);
    });
  }, [draftsList, submissionsList, searchTerm]);

  const handleNewRegistration = async () => {
    await clearDraft();
    navigate("/gst/documents");
  };

  const handleSelectRecord = async (record) => {
    console.log("[SelectionPage] Selecting record:", record);
    try {
      if (record.type === 'draft') {
          await loadDraft(record.id);
      } else {
          await loadSubmission(record.id);
      }
      console.log("[SelectionPage] Record loaded successfully, navigating...");
      navigate("/gst/documents");
    } catch (err) {
      console.error("[SelectionPage] Error picking record:", err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F6FA",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      {/* Header / Logo Section */}
      <div style={{ textAlign: "center", marginBottom: 40, animation: "fadeInUp 0.4s ease both" }}>
        <div
          style={{
            width: 60,
            height: 60,
            background: "linear-gradient(135deg,#1B4FD8,#3B82F6)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 20px rgba(27,79,216,0.25)",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1E293B", letterSpacing: "-0.02em" }}>
          Application Manager
        </h1>
        <p style={{ fontSize: 15, color: "#64748B", marginTop: 8, fontWeight: 500 }}>
          Manage your drafts and submitted GST applications for <b>{contactInfo.mobile}</b>
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
          maxWidth: 900,
          width: "100%",
          animation: "fadeInUp 0.5s ease both 0.1s",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Card 1: New Registration */}
        <div
          onClick={handleNewRegistration}
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 32,
            border: "2px solid transparent",
            boxShadow: "0 4px 6px rgba(15,23,42,0.04), 0 10px 15px rgba(15,23,42,0.05)",
            cursor: "pointer",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.borderColor = "#1B4FD8";
            e.currentTarget.style.boxShadow = "0 20px 25px rgba(27,79,216,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(15,23,42,0.04), 0 10px 15px rgba(15,23,42,0.05)";
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#EEF2FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              marginBottom: 20,
              color: "#1B4FD8",
            }}
          >
            ✨
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1E293B", marginBottom: 12 }}>
            New registration
          </h2>
          <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.6, marginBottom: 24 }}>
            Start a fresh application from scratch. All previously entered data for this session will be cleared.
          </p>
          <div
            style={{
              marginTop: "auto",
              padding: "10px 24px",
              background: "#1B4FD8",
              color: "#fff",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Start Fresh
          </div>
        </div>

        {/* Card 2: Update Data / Searchable Select */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 32,
            border: "2px solid transparent",
            boxShadow: "0 4px 6px rgba(15,23,42,0.04), 0 10px 15px rgba(15,23,42,0.05)",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.25s ease",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#F0FDF4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                margin: "0 auto 20px",
                color: "#059669",
              }}
            >
              📂
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1E293B", marginBottom: 12 }}>
              Records for {contactInfo.mobile}
            </h2>
            <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.6, marginBottom: 24 }}>
              Continue working on a previously saved application or view submitted results.
            </p>
          </div>

          <div style={{ position: "relative", width: "100%", zIndex: showDropdown ? 100 : 1 }}>
            <div
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94A3B8",
                zIndex: 10,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by Legal Name or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              style={{
                width: "100%",
                padding: "14px 14px 14px 44px",
                fontSize: 14.5,
                fontWeight: 600,
                color: "#1E293B",
                background: "#F8FAFC",
                border: "2px solid #E2E8F0",
                borderRadius: 12,
                outline: "none",
                transition: "all 0.2s",
              }}
            />

            {showDropdown && (searchTerm || combinedRecords.length > 0) && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)",
                  border: "1px solid #E2E8F0",
                  maxHeight: 320,
                  overflowY: "auto",
                  zIndex: 1000,
                  padding: 6,
                }}
              >
                {combinedRecords.length > 0 ? (
                  combinedRecords.map((record) => (
                    <div
                      key={`${record.type}-${record.id}`}
                      onClick={() => {
                        console.log("[SelectionPage] Selected record:", record);
                        handleSelectRecord(record);
                      }}
                      style={{
                        padding: "12px 16px",
                        borderRadius: 8,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#F1F5F9";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          background: record.type === 'draft' ? "#EEF2FF" : "#ECFDF5",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                        }}
                      >
                         {record.type === 'draft' ? "📝" : "✅"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 700,
                            color: "#1E293B",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {getRecordName(record)}
                        </div>
                        <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>
                          ID: #{record.id} • <span style={{ color: record.type === 'draft' ? "#1B4FD8" : "#059669" }}>
                            {record.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "#1B4FD8", fontWeight: 700 }}>Resmue →</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "20px 16px", textAlign: "center", color: "#64748B", fontSize: 13.5 }}>
                    No matching records found
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Overlay to close dropdown when clicking outside */}
          {showDropdown && (
            <div 
              style={{ position: "fixed", inset: 0, zIndex: 90 }} 
              onClick={() => setShowDropdown(false)}
            />
          )}

          <div style={{ marginTop: 24, padding: "12px 16px", background: "#F1F5F9", borderRadius: 10, border: "1px dashed #CBD5E1" }}>
            <p style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <span>💡</span> Tip: Start typing the legal name to filter the list instantly.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40, animation: "fadeInUp 0.6s ease both 0.2s", position: "relative", zIndex: 1 }}>
         <button 
           onClick={() => navigate("/gst/otp")}
           style={{
             background: "none",
             border: "none",
             color: "#94A3B8",
             fontSize: 14,
             fontWeight: 600,
             cursor: "pointer",
             display: "flex",
             alignItems: "center",
             gap: 8,
           }}
           onMouseEnter={(e) => e.currentTarget.style.color = "#1B4FD8"}
           onMouseLeave={(e) => e.currentTarget.style.color = "#94A3B8"}
         >
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
             <path d="M19 12H5M12 19l-7-7 7-7" />
           </svg>
           Back to OTP Verification
         </button>
      </div>
    </div>
  );
}
