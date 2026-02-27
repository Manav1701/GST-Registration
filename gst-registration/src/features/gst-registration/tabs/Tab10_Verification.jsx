import { FormInput, FormSelect, FormCheckbox, SectionCard, InfoAlert, Grid2 } from "../../../components/ui/index.jsx";

export default function Tab10_Verification({ data, update, errors, touched, touch }) {
  const f = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });

  return (
    <SectionCard title="Verification & Declaration" icon="✅">
      <FormCheckbox
        label="I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed therefrom."
        value={!!data.declaration}
        onChange={(v)=>update("declaration",v)}
        error={touched.declaration?errors.declaration:null}
      />
      <Grid2>
        <FormSelect label="Name of Authorized Signatory" required
          value={data.signatory}
          error={touched.signatory?errors.signatory:null}
          onChange={(e)=>update("signatory",e.target.value)}
          onBlur={()=>touch("signatory")}
          items={[
            {value:"object:2346",label:"RAVI VISHNUKUMAR SOMANI [DRMPS3554S]"},
            {value:"object:2347",label:"Ravi Vishnukumar Somani [DRMPS3552R]"},
          ]}
        />
        <FormInput label="Place" required {...f("place")} placeholder="Enter place of signing"/>
        {/* designation_ver — editable (was readOnly before, now fixed) */}
        <FormInput label="Designation / Status" {...f("designation_ver")} placeholder="e.g. Proprietor"/>
        {/* date_ver — editable (was readOnly before, now fixed) */}
        <FormInput label="Date" type="date" {...f("date_ver")}/>
      </Grid2>
      <InfoAlert type="warning">
        After filling this section, please go to the <strong>Review & Submit</strong> page to review all your details before final submission.
        <br/>Submit button is on the Review & Submit page.
      </InfoAlert>
    </SectionCard>
  );
}
