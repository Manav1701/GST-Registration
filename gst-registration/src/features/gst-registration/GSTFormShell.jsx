import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGSTForm } from "../../hooks/useGSTForm.js";
import { TABS } from "../../constants/tabs.js";

// Tab pages
import Tab0_BusinessDetails from "./tabs/Tab0_BusinessDetails.jsx";
import Tab1_Promoter from "./tabs/Tab1_Promoter.jsx";
import Tab2_Promoter2 from "./tabs/Tab2_Promoter2.jsx";
import Tab3_AuthSignatory from "./tabs/Tab3_AuthSignatory.jsx";
import Tab4_AuthRep from "./tabs/Tab4_AuthRep.jsx";
import Tab5_PPB from "./tabs/Tab5_PPB.jsx";
import Tab6_APB from "./tabs/Tab6_APB.jsx";
import Tab7_GoodsServices from "./tabs/Tab7_GoodsServices.jsx";
import Tab8_StateSpecific from "./tabs/Tab8_StateSpecific.jsx";
import Tab9_Aadhaar from "./tabs/Tab9_Aadhaar.jsx";
import Tab10_Verification from "./tabs/Tab10_Verification.jsx";

export default function GSTFormShell() {
  const navigate = useNavigate();
  const {
    formData, contactInfo, errors, touched, tabStatus,
    activeTab, setActiveTab, showTabWarning,
    update, touch, handleSaveContinue, getTabErrors,
    fetchAddressByPin,
  } = useGSTForm();

  // Sync active tab to sessionStorage so MainLayout progress bar can read it
  useEffect(() => {
    sessionStorage.setItem("gst_active_tab", String(activeTab));
  }, [activeTab]);

  const props = { data: formData, update, errors, touched, touch, fetchAddressByPin };

  const pages = [
    <Tab0_BusinessDetails {...props} />,
    <Tab1_Promoter {...props} suffix="" />,
    <Tab2_Promoter2 {...props} suffix="_2" />,
    <Tab3_AuthSignatory {...props} />,
    <Tab4_AuthRep {...props} />,
    <Tab5_PPB {...props} />,
    <Tab6_APB {...props} />,
    <Tab7_GoodsServices {...props} />,
    <Tab8_StateSpecific {...props} />,
    <Tab9_Aadhaar {...props} />,
    <Tab10_Verification {...props} />,
  ];

  const tabErrors = getTabErrors(activeTab, formData);

  return (
    <div style={{ maxWidth:1400, margin:"0 auto", padding:"22px 24px", display:"flex", gap:22, alignItems:"flex-start" }}>
      {/* Sidebar */}
      <aside style={{ width:248, flexShrink:0, position:"sticky", top:82 }}>
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #E2E8F0", overflow:"hidden", boxShadow:"0 1px 5px rgba(15,23,42,0.05)" }}>
          <div style={{ padding:"14px 18px", background:"linear-gradient(135deg,#1B4FD8,#2563EB)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ color:"#fff", fontSize:11, fontWeight:800, letterSpacing:"0.07em", textTransform:"uppercase" }}>Form Sections</span>
            <span style={{ color:"#93C5FD", fontSize:11.5, fontWeight:600 }}>{activeTab+1}/{TABS.length}</span>
          </div>
          <nav style={{ padding:"6px 0" }}>
            {TABS.map((tab, i) => {
              const isActive = i===activeTab;
              const isComplete = tabStatus[i]==="complete";
              return (
                <button key={i} type="button" onClick={()=>{ setActiveTab(i); window.scrollTo({top:0,behavior:"smooth"}); }}
                  style={{ width:"100%", textAlign:"left", padding:"9px 18px", background:isActive?"#EEF4FF":"transparent", border:"none", borderLeft:isActive?"3px solid #1B4FD8":"3px solid transparent", cursor:"pointer", display:"flex", alignItems:"center", gap:9, transition:"all 0.15s ease" }}>
                  <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:isComplete?11:10.5, fontWeight:800, background:isActive?"#1B4FD8":isComplete?"#D1FAE5":"#F1F5F9", color:isActive?"#fff":isComplete?"#065F46":"#94A3B8" }}>
                    {isComplete?"✓":i+1}
                  </div>
                  <span style={{ fontSize:12, fontWeight:isActive?700:500, color:isActive?"#1B4FD8":"#475569", lineHeight:1.35 }}>{tab.label}</span>
                </button>
              );
            })}
          </nav>
          {/* Re-upload documents button */}
          <div style={{ padding:"10px 18px", borderTop:"1px solid #F1F5F9" }}>
            <button onClick={()=>navigate("/documents")}
              style={{ width:"100%", padding:"8px 12px", background:"#F8FAFC", border:"1.5px solid #E2E8F0", borderRadius:8, fontSize:12, fontWeight:600, color:"#64748B", cursor:"pointer", display:"flex", alignItems:"center", gap:7 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              Re-upload Documents
            </button>
          </div>
          <div style={{ padding:"8px 18px 12px", background:"#F8FAFC" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#10B981" }}/>
              <span style={{ fontSize:10.5, color:"#64748B", fontWeight:600 }}>Auto-saved to browser</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex:1, minWidth:0 }}>
        {showTabWarning && (
          <div style={{ background:"#FFFBEB", border:"1px solid #F59E0B", borderRadius:10, padding:"13px 17px", marginBottom:14, display:"flex", alignItems:"center", gap:9 }}>
            <span style={{ fontSize:16 }}>⚠️</span>
            <span style={{ fontSize:13.5, fontWeight:700, color:"#92400E" }}>
              Please fix {tabErrors.length} validation error{tabErrors.length>1?"s":""} before continuing.
            </span>
          </div>
        )}

        {/* Tab header */}
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #E2E8F0", padding:"18px 26px", marginBottom:18, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 4px rgba(15,23,42,0.04)" }}>
          <div>
            <div style={{ fontSize:10.5, fontWeight:800, color:"#1B4FD8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>Section {activeTab+1} of {TABS.length}</div>
            <h2 style={{ fontSize:20, fontWeight:800, color:"#1E293B", letterSpacing:"-0.02em" }}>{TABS[activeTab].label}</h2>
          </div>
          <div style={{ width:48, height:48, borderRadius:"50%", background:"linear-gradient(135deg,#EEF4FF,#DBEAFE)", border:"2px solid #C7D9FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:800, color:"#1B4FD8", fontFamily:"'JetBrains Mono',monospace" }}>
            {String(activeTab+1).padStart(2,"0")}
          </div>
        </div>

        {pages[activeTab]}

        {/* Navigation footer */}
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #E2E8F0", padding:"16px 26px", marginTop:6, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 4px rgba(15,23,42,0.04)" }}>
          <button type="button" onClick={()=>{ if(activeTab>0){setActiveTab(activeTab-1);window.scrollTo({top:0,behavior:"smooth"});} }} disabled={activeTab===0} className="nav-btn"
            style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 20px", border:"1.5px solid #E2E8F0", background:"#fff", borderRadius:9, fontSize:13.5, fontWeight:600, color:activeTab===0?"#CBD5E1":"#374151", cursor:activeTab===0?"not-allowed":"pointer" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:11.5, color:"#94A3B8", fontWeight:600 }}>{activeTab+1}/{TABS.length}</span>
            <div style={{ display:"flex", gap:4 }}>
              {TABS.map((_,i)=>(
                <div key={i} onClick={()=>{setActiveTab(i);window.scrollTo({top:0,behavior:"smooth"});}}
                  style={{ width:i===activeTab?16:6, height:6, borderRadius:3, background:i===activeTab?"#1B4FD8":tabStatus[i]==="complete"?"#C7D9FF":"#E2E8F0", transition:"all 0.3s ease", cursor:"pointer" }}/>
              ))}
            </div>
          </div>

          <button type="button" onClick={()=>handleSaveContinue(activeTab,TABS.length)} className="nav-btn"
            style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 22px", background:"linear-gradient(135deg,#1B4FD8,#2563EB)", color:"#fff", border:"none", borderRadius:9, fontSize:13.5, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 14px rgba(27,79,216,0.28)" }}>
            {activeTab<TABS.length-1?"Save & Continue":"Go to Review"}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </main>
    </div>
  );
}
