import { useEffect } from "react";
import {
  FormInput,
  FormSelect,
  FormToggle,
  FormRadioGroup,
  SectionCard,
  InfoAlert,
  Grid2,
  Grid3,
} from "../../../components/ui/index.jsx";
import { FileInput } from "../../../components/ui/index.jsx";
import {
  COUNTRIES,
  getStatesForCountry,
  getCitiesForState,
} from "../../../constants/dropdowns.js";

function PromoterForm({
  data,
  update,
  errors,
  touched,
  touch,
  suffix = "",
  fetchAddressByPin,
  onRemove,
  isRemoveable,
}) {
  const s = (n) => (suffix ? `${n}${suffix}` : n);
  const genderKey = suffix === "" ? "radiogroup" : `radiogroup_1${suffix}`;
  const f = (name) => ({
    value: data[s(name)],
    error: touched[s(name)] ? errors[s(name)] : null,
    onChange: (e) => update(s(name), e.target.value),
    onBlur: () => touch(s(name)),
  });
  const sel = (name) => ({
    value: data[s(name)],
    error: touched[s(name)] ? errors[s(name)] : null,
    onChange: (e) => update(s(name), e.target.value),
    onBlur: () => touch(s(name)),
  });

  const isAlsoSignatoryField = s("Also Authorized Signatory");
  const isAlsoSignatory = !!data[isAlsoSignatoryField];

  const countryCode = data[s("country")] || "IN";
  const stateCode = data[s("state_res")];

  const stateItems = getStatesForCountry(countryCode);
  const districtItems = stateCode
    ? getCitiesForState(countryCode, stateCode)
    : [];

  // PIN Code Auto-fill Logic
  useEffect(() => {
    const pin = data[s("pin_code")];
    if (pin?.length === 6 && countryCode === "IN") {
      const loadAddress = async () => {
        try {
          const address = await fetchAddressByPin(pin);
          if (address && address.stateName) {
            // Find state code by comparing label
            const matchedState = stateItems.find(
              (sItem) =>
                sItem.label.toLowerCase().trim() ===
                address.stateName.toLowerCase().trim()
            );

            if (matchedState) {
              update(s("state_res"), matchedState.value);
              // Wait for state to update, then set district
              setTimeout(() => {
                update(s("district_res"), address.district);
                update(s("city_res"), address.city);
              }, 50);
            }
          }
        } catch (err) {
          console.error("PIN Fetch Error:", err);
        }
      };
      loadAddress();
    }
  }, [data[s("pin_code")], countryCode]);

  // 🎯 CITIZENSHIP -> COUNTRY SYNC
  useEffect(() => {
    if (data[s("toggle_2")] === true) {
      if (!data[s("country")]) update(s("country"), "IN");
    } else if (data[s("toggle_2")] === false) {
      if (data[s("country")] === "IN") update(s("country"), "");
    }
  }, [data[s("toggle_2")]]);

  // REAL-TIME SYNC: Syncs Promoter 1 to Authorized Signatory section (Page 4)
  useEffect(() => {
    if (suffix !== "") return; // Only sync for Primary Promoter

    const mappings = {};
    if (isAlsoSignatory) {
      mappings.as_name_first = data[s("name_first")];
      mappings.as_name_middle = data[s("name_middle")];
      mappings.as_name_last = data[s("name_last")];
      mappings.as_father_first = data[s("father_first")];
      mappings.as_father_middle = data[s("father_middle")];
      mappings.as_father_last = data[s("father_last")];
      mappings.as_dob = data[s("dob")];
      mappings.as_mobile = data[s("mobile")];
      mappings.as_email = data[s("email")];
      mappings.as_telephone = data[s("telephone")];
      mappings.radiogroup_1 = data[s("radiogroup")]; // Corrected mapping for Promoter 1 -> Signatory
      mappings.as_designation = data[s("designation")];
      mappings.as_din = data[s("din")];
      mappings.as_pan = data[s("pan_proprietor")];
      mappings.toggle_3 = !!data[s("toggle_2")];
      mappings.as_passport = data[s("passport")];
      mappings.as_aadhaar = data[s("aadhaar")];
      mappings.as_country = data[s("country")];
      mappings.as_pin = data[s("pin_code")];
      mappings.as_state = data[s("state_res")];
      mappings.as_district = data[s("district_res")];
      mappings.as_city = data[s("city_res")];
      mappings.as_locality = data[s("locality")];
      mappings.as_road = data[s("road_street_res")];
      mappings.as_premises = data[s("premises_name")];
      mappings.as_bno = data[s("building_no_res")];
      mappings.as_floor = data[s("floor_no_res")];
      mappings.as_landmark = data[s("landmark_res")];
      mappings.as_photo = data[s("photo")];
      mappings.is_primary = true;
    }

    Object.entries(mappings).forEach(([targetKey, newValue]) => {
      if (data[targetKey] !== newValue) update(targetKey, newValue);
    });
  }, [
    isAlsoSignatory,
    suffix,
    data[s("name_first")],
    data[s("name_middle")],
    data[s("name_last")],
    data[s("father_first")],
    data[s("father_middle")],
    data[s("father_last")],
    data[s("dob")],
    data[s("mobile")],
    data[s("email")],
    data[s("telephone")],
    data[genderKey],
    data[s("designation")],
    data[s("din")],
    data[s("pan_proprietor")],
    data[s("toggle_2")],
    data[s("passport")],
    data[s("aadhaar")],
    data[s("country")],
    data[s("pin_code")],
    data[s("state_res")],
    data[s("district_res")],
    data[s("city_res")],
    data[s("locality")],
    data[s("road_street_res")],
    data[s("premises_name")],
    data[s("building_no_res")],
    data[s("floor_no_res")],
    data[s("landmark_res")],
    data[s("photo")],
  ]);

  const pNum = suffix ? suffix.replace("_", "") : "1";

  return (
    <div
      style={{
        marginBottom: 40,
        borderLeft: "4px solid #1B4FD8",
        paddingLeft: 24,
        paddingBottom: 10,
      }}
    >
      {/* Promoter Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#1B4FD8",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#1B4FD8",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            {pNum}
          </span>
          Promoter / Partner Details
        </h3>
        {isRemoveable && (
          <button
            type="button"
            onClick={onRemove}
            style={{
              padding: "6px 12px",
              background: "#FEE2E2",
              color: "#DC2626",
              border: "1px solid #FECACA",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#FCA5A5")}
            onMouseOut={(e) => (e.target.style.background = "#FEE2E2")}
          >
            ✕ Remove Promoter
          </button>
        )}
      </div>

      {suffix === "" && isAlsoSignatory && (
        <div
          style={{
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: 12,
            padding: "12px 18px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#10B981",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            ✓
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#065F46" }}>
            <strong>Auto-Sync Enabled:</strong> This promoter's details are
            being synced to the Authorized Signatory section.
          </span>
        </div>
      )}

      <SectionCard title="Personal Information" icon="👤">
        <Grid3>
          <FormInput
            label="First Name"
            required
            {...f("name_first")}
            placeholder="First name"
          />
          <FormInput
            label="Middle Name"
            {...f("name_middle")}
            placeholder="Middle name"
          />
          <FormInput
            label="Last Name"
            required
            {...f("name_last")}
            placeholder="Last name"
          />
          <FormInput
            label="Father's First Name"
            {...f("father_first")}
            placeholder="Father's first name"
          />
          <FormInput
            label="Father's Middle Name"
            {...f("father_middle")}
            placeholder="Father's middle name"
          />
          <FormInput
            label="Father's Last Name"
            {...f("father_last")}
            placeholder="Father's last name"
          />
        </Grid3>
        <Grid2>
          <FormInput label="Date of Birth" required type="date" {...f("dob")} />
          <FormInput
            label="Mobile Number (+91)"
            required
            {...f("mobile")}
            placeholder="10-digit mobile number"
            hint="Format: 9876543210"
          />
          <FormInput
            label="Email Address"
            required
            {...f("email")}
            placeholder="email@example.com"
          />
          <FormInput
            label="Telephone Number (with STD Code)"
            {...f("telephone")}
            placeholder="e.g. 022-23456789"
          />
        </Grid2>
        <FormRadioGroup
          label="Gender"
          value={data[genderKey]}
          onChange={(v) => update(genderKey, v)}
          items={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Others", label: "Others" },
          ]}
        />
      </SectionCard>

      <SectionCard title="Identity Information" icon="🪪">
        <Grid2>
          <FormInput
            label="Designation / Status"
            required
            {...f("designation")}
            placeholder="e.g. Director, Partner"
          />
          <FormInput
            label="Director Identification Number (DIN)"
            {...f("din")}
            placeholder="8-digit DIN"
            hint="Format: 12345678"
          />
        </Grid2>
        <FormToggle
          label="Are you a citizen of India?"
          value={!!data[s("toggle_2")]}
          onChange={(v) => update(s("toggle_2"), v)}
        />
        <Grid2>
          <FormInput
            label="PAN"
            required
            {...f("pan_proprietor")}
            placeholder="ABCDE1234F"
          />
          <FormInput
            label="Passport Number"
            {...f("passport")}
            placeholder="Foreigners only"
          />
          <FormInput
            label="Aadhaar Number"
            {...f("aadhaar")}
            placeholder="12-digit Aadhaar"
          />
        </Grid2>
      </SectionCard>

      <SectionCard title="Residential Address" icon="🏠">
        <Grid2>
          <FormSelect
            label="Country"
            required
            {...sel("country")}
            items={COUNTRIES}
          />
          <FormInput
            label="PIN Code"
            required
            {...f("pin_code")}
            placeholder="6-digit PIN"
          />
          <FormSelect
            label="State"
            required
            {...sel("state_res")}
            items={stateItems}
            onChange={(e) => {
              update(s("state_res"), e.target.value);
              update(s("district_res"), "");
            }}
          />
          <FormSelect
            label="District"
            required
            {...sel("district_res")}
            items={districtItems}
            disabled={!data[s("state_res")]}
          />
          <FormInput
            label="City / Town / Village"
            required
            {...f("city_res")}
            placeholder="City or town"
          />
          <FormInput
            label="Locality"
            {...f("locality")}
            placeholder="Locality"
          />
          <FormInput
            label="Road / Street"
            required
            {...f("road_street_res")}
            placeholder="Road or street"
          />
          <FormInput
            label="Building Name"
            {...f("premises_name")}
            placeholder="Building name"
          />
          <FormInput
            label="Building No."
            required
            {...f("building_no_res")}
            placeholder="Building number"
          />
          <FormInput
            label="Floor No."
            {...f("floor_no_res")}
            placeholder="Floor number"
          />
          <FormInput
            label="Landmark"
            {...f("landmark_res")}
            placeholder="Nearby landmark"
          />
        </Grid2>
      </SectionCard>

      <SectionCard title="Uploads" icon="📎">
        <FileInput
          label="Photo (JPEG, max 100KB)"
          value={data[s("photo")]}
          onChange={(v) => update(s("photo"), v)}
          maxKb={100}
          forceJpeg={true}
        />
        <FormToggle
          label="Also Authorized Signatory"
          value={isAlsoSignatory}
          onChange={(v) => update(isAlsoSignatoryField, v)}
        />
      </SectionCard>
    </div>
  );
}

export default function Tab1_Promoter(props) {
  const { data, addPromoter, removePromoter } = props;
  const ids = data.promoter_ids || [""];

  return (
    <div className="section-container animate-fade-in">
      <InfoAlert>
        <strong>Note:</strong> You can add multiple promoters/partners. If 'Also
        Authorized Signatory' is selected for the first promoter, their details
        will automatically sync to that section.
      </InfoAlert>

      <div style={{ padding: "10px 0" }}>
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "30px 0",
          borderTop: "2px dashed #E2E8F0",
          marginTop: 20,
        }}
      >
        <button
          type="button"
          onClick={addPromoter}
          style={{
            padding: "14px 32px",
            background: "#fff",
            border: "2.5px solid #1B4FD8",
            color: "#1B4FD8",
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 12,
            transition: "all 0.2s",
            boxShadow: "0 4px 12px rgba(27,79,216,0.1)",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#EEF4FF";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#fff";
            e.target.style.transform = "none";
          }}
        >
          <span style={{ fontSize: 24, lineHeight: 1 }}>+</span> Add Another
          Promoter / Partner
        </button>
      </div>
    </div>
  );
}
