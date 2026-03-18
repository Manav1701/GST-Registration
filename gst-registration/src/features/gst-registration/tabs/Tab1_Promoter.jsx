import { useEffect } from "react";
import { FormInput, FormSelect, FormToggle, FormRadioGroup, SectionCard, InfoAlert, Grid2, Grid3 } from "../../../components/ui/index.jsx";
import { FileInput } from "../../../components/ui/index.jsx";
import { COUNTRIES, getStatesForCountry, getCitiesForState } from "../../../constants/dropdowns.js";

// Shared promoter form used for both Promoter 1 (suffix="") and Promoter 2 (suffix="_2")
export default function Tab1_Promoter({ data, update, errors, touched, touch, suffix="", fetchAddressByPin }) {
  const s = (n) => suffix ? `${n}${suffix}` : n;
  const f = (name) => ({ value:data[s(name)], error:touched[s(name)]?errors[s(name)]:null, onChange:(e)=>update(s(name),e.target.value), onBlur:()=>touch(s(name)) });
  const sel = (name) => ({ value:data[s(name)], error:touched[s(name)]?errors[s(name)]:null, onChange:(e)=>update(s(name),e.target.value), onBlur:()=>touch(s(name)) });

  const isAlsoSignatoryField = s("Also Authorized Signatory");
  const isAlsoSignatory = !!data[isAlsoSignatoryField];

  const countryCode = data[s("country")] || "IN";
  const stateCode = data[s("state_res")];

  const stateItems = getStatesForCountry(countryCode);
  const districtItems = stateCode ? getCitiesForState(countryCode, stateCode) : [];

  // PIN Code Auto-fill Logic (Live API for India)
  useEffect(() => {
    const pin = data[s("pin_code")];
    if (pin?.length === 6 && countryCode === "IN") {
      const loadAddress = async () => {
        const address = await fetchAddressByPin(pin);
        if (address) {
          const matchedState = stateItems.find(s => s.label.toLowerCase() === address.stateName.toLowerCase());
          if (matchedState) {
            update(s("state_res"), matchedState.value);
            update(s("district_res"), address.district);
            update(s("city_res"), address.city);
          }
        }
      };
      loadAddress();
    }
  }, [data[s("pin_code")], update, s, countryCode, fetchAddressByPin, stateItems]);

  // REAL-TIME SYNC: This effect ensures that as you type in Promoter fields, 
  // the Authorized Signatory (Tab 3/Page 4) stays updated automatically.
  useEffect(() => {
    if (isAlsoSignatory) {
      const mappings = {
        as_name_first: data[s("name_first")],
        as_name_middle: data[s("name_middle")],
        as_name_last: data[s("name_last")],
        as_father_first: data[s("father_first")],
        as_father_middle: data[s("father_middle")],
        as_father_last: data[s("father_last")],
        as_dob: data[s("dob")],
        as_mobile: data[s("mobile")],
        as_email: data[s("email")],
        as_telephone: data[s("telephone")],
        radiogroup_1: data[s("radiogroup")],
        as_designation: data[s("designation")],
        as_din: data[s("din")],
        as_pan: data[s("pan_proprietor")],
        toggle_3: !!data[s("toggle_2")], 
        as_passport: data[s("passport")],
        as_aadhaar: data[s("aadhaar")],
        as_country: data[s("country")],
        as_pin: data[s("pin_code")],
        as_state: data[s("state_res")],
        as_district: data[s("district_res")],
        as_city: data[s("city_res")],
        as_locality: data[s("locality")],
        as_road: data[s("road_street_res")],
        as_premises: data[s("premises_name")],
        as_bno: data[s("building_no_res")],
        as_floor: data[s("floor_no_res")],
        as_landmark: data[s("landmark_res")],
        as_photo: data[s("photo")],
        is_primary: true
      };

      Object.entries(mappings).forEach(([targetKey, newValue]) => {
        if (data[targetKey] !== newValue) update(targetKey, newValue);
      });
    }
  }, [
    isAlsoSignatory,
    data[s("name_first")], data[s("name_middle")], data[s("name_last")],
    data[s("father_first")], data[s("father_middle")], data[s("father_last")],
    data[s("dob")], data[s("mobile")], data[s("email")], data[s("telephone")],
    data[s("radiogroup")], data[s("designation")], data[s("din")], data[s("pan_proprietor")],
    data[s("toggle_2")], data[s("passport")], data[s("aadhaar")], data[s("country")],
    data[s("pin_code")], data[s("state_res")], data[s("district_res")], data[s("city_res")],
    data[s("locality")], data[s("road_street_res")], data[s("premises_name")],
    data[s("building_no_res")], data[s("floor_no_res")], data[s("landmark_res")],
  ]);

  return (
    <>
      {isAlsoSignatory && (
        <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:12, padding:"12px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:24, height:24, borderRadius:"50%", background:"#10B981", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>✓</div>
          <span style={{ fontSize:13, fontWeight:600, color:"#065F46" }}>
            <strong>Auto-Sync Enabled:</strong> This promoter's details are being synced to the Authorized Signatory section in real-time.
          </span>
        </div>
      )}

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
          <FormInput label="PIN Code" required {...f("pin_code")} placeholder="6-digit PIN" hint="Type 380015 to test auto-fill"/>
          <FormSelect label="State" required {...sel("state_res")} items={stateItems}
            onChange={(e) => { update(s("state_res"), e.target.value); update(s("district_res"), ""); }} />
          <FormSelect label="District" required {...sel("district_res")} items={districtItems} disabled={!data[s("state_res")]}/>
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
        <FormToggle label="Also Authorized Signatory" value={isAlsoSignatory} onChange={(v)=>update(isAlsoSignatoryField, v)}/>
      </SectionCard>
    </>
  );
}
