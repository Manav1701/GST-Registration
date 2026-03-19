import { useEffect } from "react";
import { FormInput, FormSelect, FormToggle, FormRadioGroup, FormCheckbox, SectionCard, InfoAlert, Grid2, Grid3 } from "../../../components/ui/index.jsx";
import { FileInput } from "../../../components/ui/index.jsx";
import { COUNTRIES, AUTH_SIGNATORY_PROOF, getStatesForCountry, getCitiesForState } from "../../../constants/dropdowns.js";

export default function Tab3_AuthSignatory({ data, update, errors, touched, touch, fetchAddressByPin }) {
  const f = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });
  const sel = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });

  const countryCode = data.as_country || "IN";
  const stateCode = data.as_state;

  const stateItems = getStatesForCountry(countryCode);
  const districtItems = stateCode ? getCitiesForState(countryCode, stateCode) : [];

  // PIN Code Auto-fill Logic (Live API for India)
  useEffect(() => {
    if (data.as_pin?.length === 6 && countryCode === "IN") {
      const loadAddress = async () => {
        const address = await fetchAddressByPin(data.as_pin);
        if (address) {
          const matchedState = stateItems.find(s => s.label.toLowerCase() === address.stateName.toLowerCase());
          if (matchedState) {
            update("as_state", matchedState.value);
            update("as_district", address.district);
            update("as_city", address.city);
          }
        }
      };
      loadAddress();
    }
  }, [data.as_pin, update, countryCode, fetchAddressByPin, stateItems]);

  return (
    <>
      {(data["Also Authorized Signatory"] || data["Also Authorized Signatory_2"]) && (
        <InfoAlert type="info">
          <strong>Note:</strong> These details have been automatically filled from the Promoter section because you selected "Also Authorized Signatory" there. 
          Any changes you make here will be saved for the signatory specifically.
        </InfoAlert>
      )}
      <SectionCard title="Authorized Signatory Details" icon="✍️">
        <FormCheckbox label="Primary Authorized Signatory" value={data.is_primary} onChange={(v)=>update("is_primary",v)}/>
        <Grid3>
          <FormInput label="First Name" required {...f("as_name_first")} placeholder="First name"/>
          <FormInput label="Middle Name" {...f("as_name_middle")} placeholder="Middle name"/>
          <FormInput label="Last Name" required {...f("as_name_last")} placeholder="Last name"/>
          <FormInput label="Father's First Name" {...f("as_father_first")} placeholder="Father's first name"/>
          <FormInput label="Father's Middle Name" {...f("as_father_middle")} placeholder="Father's middle name"/>
          <FormInput label="Father's Last Name" {...f("as_father_last")} placeholder="Father's last name"/>
        </Grid3>
        <Grid2>
          <FormInput label="Date of Birth" required type="date" {...f("as_dob")}/>
          <FormInput label="Mobile Number (+91)" required {...f("as_mobile")} placeholder="10-digit mobile" hint="Format: 9876543210"/>
          <FormInput label="Email Address" required {...f("as_email")} placeholder="email@example.com"/>
          <FormInput label="Telephone Number (with STD Code)" {...f("as_telephone")} placeholder="e.g. 022-23456789"/>
        </Grid2>
        <FormRadioGroup label="Gender" value={data.radiogroup_1} onChange={(v)=>update("radiogroup_1",v)}
          items={[{value:"Male",label:"Male"},{value:"Female",label:"Female"},{value:"Others",label:"Others"}]}/>
      </SectionCard>

      <SectionCard title="Identity Information" icon="🪪">
        <Grid2>
          <FormInput label="Designation / Status" required {...f("as_designation")} placeholder="e.g. Director"/>
          <FormInput label="Director Identification Number (DIN)" {...f("as_din")} placeholder="8-digit DIN"/>
          <FormInput label="Permanent Account Number (PAN)" required {...f("as_pan")} placeholder="ABCDE1234F"/>
        </Grid2>
        <FormToggle label="Are you a citizen/resident of India?" value={!!data.toggle_3} onChange={(v)=>update("toggle_3",v)}/>
        <Grid2>
          <FormInput label="Passport Number (Foreigners only)" {...f("as_passport")} placeholder="Passport number"/>
          <FormInput label="Aadhaar Number" {...f("as_aadhaar")} placeholder="12-digit Aadhaar"/>
        </Grid2>
      </SectionCard>

      <SectionCard title="Residential Address" icon="🏠">
        <InfoAlert>i. Address validations are mandatory in the GST system.<br/>ii. Ensure addresses match your proof documents exactly.</InfoAlert>
        <Grid2>
          <FormSelect label="Country" value={data.as_country} onChange={(e)=>update("as_country",e.target.value)} items={COUNTRIES}/>
          <FormInput label="PIN Code" required {...f("as_pin")} placeholder="6-digit PIN" hint="Type 380001 for test"/>
          <FormSelect label="State" {...sel("as_state")} items={stateItems}
            onChange={(e) => { update("as_state", e.target.value); update("as_district", ""); }} />
          <FormSelect label="District" {...sel("as_district")} items={districtItems} disabled={!data.as_state}/>
          <FormInput label="City / Town / Village" value={data.as_city??""} onChange={(e)=>update("as_city",e.target.value||null)} placeholder="City"/>
          <FormInput label="Locality / Sub Locality" value={data.as_locality??""} onChange={(e)=>update("as_locality",e.target.value||null)} placeholder="Locality"/>
          <FormInput label="Road / Street" value={data.as_road??""} onChange={(e)=>update("as_road",e.target.value||null)} placeholder="Road or street"/>
          <FormInput label="Name of the Premises / Building" value={data.as_premises??""} onChange={(e)=>update("as_premises",e.target.value||null)} placeholder="Building name"/>
          <FormInput label="Building No. / Flat No." value={data.as_bno??""} onChange={(e)=>update("as_bno",e.target.value||null)} placeholder="Flat number"/>
          <FormInput label="Floor No." value={data.as_floor??""} onChange={(e)=>update("as_floor",e.target.value||null)} placeholder="Floor number"/>
          <FormInput label="Nearby Landmark" value={data.as_landmark??""} onChange={(e)=>update("as_landmark",e.target.value||null)} placeholder="Nearby landmark"/>
        </Grid2>
      </SectionCard>

      <SectionCard title="Documents" icon="📎">
        <FormSelect label="Proof of details of authorized signatory" value={data.as_proof_type} onChange={(e)=>update("as_proof_type",e.target.value)} items={AUTH_SIGNATORY_PROOF}/>
        <FileInput label="Upload Proof (PDF/JPEG, max 1MB)" value={data.as_proof_file} onChange={(v)=>update("as_proof_file",v)} maxKb={1024}/>
        <FileInput label="Upload Photograph (JPEG only, max 100KB)" value={data.as_photo} onChange={(v)=>update("as_photo",v)} maxKb={100} forceJpeg={true}/>
      </SectionCard>
    </>
  );
}
