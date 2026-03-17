import { useEffect } from "react";
import { FormInput, FormSelect, SectionCard, InfoAlert, Grid2 } from "../../../components/ui/index.jsx";
import { FileInput } from "../../../components/ui/index.jsx";
import BusinessActivityCheckboxes from "../../../components/shared/BusinessActivityCheckboxes.jsx";
import { POSSESSION_TYPES, PROOF_OF_PREMISES, DISTRICT_MAP, INDIAN_STATES, PIN_DATA } from "../../../constants/dropdowns.js";

export default function Tab6_APB({ data, update, errors, touched, touch }) {
  const f = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });
  const sel = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });

  // PIN Code Auto-fill Logic
  useEffect(() => {
    if (data.apb_pin?.length === 6) {
      const match = PIN_DATA[data.apb_pin];
      if (match) {
        update("apb_state", match.state);
        update("apb_district", match.district);
        update("apb_city", match.city);
      }
    }
  }, [data.apb_pin, update]);

  return (
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
          <FormInput label="PIN Code" value={data.apb_pin} onChange={(e)=>update("apb_pin",e.target.value)} placeholder="6-digit PIN" hint="Type 380001 for auto-fill test"/>
          <FormSelect label="State" {...sel("apb_state")} items={INDIAN_STATES}
            onChange={(e) => { update("apb_state", e.target.value); update("apb_district", ""); }} />
          <FormSelect label="District" {...sel("apb_district")} items={DISTRICT_MAP[data.apb_state] || []} disabled={!data.apb_state}/>
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
        <FileInput label="Upload Document (PDF/JPEG, max 1MB)" value={data.apb_file} onChange={(v)=>update("apb_file",v)}/>
      </SectionCard>

      <SectionCard title="Nature of Business Activity" icon="💼">
        <InfoAlert>In case you need to upload multiple documents, please append all to a single file before uploading.</InfoAlert>
        <BusinessActivityCheckboxes data={data} update={update} prefix="apb_"/>
      </SectionCard>
    </>
  );
}
