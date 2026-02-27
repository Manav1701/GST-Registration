import { FormToggle, SectionCard, InfoAlert } from "../../../components/ui/index.jsx";

export default function Tab9_Aadhaar({ data, update }) {

  // Build rows dynamically from actual form data
  const persons = [];

  // Promoter 1 — from Tab 1
  const p1name = [data.name_first, data.name_middle, data.name_last].filter(Boolean).join(" ");
  if (p1name) {
    persons.push({
      name: p1name,
      citizen: data.toggle_2 ? "Yes" : "No",
      promoter: "Yes",
      primary: data["Also Authorized Signatory"] ? "Yes" : "No",
      desig: data.designation || "—",
      email: data.email || "—",
      mobile: data.mobile || "—",
    });
  }

  // Promoter 2 — from Tab 2
  const p2name = [data.name_first_2, data.name_middle_2, data.name_last_2].filter(Boolean).join(" ");
  if (p2name) {
    persons.push({
      name: p2name,
      citizen: data.toggle_2_2 ? "Yes" : "No",
      promoter: "Yes",
      primary: data["Also Authorized Signatory_2"] ? "Yes" : "No",
      desig: data.designation_2 || "—",
      email: data.email_2 || "—",
      mobile: data.mobile_2 || "—",
    });
  }

  // Authorized Signatory — from Tab 3
  const asname = [data.as_name_first, data.as_name_middle, data.as_name_last].filter(Boolean).join(" ");
  if (asname) {
    persons.push({
      name: asname,
      citizen: data.toggle_3 ? "Yes" : "No",
      promoter: data.is_primary ? "Yes" : "No",
      primary: "Yes",
      desig: data.as_designation || "—",
      email: data.as_email || "—",
      mobile: data.as_mobile || "—",
    });
  }

  return (
    <SectionCard title="Aadhaar Authentication" icon="🔐">
      <FormToggle
        label="Do you want to opt for Aadhaar Authentication for Promoter/Partner and Primary Authorized Signatory?"
        value={!!data.opt_for_aadhaar}
        onChange={(v) => update("opt_for_aadhaar", v)}
      />

      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:22 }}>
        <InfoAlert>Authentication request will be sent to the mobile number and email upon submission for selected persons.</InfoAlert>
        <InfoAlert>ARN will be generated once Aadhaar Authentication is completed for all applicable persons.</InfoAlert>
        <InfoAlert type="warning">Select at least one person from Promoter/Partner for Aadhaar Authentication.</InfoAlert>
      </div>

      {persons.length === 0 ? (
        <div style={{ textAlign:"center", padding:"36px 20px", background:"#F8FAFC", borderRadius:10, border:"1.5px dashed #CBD5E1" }}>
          <div style={{ fontSize:30, marginBottom:10 }}>👥</div>
          <p style={{ fontSize:13.5, fontWeight:700, color:"#64748B" }}>No persons found</p>
          <p style={{ fontSize:12, color:"#94A3B8", marginTop:5, lineHeight:1.65 }}>
            Please fill in Promoter details in Tab 1 &amp; Tab 2, and Authorized Signatory in Tab 3 first. 
            Those people will appear here automatically.
          </p>
        </div>
      ) : (
        <div style={{ overflowX:"auto", borderRadius:10, border:"1px solid #E2E8F0" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12.5 }}>
            <thead>
              <tr style={{ background:"linear-gradient(135deg,#EEF4FF,#F8FAFC)" }}>
                {["Select","Sl No","Name","Citizen / Resident","Promoter / Partner","Primary Auth. Signatory","Designation","Email","Mobile","Status"].map((h) => (
                  <th key={h} style={{ padding:"11px 13px", textAlign:"left", fontSize:10.5, fontWeight:800, color:"#1B4FD8", textTransform:"uppercase", letterSpacing:"0.04em", borderBottom:"1.5px solid #C7D9FF", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {persons.map((row, i) => (
                <tr key={i} style={{ borderBottom:"1px solid #F1F5F9" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding:"11px 13px" }}>
                    <div style={{ width:17, height:17, borderRadius:4, border:"2px solid #1B4FD8", background:"#1B4FD8", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  </td>
                  <td style={{ padding:"11px 13px", color:"#64748B" }}>{i + 1}</td>
                  <td style={{ padding:"11px 13px", fontWeight:700, color:"#1E293B", whiteSpace:"nowrap" }}>{row.name}</td>
                  <td style={{ padding:"11px 13px" }}>{row.citizen}</td>
                  <td style={{ padding:"11px 13px" }}>{row.promoter}</td>
                  <td style={{ padding:"11px 13px" }}>{row.primary}</td>
                  <td style={{ padding:"11px 13px" }}>{row.desig}</td>
                  <td style={{ padding:"11px 13px", color:"#1B4FD8" }}>{row.email}</td>
                  <td style={{ padding:"11px 13px" }}>{row.mobile}</td>
                  <td style={{ padding:"11px 13px" }}>
                    <span style={{ background:"#FEF3C7", color:"#92400E", borderRadius:20, padding:"3px 9px", fontSize:10.5, fontWeight:700, whiteSpace:"nowrap" }}>
                      Auth Required
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ fontSize:11.5, color:"#64748B", marginTop:10, fontStyle:"italic", lineHeight:1.65 }}>
        Note: Please ensure Email ID and Mobile Number of Promoter/Partners and Primary Authorized Signatory are correct. The Aadhaar validation link/biometric intimation will be sent to the provided contacts.
      </p>
    </SectionCard>
  );
}