import { FormInput, FormSelect, SectionCard, Grid2 } from "../../../components/ui/index.jsx";
import { POSSESSION_TYPES, ELECTRICITY_BOARDS } from "../../../constants/dropdowns.js";

export default function Tab8_StateSpecific({ data, update, errors, touched, touch }) {
  const f = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });
  const sel = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });

  return (
    <SectionCard title="State Specific Information (Gujarat)" icon="🏛️">
      <FormSelect label="Nature of possession — Principal Place of Business" required {...sel("nature_of_possession_ppb")} items={POSSESSION_TYPES}/>
      <FormSelect label="Name of the Electricity Board or Unit" required {...sel("electricity_board")} items={ELECTRICITY_BOARDS}/>
      <FormInput label="CA Number / Electricity Consumer Number" required {...f("consumer_number")} placeholder="Enter consumer number"/>
      <Grid2>
        <FormInput label="Professional Tax Employee Code (EC) No." {...f("prof_tax_ec")} placeholder="EC No."/>
        <FormInput label="Professional Tax Registration Certificate (RC) No." {...f("prof_tax_rc")} placeholder="RC No."/>
        <FormInput label="State Excise License No." {...f("state_excise_lic")} placeholder="License number"/>
        <FormInput label="Name of person holding Excise Licence" {...f("excise_person_name")} placeholder="Full name"/>
      </Grid2>
    </SectionCard>
  );
}
