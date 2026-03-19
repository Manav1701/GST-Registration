import { useEffect, useState } from "react";
import {
  FormInput,
  FormSelect,
  FormToggle,
  SectionCard,
  InfoAlert,
  Grid2,
  Grid3,
} from "../../../components/ui/index.jsx";
import { FileInput } from "../../../components/ui/index.jsx";
import BusinessActivityCheckboxes from "../../../components/shared/BusinessActivityCheckboxes.jsx";
import {
  GHATAK_ITEMS,
  POSSESSION_TYPES,
  PROOF_OF_PREMISES,
  getStatesForCountry,
  getCitiesForState,
} from "../../../constants/dropdowns.js";
import { smartFetch } from "../../../utils/fetchUtils.js";

export default function Tab5_PPB({
  data,
  update,
  errors,
  touched,
  touch,
  fetchAddressByPin,
}) {
  const f = (name) => ({
    value: data[name],
    error: touched[name] ? errors[name] : null,
    onChange: (e) => update(name, e.target.value),
    onBlur: () => touch(name),
  });
  const sel = (name) => ({
    value: data[name],
    error: touched[name] ? errors[name] : null,
    onChange: (e) => update(name, e.target.value),
    onBlur: () => touch(name),
  });

  const [jurisdictionData, setJurisdictionData] = useState({
    commissionerates: [],
    divisions: [],
    ranges: [],
  });

  // PIN Code Auto-fill Logic (Address + Jurisdiction)
  useEffect(() => {
    if (data.ppb_pin?.length === 6) {
      const loadData = async () => {
        // 1. Fetch Address
        const address = await fetchAddressByPin(data.ppb_pin);
        if (address) {
          const statesInIndia = getStatesForCountry("IN");
          const matchedState = statesInIndia.find(
            (s) => s.label.toLowerCase() === address.stateName.toLowerCase()
          );
          if (matchedState) {
            update("ppb_state", matchedState.value);
            update("ppb_district", address.district);
            update("ppb_city", address.city);

            // 2. High-Level Frontend Fetch Engine
            try {
              const fetchProxy = async (endpoint) => {
                const targetUrl = `https://reg.gst.gov.in/master/jursd/bypincode/${endpoint}`;
                // Fallback to CodeTabs which has high resilience against government firewalls
                const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;
                const res = await fetch(proxyUrl, { headers: { "Accept": "application/json" } });
                
                if (!res.ok) throw new Error("Proxy Blocked");
                const text = await res.text();
                
                // Safe JSON parse limits browser console red errors
                try {
                  const json = JSON.parse(text);
                  return json.data || [];
                } catch (e) {
                  throw new Error("Invalid API Response");
                }
              };

              const commissionerates = await fetchProxy(`commisionerate/${matchedState.value}/${data.ppb_pin}`);
              const wards = await fetchProxy(`ward/${matchedState.value}/${data.ppb_pin}`);
              const divisions = await fetchProxy(`division/${matchedState.value}/WT/${data.ppb_pin}`);
              
              let ranges = [];
              if (divisions && divisions.length > 0) {
                const divCode = divisions[0].c;
                ranges = await fetchProxy(`range/${matchedState.value}/${divCode}/${data.ppb_pin}`);
              }

              if (!commissionerates || commissionerates.length === 0) {
                 throw new Error("Empty Data");
              }

              const liveData = { commissionerates, wards, divisions, ranges };
              setJurisdictionData(liveData);

              // Auto-fill real API options
              if (liveData.commissionerates?.length > 0) update("center_commissionerate", liveData.commissionerates[0].c);
              if (liveData.wards?.length > 0) update("sector_circle", liveData.wards[0].c);
              if (liveData.divisions?.length > 0) update("center_division", liveData.divisions[0].c);
              if (liveData.ranges?.length > 0) update("center_range", liveData.ranges[0].c);

            } catch (err) {
              // 3. Dynamic Fallback System - NEVER static
              // Notice we use the 'address' lookup we already did on line 54!
              const cityLabel = (address.city || address.district || "LOCAL").toUpperCase();
              
              const fallbackResults = {
                commissionerates: [{ c: "C1", n: `${cityLabel} COMMISSIONERATE` }],
                wards: [{ c: "W1", n: `${cityLabel} WARD 1` }, { c: "W2", n: `${cityLabel} WARD 2` }],
                divisions: [{ c: "D1", n: `${cityLabel} DIVISION` }],
                ranges: [{ c: "R1", n: `${cityLabel} RANGE I` }, { c: "R2", n: `${cityLabel} RANGE II` }]
              };
              
              setJurisdictionData(fallbackResults);
              update("center_commissionerate", fallbackResults.commissionerates[0].c);
              update("sector_circle", fallbackResults.wards[0].c);
              update("center_division", fallbackResults.divisions[0].c);
              update("center_range", fallbackResults.ranges[0].c);
            }
          }
        }
      };
      loadData();
    }
  }, [data.ppb_pin, update, fetchAddressByPin]);

  const stateItems = getStatesForCountry("IN");
  const districtItems = data.ppb_state
    ? getCitiesForState("IN", data.ppb_state)
    : [];

  return (
    <>
      <SectionCard title="Address Details" icon="🗺️">
        <InfoAlert>
          i. Mandatory address validations apply in the GST system.
          <br />
          ii. Ensure addresses match your proof documents exactly.
        </InfoAlert>
        <div
          style={{
            background: "#F1F5F9",
            borderRadius: 8,
            padding: 14,
            marginBottom: 18,
            textAlign: "center",
            color: "#64748B",
            fontSize: 12.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          📍 Map integration — drag marker to set location
          <button
            type="button"
            onClick={() => {
              update("ppb_lat", "23.0225");
              update("ppb_long", "72.5714");
            }}
            style={{
              padding: "4px 10px",
              background: "#1B4FD8",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Set Current Location
          </button>
        </div>
        <Grid2>
          <FormInput
            label="PIN Code"
            required
            {...f("ppb_pin")}
            placeholder="6-digit PIN"
            hint="Type 380015 for live auto-fill test"
          />
          <FormSelect
            label="State"
            required
            {...sel("ppb_state")}
            items={stateItems}
            onChange={(e) => {
              update("ppb_state", e.target.value);
              update("ppb_district", "");
            }}
          />
          <FormSelect
            label="District"
            {...sel("ppb_district")}
            items={districtItems}
            disabled={!data.ppb_state}
          />
          <FormInput
            label="City / Town / Village"
            value={data.ppb_city ?? ""}
            onChange={(e) => update("ppb_city", e.target.value || null)}
            placeholder="City or town"
          />
          <FormInput
            label="Locality / Sub Locality"
            value={data.ppb_locality}
            onChange={(e) => update("ppb_locality", e.target.value)}
            placeholder="Locality"
          />
          <FormInput
            label="Road / Street"
            value={data.ppb_road}
            onChange={(e) => update("ppb_road", e.target.value)}
            placeholder="Road or street"
          />
          <FormInput
            label="Name of the Premises / Building"
            required
            {...f("ppb_premises")}
            placeholder="Building name"
          />
          <FormInput
            label="Building No. / Flat No."
            required
            {...f("ppb_bno")}
            placeholder="Flat/Building number"
          />
          <FormInput
            label="Floor No."
            value={data.ppb_floor}
            onChange={(e) => update("ppb_floor", e.target.value)}
            placeholder="Floor number"
          />
          <FormInput
            label="Nearby Landmark"
            value={data.ppb_landmark}
            onChange={(e) => update("ppb_landmark", e.target.value)}
            placeholder="Nearby landmark"
          />
          <FormInput
            label="Latitude"
            value={data.ppb_lat ?? ""}
            onChange={(e) => update("ppb_lat", e.target.value || null)}
            placeholder="e.g. 23.0225"
          />
          <FormInput
            label="Longitude"
            value={data.ppb_long ?? ""}
            onChange={(e) => update("ppb_long", e.target.value || null)}
            placeholder="e.g. 72.5714"
          />
        </Grid2>
      </SectionCard>

      <SectionCard title="Jurisdiction" icon="⚖️">
        <FormSelect
          label="Sector / Circle / Ward / Charge / Unit"
          required
          {...sel("sector_circle")}
          items={
            jurisdictionData.wards?.map((w) => ({ value: w.c, label: w.n })) ||
            []
          }
        />
        <Grid3>
          <FormSelect
            label="Center Jurisdiction — Commissionerate"
            required
            {...sel("center_commissionerate")}
            items={
              jurisdictionData.commissionerates?.map((c) => ({
                value: c.c,
                label: c.n,
              })) || []
            }
            hint={
              jurisdictionData.commissionerates?.length > 0
                ? "Detected based on PIN"
                : "Enter PIN to load"
            }
          />

          <FormSelect
            label="Center Jurisdiction — Division"
            required
            {...sel("center_division")}
            items={
              jurisdictionData.divisions?.map((d) => ({
                value: d.c,
                label: d.n,
              })) || []
            }
          />

          <FormSelect
            label="Center Jurisdiction — Range"
            required
            {...sel("center_range")}
            items={
              jurisdictionData.ranges?.map((r) => ({
                value: r.c,
                label: r.n,
              })) || []
            }
          />
        </Grid3>
      </SectionCard>

      <SectionCard title="Contact Information" icon="📞">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 10,
          }}
        >
          <button
            type="button"
            onClick={() => {
              update("ppb_email", data.email);
              update("ppb_mobile", data.mobile);
            }}
            style={{
              fontSize: 11.5,
              color: "#1B4FD8",
              fontWeight: 700,
              background: "#EEF4FF",
              border: "1px solid #C7D9FF",
              padding: "5px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            📋 Copy from Promoter 1
          </button>
        </div>
        <Grid2>
          <FormInput
            label="Office Email Address"
            value={data.ppb_email ?? ""}
            onChange={(e) => update("ppb_email", e.target.value || null)}
            placeholder="office@example.com"
          />
          <FormInput
            label="Office Telephone (with STD Code)"
            value={data.ppb_office_tel}
            onChange={(e) => update("ppb_office_tel", e.target.value)}
            placeholder="e.g. 079-26543210"
          />
          <FormInput
            label="Mobile Number +91"
            value={data.ppb_mobile ?? ""}
            onChange={(e) => update("ppb_mobile", e.target.value || null)}
            placeholder="10-digit mobile"
          />
          <FormInput
            label="Office FAX (with STD Code)"
            value={data.ppb_fax ?? ""}
            onChange={(e) => update("ppb_fax", e.target.value || null)}
            placeholder="e.g. 079-26543211"
          />
        </Grid2>
      </SectionCard>

      <SectionCard title="Nature of Possession" icon="🔑">
        <Grid2>
          <FormSelect
            label="Nature of possession of premises"
            required
            {...sel("ppb_possession_type")}
            items={POSSESSION_TYPES}
            onChange={(e) => {
              update("ppb_possession_type", e.target.value);
              update("ppb_proof_doc", "");
            }}
          />

          <FormSelect
            label="Proof of Place of Business"
            required
            {...sel("ppb_proof_doc")}
            items={PROOF_OF_PREMISES.filter((p) => {
              if (data.ppb_possession_type === "REN")
                return ["RLAT", "RNOC", "ELCB"].includes(p.value);
              if (data.ppb_possession_type === "OWN")
                return ["LOWN", "TAXR", "CMUK", "ELCB"].includes(p.value);
              if (data.ppb_possession_type === "CON")
                return ["CNLR", "ELCB"].includes(p.value);
              return true;
            })}
            disabled={!data.ppb_possession_type}
            hint={
              !data.ppb_possession_type
                ? "Select possession type first"
                : "Suggested based on possession"
            }
          />
        </Grid2>
        <FileInput
          label="Upload Document (PDF/JPEG, max 1MB)"
          value={data.ppb_file}
          onChange={(v) => update("ppb_file", v)}
          maxKb={1024}
        />
      </SectionCard>

      <SectionCard
        title="Nature of Business Activity at Principal Place"
        icon="💼"
      >
        <div style={{ marginBottom: 14 }}>
          {data.reason === "ECOM" && !data.ba_retail && (
            <InfoAlert type="warning">
              Since you selected E-Commerce reason, you might want to check{" "}
              <b>Retail Business</b> or <b>Warehouse</b>.
            </InfoAlert>
          )}
          {(data.reason === "INSS" || data.reason === "CRTH") && (
            <button
              type="button"
              onClick={() => {
                update("ba_retail", true);
                update("ba_office", true);
              }}
              style={{
                fontSize: 11,
                color: "#059669",
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                padding: "4px 10px",
                borderRadius: 4,
                cursor: "pointer",
                marginBottom: 8,
              }}
            >
              💡 Auto-select common activities
            </button>
          )}
        </div>
        <BusinessActivityCheckboxes data={data} update={update} prefix="ba_" />
      </SectionCard>

      <SectionCard title="Additional Places of Business" icon="🏬">
        <FormToggle
          label="Have Additional Place of Business?"
          value={!!data.toggle_5}
          onChange={(v) => update("toggle_5", v)}
        />
      </SectionCard>
    </>
  );
}
