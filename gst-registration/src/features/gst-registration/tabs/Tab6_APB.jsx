import { useEffect } from "react";
import { FormInput, FormSelect, SectionCard, InfoAlert, Grid2 } from "../../../components/ui/index.jsx";
import { FileInput } from "../../../components/ui/index.jsx";
import BusinessActivityCheckboxes from "../../../components/shared/BusinessActivityCheckboxes.jsx";
import { POSSESSION_TYPES, PROOF_OF_PREMISES, getStatesForCountry, getCitiesForState } from "../../../constants/dropdowns.js";

export default function Tab6_APB({ data, update, errors, touched, touch, fetchAddressByPin }) {
  const f = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });
  const sel = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });

  // PIN Code Auto-fill Logic (Live API)
  useEffect(() => {
    if (data.apb_pin?.length === 6) {
      const loadAddress = async () => {
        const address = await fetchAddressByPin(data.apb_pin);
        if (address) {
          const statesInIndia = getStatesForCountry('IN');
          const matchedState = statesInIndia.find(s => s.label.toLowerCase() === address.stateName.toLowerCase());
          if (matchedState) {
            update("apb_state", matchedState.value);
            update("apb_district", address.district);
            update("apb_city", address.city);
          }
        }
      };
      loadAddress();
    }
  }, [data.apb_pin, update, fetchAddressByPin]);

  const showFields = !!data.toggle_5;

  // Auto-cleanup: if user switches to "No" in previous tab, clear all APB values
  useEffect(() => {
    if (!showFields) {
      const keysToClear = [
        "apb_count", "apb_pin", "apb_state", "apb_district", "apb_city", 
        "apb_locality", "apb_road", "apb_premises", "apb_bno", "apb_floor", 
        "apb_landmark", "apb_lat", "apb_long", "apb_email", "apb_mobile", 
        "apb_office_tel", "apb_fax", "apb_possession_type", "apb_proof_doc", "apb_file"
      ];
      // Activity checkboxes
      const activities = ["bonded_warehouse", "eou", "export", "factory", "import", "services", "leasing", "office", "recipient", "retail", "warehouse", "wholesale", "works_contract", "others", "others_specify"];
      
      [...keysToClear, ...activities.map(a => `apb_${a}`)].forEach(k => {
        if (data[k] !== "" && data[k] !== null && data[k] !== false) {
           update(k, (k === "apb_lat" || k === "apb_long" || k === "apb_fax" || k === "apb_file") ? null : k.includes("ba_") || activities.some(a => k === `apb_${a}`) ? false : "");
        }
      });
    }
  }, [showFields, update, data]);

  const hasNoticeError = !!errors.apb_notice;

  const stateItems = getStatesForCountry('IN');
  const districtItems = data.apb_state ? getCitiesForState('IN', data.apb_state) : [];

  return (
    <>
      {!showFields ? (
        <SectionCard title="Additional Place Details" icon="🏬">
          <div style={{ 
            padding: "40px 20px", 
            textAlign: "center", 
            background: hasNoticeError ? "#FFF1F2" : "#F8FAFC", 
            border: hasNoticeError ? "2px solid #F43F5E" : "1px dashed #E2E8F0",
            borderRadius: 12,
            transition: "all 0.3s ease"
          }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>ℹ️</div>
            <h3 style={{ color: "#1E293B", fontWeight: 700, marginBottom: 8 }}>Additional Places of Business Disabled</h3>
            <p style={{ color: "#64748B", fontSize: 13.5, maxWidth: 400, margin: "0 auto" }}>
              To add additional places of business, you must select <b>"Yes"</b> to the question 
              <i>"Have Additional Place of Business?"</i> in the <b>Principal Place of Business</b> section.
            </p>
            {hasNoticeError && (
              <div style={{ marginTop: 16, color: "#E11D48", fontWeight: 700, fontSize: 13 }}>
                ⚠️ You cannot proceed to the next step without enabling this or going back.
              </div>
            )}
          </div>
        </SectionCard>
      ) : (
        <>
          <SectionCard title="Additional Place Details" icon="🏬">
            <FormInput label="Number of additional places" {...f("apb_count")} placeholder="Enter number"/>
          </SectionCard>

          <SectionCard title="Additional Place Address" icon="🗺️">
            <InfoAlert>i. Mandatory address validations apply.<br/>ii. Ensure addresses match your proof documents.</InfoAlert>
            <div style={{ background:"#F1F5F9", borderRadius:8, padding:14, marginBottom:18, textAlign:"center", color:"#64748B", fontSize:12.5, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              📍 Map integration — drag marker to set location
              <button type="button" onClick={() => { update("apb_lat", "23.0225"); update("apb_long", "72.5714"); }}
                style={{ padding:"4px 10px", background:"#1B4FD8", color:"#fff", border:"none", borderRadius:6, fontSize:11, fontWeight:600, cursor:"pointer" }}>
                Set Current Location
              </button>
            </div>
            <Grid2>
              <FormInput label="PIN Code" value={data.apb_pin} onChange={(e)=>update("apb_pin",e.target.value)} placeholder="6-digit PIN" hint="Type 380015 for live auto-fill test"/>
              <FormSelect label="State" {...sel("apb_state")} items={stateItems}
                onChange={(e) => { update("apb_state", e.target.value); update("apb_district", ""); }} />
              <FormSelect label="District" {...sel("apb_district")} items={districtItems} disabled={!data.apb_state}/>
              <FormInput label="City / Town / Village" value={data.apb_city??""} onChange={(e)=>update("apb_city",e.target.value||null)} placeholder="City"/>
              <FormInput label="Locality / Sub Locality" value={data.apb_locality} onChange={(e)=>update("apb_locality",e.target.value)} placeholder="Locality"/>
              <FormInput label="Road / Street" value={data.apb_road} onChange={(e)=>update("apb_road",e.target.value)} placeholder="Road"/>
              <FormInput label="Name of Premises / Building" value={data.apb_premises} onChange={(e)=>update("apb_premises",e.target.value)} placeholder="Building name"/>
              <FormInput label="Building No. / Flat No." value={data.apb_bno} onChange={(e)=>update("apb_bno",e.target.value)} placeholder="Flat number"/>
              <FormInput label="Floor No." value={data.apb_floor} onChange={(e)=>update("apb_floor",e.target.value)} placeholder="Floor"/>
              <FormInput label="Nearby Landmark" value={data.apb_landmark} onChange={(e)=>update("apb_landmark",e.target.value)} placeholder="Landmark"/>
              <FormInput label="Latitude" value={data.apb_lat??""} onChange={(e)=>update("apb_lat",e.target.value||null)} placeholder="e.g. 23.0225"/>
              <FormInput label="Longitude" value={data.apb_long??""} onChange={(e)=>update("apb_long",e.target.value||null)} placeholder="e.g. 72.5714"/>
            </Grid2>
          </SectionCard>

          <SectionCard title="Contact Information" icon="📞">
            <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}>
              <button type="button" onClick={() => { update("apb_email", data.ppb_email); update("apb_mobile", data.ppb_mobile); }}
                style={{ fontSize:11.5, color:"#1B4FD8", fontWeight:700, background:"#EEF4FF", border:"1px solid #C7D9FF", padding:"5px 12px", borderRadius:6, cursor:"pointer" }}>
                📋 Copy from Principal Place
              </button>
            </div>
            <Grid2>
              <FormInput label="Office Email Address" value={data.apb_email} onChange={(e)=>update("apb_email",e.target.value)} placeholder="office@example.com"/>
              <FormInput label="Office Telephone (with STD Code)" value={data.apb_office_tel} onChange={(e)=>update("apb_office_tel",e.target.value)} placeholder="e.g. 02766-222333"/>
              <FormInput label="Mobile Number +91" value={data.apb_mobile} onChange={(e)=>update("apb_mobile",e.target.value)} placeholder="10-digit mobile"/>
              <FormInput label="FAX Number (with STD Code)" value={data.apb_fax??""} onChange={(e)=>update("apb_fax",e.target.value||null)} placeholder="FAX number"/>
            </Grid2>
          </SectionCard>

          <SectionCard title="Nature of Possession" icon="🔑">
            <Grid2>
              <FormSelect label="Nature of possession" {...sel("apb_possession_type")} items={POSSESSION_TYPES} 
                onChange={(e) => { update("apb_possession_type", e.target.value); update("apb_proof_doc", ""); }} />
              
              <FormSelect label="Proof of Additional Place" {...sel("apb_proof_doc")} 
                items={PROOF_OF_PREMISES.filter(p => {
                  if (data.apb_possession_type === "REN") return ["RLAT", "RNOC", "ELCB"].includes(p.value);
                  if (data.apb_possession_type === "OWN") return ["LOWN", "TAXR", "CMUK", "ELCB"].includes(p.value);
                  if (data.apb_possession_type === "CON") return ["CNLR", "ELCB"].includes(p.value);
                  return true;
                })}
                disabled={!data.apb_possession_type}
                hint={!data.apb_possession_type ? "Select possession type first" : "Suggested based on possession"} />
            </Grid2>
            <FileInput label="Upload Document (PDF/JPEG, max 1MB)" value={data.apb_file} onChange={(v)=>update("apb_file",v)} maxKb={1024}/>
          </SectionCard>

          <SectionCard title="Nature of Business Activity" icon="💼">
            <InfoAlert>In case you need to upload multiple documents, please append all to a single file before uploading.</InfoAlert>
            <BusinessActivityCheckboxes data={data} update={update} prefix="apb_"/>
          </SectionCard>
        </>
      )}
    </>
  );
}
