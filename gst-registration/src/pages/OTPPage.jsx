import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import OtpDigitBox from "../components/shared/OtpDigitBox.jsx";

export default function OTPPage() {
  const navigate = useNavigate();
  const contactInfo = (() => { try { return JSON.parse(localStorage.getItem("gst_contact"))||{}; } catch { return {}; } })();

  const [mobileOtp, setMobileOtp] = useState(["","","","","",""]);
  const [emailOtp, setEmailOtp] = useState(["","","","","",""]);
  const [mobileTimer, setMobileTimer] = useState(60);
  const [emailTimer, setEmailTimer] = useState(60);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [shake, setShake] = useState({ mobile:false, email:false });
  const mobileRefs = useRef([]);
  const emailRefs = useRef([]);

  useEffect(()=>{ if(mobileTimer>0&&!mobileVerified){const t=setTimeout(()=>setMobileTimer(v=>v-1),1000);return()=>clearTimeout(t);} },[mobileTimer,mobileVerified]);
  useEffect(()=>{ if(emailTimer>0&&!emailVerified){const t=setTimeout(()=>setEmailTimer(v=>v-1),1000);return()=>clearTimeout(t);} },[emailTimer,emailVerified]);

  const handleOtpInput=(arr,setArr,refs,index,val)=>{ if(!/^\d*$/.test(val))return; const n=[...arr]; n[index]=val.slice(-1); setArr(n); if(val&&index<5)refs.current[index+1]?.focus(); };
  const handleOtpKeyDown=(arr,setArr,refs,index,e)=>{ if(e.key==="Backspace"){if(arr[index]){const n=[...arr];n[index]="";setArr(n);}else if(index>0)refs.current[index-1]?.focus();} if(e.key==="ArrowLeft"&&index>0)refs.current[index-1]?.focus(); if(e.key==="ArrowRight"&&index<5)refs.current[index+1]?.focus(); };
  const handleOtpPaste=(setArr,refs,e)=>{ e.preventDefault(); const p=e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6); const n=["","","","","",""]; p.split("").forEach((c,i)=>{n[i]=c;}); setArr(n); setTimeout(()=>refs.current[Math.min(p.length,5)]?.focus(),0); };

  const verifyMobile=()=>{ if(mobileOtp.join("").length===6){setMobileVerified(true);setMobileError("");}else{setMobileError("Please enter all 6 digits");setShake(s=>({...s,mobile:true}));setTimeout(()=>setShake(s=>({...s,mobile:false})),500);} };
  const verifyEmail=()=>{ if(emailOtp.join("").length===6){setEmailVerified(true);setEmailError("");}else{setEmailError("Please enter all 6 digits");setShake(s=>({...s,email:true}));setTimeout(()=>setShake(s=>({...s,email:false})),500);} };

  const canProceed = mobileVerified || emailVerified;

  const TimerBadge = ({ timer, onResend, verified }) => (
    <div style={{ textAlign:"center", marginTop:10 }}>
      {verified ? <span style={{ fontSize:13, color:"#059669", fontWeight:700 }}>✓ Verified successfully</span>
        : timer>0 ? <span style={{ fontSize:12.5, fontWeight:600, color:timer<=10?"#DC2626":"#94A3B8", animation:timer<=10?"timerPulse 1s infinite":"none" }}>Resend OTP in {String(Math.floor(timer/60)).padStart(2,"0")}:{String(timer%60).padStart(2,"0")}</span>
        : <button onClick={onResend} style={{ background:"none", border:"none", color:"#1B4FD8", fontSize:13, fontWeight:700, cursor:"pointer", textDecoration:"underline" }}>Resend OTP</button>}
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#F4F6FA", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"#fff", borderRadius:20, border:"1px solid #E2E8F0", padding:"44px 40px", maxWidth:520, width:"100%", boxShadow:"0 8px 40px rgba(15,23,42,0.1)", animation:"fadeInUp 0.35s ease both" }}>
        <div style={{ textAlign:"center", marginBottom:30 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#1B4FD8,#3B82F6)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:"0 6px 18px rgba(27,79,216,0.3)" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
          </div>
          <h2 style={{ fontSize:22, fontWeight:800, color:"#1E293B", marginBottom:6 }}>OTP Verification</h2>
          <p style={{ fontSize:13, color:"#64748B", lineHeight:1.65 }}>OTPs sent to <strong style={{ color:"#1B4FD8" }}>+91 {contactInfo.mobile}</strong> and <strong style={{ color:"#1B4FD8" }}>{contactInfo.email}</strong></p>
          <div style={{ display:"inline-block", marginTop:8, padding:"5px 12px", background:"#EEF4FF", borderRadius:20, border:"1px solid #C7D9FF" }}>
            <span style={{ fontSize:11.5, color:"#1B4FD8", fontWeight:600 }}>🧪 Test mode — any 6 digits are valid</span>
          </div>
        </div>

        {/* Mobile OTP */}
        {[{label:"Mobile OTP",sub:`+91 ${contactInfo.mobile}`,otp:mobileOtp,setOtp:setMobileOtp,refs:mobileRefs,verified:mobileVerified,error:mobileError,timer:mobileTimer,onResend:()=>setMobileTimer(60),onVerify:verifyMobile,shakeKey:"mobile",color:"#1B4FD8",bg:"#EEF4FF",icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>,btnBg:"linear-gradient(135deg,#1B4FD8,#3B82F6)"},
          {label:"Email OTP",sub:contactInfo.email,otp:emailOtp,setOtp:setEmailOtp,refs:emailRefs,verified:emailVerified,error:emailError,timer:emailTimer,onResend:()=>setEmailTimer(60),onVerify:verifyEmail,shakeKey:"email",color:"#7C3AED",bg:"#F5F3FF",icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,btnBg:"linear-gradient(135deg,#6D28D9,#7C3AED)"},
        ].map((card) => (
          <div key={card.label} style={{ background:"#F8FAFC", border:`1.5px solid ${shake[card.shakeKey]?"#FCA5A5":card.verified?"#BBF7D0":"#E2E8F0"}`, borderRadius:12, padding:"20px 20px 16px", marginBottom:14, animation:shake[card.shakeKey]?"shake 0.4s ease":"none" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:card.verified?"#DCFCE7":card.bg, display:"flex", alignItems:"center", justifyContent:"center", color:card.verified?"#059669":card.color }}>{card.icon}</div>
                <div><div style={{ fontSize:13, fontWeight:700, color:"#1E293B" }}>{card.label}</div><div style={{ fontSize:11, color:"#94A3B8" }}>{card.sub}</div></div>
              </div>
              {card.verified && <span style={{ fontSize:12, background:"#DCFCE7", color:"#059669", padding:"4px 10px", borderRadius:20, fontWeight:700 }}>✓ Verified</span>}
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
              {card.otp.map((digit,i)=>(
                <OtpDigitBox key={i} value={digit} disabled={card.verified}
                  inputRef={(el)=>(card.refs.current[i]=el)}
                  onChange={(e)=>handleOtpInput(card.otp,card.setOtp,card.refs,i,e.target.value)}
                  onKeyDown={(e)=>handleOtpKeyDown(card.otp,card.setOtp,card.refs,i,e)}
                  onPaste={(e)=>handleOtpPaste(card.setOtp,card.refs,e)}
                />
              ))}
            </div>
            {card.error && <p style={{ textAlign:"center", fontSize:12, color:"#DC2626", marginTop:8, fontWeight:600 }}>⚠ {card.error}</p>}
            <TimerBadge timer={card.timer} onResend={card.onResend} verified={card.verified}/>
            {!card.verified && (
              <button onClick={card.onVerify} className="nav-btn"
                style={{ width:"100%", marginTop:12, padding:10, fontSize:13.5, fontWeight:700, background:card.btnBg, color:"#fff", border:"none", borderRadius:9, cursor:"pointer", boxShadow:"0 3px 10px rgba(27,79,216,0.25)" }}>
                Verify {card.label}
              </button>
            )}
          </div>
        ))}

        <button onClick={()=>{ if(!canProceed)return; localStorage.setItem("gst_otp_verified","1"); navigate("/documents"); }} className="nav-btn"
          style={{ width:"100%", padding:13, fontSize:15, fontWeight:800, background:canProceed?"linear-gradient(135deg,#059669,#10B981)":"#F1F5F9", color:canProceed?"#fff":"#94A3B8", border:`1.5px solid ${canProceed?"transparent":"#E2E8F0"}`, borderRadius:12, cursor:canProceed?"pointer":"not-allowed", boxShadow:canProceed?"0 4px 14px rgba(5,150,105,0.3)":"none", display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}>
          {canProceed ? <>Proceed to Document Upload <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></> : "Verify at least one OTP to continue"}
        </button>
        <button onClick={()=>navigate("/")} style={{ width:"100%", marginTop:10, padding:10, background:"none", border:"none", color:"#94A3B8", fontSize:13, cursor:"pointer", fontWeight:500 }}>← Back to contact details</button>
      </div>
    </div>
  );
}
