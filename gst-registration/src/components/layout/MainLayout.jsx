import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MainLayout({ children, showReviewHeader }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isReview = location.pathname === "/review" || showReviewHeader;

  const contactInfo = (() => {
    try { return JSON.parse(localStorage.getItem("gst_contact")) || {}; } catch { return {}; }
  })();

  return (
    <div style={{ minHeight:"100vh", background:"#F4F6FA", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      {/* Header */}
      <header style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", boxShadow:"0 1px 5px rgba(15,23,42,0.06)", position:"sticky", top:0, zIndex:1000 }}>
        <div className="header-content" style={{ maxWidth:1400, margin:"0 auto", padding:"0 24px", minHeight:62, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0" }}>
            <div style={{ width:36, height:36, background:"linear-gradient(135deg,#1B4FD8,#3B82F6)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div className="logo-text">
              <div style={{ fontSize:14, fontWeight:800, color:"#1E293B" }}>GST Registration</div>
              <div style={{ fontSize:10.5, color:"#1B4FD8", fontWeight:700, letterSpacing:"0.04em" }}>
                {isReview ? "REVIEW & SUBMIT" : "FORM REG-01 — NEW APPLICATION"}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div style={{ display:"flex", alignItems:"center", gap:14, padding:"8px 0", flexWrap:"wrap" }}>
            {/* Record ID / Mode Indicator */}
            {(() => {
              const regId = localStorage.getItem("gst_submission_id");
              const regName = localStorage.getItem("gst_submission_name");
              if (!regId) return (
                <div style={{ display:"flex", alignItems:"center", gap:6, background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:8, padding:"6px 12px" }}>
                  <span style={{ fontSize:15 }}>🆕</span>
                  <span style={{ fontSize:11.5, fontWeight:700, color:"#64748B" }}>NEW RECORD</span>
                </div>
              );
              return (
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                   <div style={{ 
                     display:"flex", alignItems:"center", gap:7, background:"#FFFBEB", border:"1px solid #FCD34D", borderRadius:8, padding:"6px 12px",
                     maxWidth: 240 // Prevents pushing buttons out of screen
                   }}>
                    <span style={{ fontSize:15 }}>✏️</span>
                    <span style={{ 
                      fontSize:11.5, fontWeight:700, color:"#92400E", 
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" 
                    }}>
                      {regName ? `${regName.toUpperCase()} (#${regId})` : `EDITING: #${regId}`}
                    </span>
                  </div>
                  <button 
                    onClick={()=>navigate("/gst/selection")}
                    style={{ 
                      background: "#fff", 
                      border: "1px solid #C7D9FF", 
                      color: "#1B4FD8", 
                      fontSize: 10, 
                      fontWeight: 800, 
                      cursor: "pointer", 
                      padding: "4px 10px", 
                      borderRadius: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      transition: "all 0.15s ease",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#EEF4FF";
                      e.currentTarget.style.borderColor = "#1B4FD8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.borderColor = "#C7D9FF";
                    }}
                  >
                    Change
                  </button>
                </div>
              );
            })()}

            {contactInfo.mobile && (
              <div className="hide-mobile" style={{ display:"flex", alignItems:"center", gap:8, background:"#EEF4FF", border:"1px solid #C7D9FF", borderRadius:8, padding:"6px 12px" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#10B981" }}/>
                <span style={{ fontSize:12, fontWeight:600, color:"#1B4FD8" }}>+91 {contactInfo.mobile}</span>
              </div>
            )}
            {isReview ? (
              <button onClick={()=>navigate("/gst/form")} className="nav-btn"
                style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 16px", border:"1.5px solid #E2E8F0", background:"#fff", borderRadius:8, fontSize:13, fontWeight:600, color:"#374151", cursor:"pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                <span className="hide-mobile">Back to Form</span>
                <span className="show-mobile" style={{ display:"none" }}>Back</span>
              </button>
            ) : (
              <button onClick={()=>navigate("/gst/review")} className="nav-btn"
                style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 16px", background:"linear-gradient(135deg,#059669,#10B981)", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 3px 10px rgba(5,150,105,0.3)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                <span className="hide-mobile">Review & Submit</span>
                <span className="show-mobile" style={{ display:"none" }}>Review</span>
              </button>
            )}
          </div>
        </div>
        {/* Progress bar — only on form */}
        {!isReview && <ProgressBar />}
      </header>

      {children}
    </div>
  );
}

function ProgressBar() {
  // reads activeTab from sessionStorage set by GSTFormShell
  const tab = parseInt(sessionStorage.getItem("gst_active_tab") || "0", 10);
  const total = 11;
  return (
    <div style={{ height:3, background:"#F1F5F9" }}>
      <div style={{ height:3, background:"linear-gradient(90deg,#1B4FD8,#3B82F6,#06B6D4)", width:`${((tab+1)/total)*100}%`, transition:"width 0.4s cubic-bezier(0.4,0,0.2,1)" }}/>
    </div>
  );
}
