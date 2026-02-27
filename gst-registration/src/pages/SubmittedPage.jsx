import { useNavigate } from "react-router-dom";
import { STORAGE_KEY } from "../constants/tabs.js";

export default function SubmittedPage() {
  const navigate = useNavigate();
  const formData = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY+"_submitted")||"{}"); } catch { return {}; } })();
  const contact = (() => { try { return JSON.parse(localStorage.getItem("gst_contact")||"{}"); } catch { return {}; } })();

  const handleNew = () => {
    [STORAGE_KEY, "gst_stage","gst_contact","gst_otp_verified",STORAGE_KEY+"_submitted"].forEach(k=>localStorage.removeItem(k));
    navigate("/");
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F4F6FA" }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"56px 52px", textAlign:"center", maxWidth:500, boxShadow:"0 24px 60px rgba(15,23,42,0.1)", animation:"fadeInUp 0.4s ease both" }}>
        <div style={{ width:76, height:76, borderRadius:"50%", background:"linear-gradient(135deg,#DCFCE7,#D1FAE5)", border:"2px solid #BBF7D0", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 22px" }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ fontSize:24, fontWeight:800, color:"#1E293B", marginBottom:10, letterSpacing:"-0.02em" }}>Application Submitted!</h2>
        <p style={{ color:"#64748B", fontSize:14, lineHeight:1.75, marginBottom:28 }}>
          Your GST Registration application has been submitted successfully. An ARN will be generated after Aadhaar authentication is completed.
        </p>
        <div style={{ background:"#EEF4FF", borderRadius:10, padding:16, marginBottom:28, textAlign:"left" }}>
          <p style={{ fontSize:11, color:"#1B4FD8", fontWeight:800, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>Submitted Summary</p>
          <p style={{ fontSize:13, color:"#374151", marginBottom:4 }}>Legal Name: <strong>{formData.legal_name||"—"}</strong></p>
          <p style={{ fontSize:13, color:"#374151", marginBottom:4 }}>PAN: <strong>{formData.pan||"—"}</strong></p>
          <p style={{ fontSize:13, color:"#374151", marginBottom:4 }}>Trade Name: <strong>{formData.trade_name||"—"}</strong></p>
          <p style={{ fontSize:13, color:"#374151" }}>Mobile: <strong>+91 {contact.mobile||"—"}</strong></p>
        </div>
        <button onClick={handleNew}
          style={{ padding:"12px 28px", background:"linear-gradient(135deg,#1B4FD8,#3B82F6)", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 14px rgba(27,79,216,0.3)" }}>
          Start New Application
        </button>
      </div>
    </div>
  );
}
