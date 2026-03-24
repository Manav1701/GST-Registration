import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATTERNS } from "../constants/validation.js";

export default function ContactPage() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validate = () => {
    let valid = true;
    if (!PATTERNS.mobile.test(mobile)) { setMobileError("Enter valid 10-digit mobile number (starts with 6-9)"); valid=false; } else setMobileError("");
    if (!PATTERNS.email.test(email)) { setEmailError("Enter a valid email address"); valid=false; } else setEmailError("");
    return valid;
  };

  const handleProceed = () => {
    if (!validate()) return;
    localStorage.setItem("gst_contact", JSON.stringify({ mobile, email }));
    navigate("/otp");
  };

  return (
    <div style={{ minHeight:"100vh", background:"#F4F6FA", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div className="section-card-content" style={{ background:"#fff", borderRadius:20, border:"1px solid #E2E8F0", maxWidth:480, width:"100%", boxShadow:"0 8px 40px rgba(15,23,42,0.1)", animation:"fadeInUp 0.4s ease both" }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:60, height:60, borderRadius:16, background:"linear-gradient(135deg,#1B4FD8,#3B82F6)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", boxShadow:"0 8px 24px rgba(27,79,216,0.3)" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <h1 style={{ fontSize:24, fontWeight:800, color:"#1E293B", letterSpacing:"-0.02em", marginBottom:6 }}>GST Registration</h1>
          <p style={{ fontSize:12.5, color:"#94A3B8", fontWeight:500 }}>Form REG-01 — New Application</p>
        </div>

        {/* Step progress */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:28 }}>
          {["Contact","OTP","Documents","Form","Review"].map((s,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:i===0?28:24, height:i===0?28:24, borderRadius:"50%", background:i===0?"#1B4FD8":"#E2E8F0", color:i===0?"#fff":"#94A3B8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800 }}>{i+1}</div>
              {i<4 && <div style={{ width:18, height:2, background:"#E2E8F0", borderRadius:1 }}/>}
            </div>
          ))}
        </div>

        <div style={{ background:"#EEF4FF", borderRadius:10, padding:"14px 18px", marginBottom:28, border:"1px solid #C7D9FF" }}>
          <p style={{ fontSize:13, color:"#1B4FD8", lineHeight:1.65, textAlign:"center", fontWeight:500 }}>
            Enter your <strong>mobile number</strong> and <strong>email address</strong> to begin. An OTP will be sent for verification.
          </p>
        </div>

        {/* Mobile */}
        <div style={{ marginBottom:18 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#64748B", marginBottom:6, letterSpacing:"0.06em", textTransform:"uppercase" }}>Mobile Number <span style={{ color:"#EF4444" }}>*</span></label>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontSize:13, fontWeight:700, color:"#64748B", borderRight:"1.5px solid #E2E8F0", paddingRight:10, lineHeight:1 }}>+91</div>
            <input type="tel" value={mobile}
              onChange={(e)=>{ setMobile(e.target.value.replace(/\D/g,"").slice(0,10)); setMobileError(""); }}
              placeholder="9876543210"
              style={{ width:"100%", padding:"11px 14px 11px 56px", fontSize:15, fontFamily:"'JetBrains Mono',monospace", fontWeight:500, background:"#fff", border:`1.5px solid ${mobileError?"#FCA5A5":"#CBD5E1"}`, borderRadius:9, color:"#1E293B", outline:"none", letterSpacing:"0.05em" }}
              onFocus={(e)=>{ e.target.style.borderColor="#1B4FD8"; e.target.style.boxShadow="0 0 0 3px rgba(27,79,216,0.12)"; }}
              onBlur={(e)=>{ e.target.style.borderColor=mobileError?"#FCA5A5":"#CBD5E1"; e.target.style.boxShadow="none"; }}
            />
          </div>
          {mobileError && <p style={{ fontSize:11.5, color:"#DC2626", marginTop:5, fontWeight:600 }}>⚠ {mobileError}</p>}
        </div>

        {/* Email */}
        <div style={{ marginBottom:30 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#64748B", marginBottom:6, letterSpacing:"0.06em", textTransform:"uppercase" }}>Email Address <span style={{ color:"#EF4444" }}>*</span></label>
          <input type="email" value={email}
            onChange={(e)=>{ setEmail(e.target.value); setEmailError(""); }}
            placeholder="yourname@example.com"
            style={{ width:"100%", padding:"11px 14px", fontSize:14, background:"#fff", border:`1.5px solid ${emailError?"#FCA5A5":"#CBD5E1"}`, borderRadius:9, color:"#1E293B", outline:"none" }}
            onFocus={(e)=>{ e.target.style.borderColor="#1B4FD8"; e.target.style.boxShadow="0 0 0 3px rgba(27,79,216,0.12)"; }}
            onBlur={(e)=>{ e.target.style.borderColor=emailError?"#FCA5A5":"#CBD5E1"; e.target.style.boxShadow="none"; }}
          />
          {emailError && <p style={{ fontSize:11.5, color:"#DC2626", marginTop:5, fontWeight:600 }}>⚠ {emailError}</p>}
        </div>

        <button onClick={handleProceed} className="nav-btn"
          style={{ width:"100%", padding:13, fontSize:15, fontWeight:800, background:"linear-gradient(135deg,#1B4FD8,#2563EB)", color:"#fff", border:"none", borderRadius:10, cursor:"pointer", boxShadow:"0 5px 16px rgba(27,79,216,0.3)", display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}>
          Send OTP & Proceed
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
        <p style={{ textAlign:"center", fontSize:11.5, color:"#94A3B8", marginTop:16 }}>🔒 Your data is stored locally until submission</p>
      </div>
    </div>
  );
}
