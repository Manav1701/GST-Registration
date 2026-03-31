import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useADTForm } from "../../hooks/useADTForm.js";

export default function ADTFormShell() {
  const navigate = useNavigate();
  const { formData, contactInfo, update, addAuditor, removeAuditor, updateAuditor, handleSubmit } = useADTForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionResult(null);
    try {
      const result = await handleSubmit();
      if (result) {
        setSubmissionResult(result);
      }
    } catch (err) {
      console.error(err);
      setSubmissionResult({ error: true, message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const Section = ({ title, children, icon, description }) => (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E5E7EB", padding: "28px", marginBottom: 32, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", transition: "all 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, borderBottom: "1px solid #F3F4F6", paddingBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, boxShadow: "0 4px 12px rgba(15,23,42,0.15)" }}>{icon}</div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", textTransform: "uppercase", letterSpacing: "0.025em", margin: 0 }}>{title}</h3>
          {description && <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0 0", fontWeight: 500 }}>{description}</p>}
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px 24px" }}>
        {children}
      </div>
    </div>
  );

  const Field = ({ label, children, required, width = "100%", hint }) => (
    <div style={{ marginBottom: 12, width: width, flexGrow: width === "100%" ? 1 : 0, minWidth: "220px" }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, fontWeight: 500 }}>{hint}</p>}
    </div>
  );

  const Input = (props) => (
    <input {...props}
      value={props.value || ""}
      style={{
        width: "100%", padding: "10px 14px", fontSize: 14, background: props.readOnly ? "#F3F4F6" : "#FFFFFF", border: "1.5px solid #D1D5DB", borderRadius: 10, outline: "none", color: "#111827", transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)", fontWeight: 500, boxSizing: "border-box",
        ...props.style
      }}
      onFocus={(e) => { if(!props.readOnly) { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.1)"; } }}
      onBlur={(e) => { if(!props.readOnly) { e.target.style.borderColor = "#D1D5DB"; e.target.style.boxShadow = "none"; } }}
    />
  );

  const Select = (props) => (
    <div style={{ position: "relative", width: "100%" }}>
      <select {...props}
        style={{
          width: "100%", padding: "10px 14px", fontSize: 14, background: "#FFFFFF", border: "1.5px solid #D1D5DB", borderRadius: 10, outline: "none", color: "#111827", cursor: "pointer", appearance: "none", fontWeight: 500, boxSizing: "border-box",
          ...props.style
        }}
      >
        {props.children}
      </select>
      <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#6B7280" }}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  );

  const RadioGroup = ({ label, name, options, value, onChange, vertical }) => (
    <div style={{ marginBottom: 16, width: "100%" }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10 }}>{label}</label>}
      <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", gap: vertical ? 8 : 16, flexWrap: "wrap" }}>
        {options.map(opt => (
          <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: value === opt.value ? "#111827" : "#4B5563", cursor: "pointer", fontWeight: value === opt.value ? 700 : 500, padding: "6px 12px", borderRadius: 8, background: value === opt.value ? "#EFF6FF" : "transparent", border: value === opt.value ? "1.5px solid #2563EB" : "1.5px solid #E5E7EB", transition: "all 0.2s" }}>
            <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} style={{ width: 16, height: 16, accentColor: "#2563EB" }} />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );

  const AuditorCard = ({ index, auditor }) => (
    <div style={{ background: "#F9FAFB", borderRadius: 16, padding: "20px", marginBottom: 20, border: "1px solid #E5E7EB", borderLeft: "4px solid #2563EB", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "1px solid #E5E7EB", paddingBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: "#2563EB", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{index + 1}</div>
          Auditor Details
        </div>
        {(formData?.auditorDetailsList || []).length > 1 && (
          <button type="button" onClick={() => removeAuditor(index)} style={{ padding: "4px 10px", borderRadius: 6, background: "#FEF2F2", color: "#DC2626", border: "1px solid #FEE2E2", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            Remove
          </button>
        )}
      </div>
      
      <RadioGroup label="Category" name={`cat_${index}`} value={auditor.audCategory} onChange={(val) => updateAuditor(index, "audCategory", val)} options={[{ label: "Auditor's Firm", value: "Auditor's Firm" }, { label: "Individual", value: "Individual" }]} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 20px" }}>
        {auditor.audCategory === "Auditor's Firm" && (
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20, width: "100%", display: "flex", flexWrap: "wrap", gap: "12px 20px" }}>
             <Field label="FRN" width="180px"><Input value={auditor.firmFRN} onChange={(e) => updateAuditor(index, "firmFRN", e.target.value.toUpperCase())} placeholder="e.g. 123456W" /></Field>
             <Field label="Firm Name" width="400px" required><Input value={auditor.firmName} onChange={(e) => updateAuditor(index, "firmName", e.target.value)} /></Field>
             <Field label="Firm PAN" width="180px"><Input value={auditor.firmPan} onChange={(e) => updateAuditor(index, "firmPan", e.target.value.toUpperCase())} maxLength={10} /></Field>
             <Field label="Firm Email" width="300px" required><Input value={auditor.firmEmail} onChange={(e) => updateAuditor(index, "firmEmail", e.target.value)} type="email" /></Field>
             <Field label="Address" width="100%" required><Input value={auditor.firmAddr1} onChange={(e) => updateAuditor(index, "firmAddr1", e.target.value)} /></Field>
          </div>
        )}

        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20, width: "100%", display: "flex", flexWrap: "wrap", gap: "12px 20px" }}>
           <Field label="Membership No" width="180px" required><Input value={auditor.audMembershipNo} onChange={(e) => updateAuditor(index, "audMembershipNo", e.target.value)} /></Field>
           <Field label="Auditor Name" width="400px" required><Input value={auditor.audName} onChange={(e) => updateAuditor(index, "audName", e.target.value)} /></Field>
           <Field label="PAN" width="180px" required><Input value={auditor.audPan} onChange={(e) => updateAuditor(index, "audPan", e.target.value.toUpperCase())} maxLength={10} /></Field>
           <Field label="Email" width="300px" required><Input value={auditor.audEmail} onChange={(e) => updateAuditor(index, "audEmail", e.target.value)} type="email" /></Field>
           <Field label="Address" width="100%" required><Input value={auditor.audAddr1} onChange={(e) => updateAuditor(index, "audAddr1", e.target.value)} /></Field>
        </div>
      </div>
      
      <div style={{ marginTop: 16, padding: "12px 20px", background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", width: "100%" }}>
        <RadioGroup label="Within limits u/s 141(3)(g)?" name={`within_${index}`} value={auditor.WithinLimit} onChange={(val) => updateAuditor(index, "WithinLimit", val)} options={[{ label: "Yes", value: "Y" }, { label: "No", value: "N" }]} />
      </div>
    </div>
  );

  return (
    <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto", padding: "20px", boxSizing: "border-box", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #334155 100%)", borderRadius: 20, padding: "40px", marginBottom: 32, color: "#fff", boxShadow: "0 20px 40px rgba(15,23,42,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ padding: "4px 12px", background: "rgba(255,255,255,0.15)", borderRadius: "100px", fontSize: 12, fontWeight: 700, color: "#93C5FD" }}>E-FORM ADT-1</span>
          </div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 900, marginBottom: 8 }}>Notice of Auditor Appointment</h1>
          <p style={{ fontSize: 15, opacity: 0.8, maxWidth: 800 }}>Pursuant to section 139(1) of the Companies Act, 2013 and rules thereunder.</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.1)", padding: "16px 24px", borderRadius: 16, backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", opacity: 0.7, marginBottom: 4 }}>Active Session</div>
          <div style={{ fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, background: "#22C55E", borderRadius: "50%" }}></div>
            +91 {contactInfo.mobile}
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <Section title="1-2 Company Identification" icon="🏢">
          <Field label="1. Corporate Identity Number (CIN)" width="280px" required hint="21-character alphanumeric">
            <Input value={formData.cin} onChange={(e) => update("cin", e.target.value.toUpperCase())} maxLength={21} />
          </Field>
          <Field label="2(c) Professional Email ID" width="300px" required>
            <Input value={formData.companyEmailId} onChange={(e) => update("companyEmailId", e.target.value)} type="email" />
          </Field>
          <Field label="2(a) Company Name" width="500px" required>
            <Input value={formData.companyName} onChange={(e) => update("companyName", e.target.value)} />
          </Field>
          <Field label="2(b) Registered Address" width="100%" required>
            <Input value={formData.registeredAddressline1} onChange={(e) => update("registeredAddressline1", e.target.value)} />
          </Field>
        </Section>

        <Section title="3-4 Appointment Particulars" icon="👤">
          <div style={{ background: "#F9FAFB", padding: "24px", borderRadius: 16, width: "100%", display: "flex", flexWrap: "wrap", gap: "12px 24px" }}>
            <RadioGroup label="3(a) Falling under section 139(2)?" name="isClass139_2" value={formData.isClass139_2} onChange={(val) => update("isClass139_2", val)} options={[{ label: "Yes", value: "Y" }, { label: "No", value: "N" }]} />
            <RadioGroup label="3(b) Nature of Appointment" name="natureOfAppt" vertical value={formData.natureOfAppt} onChange={(val) => update("natureOfAppt", val)}
              options={[{ label: "First auditor", value: "First" }, { label: "Subsequent", value: "Subsequent" }, { label: "Casual Vacancy", value: "Casual" }, { label: "Others", value: "Others" }]} />
          </div>
          <div style={{ background: "#F9FAFB", padding: "24px", borderRadius: 16, width: "100%", display: "flex", flexWrap: "wrap", gap: "12px 32px" }}>
            <RadioGroup label="3(c) Appointment in AGM?" name="agm_selection" value={formData.agm_selection} onChange={(val) => update("agm_selection", val)} options={[{ label: "Yes", value: "Y" }, { label: "No", value: "N" }]} />
            <Field label="4(a) Date of Appointment" width="220px" required><Input type="date" value={formData.appDate} onChange={(e) => update("appDate", e.target.value)} /></Field>
            <Field label="4(c) No. of Auditors" width="120px"><Input value={(formData?.auditorDetailsList || []).length} readOnly /></Field>
          </div>
        </Section>

        <Section title="Auditor Particulars" icon="📄">
          {(formData?.auditorDetailsList || []).map((auditor, idx) => <AuditorCard key={idx} index={idx} auditor={auditor} />)}
          <button type="button" onClick={addAuditor} style={{ width: "100%", padding: "16px", background: "#F0F9FF", border: "2px dashed #0284C7", borderRadius: 16, color: "#0369A1", fontWeight: 700, cursor: "pointer" }}>
            + Add Another Auditor
          </button>
        </Section>

        <Section title="Declaration" icon="🖋️">
          <Field label="Resolution No" width="220px" required><Input value={formData.declResolutionNumber} onChange={(e) => update("declResolutionNumber", e.target.value)} /></Field>
          <Field label="Resolution Date" width="220px" required><Input type="date" value={formData.declDate} onChange={(e) => update("declDate", e.target.value)} /></Field>
          <Field label="Designation" width="180px" required><Select value={formData.DSCDesignation} onChange={(e) => update("DSCDesignation", e.target.value)}><option value="">Select</option><option value="Director">Director</option></Select></Field>
          <label style={{ display: "flex", gap: 12, padding: 24, background: "#F9FAFB", borderRadius: 16, cursor: "pointer", marginTop: 16, width: "100%" }}>
            <input type="checkbox" checked={formData.declaration} onChange={(e) => update("declaration", e.target.checked)} style={{ width: 20, height: 20 }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>I certify that all requirements of the Companies Act, 2013 have been complied with.</span>
          </label>
        </Section>

        {submissionResult && (
          <div style={{ padding: 24, borderRadius: 16, background: submissionResult.error ? "#FEF2F2" : "#F0FDF4", border: "1px solid #E5E7EB", marginBottom: 32, display: "flex", gap: 16 }}>
            <div style={{ fontWeight: 800, color: submissionResult.error ? "#991B1B" : "#166534" }}>
              {submissionResult.error ? "Failed: " + submissionResult.message : "Success: Bridged with Ref ID #" + submissionResult.id}
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: 60 }}>
          <button type="submit" disabled={isSubmitting || !formData.declaration} style={{ padding: "16px 60px", borderRadius: 16, background: "#0F172A", color: "#fff", fontWeight: 900, cursor: "pointer", border: "none" }}>
            {isSubmitting ? "Processing..." : "Submit to Official API"}
          </button>
        </div>
      </form>
    </div>
  );
}
