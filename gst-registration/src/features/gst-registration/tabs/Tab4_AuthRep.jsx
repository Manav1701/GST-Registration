import { FormInput, FormSelect, FormToggle, FormRadioGroup, SectionCard, Grid2, Grid3 } from "../../../components/ui/index.jsx";
import { REP_DESIGNATIONS } from "../../../constants/dropdowns.js";

export default function Tab4_AuthRep({ data, update, errors, touched, touch }) {
  const f = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });

  return (
    <SectionCard title="Authorized Representative" icon="👔">
      <FormToggle label="Do you have any Authorized Representative?" value={!!data.toggle_4} onChange={(v)=>update("toggle_4",v)}/>
      <FormRadioGroup label="Type of Authorised Representative" value={data.radiogroup_2} onChange={(v)=>update("radiogroup_2",v)}
        items={[{value:"GST Practitioner",label:"GST Practitioner"},{value:"Other",label:"Other"}]}/>
      <Grid2>
        <FormInput label="Enrolment ID" value={data.enrolment_id} onChange={(e)=>update("enrolment_id",e.target.value)} placeholder="e.g. TRP123456789012"/>
      </Grid2>
      <Grid3>
        <FormInput label="First Name" {...f("rep_name_first")} placeholder="First name"/>
        <FormInput label="Middle Name" value={data.rep_name_middle} onChange={(e)=>update("rep_name_middle",e.target.value)} placeholder="Middle name"/>
        <FormInput label="Last Name" value={data.rep_name_last} onChange={(e)=>update("rep_name_last",e.target.value)} placeholder="Last name"/>
      </Grid3>
      <Grid2>
        <FormSelect label="Designation / Status" value={data.rep_designation} onChange={(e)=>update("rep_designation",e.target.value)} items={REP_DESIGNATIONS}/>
        <FormInput label="Mobile Number +91" {...f("rep_mobile")} placeholder="10-digit mobile"/>
        <FormInput label="Email Address" {...f("rep_email")} placeholder="email@example.com"/>
        <FormInput label="Permanent Account Number (PAN)" {...f("rep_pan")} placeholder="ABCDE1234F"/>
        <FormInput label="Aadhaar Number" value={data.rep_aadhaar??""} onChange={(e)=>update("rep_aadhaar",e.target.value||null)} placeholder="12-digit Aadhaar"/>
        <FormInput label="Telephone Number (with STD Code)" value={data.rep_telephone} onChange={(e)=>update("rep_telephone",e.target.value)} placeholder="e.g. 022-23456789"/>
        <FormInput label="FAX Number (with STD Code)" value={data.rep_fax??""} onChange={(e)=>update("rep_fax",e.target.value||null)} placeholder="e.g. 022-23456789"/>
      </Grid2>
    </SectionCard>
  );
}
