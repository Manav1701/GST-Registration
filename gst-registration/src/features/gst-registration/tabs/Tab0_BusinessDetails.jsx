import { FormInput, FormSelect, FormToggle, FormRadioGroup, SectionCard, InfoAlert, Grid2, Grid3, DynamicList } from "../../../components/ui/index.jsx";
import { CONSTITUTION_TYPES, REGISTRATION_REASONS, REG_TYPES, PROOF_OF_CONSTITUTION, getStatesForCountry, getCitiesForState } from "../../../constants/dropdowns.js";
import { FileInput } from "../../../components/ui/index.jsx";

export default function Tab0_BusinessDetails({ data, update, errors, touched, touch }) {
  const f = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });
  const sel = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });

  const stateItems = getStatesForCountry('IN');
  const districtItems = data.state ? getCitiesForState('IN', data.state) : [];

  return (
    <>
      <SectionCard title="Business Identity" icon="🏢">
        <Grid2>
          {/* legal_name — editable (was readOnly before, now fixed) */}
          <FormInput label="Legal Name of the Business" required {...f("legal_name")} placeholder="As per PAN records"/>
          <FormInput label="Permanent Account Number (PAN)" required {...f("pan")} placeholder="ABCDE1234F" hint="10-character PAN"/>
          <FormInput label="Date of Creation of PAN" required type="date" {...f("pan_date")}/>
          <FormSelect label="Constitution of Business" required {...sel("Constitution of Business")} items={CONSTITUTION_TYPES}/>
        </Grid2>
        <FormInput label="Trade Name" required {...f("trade_name")} placeholder="Enter trade name (if different from legal name)"/>
      </SectionCard>

      <SectionCard title="Location" icon="📍">
        <Grid2>
          <FormSelect label="Name of the State" required {...sel("state")} items={stateItems} 
            onChange={(e) => { update("state", e.target.value); update("District", ""); }} />
          <FormSelect label="District" required {...sel("District")} items={districtItems} disabled={!data.state}/>
        </Grid2>
      </SectionCard>

      <SectionCard title="Registration Options" icon="⚙️">
        <FormToggle label="Are you applying for registration as a casual taxable person?" value={data.toggle} onChange={(v)=>update("toggle",v)}/>
        <FormToggle label="Option For Composition" value={data.toggle_1} onChange={(v)=>update("toggle_1",v)}/>
        <FormRadioGroup label="Option for registration under Rule 14A" value={data.radioBlocks} onChange={(v)=>update("radioBlocks",v)}
          items={[{value:0,label:"Yes"},{value:1,label:"No"}]}/>
        <InfoAlert>You may avail option under Rule 14A if the ITC to be passed on is ≤ ₹2.5 lakhs per month. Aadhaar Authentication is mandatory for this option.</InfoAlert>
      </SectionCard>

      <SectionCard title="Registration Details" icon="📋">
        <Grid2>
          <FormSelect label="Reason to obtain registration" required {...sel("reason")} items={REGISTRATION_REASONS}/>
          <div/>
          <FormInput label="Date of commencement of Business" required type="date" {...f("commencement_date")}/>
          <FormInput label="Date on which liability to register arises" required type="date" {...f("commencement_date_1")}/>
        </Grid2>
      </SectionCard>

      <SectionCard title="Existing Registrations" icon="🗂️">
        <DynamicList value={data.existing_registrations_list} onChange={(v)=>update("existing_registrations_list",v)}
          emptyItem={{type:"",reg_no:"",date:""}} addLabel="Add Existing Registration"
          renderItem={(item,_i,updateItem)=>(
            <Grid3>
              <FormSelect label="Type of Registration" value={item.type} onChange={(e)=>updateItem({type:e.target.value})} items={REG_TYPES}/>
              <FormInput label="Registration No." value={item.reg_no} onChange={(e)=>updateItem({reg_no:e.target.value})} placeholder="Enter registration number"/>
              <FormInput label="Date of Registration" value={item.date} onChange={(e)=>updateItem({date:e.target.value})} type="date"/>
            </Grid3>
          )}
        />
      </SectionCard>

      <SectionCard title="Proof of Constitution" icon="📄">
        <Grid2>
          <FormSelect label="Proof of Constitution of Business" value={data.proof_of_constitution} onChange={(e)=>update("proof_of_constitution",e.target.value)} items={PROOF_OF_CONSTITUTION}/>
          <div/>
        </Grid2>
        <FileInput label="Upload Constitution Document" value={data.constitution_document} onChange={(v)=>update("constitution_document",v)}/>
        <FileInput label="Document Upload" value={data.file} onChange={(v)=>update("file",v)}/>
      </SectionCard>
    </>
  );
}
