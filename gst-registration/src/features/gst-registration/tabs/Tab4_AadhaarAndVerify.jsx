import { FormInput, FormSelect, FormCheckbox, FormToggle, SectionCard, InfoAlert, Grid2 } from "../../../components/ui/index.jsx";

// ─────────────────────────────────────────────────────────────
// AADHAAR AUTHENTICATION  (identical logic to original Tab9)
// ─────────────────────────────────────────────────────────────
function AadhaarSection({ data, update }) {
  const persons = [];

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

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        <InfoAlert>Authentication request will be sent to the mobile number and email upon submission for selected persons.</InfoAlert>
        <InfoAlert>ARN will be generated once Aadhaar Authentication is completed for all applicable persons.</InfoAlert>
        <InfoAlert type="warning">Select at least one person from Promoter/Partner for Aadhaar Authentication.</InfoAlert>
      </div>

      {persons.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 20px", background: "#F8FAFC", borderRadius: 10, border: "1.5px dashed #CBD5E1" }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>👥</div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#64748B" }}>No persons found</p>
          <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 5, lineHeight: 1.65 }}>
            Fill in Promoter details and Authorized Signatory in Tab 2 first. Those people will appear here automatically.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid #E2E8F0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg,#EEF4FF,#F8FAFC)" }}>
                {["Select", "Sl No", "Name", "Citizen / Resident", "Promoter / Partner", "Primary Auth. Signatory", "Designation", "Email", "Mobile", "Status"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 10.5, fontWeight: 800, color: "#1B4FD8", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1.5px solid #C7D9FF", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {persons.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F1F5F9" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ width: 17, height: 17, borderRadius: 4, border: "2px solid #1B4FD8", background: "#1B4FD8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#64748B" }}>{i + 1}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1E293B", whiteSpace: "nowrap" }}>{row.name}</td>
                  <td style={{ padding: "10px 12px" }}>{row.citizen}</td>
                  <td style={{ padding: "10px 12px" }}>{row.promoter}</td>
                  <td style={{ padding: "10px 12px" }}>{row.primary}</td>
                  <td style={{ padding: "10px 12px" }}>{row.desig}</td>
                  <td style={{ padding: "10px 12px", color: "#1B4FD8" }}>{row.email}</td>
                  <td style={{ padding: "10px 12px" }}>{row.mobile}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ background: "#FEF3C7", color: "#92400E", borderRadius: 20, padding: "3px 9px", fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap" }}>
                      Auth Required
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ fontSize: 11.5, color: "#64748B", marginTop: 10, fontStyle: "italic", lineHeight: 1.65 }}>
        Note: Please ensure Email ID and Mobile Number of Promoter/Partners and Primary Authorized Signatory are correct. The Aadhaar validation link/biometric intimation will be sent to the provided contacts.
      </p>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// VERIFICATION SECTION  (identical logic to original Tab10)
// ─────────────────────────────────────────────────────────────
function VerificationSection({ data, update, errors, touched, touch }) {
  const f = (name) => ({ value: data[name], error: touched[name] ? errors[name] : null, onChange: (e) => update(name, e.target.value), onBlur: () => touch(name) });

  const signatoryItems = [];

  if (data.as_name_first) {
    const fullName = [data.as_name_first, data.as_name_middle, data.as_name_last].filter(Boolean).join(" ");
    signatoryItems.push({ value: fullName, label: `${fullName} [${data.as_pan || ''}]`.toUpperCase().trim() });
  }

  if (data["Also Authorized Signatory"] && data.name_first) {
    const fullName = [data.name_first, data.name_middle, data.name_last].filter(Boolean).join(" ");
    if (!signatoryItems.some(item => item.value === fullName)) {
      signatoryItems.push({ value: fullName, label: `${fullName} [${data.pan_proprietor || ''}]`.toUpperCase().trim() });
    }
  }

  if (data["Also Authorized Signatory_2"] && data.name_first_2) {
    const fullName = [data.name_first_2, data.name_middle_2, data.name_last_2].filter(Boolean).join(" ");
    if (!signatoryItems.some(item => item.value === fullName)) {
      signatoryItems.push({ value: fullName, label: `${fullName} [${data.pan_proprietor_2 || ''}]`.toUpperCase().trim() });
    }
  }

  return (
    <SectionCard title="Verification & Declaration" icon="✅">
      <FormCheckbox
        label="I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed therefrom."
        value={!!data.declaration}
        onChange={(v) => update("declaration", v)}
        error={touched.declaration ? errors.declaration : null}
      />
      <Grid2>
        <FormSelect label="Name of Authorized Signatory" required
          value={data.signatory}
          error={touched.signatory ? errors.signatory : null}
          onChange={(e) => update("signatory", e.target.value)}
          onBlur={() => touch("signatory")}
          items={signatoryItems}
          placeholder="Select signatory name"
        />
        <FormInput label="Place" required {...f("place")} placeholder="Enter place of signing" />
        <FormInput label="Designation / Status" {...f("designation_ver")} placeholder="e.g. Proprietor" />
        <FormInput label="Date" type="date" {...f("date_ver")} />
      </Grid2>
      <InfoAlert type="warning">
        After filling this section, please go to the <strong>Review &amp; Submit</strong> page to review all your details before final submission.
        <br />Submit button is on the Review &amp; Submit page.
      </InfoAlert>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN TAB EXPORT
// ─────────────────────────────────────────────────────────────
export default function Tab4_AadhaarAndVerify(props) {
  return (
    <div className="section-container animate-fade-in">

      {/* ── PART A: AADHAAR ── */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#EEF4FF,#DBEAFE)", border: "2px solid #C7D9FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔐</div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>Aadhaar Authentication</h2>
        </div>
        <AadhaarSection {...props} />
      </div>

      {/* ── PART B: VERIFICATION ── */}
      <div style={{ borderTop: "3px solid #E2E8F0", paddingTop: 20, marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#EEF4FF,#DBEAFE)", border: "2px solid #C7D9FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>✅</div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>Verification &amp; Declaration</h2>
        </div>
        <VerificationSection {...props} />
      </div>

    </div>
  );
}
