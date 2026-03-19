// ─── All reusable UI primitive components ────────────────────────────────────
import { useState } from "react";
import { processImage } from "../../utils/fileProcessor.js";

export const FieldWrapper = ({ label, required, error, hint, children }) => (
  <div style={{ marginBottom: 18 }} className="field-animate">
    {label && (
      <label style={{ display:"block", fontSize:11.5, fontWeight:700, color:error?"#DC2626":"#64748B", marginBottom:5, letterSpacing:"0.06em", textTransform:"uppercase" }}>
        {label}
        {required && <span style={{ color:"#EF4444", marginLeft:3 }}>*</span>}
      </label>
    )}
    {children}
    {error && (
      <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:4 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span style={{ fontSize:11, color:"#DC2626", fontWeight:600 }}>{error}</span>
      </div>
    )}
    {hint && !error && <span style={{ fontSize:11, color:"#94A3B8", marginTop:3, display:"block" }}>{hint}</span>}
  </div>
);

const inputBase = (error, disabled) => ({
  width:"100%", padding:"10px 13px", fontSize:13.5,
  fontFamily:"'Plus Jakarta Sans', sans-serif",
  border:`1.5px solid ${error?"#FCA5A5":disabled?"#E2E8F0":"#CBD5E1"}`,
  borderRadius:8, outline:"none",
  transition:"border-color 0.15s, box-shadow 0.15s",
  background:disabled?"#F1F5F9":"#FFFFFF",
  color:disabled?"#94A3B8":"#1E293B",
  cursor:disabled?"not-allowed":"text",
  boxShadow:error?"0 0 0 3px rgba(220,38,38,0.08)":"none",
});

export const FormInput = ({ label, required, error, hint, disabled, readOnly, value, onChange, onBlur, placeholder, type="text" }) => (
  <FieldWrapper label={label} required={required} error={error} hint={hint}>
    <input
      type={type} value={value??""} onChange={onChange} onBlur={onBlur}
      disabled={disabled} readOnly={readOnly} placeholder={placeholder} style={inputBase(error,disabled || readOnly)}
      onFocus={(e) => { if(!disabled && !readOnly){e.target.style.borderColor="#1B4FD8"; e.target.style.boxShadow="0 0 0 3px rgba(27,79,216,0.12)";} }}
      onBlurCapture={(e) => { e.target.style.borderColor=error?"#FCA5A5":"#CBD5E1"; e.target.style.boxShadow=error?"0 0 0 3px rgba(220,38,38,0.08)":"none"; }}
    />
  </FieldWrapper>
);

export const FormSelect = ({ label, required, error, hint, disabled, value, onChange, onBlur, items=[], placeholder="— Select —" }) => (
  <FieldWrapper label={label} required={required} error={error} hint={hint}>
    <div style={{ position:"relative" }}>
      <select value={value??""} onChange={onChange} onBlur={onBlur} disabled={disabled}
        style={{ ...inputBase(error,disabled), appearance:"none", paddingRight:36, cursor:disabled?"not-allowed":"pointer" }}>
        <option value="">{placeholder}</option>
        {items.map((item,i) => <option key={i} value={item.value}>{item.label}</option>)}
      </select>
      <svg style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:disabled?"#CBD5E1":"#94A3B8" }}
        width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  </FieldWrapper>
);

export const FormToggle = ({ label, value, onChange }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 15px", background:"#F8FAFC", border:"1.5px solid #E2E8F0", borderRadius:8, marginBottom:14 }}>
    <span style={{ fontSize:13.5, fontWeight:500, color:"#334155", flex:1, paddingRight:14 }}>{label}</span>
    <div style={{ display:"flex", alignItems:"center", gap:9, flexShrink:0 }}>
      <span style={{ fontSize:11.5, fontWeight:700, color:value?"#1B4FD8":"#94A3B8", minWidth:22 }}>{value?"Yes":"No"}</span>
      <button type="button" onClick={()=>onChange(!value)}
        style={{ position:"relative", width:42, height:22, borderRadius:11, background:value?"#1B4FD8":"#CBD5E1", border:"none", cursor:"pointer", transition:"background 0.2s ease" }}>
        <span style={{ position:"absolute", top:3, left:value?22:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s ease", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
      </button>
    </div>
  </div>
);

export const FormRadioGroup = ({ label, required, error, items=[], value, onChange }) => (
  <FieldWrapper label={label} required={required} error={error}>
    <div style={{ display:"flex", flexWrap:"wrap", gap:14, paddingTop:4 }}>
      {items.map((item,i) => (
        <label key={i} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
          <div style={{ width:17, height:17, borderRadius:"50%", border:`2px solid ${value===item.value?"#1B4FD8":"#CBD5E1"}`, background:value===item.value?"#1B4FD8":"#fff", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s ease", flexShrink:0 }}
            onClick={()=>onChange(item.value)}>
            {value===item.value && <div style={{ width:5, height:5, borderRadius:"50%", background:"#fff" }}/>}
          </div>
          <span style={{ fontSize:13.5, color:"#334155", fontWeight:500 }}>{item.label}</span>
        </label>
      ))}
    </div>
  </FieldWrapper>
);

export const FormCheckbox = ({ label, value, onChange, error }) => (
  <FieldWrapper error={error}>
    <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }}>
      <div onClick={()=>onChange(!value)}
        style={{ width:17, height:17, borderRadius:4, flexShrink:0, marginTop:2, border:`2px solid ${value?"#1B4FD8":"#CBD5E1"}`, background:value?"#1B4FD8":"#fff", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s ease", cursor:"pointer" }}>
        {value && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
      <span style={{ fontSize:13.5, color:"#334155", lineHeight:1.55 }}>{label}</span>
    </label>
  </FieldWrapper>
);

export const FileInput = ({ label, required, error, value, onChange, maxKb = 1024, forceJpeg = false }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const processedFile = await processImage(file, maxKb, forceJpeg);
      // For now, we still just save the name to maintain compatibility with existing logic,
      // but in a real app, you'd save the processedFile object or upload it.
      onChange(processedFile.name); 
    } catch (err) {
      console.error("File processing failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <FieldWrapper label={label} required={required} error={error}>
      <div style={{ border:`2px dashed ${error?"#FCA5A5":isProcessing?"#1B4FD8":"#CBD5E1"}`, borderRadius:8, padding:"18px 14px", textAlign:"center", background:"#FAFBFD", cursor:isProcessing?"wait":"pointer", transition:"all 0.15s ease", position:"relative" }}
        onMouseEnter={(e)=>(!isProcessing && (e.currentTarget.style.borderColor="#1B4FD8"))}
        onMouseLeave={(e)=>(!isProcessing && (e.currentTarget.style.borderColor=error?"#FCA5A5":"#CBD5E1"))}>
        <input type="file" disabled={isProcessing} style={{ position:"absolute", inset:0, opacity:0, cursor:isProcessing?"wait":"pointer" }} 
          onChange={handleFileChange} accept={forceJpeg ? "image/jpeg" : ".pdf,image/jpeg,image/png"}/>
        
        {isProcessing ? (
          <div style={{ padding:"10px 0" }}>
            <div className="spinner" style={{ width:20, height:20, border:"2px solid #E2E8F0", borderTopColor:"#1B4FD8", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 10px" }} />
            <p style={{ fontSize:12, color:"#1B4FD8", fontWeight:700 }}>Optimizing File...</p>
          </div>
        ) : (
          <>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" style={{ margin:"0 auto 7px" }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            {value
              ? <p style={{ fontSize:12.5, color:"#1B4FD8", fontWeight:600 }}>✅ {value}</p>
              : <><p style={{ fontSize:12.5, color:"#64748B", fontWeight:600 }}>Click to upload or drag & drop</p><p style={{ fontSize:11, color:"#94A3B8", marginTop:3 }}>{forceJpeg ? "JPEG Only" : "PDF / JPEG"} — max {maxKb >= 1024 ? (maxKb/1024)+"MB" : maxKb+"KB"}</p></>}
          </>
        )}
      </div>
    </FieldWrapper>
  );
};

export const SectionCard = ({ title, icon, children }) => (
  <div style={{ background:"#fff", borderRadius:12, border:"1px solid #E2E8F0", marginBottom:20, overflow:"hidden", boxShadow:"0 1px 4px rgba(15,23,42,0.05)" }}>
    <div style={{ padding:"13px 22px", borderBottom:"1px solid #F1F5F9", background:"linear-gradient(135deg,#EEF4FF 0%,#F8FAFC 100%)", display:"flex", alignItems:"center", gap:9 }}>
      {icon && <span style={{ fontSize:16 }}>{icon}</span>}
      <h3 style={{ fontSize:12, fontWeight:800, color:"#1B4FD8", letterSpacing:"0.07em", textTransform:"uppercase" }}>{title}</h3>
    </div>
    <div style={{ padding:22 }}>{children}</div>
  </div>
);

export const InfoAlert = ({ children, type="info" }) => {
  const colors = {
    info:    { bg:"#EEF4FF", border:"#C7D9FF", text:"#1D4ED8", icon:"ℹ️" },
    warning: { bg:"#FFFBEB", border:"#FDE68A", text:"#92400E", icon:"⚠️" },
    success: { bg:"#F0FDF4", border:"#BBF7D0", text:"#166534", icon:"✅" },
  };
  const c = colors[type];
  return (
    <div style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:8, padding:"11px 14px", marginBottom:14, display:"flex", gap:9 }}>
      <span style={{ fontSize:13 }}>{c.icon}</span>
      <div style={{ fontSize:12.5, color:c.text, lineHeight:1.65 }}>{children}</div>
    </div>
  );
};

export const Grid2 = ({ children }) => (
  <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"0 18px" }}>{children}</div>
);

export const Grid3 = ({ children }) => (
  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0 18px" }}>{children}</div>
);

export const DynamicList = ({ value=[], onChange, renderItem, emptyItem, addLabel }) => (
  <div>
    {value.map((item,i) => (
      <div key={i} style={{ border:"1px solid #E2E8F0", borderRadius:10, padding:18, marginBottom:10, background:"#FAFBFD", position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:11.5, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.05em" }}>Entry {i+1}</span>
          <button type="button" onClick={()=>onChange(value.filter((_,idx)=>idx!==i))}
            style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:6, padding:"4px 9px", fontSize:11.5, color:"#DC2626", fontWeight:600, cursor:"pointer" }}>
            Remove
          </button>
        </div>
        {renderItem(item,i,(updated)=>{ const n=[...value]; n[i]={...item,...updated}; onChange(n); })}
      </div>
    ))}
    <button type="button" onClick={()=>onChange([...value,{...emptyItem}])}
      style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 16px", background:"#EEF4FF", border:"1.5px solid #C7D9FF", borderRadius:8, fontSize:12.5, fontWeight:700, color:"#1B4FD8", cursor:"pointer" }}
      onMouseEnter={(e)=>(e.currentTarget.style.background="#DBEAFE")}
      onMouseLeave={(e)=>(e.currentTarget.style.background="#EEF4FF")}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      {addLabel}
    </button>
  </div>
);
