import { useEffect } from "react";
import { FormInput, FormSelect, FormToggle, FormRadioGroup, SectionCard, Grid2, Grid3 } from "../../../components/ui/index.jsx";
import { REP_DESIGNATIONS } from "../../../constants/dropdowns.js";

export default function Tab4_AuthRep({ data, update, errors, touched, touch }) {
  const f = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });

  // Auto-cleanup: if user switches to "No", clear all values but keep keys in JSON
  useEffect(() => {
    if (!data.toggle_4) {
      const keysToClear = [
        "radiogroup_2", "enrolment_id", "rep_name_first", "rep_name_middle", "rep_name_last",
        "rep_designation", "rep_mobile", "rep_email", "rep_pan", "rep_aadhaar",
        "rep_telephone", "rep_fax"
      ];
      keysToClear.forEach(k => {
        if (data[k] !== "" && data[k] !== null) {
          update(k, k === "rep_aadhaar" || k === "rep_fax" ? null : "");
        }
      });
    }
  }, [data.toggle_4, update]);

  const isGSTP = data.radiogroup_2 === "GST Practitioner";
  const isOther = data.radiogroup_2 === "Other";

  return (
    <SectionCard title="Authorized Representative" icon="👔">
      <FormToggle label="Do you have any Authorized Representative?" value={!!data.toggle_4} onChange={(v)=>update("toggle_4",v)}/>
      
      {data.toggle_4 && (
        <div className="field-animate">
          <FormRadioGroup label="Type of Authorised Representative" value={data.radiogroup_2} onChange={(v)=>update("radiogroup_2",v)}
            items={[{value:"GST Practitioner",label:"GST Practitioner"},{value:"Other",label:"Other"}]}/>
          
          <Grid2>
            <FormInput label="Enrolment ID" value={data.enrolment_id} onChange={(e)=>update("enrolment_id",e.target.value)} placeholder="e.g. TRP123456789012" disabled={isOther}/>
          </Grid2>
          
          <Grid3>
            <FormInput label="First Name" required {...f("rep_name_first")} placeholder="First name" disabled={isGSTP}/>
            <FormInput label="Middle Name" value={data.rep_name_middle||""} onChange={(e)=>update("rep_name_middle",e.target.value)} placeholder="Middle name" disabled={isGSTP}/>
            <FormInput label="Last Name" required {...f("rep_name_last")} placeholder="Last name" disabled={isGSTP}/>
          </Grid3>
          
          <Grid2>
            <FormSelect label="Designation / Status" value={data.rep_designation} onChange={(e)=>update("rep_designation",e.target.value)} items={REP_DESIGNATIONS} disabled={isGSTP}/>
            <FormInput label="Mobile Number +91" required {...f("rep_mobile")} placeholder="10-digit mobile" disabled={isGSTP}/>
            <FormInput label="Email Address" required {...f("rep_email")} placeholder="email@example.com" disabled={isGSTP}/>
            <FormInput label="Permanent Account Number (PAN)" required {...f("rep_pan")} placeholder="ABCDE1234F" disabled={isGSTP}/>
            <FormInput label="Aadhaar Number" value={data.rep_aadhaar??""} onChange={(e)=>update("rep_aadhaar",e.target.value||null)} placeholder="12-digit Aadhaar" disabled={isGSTP || isOther}/>
            <FormInput label="Telephone Number (with STD Code)" value={data.rep_telephone||""} onChange={(e)=>update("rep_telephone",e.target.value)} placeholder="e.g. 022-23456789" disabled={isGSTP}/>
            <FormInput label="FAX Number (with STD Code)" value={data.rep_fax??""} onChange={(e)=>update("rep_fax",e.target.value||null)} placeholder="e.g. 022-23456789" disabled={isGSTP}/>
          </Grid2>
        </div>
      )}
    </SectionCard>
  );
}
