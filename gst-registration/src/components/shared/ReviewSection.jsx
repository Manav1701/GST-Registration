export default function ReviewSection({ title, icon, rows }) {
  return (
    <div style={{ background:"#fff", borderRadius:12, border:"1px solid #E2E8F0", marginBottom:16, overflow:"hidden", boxShadow:"0 1px 4px rgba(15,23,42,0.05)" }}>
      <div style={{ padding:"12px 20px", background:"linear-gradient(135deg,#EEF4FF,#F8FAFC)", borderBottom:"1px solid #E2E8F0", display:"flex", alignItems:"center", gap:9 }}>
        <span style={{ fontSize:15 }}>{icon}</span>
        <h3 style={{ fontSize:12, fontWeight:800, color:"#1B4FD8", textTransform:"uppercase", letterSpacing:"0.07em" }}>{title}</h3>
      </div>
      <div style={{ padding:"12px 16px" }}>
        <div className="responsive-grid-4" style={{ gap:"8px 16px" }}>
          {rows.filter(r=>r.value !== null && r.value !== undefined && r.value !== "").map((row,i)=>(
            <div key={i} style={{ borderBottom:"1px solid #F1F5F9", paddingBottom:4 }}>
              <div style={{ fontSize:9.5, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:1 }}>{row.label}</div>
              <div style={{ fontSize:12.5, fontWeight:600, color:"#1E293B", wordBreak:"break-word" }}>{String(row.value)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
