import { FormInput, FormSelect, FormToggle, FormRadioGroup, SectionCard, InfoAlert, Grid2, Grid3 } from "../../../components/ui/index.jsx";
import { FileInput } from "../../../components/ui/index.jsx";
import { COUNTRIES } from "../../../constants/dropdowns.js";

// Shared promoter form used for both Promoter 1 (suffix="") and Promoter 2 (suffix="_2")
export default function Tab1_Promoter({ data, update, errors, touched, touch, suffix="" }) {
  const s = (n) => suffix ? `${n}${suffix}` : n;
  const f = (name) => ({ value:data[s(name)], error:touched[s(name)]?errors[s(name)]:null, onChange:(e)=>update(s(name),e.target.value), onBlur:()=>touch(s(name)) });
  const sel = (name) => ({ value:data[s(name)], error:touched[s(name)]?errors[s(name)]:null, onChange:(e)=>update(s(name),e.target.value), onBlur:()=>touch(s(name)) });

  return (
    <>
      <SectionCard title="Personal Information" icon="👤">
        <Grid3>
          <FormInput label="First Name" required {...f("name_first")} placeholder="First name"/>
          <FormInput label="Middle Name" {...f("name_middle")} placeholder="Middle name"/>
          <FormInput label="Last Name" required {...f("name_last")} placeholder="Last name"/>
          <FormInput label="Father's First Name" {...f("father_first")} placeholder="Father's first name"/>
          <FormInput label="Father's Middle Name" {...f("father_middle")} placeholder="Father's middle name"/>
          <FormInput label="Father's Last Name" {...f("father_last")} placeholder="Father's last name"/>
        </Grid3>
        <Grid2>
          <FormInput label="Date of Birth" required type="date" {...f("dob")}/>
          <FormInput label="Mobile Number (+91)" required {...f("mobile")} placeholder="10-digit mobile number" hint="Format: 9876543210"/>
          <FormInput label="Email Address" required {...f("email")} placeholder="email@example.com"/>
          <FormInput label="Telephone Number (with STD Code)" {...f("telephone")} placeholder="e.g. 022-23456789"/>
        </Grid2>
        <FormRadioGroup label="Gender" value={data[s("radiogroup")]} onChange={(v)=>update(s("radiogroup"),v)}
          items={[{value:"Male",label:"Male"},{value:"Female",label:"Female"},{value:"Others",label:"Others"}]}/>
      </SectionCard>

      <SectionCard title="Identity Information" icon="🪪">
        <Grid2>
          <FormInput label="Designation / Status" required {...f("designation")} placeholder="e.g. Director, Partner"/>
          <FormInput label="Director Identification Number (DIN)" {...f("din")} placeholder="8-digit DIN" hint="Format: 12345678"/>
        </Grid2>
        <FormToggle label="Are you a citizen of India?" value={!!data[s("toggle_2")]} onChange={(v)=>update(s("toggle_2"),v)}/>
        <Grid2>
          <FormInput label="Permanent Account Number (PAN)" required {...f("pan_proprietor")} placeholder="ABCDE1234F"/>
          <FormInput label="Passport Number (Foreigners only)" {...f("passport")} placeholder="Passport number"/>
          <FormInput label="Aadhaar Number" {...f("aadhaar")} placeholder="12-digit Aadhaar" hint="Format: 123456789012"/>
        </Grid2>
      </SectionCard>

      <SectionCard title="Residential Address" icon="🏠">
        <InfoAlert>
          i. Please be aware that the GST system incorporates mandatory address validations for accuracy and uniformity.<br/>
          ii. Users must ensure that addresses entered align with these validations and any corresponding address proof.
        </InfoAlert>
        <Grid2>
          <FormSelect label="Country" required {...sel("country")} items={COUNTRIES}/>
          <FormInput label="PIN Code" required {...f("pin_code")} placeholder="6-digit PIN" hint="Auto-fills state/city"/>
          <FormInput label="State" required {...f("state_res")} placeholder="State"/>
          <FormInput label="District" required {...f("district_res")} placeholder="District"/>
          <FormInput label="City / Town / Village" required {...f("city_res")} placeholder="City or town"/>
          <FormInput label="Locality / Sub Locality" {...f("locality")} placeholder="Locality or sub-locality"/>
          <FormInput label="Road / Street" required {...f("road_street_res")} placeholder="Road or street name"/>
          <FormInput label="Name of the Premises / Building" {...f("premises_name")} placeholder="Building or premises name"/>
          <FormInput label="Building No. / Flat No." required {...f("building_no_res")} placeholder="Flat/Building number"/>
          <FormInput label="Floor No." {...f("floor_no_res")} placeholder="Floor number"/>
          <FormInput label="Nearby Landmark" {...f("landmark_res")} placeholder="Nearby landmark"/>
        </Grid2>
      </SectionCard>

      <SectionCard title="Document Upload" icon="📎">
        <FileInput label="Upload Photo (JPEG only, max 100KB)" value={data[s("photo")]} onChange={(v)=>update(s("photo"),v)}/>
        <FormToggle label="Also Authorized Signatory" value={!!data[s("Also Authorized Signatory")]} onChange={(v)=>update(s("Also Authorized Signatory"),v)}/>
      </SectionCard>
    </>
  );
}
