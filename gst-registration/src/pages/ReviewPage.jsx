import { useNavigate } from "react-router-dom";
import ReviewSection from "../components/shared/ReviewSection.jsx";
import { useGSTForm } from "../hooks/useGSTForm.js";
import { CONSTITUTION_TYPES, DISTRICT_MAP, REGISTRATION_REASONS, POSSESSION_TYPES, PROOF_OF_PREMISES, ELECTRICITY_BOARDS, COUNTRIES, INDIAN_STATES } from "../constants/dropdowns.js";

export default function ReviewPage() {
  const navigate = useNavigate();
  const { formData, contactInfo, isSubmitting, apiError, handleSubmit } = useGSTForm();
  const getLabel = (arr, val) => arr.find((i) => i.value === val)?.label || val;

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"28px 24px", animation:"fadeInUp 0.3s ease both" }}>
      {/* Header card */}
      <div style={{ background:"linear-gradient(135deg,#EEF4FF,#F8FAFC)", border:"1px solid #C7D9FF", borderRadius:12, padding:"18px 22px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:44, height:44, borderRadius:12, background:"#1B4FD8", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
        </div>
        <div>
          <h2 style={{ fontSize:18, fontWeight:800, color:"#1E293B" }}>Review Your Application</h2>
          <p style={{ fontSize:12.5, color:"#64748B", marginTop:2 }}>Please verify all details before final submission.</p>
        </div>
      </div>

      <ReviewSection title="Contact Information" icon="📱" rows={[
        { label:"Mobile Number", value:contactInfo?.mobile?`+91 ${contactInfo.mobile}`:"" },
        { label:"Email Address", value:contactInfo?.email },
      ]}/>
      <ReviewSection title="Business Identity" icon="🏢" rows={[
        { label:"Legal Name", value:formData.legal_name },
        { label:"PAN", value:formData.pan },
        { label:"PAN Date", value:formData.pan_date },
        { label:"Constitution", value:getLabel(CONSTITUTION_TYPES,formData["Constitution of Business"]) },
        { label:"Trade Name", value:formData.trade_name },
        { label:"State", value:formData.state },
        { label:"District", value:getLabel(DISTRICT_MAP[formData.state] || [], formData.District) },
        { label:"Reason to Register", value:getLabel(REGISTRATION_REASONS,formData.reason) },
        { label:"Commencement Date", value:formData.commencement_date },
        { label:"Liability Date", value:formData.commencement_date_1 },
      ]}/>
      <ReviewSection title="Promoter Details" icon="👤" rows={[
        { label:"First Name", value:formData.name_first },
        { label:"Last Name", value:formData.name_last },
        { label:"Date of Birth", value:formData.dob },
        { label:"Mobile", value:formData.mobile },
        { label:"Email", value:formData.email },
        { label:"Designation", value:formData.designation },
        { label:"PAN", value:formData.pan_proprietor },
      ]}/>
      <ReviewSection title="Residential Address" icon="🏠" rows={[
        { label:"PIN Code", value:formData.pin_code },
        { label:"State", value:formData.state_res },
        { label:"District", value:getLabel(DISTRICT_MAP[formData.state_res] || [], formData.district_res) },
        { label:"City", value:formData.city_res },
        { label:"Road / Street", value:formData.road_street_res },
        { label:"Building No.", value:formData.building_no_res },
      ]}/>
      <ReviewSection title="Authorized Signatory" icon="✍️" rows={[
        { label:"First Name", value:formData.as_name_first },
        { label:"Last Name", value:formData.as_name_last },
        { label:"Date of Birth", value:formData.as_dob },
        { label:"Mobile", value:formData.as_mobile },
        { label:"Email", value:formData.as_email },
        { label:"Designation", value:formData.as_designation },
        { label:"PAN", value:formData.as_pan },
        { label:"Country", value:getLabel(COUNTRIES, formData.as_country) },
        { label:"PIN Code", value:formData.as_pin },
        { label:"State", value:getLabel(INDIAN_STATES, formData.as_state) },
        { label:"District", value:getLabel(DISTRICT_MAP[formData.as_state] || [], formData.as_district) },
        { label:"City", value:formData.as_city },
        { label:"Road / Street", value:formData.as_road },
      ]}/>
      <ReviewSection title="Principal Place of Business" icon="🏬" rows={[
        { label:"PIN Code", value:formData.ppb_pin },
        { label:"State", value:formData.ppb_state },
        { label:"District", value:getLabel(DISTRICT_MAP[formData.ppb_state] || [], formData.ppb_district) },
        { label:"Premises", value:formData.ppb_premises },
        { label:"Building No.", value:formData.ppb_bno },
        { label:"Sector / Circle", value:formData.sector_circle },
        { label:"Commissionerate", value:formData.center_commissionerate },
        { label:"Nature of Possession", value:getLabel(POSSESSION_TYPES,formData.ppb_possession_type) },
        { label:"Proof Document", value:getLabel(PROOF_OF_PREMISES,formData.ppb_proof_doc) },
      ]}/>
      <ReviewSection title="State Specific Info" icon="🏛️" rows={[
        { label:"Electricity Board", value:getLabel(ELECTRICITY_BOARDS,formData.electricity_board) },
        { label:"Consumer Number", value:formData.consumer_number },
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

      <ReviewSection title="Verification" icon="📋" rows={[
        { label:"Authorized Signatory", value:formData.signatory },
        { label:"Place of Signing", value:formData.place },
        { label:"Designation", value:formData.designation_ver },
      ]}/>

      {apiError && (
        <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:16, marginBottom:16 }}>
          <p style={{ color:"#DC2626", fontWeight:700, fontSize:14, marginBottom:4 }}>⚠ Submission Error</p>
          <p style={{ fontSize:12.5, color:"#B91C1C" }}>{apiError}</p>
        </div>
      )}

      {/* Buttons */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #E2E8F0", padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 4px rgba(15,23,42,0.05)" }}>
        <button onClick={()=>navigate("/form")} className="nav-btn"
          style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 20px", border:"1.5px solid #E2E8F0", background:"#fff", borderRadius:10, fontSize:13.5, fontWeight:600, color:"#374151", cursor:"pointer" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit Details
        </button>
        <button onClick={handleSubmit} disabled={isSubmitting||!formData.declaration} className="nav-btn"
          style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 30px", background:!formData.declaration||isSubmitting?"#94A3B8":"linear-gradient(135deg,#1B4FD8,#3B82F6)", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontWeight:800, cursor:!formData.declaration||isSubmitting?"not-allowed":"pointer", boxShadow:!formData.declaration||isSubmitting?"none":"0 6px 18px rgba(27,79,216,0.35)" }}>
          {isSubmitting?<><div style={{ width:17, height:17, border:"2px solid #ffffff40", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>Submitting...</>:<><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Confirm & Submit</>}
        </button>
      </div>
    </div>
  );
}
