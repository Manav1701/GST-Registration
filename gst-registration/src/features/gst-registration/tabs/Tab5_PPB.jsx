import { FormInput, FormSelect, FormToggle, SectionCard, InfoAlert, Grid2, Grid3 } from "../../../components/ui/index.jsx";
import { FileInput } from "../../../components/ui/index.jsx";
import BusinessActivityCheckboxes from "../../../components/shared/BusinessActivityCheckboxes.jsx";
import { GHATAK_ITEMS, POSSESSION_TYPES, PROOF_OF_PREMISES } from "../../../constants/dropdowns.js";

export default function Tab5_PPB({ data, update, errors, touched, touch }) {
  const f = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });
  const sel = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });

  return (
    <>
      <SectionCard title="Address Details" icon="🗺️">
        <InfoAlert>i. Mandatory address validations apply in the GST system.<br/>ii. Ensure addresses match your proof documents exactly.</InfoAlert>
        <div style={{ background:"#F1F5F9", borderRadius:8, padding:14, marginBottom:18, textAlign:"center", color:"#64748B", fontSize:12.5 }}>📍 Map integration — drag marker to set location (MapMyIndia)</div>
        <Grid2>
          <FormInput label="PIN Code" required {...f("ppb_pin")} placeholder="6-digit PIN"/>
          {/* ppb_state — editable (was readOnly before, now fixed) */}
          <FormInput label="State" required {...f("ppb_state")} placeholder="e.g. Gujarat"/>
          <FormInput label="District" value={data.ppb_district??""} onChange={(e)=>update("ppb_district",e.target.value||null)} placeholder="District"/>
          <FormInput label="City / Town / Village" value={data.ppb_city??""} onChange={(e)=>update("ppb_city",e.target.value||null)} placeholder="City or town"/>
          <FormInput label="Locality / Sub Locality" value={data.ppb_locality} onChange={(e)=>update("ppb_locality",e.target.value)} placeholder="Locality"/>
          <FormInput label="Road / Street" value={data.ppb_road} onChange={(e)=>update("ppb_road",e.target.value)} placeholder="Road or street"/>
          <FormInput label="Name of the Premises / Building" required {...f("ppb_premises")} placeholder="Building name"/>
          <FormInput label="Building No. / Flat No." required {...f("ppb_bno")} placeholder="Flat/Building number"/>
          <FormInput label="Floor No." value={data.ppb_floor} onChange={(e)=>update("ppb_floor",e.target.value)} placeholder="Floor number"/>
          <FormInput label="Nearby Landmark" value={data.ppb_landmark} onChange={(e)=>update("ppb_landmark",e.target.value)} placeholder="Nearby landmark"/>
          <FormInput label="Latitude" value={data.ppb_lat??""} onChange={(e)=>update("ppb_lat",e.target.value||null)} placeholder="e.g. 23.0225"/>
          <FormInput label="Longitude" value={data.ppb_long??""} onChange={(e)=>update("ppb_long",e.target.value||null)} placeholder="e.g. 72.5714"/>
        </Grid2>
      </SectionCard>

      <SectionCard title="Jurisdiction" icon="⚖️">
        <FormSelect label="Sector / Circle / Ward / Charge / Unit" required {...sel("sector_circle")} items={GHATAK_ITEMS}/>
        <Grid3>
          <FormSelect label="Center Jurisdiction — Commissionerate" required {...sel("center_commissionerate")}
            items={[{value:"AHMEDABAD SOUTH",label:"AHMEDABAD SOUTH"}]}/>
          <FormSelect label="Center Jurisdiction — Division" required {...sel("center_division")}
            items={[{value:"WS06",label:"DIVISION-VI — VASTRAPUR"},{value:"WS07",label:"DIVISION-VII — SATELLITE"},{value:"WS08",label:"DIVISION-VIII — VEJALPUR"}]}/>
          <FormSelect label="Center Jurisdiction — Range" required {...sel("center_range")}
            items={[{value:"WS0601",label:"RANGE I"},{value:"WS0602",label:"RANGE II"},{value:"WS0603",label:"RANGE III"}]}/>
        </Grid3>
      </SectionCard>

      <SectionCard title="Contact Information" icon="📞">
        <Grid2>
          <FormInput label="Office Email Address" value={data.ppb_email??""} onChange={(e)=>update("ppb_email",e.target.value||null)} placeholder="office@example.com"/>
          <FormInput label="Office Telephone (with STD Code)" value={data.ppb_office_tel} onChange={(e)=>update("ppb_office_tel",e.target.value)} placeholder="e.g. 079-26543210"/>
          <FormInput label="Mobile Number +91" value={data.ppb_mobile??""} onChange={(e)=>update("ppb_mobile",e.target.value||null)} placeholder="10-digit mobile"/>
          <FormInput label="Office FAX (with STD Code)" value={data.ppb_fax??""} onChange={(e)=>update("ppb_fax",e.target.value||null)} placeholder="e.g. 079-26543211"/>
        </Grid2>
      </SectionCard>

      <SectionCard title="Nature of Possession" icon="🔑">
        <Grid2>
          <FormSelect label="Nature of possession of premises" required {...sel("ppb_possession_type")} items={POSSESSION_TYPES}/>
          <FormSelect label="Proof of Place of Business" required {...sel("ppb_proof_doc")} items={PROOF_OF_PREMISES}/>
        </Grid2>
        <FileInput label="Upload Document (PDF/JPEG, max 1MB)" value={data.ppb_file} onChange={(v)=>update("ppb_file",v)}/>
      </SectionCard>

      <SectionCard title="Nature of Business Activity at Principal Place" icon="💼">
        <BusinessActivityCheckboxes data={data} update={update} prefix="ba_"/>
      </SectionCard>

      <SectionCard title="Additional Places of Business" icon="🏬">
        <FormToggle label="Have Additional Place of Business?" value={!!data.toggle_5} onChange={(v)=>update("toggle_5",v)}/>
      </SectionCard>
    </>
  );
}
