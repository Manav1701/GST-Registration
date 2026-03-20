import { useEffect } from "react";
import { FormInput, FormSelect, FormToggle, FormRadioGroup, FormCheckbox, SectionCard, InfoAlert, Grid2, Grid3 } from "../../../components/ui/index.jsx";
import { FileInput } from "../../../components/ui/index.jsx";
import { COUNTRIES, AUTH_SIGNATORY_PROOF, REP_DESIGNATIONS, getStatesForCountry, getCitiesForState } from "../../../constants/dropdowns.js";

// ─────────────────────────────────────────────────────────────
// PROMOTER FORM  (identical logic to original Tab1_Promoter)
// ─────────────────────────────────────────────────────────────
function PromoterForm({ data, update, errors, touched, touch, suffix = "", fetchAddressByPin, onRemove, isRemoveable }) {
  const s = (n) => suffix ? `${n}${suffix}` : n;
  const f = (name) => ({ value: data[s(name)], error: touched[s(name)] ? errors[s(name)] : null, onChange: (e) => update(s(name), e.target.value), onBlur: () => touch(s(name)) });
  const sel = (name) => ({ value: data[s(name)], error: touched[s(name)] ? errors[s(name)] : null, onChange: (e) => update(s(name), e.target.value), onBlur: () => touch(s(name)) });

  const isAlsoSignatoryField = s("Also Authorized Signatory");
  const isAlsoSignatory = !!data[isAlsoSignatoryField];

  const countryCode = data[s("country")] || "IN";
  const stateCode = data[s("state_res")];

  const stateItems = getStatesForCountry(countryCode);
  const districtItems = stateCode ? getCitiesForState(countryCode, stateCode) : [];

  // PIN Code Auto-fill Logic
  useEffect(() => {
    const pin = data[s("pin_code")];
    if (pin?.length === 6 && countryCode === "IN") {
      const loadAddress = async () => {
        const address = await fetchAddressByPin(pin);
        if (address) {
          const matchedState = stateItems.find(st => st.label.toLowerCase() === address.stateName.toLowerCase());
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

  // REAL-TIME SYNC: Syncs Promoter 1 to Authorized Signatory section
  useEffect(() => {
    if (suffix !== "") return;

    const mappings = {
      as_name_first: isAlsoSignatory ? data[s("name_first")] : "",
      as_name_middle: isAlsoSignatory ? data[s("name_middle")] : "",
      as_name_last: isAlsoSignatory ? data[s("name_last")] : "",
      as_father_first: isAlsoSignatory ? data[s("father_first")] : "",
      as_father_middle: isAlsoSignatory ? data[s("father_middle")] : "",
      as_father_last: isAlsoSignatory ? data[s("father_last")] : "",
      as_dob: isAlsoSignatory ? data[s("dob")] : "",
      as_mobile: isAlsoSignatory ? data[s("mobile")] : "",
      as_email: isAlsoSignatory ? data[s("email")] : "",
      as_telephone: isAlsoSignatory ? data[s("telephone")] : "",
      radiogroup_1: isAlsoSignatory ? data[s("radiogroup")] : null,
      as_designation: isAlsoSignatory ? data[s("designation")] : "",
      as_din: isAlsoSignatory ? data[s("din")] : "",
      as_pan: isAlsoSignatory ? data[s("pan_proprietor")] : "",
      toggle_3: isAlsoSignatory ? !!data[s("toggle_2")] : false,
      as_passport: isAlsoSignatory ? data[s("passport")] : null,
      as_aadhaar: isAlsoSignatory ? data[s("aadhaar")] : null,
      as_country: isAlsoSignatory ? data[s("country")] : "IN",
      as_pin: isAlsoSignatory ? data[s("pin_code")] : "",
      as_state: isAlsoSignatory ? data[s("state_res")] : "",
      as_district: isAlsoSignatory ? data[s("district_res")] : "",
      as_city: isAlsoSignatory ? data[s("city_res")] : "",
      as_locality: isAlsoSignatory ? data[s("locality")] : "",
      as_road: isAlsoSignatory ? data[s("road_street_res")] : "",
      as_premises: isAlsoSignatory ? data[s("premises_name")] : "",
      as_bno: isAlsoSignatory ? data[s("building_no_res")] : "",
      as_floor: isAlsoSignatory ? data[s("floor_no_res")] : "",
      as_landmark: isAlsoSignatory ? data[s("landmark_res")] : "",
      as_photo: isAlsoSignatory ? data[s("photo")] : null,
      is_primary: isAlsoSignatory ? true : false
    };

    Object.entries(mappings).forEach(([targetKey, newValue]) => {
      if (data[targetKey] !== newValue) update(targetKey, newValue);
    });
  }, [
    isAlsoSignatory, suffix,
    data[s("name_first")], data[s("name_middle")], data[s("name_last")],
    data[s("father_first")], data[s("father_middle")], data[s("father_last")],
    data[s("dob")], data[s("mobile")], data[s("email")], data[s("telephone")],
    data[s("radiogroup")], data[s("designation")], data[s("din")], data[s("pan_proprietor")],
    data[s("toggle_2")], data[s("passport")], data[s("aadhaar")], data[s("country")],
    data[s("pin_code")], data[s("state_res")], data[s("district_res")], data[s("city_res")],
    data[s("locality")], data[s("road_street_res")], data[s("premises_name")],
    data[s("building_no_res")], data[s("floor_no_res")], data[s("landmark_res")],
    data[s("photo")]
  ]);

  const pNum = suffix ? suffix.replace("_", "") : "1";

  return (
    <div style={{ marginBottom: 32, borderLeft: "4px solid #1B4FD8", paddingLeft: 20, paddingBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1B4FD8", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#1B4FD8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{pNum}</span>
          Promoter / Partner Details
        </h3>
        {isRemoveable && (
          <button type="button" onClick={onRemove}
            style={{ padding: "5px 11px", background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            onMouseOver={(e) => e.target.style.background = "#FCA5A5"}
            onMouseOut={(e) => e.target.style.background = "#FEE2E2"}>
            ✕ Remove
          </button>
        )}
      </div>

      {suffix === "" && isAlsoSignatory && (
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#10B981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✓</div>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "#065F46" }}>
            <strong>Auto-Sync Enabled:</strong> Details synced to Authorized Signatory below.
          </span>
        </div>
      )}

      <SectionCard title="Personal Information" icon="👤">
        <Grid3>
          <FormInput label="First Name" required {...f("name_first")} placeholder="First name" />
          <FormInput label="Middle Name" {...f("name_middle")} placeholder="Middle name" />
          <FormInput label="Last Name" required {...f("name_last")} placeholder="Last name" />
          <FormInput label="Father's First Name" {...f("father_first")} placeholder="Father's first" />
          <FormInput label="Father's Middle Name" {...f("father_middle")} placeholder="Father's middle" />
          <FormInput label="Father's Last Name" {...f("father_last")} placeholder="Father's last" />
        </Grid3>
        <Grid3>
          <FormInput label="Date of Birth" required type="date" {...f("dob")} />
          <FormInput label="Mobile (+91)" required {...f("mobile")} placeholder="10-digit mobile" hint="9876543210" />
          <FormInput label="Email Address" required {...f("email")} placeholder="email@example.com" />
        </Grid3>
        <Grid2>
          <FormInput label="Telephone (STD Code)" {...f("telephone")} placeholder="022-23456789" />
          <div>
            <FormRadioGroup label="Gender" value={data[s("radiogroup")]} onChange={(v) => update(s("radiogroup"), v)}
              items={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Others", label: "Others" }]} />
          </div>
        </Grid2>
      </SectionCard>

      <SectionCard title="Identity Information" icon="🪪">
        <Grid3>
          <FormInput label="Designation / Status" required {...f("designation")} placeholder="e.g. Director" />
          <FormInput label="DIN" {...f("din")} placeholder="8-digit DIN" hint="12345678" />
          <FormInput label="PAN" required {...f("pan_proprietor")} placeholder="ABCDE1234F" />
        </Grid3>
        <Grid3>
          <div>
            <FormToggle label="Citizen of India?" value={!!data[s("toggle_2")]} onChange={(v) => update(s("toggle_2"), v)} />
          </div>
          <FormInput label="Passport No. (Foreigners)" {...f("passport")} placeholder="Passport number" />
          <FormInput label="Aadhaar Number" {...f("aadhaar")} placeholder="12-digit Aadhaar" />
        </Grid3>
      </SectionCard>

      <SectionCard title="Residential Address" icon="🏠">
        <Grid3>
          <FormSelect label="Country" required {...sel("country")} items={COUNTRIES} />
          <FormInput label="PIN Code" required {...f("pin_code")} placeholder="6-digit PIN" />
          <FormSelect label="State" required {...sel("state_res")} items={stateItems}
            onChange={(e) => { update(s("state_res"), e.target.value); update(s("district_res"), ""); }} />
        </Grid3>
        <Grid3>
          <FormSelect label="District" required {...sel("district_res")} items={districtItems} disabled={!data[s("state_res")]} />
          <FormInput label="City / Town / Village" required {...f("city_res")} placeholder="City or town" />
          <FormInput label="Locality" {...f("locality")} placeholder="Locality" />
        </Grid3>
        <Grid3>
          <FormInput label="Road / Street" required {...f("road_street_res")} placeholder="Road or street" />
          <FormInput label="Building Name" {...f("premises_name")} placeholder="Building name" />
          <FormInput label="Building No." required {...f("building_no_res")} placeholder="Building number" />
        </Grid3>
        <Grid2>
          <FormInput label="Floor No." {...f("floor_no_res")} placeholder="Floor number" />
          <FormInput label="Landmark" {...f("landmark_res")} placeholder="Nearby landmark" />
        </Grid2>
      </SectionCard>

      <SectionCard title="Uploads" icon="📎">
        <Grid2>
          <FileInput label="Photo (JPEG, max 100KB)" value={data[s("photo")]} onChange={(v) => update(s("photo"), v)} maxKb={100} forceJpeg={true} />
          <div style={{ paddingTop: 8 }}>
            <FormToggle label="Also Authorized Signatory" value={isAlsoSignatory} onChange={(v) => update(isAlsoSignatoryField, v)} />
          </div>
        </Grid2>
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AUTH SIGNATORY SECTION  (identical logic to original Tab3)
// ─────────────────────────────────────────────────────────────
function AuthSignatorySection({ data, update, errors, touched, touch, fetchAddressByPin }) {
  const f = (name) => ({ value: data[name], error: touched[name] ? errors[name] : null, onChange: (e) => update(name, e.target.value), onBlur: () => touch(name) });
  const sel = (name) => ({ value: data[name], error: touched[name] ? errors[name] : null, onChange: (e) => update(name, e.target.value), onBlur: () => touch(name) });

  const countryCode = data.as_country || "IN";
  const stateCode = data.as_state;
  const stateItems = getStatesForCountry(countryCode);
  const districtItems = stateCode ? getCitiesForState(countryCode, stateCode) : [];

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
      {data["Also Authorized Signatory"] && (
        <InfoAlert type="info">
          <strong>Note:</strong> Auto-filled from Promoter 1 ("Also Authorized Signatory" is ON). Changes here are saved for signatory only.
        </InfoAlert>
      )}

      <SectionCard title="Authorized Signatory Details" icon="✍️">
        <FormCheckbox label="Primary Authorized Signatory" value={data.is_primary} onChange={(v) => update("is_primary", v)} />
        <Grid3>
          <FormInput label="First Name" required {...f("as_name_first")} placeholder="First name" />
          <FormInput label="Middle Name" {...f("as_name_middle")} placeholder="Middle name" />
          <FormInput label="Last Name" required {...f("as_name_last")} placeholder="Last name" />
          <FormInput label="Father's First Name" {...f("as_father_first")} placeholder="Father's first" />
          <FormInput label="Father's Middle Name" {...f("as_father_middle")} placeholder="Father's middle" />
          <FormInput label="Father's Last Name" {...f("as_father_last")} placeholder="Father's last" />
        </Grid3>
        <Grid3>
          <FormInput label="Date of Birth" required type="date" {...f("as_dob")} />
          <FormInput label="Mobile (+91)" required {...f("as_mobile")} placeholder="10-digit mobile" hint="9876543210" />
          <FormInput label="Email Address" required {...f("as_email")} placeholder="email@example.com" />
        </Grid3>
        <Grid2>
          <FormInput label="Telephone (STD Code)" {...f("as_telephone")} placeholder="022-23456789" />
          <div>
            <FormRadioGroup label="Gender" value={data.radiogroup_1} onChange={(v) => update("radiogroup_1", v)}
              items={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Others", label: "Others" }]} />
          </div>
        </Grid2>
      </SectionCard>

      <SectionCard title="Signatory Identity" icon="🪪">
        <Grid3>
          <FormInput label="Designation / Status" required {...f("as_designation")} placeholder="e.g. Director" />
          <FormInput label="DIN" {...f("as_din")} placeholder="8-digit DIN" />
          <FormInput label="PAN" required {...f("as_pan")} placeholder="ABCDE1234F" />
        </Grid3>
        <Grid3>
          <div>
            <FormToggle label="Citizen / Resident of India?" value={!!data.toggle_3} onChange={(v) => update("toggle_3", v)} />
          </div>
          <FormInput label="Passport No. (Foreigners)" {...f("as_passport")} placeholder="Passport number" />
          <FormInput label="Aadhaar Number" {...f("as_aadhaar")} placeholder="12-digit Aadhaar" />
        </Grid3>
      </SectionCard>

      <SectionCard title="Signatory Residential Address" icon="🏠">
        <InfoAlert>Ensure addresses match your proof documents exactly.</InfoAlert>
        <Grid3>
          <FormSelect label="Country" value={data.as_country} onChange={(e) => update("as_country", e.target.value)} items={COUNTRIES} />
          <FormInput label="PIN Code" required {...f("as_pin")} placeholder="6-digit PIN" hint="Type 380001 for test" />
          <FormSelect label="State" {...sel("as_state")} items={stateItems}
            onChange={(e) => { update("as_state", e.target.value); update("as_district", ""); }} />
        </Grid3>
        <Grid3>
          <FormSelect label="District" {...sel("as_district")} items={districtItems} disabled={!data.as_state} />
          <FormInput label="City / Town / Village" value={data.as_city ?? ""} onChange={(e) => update("as_city", e.target.value || null)} placeholder="City" />
          <FormInput label="Locality / Sub Locality" value={data.as_locality ?? ""} onChange={(e) => update("as_locality", e.target.value || null)} placeholder="Locality" />
        </Grid3>
        <Grid3>
          <FormInput label="Road / Street" value={data.as_road ?? ""} onChange={(e) => update("as_road", e.target.value || null)} placeholder="Road or street" />
          <FormInput label="Premises / Building Name" value={data.as_premises ?? ""} onChange={(e) => update("as_premises", e.target.value || null)} placeholder="Building name" />
          <FormInput label="Building No. / Flat No." value={data.as_bno ?? ""} onChange={(e) => update("as_bno", e.target.value || null)} placeholder="Flat number" />
        </Grid3>
        <Grid2>
          <FormInput label="Floor No." value={data.as_floor ?? ""} onChange={(e) => update("as_floor", e.target.value || null)} placeholder="Floor number" />
          <FormInput label="Nearby Landmark" value={data.as_landmark ?? ""} onChange={(e) => update("as_landmark", e.target.value || null)} placeholder="Nearby landmark" />
        </Grid2>
      </SectionCard>

      <SectionCard title="Signatory Documents" icon="📎">
        <Grid3>
          <FormSelect label="Proof of Authorized Signatory" value={data.as_proof_type} onChange={(e) => update("as_proof_type", e.target.value)} items={AUTH_SIGNATORY_PROOF} />
          <div style={{ gridColumn: "span 2" }}>
            <Grid2>
              <FileInput label="Upload Proof (PDF/JPEG, max 1MB)" value={data.as_proof_file} onChange={(v) => update("as_proof_file", v)} maxKb={1024} />
              <FileInput label="Photograph (JPEG only, max 100KB)" value={data.as_photo} onChange={(v) => update("as_photo", v)} maxKb={100} forceJpeg={true} />
            </Grid2>
          </div>
        </Grid3>
      </SectionCard>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// AUTH REPRESENTATIVE SECTION  (identical logic to original Tab4)
// ─────────────────────────────────────────────────────────────
function AuthRepSection({ data, update, errors, touched, touch }) {
  const f = (name) => ({ value: data[name], error: touched[name] ? errors[name] : null, onChange: (e) => update(name, e.target.value), onBlur: () => touch(name) });

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
      <FormToggle label="Do you have any Authorized Representative?" value={!!data.toggle_4} onChange={(v) => update("toggle_4", v)} />

      {data.toggle_4 && (
        <div className="field-animate">
          <FormRadioGroup label="Type of Authorised Representative" value={data.radiogroup_2} onChange={(v) => update("radiogroup_2", v)}
            items={[{ value: "GST Practitioner", label: "GST Practitioner" }, { value: "Other", label: "Other" }]} />

          <Grid2>
            <FormInput label="Enrolment ID" value={data.enrolment_id} onChange={(e) => update("enrolment_id", e.target.value)} placeholder="e.g. TRP123456789012" disabled={isOther} />
            <div />
          </Grid2>

          <Grid3>
            <FormInput label="First Name" required {...f("rep_name_first")} placeholder="First name" disabled={isGSTP} />
            <FormInput label="Middle Name" value={data.rep_name_middle || ""} onChange={(e) => update("rep_name_middle", e.target.value)} placeholder="Middle name" disabled={isGSTP} />
            <FormInput label="Last Name" required {...f("rep_name_last")} placeholder="Last name" disabled={isGSTP} />
          </Grid3>

          <Grid3>
            <FormSelect label="Designation / Status" value={data.rep_designation} onChange={(e) => update("rep_designation", e.target.value)} items={REP_DESIGNATIONS} disabled={isGSTP} />
            <FormInput label="Mobile +91" required {...f("rep_mobile")} placeholder="10-digit mobile" disabled={isGSTP} />
            <FormInput label="Email Address" required {...f("rep_email")} placeholder="email@example.com" disabled={isGSTP} />
          </Grid3>

          <Grid3>
            <FormInput label="PAN" required {...f("rep_pan")} placeholder="ABCDE1234F" disabled={isGSTP} />
            <FormInput label="Aadhaar Number" value={data.rep_aadhaar ?? ""} onChange={(e) => update("rep_aadhaar", e.target.value || null)} placeholder="12-digit Aadhaar" disabled={isGSTP || isOther} />
            <FormInput label="Telephone (STD Code)" value={data.rep_telephone || ""} onChange={(e) => update("rep_telephone", e.target.value)} placeholder="022-23456789" disabled={isGSTP} />
          </Grid3>

          <Grid2>
            <FormInput label="FAX Number (STD Code)" value={data.rep_fax ?? ""} onChange={(e) => update("rep_fax", e.target.value || null)} placeholder="022-23456789" disabled={isGSTP} />
            <div />
          </Grid2>
        </div>
      )}
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN TAB EXPORT
// ─────────────────────────────────────────────────────────────
export default function Tab2_People(props) {
  const { data, addPromoter, removePromoter } = props;
  const ids = data.promoter_ids || [""];

  return (
    <div className="section-container animate-fade-in">

      {/* ── PART A: PROMOTERS ── */}
      <InfoAlert>
        <strong>Note:</strong> You can add multiple promoters/partners. If "Also Authorized Signatory" is selected for the first promoter, their details auto-sync to the Authorized Signatory section below.
      </InfoAlert>

      <div style={{ padding: "6px 0" }}>
        {ids.map((id, index) => (
          <PromoterForm
            key={id || "primary"}
            {...props}
            suffix={id}
            isRemoveable={index > 0}
            onRemove={() => removePromoter(id)}
          />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "20px 0", borderTop: "2px dashed #E2E8F0", marginBottom: 28 }}>
        <button type="button" onClick={addPromoter}
          style={{ padding: "12px 28px", background: "#fff", border: "2.5px solid #1B4FD8", color: "#1B4FD8", borderRadius: 12, fontSize: 13.5, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s", boxShadow: "0 4px 12px rgba(27,79,216,0.1)" }}
          onMouseOver={(e) => { e.currentTarget.style.background = "#EEF4FF"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "#fff"; }}>
          <span style={{ fontSize: 22, lineHeight: 1 }}>+</span> Add Another Promoter / Partner
        </button>
      </div>

      {/* ── PART B: AUTHORIZED SIGNATORY ── */}
      <div style={{ borderTop: "3px solid #E2E8F0", paddingTop: 20, marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#EEF4FF,#DBEAFE)", border: "2px solid #C7D9FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>✍️</div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>Details of Authorized Signatory</h2>
        </div>
        <AuthSignatorySection {...props} />
      </div>

      {/* ── PART C: AUTHORIZED REPRESENTATIVE ── */}
      <div style={{ borderTop: "3px solid #E2E8F0", paddingTop: 20, marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#EEF4FF,#DBEAFE)", border: "2px solid #C7D9FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>👔</div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>Authorized Representative</h2>
        </div>
        <AuthRepSection {...props} />
      </div>

    </div>
  );
}
