import { useNavigate } from "react-router-dom";
import ReviewSection from "../components/shared/ReviewSection.jsx";
import { useGSTForm } from "../hooks/useGSTForm.js";
import { CONSTITUTION_TYPES, DISTRICT_MAP, REGISTRATION_REASONS, POSSESSION_TYPES, PROOF_OF_PREMISES, ELECTRICITY_BOARDS, COUNTRIES, INDIAN_STATES } from "../constants/dropdowns.js";

export default function ReviewPage() {
  const navigate = useNavigate();
  const { formData, contactInfo, isSubmitting, apiError, handleSubmit } = useGSTForm();
  
  const getLabel = (arr, val) => {
    if (!arr || !val) return val;
    return arr.find((i) => i.value === val)?.label || val;
  };

  // Helper to render dynamic promoters
  const renderPromoters = () => {
    const ids = formData.promoter_ids || [""];
    return ids.map((id, index) => {
      const sfx = id;
      const rows = [
        { label: "First Name", value: formData[`name_first${sfx}`] },
        { label: "Middle Name", value: formData[`name_middle${sfx}`] },
        { label: "Last Name", value: formData[`name_last${sfx}`] },
        { label: "Father Name (First)", value: formData[`father_first${sfx}`] },
        { label: "Father Name (Last)", value: formData[`father_last${sfx}`] },
        { label: "Date of Birth", value: formData[`dob${sfx}`] },
        { label: "Mobile", value: formData[`mobile${sfx}`] },
        { label: "Email", value: formData[`email${sfx}`] },
        { label: "Designation", value: formData[`designation${sfx}`] },
        { label: "DIN", value: formData[`din${sfx}`] },
        { label: "PAN", value: formData[`pan_proprietor${sfx}`] },
        { label: "Aadhaar", value: formData[`aadhaar${sfx}`] },
        { label: "Country", value: getLabel(COUNTRIES, formData[`country${sfx}`]) },
        { label: "PIN Code", value: formData[`pin_code${sfx}`] },
        { label: "State", value: formData[`state_res${sfx}`] },
        { label: "District", value: formData[`district_res${sfx}`] },
        { label: "Locality", value: formData[`locality${sfx}`] },
        { label: "Building No.", value: formData[`building_no_res${sfx}`] },
      ];

      return (
        <ReviewSection 
          key={id || 'primary'} 
          title={`Promoter ${index + 1} Details`} 
          icon="👤" 
          rows={rows} 
        />
      );
    });
  };

  // Helper to export ALL fields to CSV
  const exportToCSV = () => {
    const csvRows = [["Section", "Field Name", "Value"]]; // Header
    
    // Add Contact
    csvRows.push(["Contact", "Mobile", contactInfo.mobile || ""]);
    csvRows.push(["Contact", "Email", contactInfo.email || ""]);
    csvRows.push(["---", "---", "---"]);

    // Add Business
    csvRows.push(["Business", "Legal Name", formData.legal_name || ""]);
    csvRows.push(["Business", "Trade Name", formData.trade_name || ""]);
    csvRows.push(["Business", "PAN", formData.pan || ""]);
    csvRows.push(["Business", "Constitution", getLabel(CONSTITUTION_TYPES, formData["Constitution of Business"]) || ""]);
    csvRows.push(["Business", "State", formData.state || ""]);
    csvRows.push(["Business", "District", formData.District || ""]);
    csvRows.push(["Business", "Reason", getLabel(REGISTRATION_REASONS, formData.reason) || ""]);
    csvRows.push(["---", "---", "---"]);

    // Add Promoters
    const promoterIds = formData.promoter_ids || [""];
    promoterIds.forEach((id, idx) => {
        const sfx = id;
        csvRows.push([`Promoter ${idx+1}`, "First Name", formData[`name_first${sfx}`] || ""]);
        csvRows.push([`Promoter ${idx+1}`, "Last Name", formData[`name_last${sfx}`] || ""]);
        csvRows.push([`Promoter ${idx+1}`, "Mobile", formData[`mobile${sfx}`] || ""]);
        csvRows.push([`Promoter ${idx+1}`, "Email", formData[`email${sfx}`] || ""]);
        csvRows.push(["---", "---", "---"]);
    });

    // Add PPB
    csvRows.push(["Principal Place", "PIN Code", formData.ppb_pin || ""]);
    csvRows.push(["Principal Place", "Premises Name", formData.ppb_premises || ""]);
    csvRows.push(["Principal Place", "Building No", formData.ppb_bno || ""]);
    csvRows.push(["Principal Place", "Possession", getLabel(POSSESSION_TYPES, formData.ppb_possession_type) || ""]);

    // Final string
    const csvData = "data:text/csv;charset=utf-8," + 
      csvRows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvData);
    link.download = `GST_Review_${formData.legal_name || "Draft"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="section-card-content" style={{ margin:"0 auto", animation:"fadeInUp 0.3s ease both" }}>
      {/* Header card */}
      <div style={{ background:"linear-gradient(135deg,#EEF4FF,#F8FAFC)", border:"1px solid #C7D9FF", borderRadius:12, padding:"18px 22px", marginBottom:20, display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
        <div style={{ width:44, height:44, borderRadius:12, background:"#1B4FD8", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
        </div>
        <div>
          <h2 style={{ fontSize:18, fontWeight:800, color:"#1E293B" }}>Final Review cockpit</h2>
          <p style={{ fontSize:12.5, color:"#64748B", marginTop:2 }}>This page shows every detail from your application. Please verify carefully.</p>
        </div>
      </div>

      <ReviewSection title="Contact Information" icon="📱" rows={[
        { label:"Mobile Number", value:contactInfo?.mobile?`+91 ${contactInfo.mobile}`:"" },
        { label:"Email Address", value:contactInfo?.email },
      ]}/>

      <ReviewSection title="Business Identity" icon="🏢" rows={[
        { label:"Legal Name", value:formData.legal_name },
        { label:"Trade Name", value:formData.trade_name },
        { label:"PAN", value:formData.pan },
        { label:"PAN Date", value:formData.pan_date },
        { label:"Constitution", value:getLabel(CONSTITUTION_TYPES,formData["Constitution of Business"]) },
        { label:"State", value:formData.state },
        { label:"District", value:getLabel(DISTRICT_MAP[formData.state] || [], formData.District) },
        { label:"Reason to Register", value:getLabel(REGISTRATION_REASONS,formData.reason) },
        { label:"Commencement Date", value:formData.commencement_date },
        { label:"Liability Date", value:formData.commencement_date_1 },
        { label:"Casual Taxable Person", value:formData.is_casual ? "YES" : "NO" },
        { label:"Proof of Constitution", value:getLabel(PROOF_OF_PREMISES, formData.proof_of_constitution) },
      ]}/>

      {renderPromoters()}

      <ReviewSection title="Authorized Signatory" icon="✍️" rows={[
        { label:"Primary Signatory", value:formData.is_primary ? "YES" : "NO" },
        { label:"First Name", value:formData.as_name_first },
        { label:"Middle Name", value:formData.as_name_middle },
        { label:"Last Name", value:formData.as_name_last },
        { label:"Father Name", value:formData.as_father_first },
        { label:"Date of Birth", value:formData.as_dob },
        { label:"Mobile", value:formData.as_mobile },
        { label:"Email", value:formData.as_email },
        { label:"Designation", value:formData.as_designation },
        { label:"PAN", value:formData.as_pan },
        { label:"AADHAAR", value:formData.as_aadhaar },
        { label:"Country", value:getLabel(COUNTRIES, formData.as_country) },
        { label:"PIN Code", value:formData.as_pin },
        { label:"State", value:getLabel(INDIAN_STATES, formData.as_state) },
        { label:"District", value:getLabel(DISTRICT_MAP[formData.as_state] || [], formData.as_district) },
        { label:"City", value:formData.as_city },
        { label:"Road / Street", value:formData.as_road },
        { label:"Building No.", value:formData.as_bno },
        { label:"Proof of Signatory", value:formData.as_proof_type },
      ]}/>

      <ReviewSection title="Authorized Representative" icon="⚖️" rows={[
        { label:"Is Rep Available?", value:formData.toggle_4 ? "YES" : "NO" },
        { label:"Enrolment ID", value:formData.enrolment_id },
        { label:"Rep Name", value:formData.rep_name_first },
        { label:"Rep Mobile", value:formData.rep_mobile },
        { label:"Rep Email", value:formData.rep_email },
        { label:"Rep PAN", value:formData.rep_pan },
      ]}/>

      <ReviewSection title="Principal Place of Business" icon="🏬" rows={[
        { label:"PIN Code", value:formData.ppb_pin },
        { label:"State", value:formData.ppb_state },
        { label:"District", value:getLabel(DISTRICT_MAP[formData.ppb_state] || [], formData.ppb_district) },
        { label:"City", value:formData.ppb_city },
        { label:"Localilty", value:formData.ppb_locality },
        { label:"Road / Street", value:formData.ppb_road },
        { label:"Premises Name", value:formData.ppb_premises },
        { label:"Building No.", value:formData.ppb_bno },
        { label:"Floor", value:formData.ppb_floor },
        { label:"Landmark", value:formData.ppb_landmark },
        { label:"Latitude", value:formData.ppb_lat },
        { label:"Longitude", value:formData.ppb_long },
        { label:"Sector / Circle", value:formData.sector_circle },
        { label:"Commissionerate", value:formData.center_commissionerate },
        { label:"Division", value:formData.center_division },
        { label:"Range", value:formData.center_range },
        { label:"Office Email", value:formData.ppb_email },
        { label:"Mobile", value:formData.ppb_mobile },
        { label:"Nature of Possession", value:getLabel(POSSESSION_TYPES,formData.ppb_possession_type) },
        { label:"Document Type", value:getLabel(PROOF_OF_PREMISES,formData.ppb_proof_doc) },
      ]}/>

      <ReviewSection title="Business Activities" icon="💼" rows={[
        { label:"Bonded Warehouse", value:formData.ba_bonded_warehouse ? "YES" : "" },
        { label:"EOU", value:formData.ba_eou ? "YES" : "" },
        { label:"Export", value:formData.ba_export ? "YES" : "" },
        { label:"Factory", value:formData.ba_factory ? "YES" : "" },
        { label:"Import", value:formData.ba_import ? "YES" : "" },
        { label:"Services", value:formData.ba_services ? "YES" : "" },
        { label:"Leasing", value:formData.ba_leasing ? "YES" : "" },
        { label:"Office", value:formData.ba_office ? "YES" : "" },
        { label:"Retail", value:formData.ba_retail ? "YES" : "" },
        { label:"Warehouse", value:formData.ba_warehouse ? "YES" : "" },
        { label:"Wholesale", value:formData.ba_wholesale ? "YES" : "" },
        { label:"Works Contract", value:formData.ba_works_contract ? "YES" : "" },
        { label:"Others", value:formData.ba_others_specify },
      ]}/>

      <ReviewSection title="State Specific Info" icon="🏛️" rows={[
        { label:"Electricity Board", value:getLabel(ELECTRICITY_BOARDS,formData.electricity_board) },
        { label:"Consumer Number", value:formData.consumer_number },
        { label:"Prof Tax EC", value:formData.prof_tax_ec },
        { label:"Prof Tax RC", value:formData.prof_tax_rc },
        { label:"Excise License No", value:formData.state_excise_lic },
        { label:"Name of Licensee", value:formData.excise_person_name },
      ]}/>

      <ReviewSection title="Commodities / HSN" icon="📦" rows={[
        { label:"HSN Search", value:formData.hsn_search },
        { label:"Selected Commodities", value:formData.commodities_list?.join(", ") },
        { label:"SAC Search", value:formData.sac_search },
        { label:"Selected Services", value:formData.services_list?.join(", ") },
      ]}/>

      <ReviewSection title="Verification Detail" icon="📋" rows={[
        { label:"Authorized Signatory", value:formData.signatory },
        { label:"Place of Signing", value:formData.place },
        { label:"Designation", value:formData.designation_ver },
        { label:"Aadhaar Opt-in", value:formData.opt_for_aadhaar ? "YES" : "NO" },
      ]}/>

      {/* Declaration status */}
      <div style={{ background:formData.declaration?"#F0FDF4":"#FEF2F2", border:`1px solid ${formData.declaration?"#BBF7D0":"#FECACA"}`, borderRadius:12, padding:"16px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:20 }}>{formData.declaration?"✅":"⚠️"}</span>
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:formData.declaration?"#166534":"#DC2626" }}>{formData.declaration?"Declaration Accepted":"Declaration Not Accepted"}</p>
          <p style={{ fontSize:11.5, color:formData.declaration?"#15803D":"#B91C1C", marginTop:2 }}>
            {formData.declaration?"You confirmed all information is true and correct.":"Please go to Verification tab and accept the declaration before submitting."}
          </p>
        </div>
      </div>

      {apiError && (
        <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:16, marginBottom:16 }}>
          <p style={{ color:"#DC2626", fontWeight:700, fontSize:14, marginBottom:4 }}>⚠ Submission Error</p>
          <p style={{ fontSize:12.5, color:"#B91C1C" }}>{apiError}</p>
        </div>
      )}

      {/* Buttons */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #E2E8F0", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 4px rgba(15,23,42,0.05)", flexWrap:"wrap", gap:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={exportToCSV} className="nav-btn"
              style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 20px", border:"1.5px solid #E2E8F0", background:"#fff", borderRadius:10, fontSize:13.5, fontWeight:600, color:"#1E293B", cursor:"pointer" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Export CSV
            </button>
            <button onClick={()=>navigate("/gst/form")} className="nav-btn"
              style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 20px", border:"1.5px solid #E2E8F0", background:"#fff", borderRadius:10, fontSize:13.5, fontWeight:600, color:"#374151", cursor:"pointer" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Back to Form
            </button>
        </div>
        <button onClick={handleSubmit} disabled={isSubmitting||!formData.declaration} className="nav-btn"
          style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 30px", background:!formData.declaration||isSubmitting?"#94A3B8":"linear-gradient(135deg,#1B4FD8,#3B82F6)", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontWeight:800, cursor:!formData.declaration||isSubmitting?"not-allowed":"pointer", boxShadow:!formData.declaration||isSubmitting?"none":"0 6px 18px rgba(27,79,216,0.35)", minWidth:200, justifyContent:"center" }}>
          {isSubmitting?<><div style={{ width:17, height:17, border:"2px solid #ffffff40", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>Submitting...</>:<><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Confirm & Submit</>}
        </button>
      </div>
    </div>
  );
}
