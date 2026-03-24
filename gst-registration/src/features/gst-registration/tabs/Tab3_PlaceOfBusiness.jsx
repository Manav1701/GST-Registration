import { useEffect, useState } from "react";
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
import BusinessActivityCheckboxes from "../../../components/shared/BusinessActivityCheckboxes.jsx";
import {
  GHATAK_ITEMS,
  POSSESSION_TYPES,
  PROOF_OF_PREMISES,
  REP_DESIGNATIONS,
  getStatesForCountry,
  getGstDistricts,
  GST_STATE_CODE,
  normalizeDistrict,
} from "../../../constants/dropdowns.js";

// ─────────────────────────────────────────────────────────────
// PRINCIPAL PLACE OF BUSINESS  (identical logic to original Tab5)
// ─────────────────────────────────────────────────────────────
function PrincipalPlaceSection({
  data,
  update,
  errors,
  touched,
  touch,
  fetchAddressByPin,
  onApbToggleOff,
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
  const [loadingComm, setLoadingComm] = useState(false);
  const [loadingDiv, setLoadingDiv] = useState(false);
  const [loadingRange, setLoadingRange] = useState(false);
  const [districtItems, setDistrictItems] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [ghatakItems, setGhatakItems] = useState([]);
  const [loadingGhataks, setLoadingGhataks] = useState(false);

  const fetchJurisdiction = async (endpoint) => {
    try {
      const apiBase =
        import.meta.env.VITE_API_BASE_URL ||
        "https://gst-fastapi-api-1.onrender.com";
      const res = await fetch(`${apiBase}/api/proxy/jurisdiction/${endpoint}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data?.length > 0 ? json.data : null;
    } catch (err) {
      console.error(`Error fetching jurisdiction (${endpoint}):`, err);
      return null;
    }
  };

  // Clear jurisdiction when PIN becomes invalid
  useEffect(() => {
    if (!data.ppb_pin || data.ppb_pin.length !== 6) {
      setJurisdictionData({
        commissionerates: [],
        divisions: [],
        ranges: [],
      });
    }
  }, [data.ppb_pin]);

  // PIN → address autofill + load commissionerates
  useEffect(() => {
    if (data.ppb_pin?.length === 6) {
      const load = async () => {
        setLoadingComm(true);
        const address = await fetchAddressByPin(data.ppb_pin);
        if (address) {
          const allStates = getStatesForCountry("IN");
          const matchedState = allStates.find(
            (s) => s.label.toLowerCase() === address.stateName.toLowerCase()
          );
          if (matchedState) {
            update("ppb_state", matchedState.value);
            const items = await getGstDistricts(matchedState.value);
            const found = items.find(
              (i) => i.label.toLowerCase() === address.district.toLowerCase()
            );
            update("ppb_district", found ? found.value : address.district);
            update("ppb_city", address.city);
            // Use numeric GST state code for API
            const gstCode =
              GST_STATE_CODE[matchedState.value] || matchedState.value;
            const commissionerates = await fetchJurisdiction(
              `commisionerate/${gstCode}/${data.ppb_pin}`
            );
            setJurisdictionData({
              commissionerates: commissionerates || [],
              divisions: [],
              ranges: [],
            });
            update("center_commissionerate", "");
            update("sector_circle", "");
            update("center_division", "");
            update("center_range", "");
          }
        }
        setLoadingComm(false);
      };
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.ppb_pin]);

  // Commissionerate → load divisions
  useEffect(() => {
    if (
      data.ppb_pin?.length === 6 &&
      data.ppb_state &&
      data.center_commissionerate
    ) {
      const load = async () => {
        setLoadingDiv(true);
        const gstCode = GST_STATE_CODE[data.ppb_state] || data.ppb_state;
        const divisions = await fetchJurisdiction(
          `division/${gstCode}/${data.center_commissionerate}/${data.ppb_pin}`
        );
        setJurisdictionData((prev) => ({
          ...prev,
          divisions: divisions || [],
          ranges: [],
        }));
        update("center_division", "");
        update("center_range", "");
        setLoadingDiv(false);
      };
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.center_commissionerate, data.ppb_pin, data.ppb_state]);

  // Division → load ranges
  useEffect(() => {
    if (data.ppb_pin?.length === 6 && data.ppb_state && data.center_division) {
      const load = async () => {
        setLoadingRange(true);
        const gstCode = GST_STATE_CODE[data.ppb_state] || data.ppb_state;
        const ranges = await fetchJurisdiction(
          `range/${gstCode}/${data.center_division}/${data.ppb_pin}`
        );
        setJurisdictionData((prev) => ({ ...prev, ranges: ranges || [] }));
        update("center_range", "");
        setLoadingRange(false);
      };
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.center_division, data.ppb_pin, data.ppb_state]);

  useEffect(() => {
    if (data.ppb_state) {
      const load = async () => {
        setLoadingDistricts(true);
        const items = await getGstDistricts(data.ppb_state);
        setDistrictItems(items);

        // HIGH-LEVEL NORMALIZATION
        const normalized = normalizeDistrict(data.ppb_district, items);
        if (normalized) update("ppb_district", normalized);

        setLoadingDistricts(false);
      };
      load();
    } else {
      setDistrictItems([]);
    }
  }, [data.ppb_state]);

  // State → load Sector/Circle/Ward (Ghataks)
  useEffect(() => {
    if (data.ppb_state) {
      const load = async () => {
        setLoadingGhataks(true);

        try {
          const gstCode = GST_STATE_CODE[data.ppb_state] || data.ppb_state;

          const apiBase =
            import.meta.env.VITE_API_BASE_URL ||
            "https://gst-fastapi-api-1.onrender.com";

          const res = await fetch(`${apiBase}/api/ghataks/${gstCode}`);

          if (res.ok) {
            const units = await res.json();

            if (Array.isArray(units) && units.length > 0) {
              setGhatakItems(
                units.map((u) => ({
                  value: u.c,
                  label: u.n,
                }))
              );
            } else {
              setGhatakItems([]);
            }
          } else {
            console.error("Ghatak API failed");
            setGhatakItems([]);
          }
        } catch (err) {
          console.error("Failed to fetch ghataks:", err);
          setGhatakItems([]);
        } finally {
          setLoadingGhataks(false);
        }
      };

      load();
    } else {
      setGhatakItems([]);
    }
  }, [data.ppb_state]);

  const stateItems = getStatesForCountry("IN");

  return (
    <>
      <SectionCard title="Address Details" icon="🗺️">
        <InfoAlert>
          Mandatory address validations apply. Ensure addresses match your proof
          documents exactly.
        </InfoAlert>
        <div
          style={{
            background: "#F1F5F9",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
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
        <Grid3>
          <FormInput
            label="PIN Code"
            required
            {...f("ppb_pin")}
            placeholder="6-digit PIN"
            hint="Type 380015 for live auto-fill"
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
            disabled={!data.ppb_state || loadingDistricts}
            hint={loadingDistricts ? "⏱️ Loading Codes..." : ""}
          />
        </Grid3>
        <Grid3>
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
        </Grid3>
        <Grid3>
          <FormInput
            label="Premises / Building Name"
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
        </Grid3>
        <Grid2>
          <FormInput
            label="Nearby Landmark"
            value={data.ppb_landmark}
            onChange={(e) => update("ppb_landmark", e.target.value)}
            placeholder="Nearby landmark"
          />
          <Grid2>
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
        </Grid2>
      </SectionCard>

      <SectionCard title="Jurisdiction" icon="⚖️">
        <Grid2>
          <FormSelect
            label="Sector / Circle / Ward / Charge / Unit (State)"
            required
            {...sel("sector_circle")}
            items={ghatakItems} // ✅ ONLY API DATA
            hint={
              loadingGhataks
                ? "⏳ Loading units…"
                : ghatakItems.length > 0
                ? `${ghatakItems.length} units found for state`
                : "⚠️ No units found for selected state"
            }
          />
          <FormSelect
            label="Center Jurisdiction — Commissionerate"
            required
            {...sel("center_commissionerate")}
            items={jurisdictionData.commissionerates.map((c) => ({
              value: c.c,
              label: c.n,
            }))}
            hint={
              loadingComm
                ? "⏳ Loading…"
                : jurisdictionData.commissionerates.length > 0
                ? `${jurisdictionData.commissionerates.length} commissionerates loaded`
                : data.ppb_pin?.length === 6
                ? "⚠️ No jurisdiction found for this PIN"
                : "Enter 6-digit PIN first"
            }
          />
        </Grid2>
        <Grid2>
          <FormSelect
            label="Center Jurisdiction — Division"
            required
            {...sel("center_division")}
            items={jurisdictionData.divisions.map((d) => ({
              value: d.c,
              label: d.n,
            }))}
            disabled={!data.center_commissionerate}
            hint={
              loadingDiv
                ? "⏳ Loading…"
                : jurisdictionData.divisions.length > 0
                ? `${jurisdictionData.divisions.length} divisions found`
                : data.center_commissionerate
                ? "⚠️ No divisions found"
                : "Select Commissionerate first"
            }
          />
          <FormSelect
            label="Center Jurisdiction — Range"
            required
            {...sel("center_range")}
            items={jurisdictionData.ranges.map((r) => ({
              value: r.c,
              label: r.n,
            }))}
            disabled={!data.center_division}
            hint={
              loadingRange
                ? "⏳ Loading…"
                : jurisdictionData.ranges.length > 0
                ? `${jurisdictionData.ranges.length} ranges found`
                : data.center_division
                ? "⚠️ No ranges found"
                : "Select Division first"
            }
          />
        </Grid2>
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
            label="Office Telephone (STD Code)"
            value={data.ppb_office_tel}
            onChange={(e) => update("ppb_office_tel", e.target.value)}
            placeholder="079-26543210"
          />
        </Grid2>
        <Grid2>
          <FormInput
            label="Mobile Number +91"
            value={data.ppb_mobile ?? ""}
            onChange={(e) => update("ppb_mobile", e.target.value || null)}
            placeholder="10-digit mobile"
          />
          <FormInput
            label="Office FAX (STD Code)"
            value={data.ppb_fax ?? ""}
            onChange={(e) => update("ppb_fax", e.target.value || null)}
            placeholder="079-26543211"
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
          onChange={(v) => {
            if (!v) onApbToggleOff?.();
            update("toggle_5", v);
          }}
        />
      </SectionCard>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// ADDITIONAL PLACE OF BUSINESS  (identical logic to original Tab6)
// ─────────────────────────────────────────────────────────────
function AdditionalPlaceSection({
  data,
  update,
  errors,
  touched,
  touch,
  fetchAddressByPin,
  userToggledApbOff,
  setUserToggledApbOff,
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

  useEffect(() => {
    if (data.apb_pin?.length === 6) {
      const loadAddress = async () => {
        const address = await fetchAddressByPin(data.apb_pin);
        if (address) {
          const allStates = getStatesForCountry("IN");
          const matchedState = allStates.find(
            (s) => s.label.toLowerCase() === address.stateName.toLowerCase()
          );
          if (matchedState) {
            update("apb_state", matchedState.value);
            const items = await getGstDistricts(matchedState.value);
            const found = items.find(
              (i) => i.label.toLowerCase() === address.district.toLowerCase()
            );
            update("apb_district", found ? found.value : address.district);
            update("apb_city", address.city);
          }
        }
      };
      loadAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.apb_pin]);

  const showFields = !!data.toggle_5;
  // Clear APB fields only when user deliberately turned off the toggle (not on load/draft)
  useEffect(() => {
    if (showFields) {
      setUserToggledApbOff?.(false);
    } else if (!showFields && userToggledApbOff) {
      const keysToClear = [
        "apb_count",
        "apb_pin",
        "apb_state",
        "apb_district",
        "apb_city",
        "apb_locality",
        "apb_road",
        "apb_premises",
        "apb_bno",
        "apb_floor",
        "apb_landmark",
        "apb_lat",
        "apb_long",
        "apb_email",
        "apb_mobile",
        "apb_office_tel",
        "apb_fax",
        "apb_possession_type",
        "apb_proof_doc",
        "apb_file",
      ];
      const activities = [
        "bonded_warehouse",
        "eou",
        "export",
        "factory",
        "import",
        "services",
        "leasing",
        "office",
        "recipient",
        "retail",
        "warehouse",
        "wholesale",
        "works_contract",
        "others",
        "others_specify",
      ];
      [...keysToClear, ...activities.map((a) => `apb_${a}`)].forEach((k) => {
        if (data[k] !== "" && data[k] !== null && data[k] !== false) {
          update(
            k,
            k === "apb_lat" ||
              k === "apb_long" ||
              k === "apb_fax" ||
              k === "apb_file"
              ? null
              : activities.some((a) => k === `apb_${a}`)
              ? false
              : ""
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFields, userToggledApbOff]);

  const hasNoticeError = !!errors.apb_notice;
  const stateItems = getStatesForCountry("IN");
  const [districtItems, setDistrictItems] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  useEffect(() => {
    if (data.apb_state) {
      const load = async () => {
        setLoadingDistricts(true);
        const items = await getGstDistricts(data.apb_state);
        setDistrictItems(items);

        // HIGH-LEVEL NORMALIZATION
        const normalized = normalizeDistrict(data.apb_district, items);
        if (normalized) update("apb_district", normalized);

        setLoadingDistricts(false);
      };
      load();
    } else {
      setDistrictItems([]);
    }
  }, [data.apb_state]);

  if (!showFields) {
    return (
      <SectionCard title="Additional Place Details" icon="🏬">
        <div
          style={{
            padding: "32px 20px",
            textAlign: "center",
            background: hasNoticeError ? "#FFF1F2" : "#F8FAFC",
            border: hasNoticeError ? "2px solid #F43F5E" : "1px dashed #E2E8F0",
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 22, marginBottom: 10 }}>ℹ️</div>
          <h3 style={{ color: "#1E293B", fontWeight: 700, marginBottom: 8 }}>
            Additional Places of Business Disabled
          </h3>
          <p
            style={{
              color: "#64748B",
              fontSize: 13,
              maxWidth: 400,
              margin: "0 auto",
            }}
          >
            Enable <b>"Have Additional Place of Business?"</b> in the Principal
            Place section above to fill this section.
          </p>
          {hasNoticeError && (
            <div
              style={{
                marginTop: 14,
                color: "#E11D48",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              ⚠️ You cannot proceed without enabling this or going back.
            </div>
          )}
        </div>
      </SectionCard>
    );
  }

  return (
    <>
      <SectionCard title="Additional Place Details" icon="🏬">
        <Grid2>
          <FormInput
            label="Number of additional places"
            {...f("apb_count")}
            placeholder="Enter number"
          />
          <div />
        </Grid2>
      </SectionCard>

      <SectionCard title="Additional Place Address" icon="🗺️">
        <InfoAlert>
          Mandatory address validations apply. Ensure addresses match your proof
          documents.
        </InfoAlert>
        <div
          style={{
            background: "#F1F5F9",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
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
              update("apb_lat", "23.0225");
              update("apb_long", "72.5714");
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
        <Grid3>
          <FormInput
            label="PIN Code"
            value={data.apb_pin}
            onChange={(e) => update("apb_pin", e.target.value)}
            placeholder="6-digit PIN"
            hint="Type 380015 for live auto-fill"
          />
          <FormSelect
            label="State"
            {...sel("apb_state")}
            items={stateItems}
            onChange={(e) => {
              update("apb_state", e.target.value);
              update("apb_district", "");
            }}
          />
          <FormSelect
            label="District"
            {...sel("apb_district")}
            items={districtItems}
            disabled={!data.apb_state || loadingDistricts}
            hint={loadingDistricts ? "⏱️ Loading Codes..." : ""}
          />
        </Grid3>
        <Grid3>
          <FormInput
            label="City / Town / Village"
            value={data.apb_city ?? ""}
            onChange={(e) => update("apb_city", e.target.value || null)}
            placeholder="City"
          />
          <FormInput
            label="Locality / Sub Locality"
            value={data.apb_locality}
            onChange={(e) => update("apb_locality", e.target.value)}
            placeholder="Locality"
          />
          <FormInput
            label="Road / Street"
            value={data.apb_road}
            onChange={(e) => update("apb_road", e.target.value)}
            placeholder="Road"
          />
        </Grid3>
        <Grid3>
          <FormInput
            label="Premises / Building Name"
            value={data.apb_premises}
            onChange={(e) => update("apb_premises", e.target.value)}
            placeholder="Building name"
          />
          <FormInput
            label="Building No. / Flat No."
            value={data.apb_bno}
            onChange={(e) => update("apb_bno", e.target.value)}
            placeholder="Flat number"
          />
          <FormInput
            label="Floor No."
            value={data.apb_floor}
            onChange={(e) => update("apb_floor", e.target.value)}
            placeholder="Floor"
          />
        </Grid3>
        <Grid2>
          <FormInput
            label="Nearby Landmark"
            value={data.apb_landmark}
            onChange={(e) => update("apb_landmark", e.target.value)}
            placeholder="Landmark"
          />
          <Grid2>
            <FormInput
              label="Latitude"
              value={data.apb_lat ?? ""}
              onChange={(e) => update("apb_lat", e.target.value || null)}
              placeholder="23.0225"
            />
            <FormInput
              label="Longitude"
              value={data.apb_long ?? ""}
              onChange={(e) => update("apb_long", e.target.value || null)}
              placeholder="72.5714"
            />
          </Grid2>
        </Grid2>
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
              update("apb_email", data.ppb_email);
              update("apb_mobile", data.ppb_mobile);
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
            📋 Copy from Principal Place
          </button>
        </div>
        <Grid2>
          <FormInput
            label="Office Email Address"
            value={data.apb_email}
            onChange={(e) => update("apb_email", e.target.value)}
            placeholder="office@example.com"
          />
          <FormInput
            label="Office Telephone (STD Code)"
            value={data.apb_office_tel}
            onChange={(e) => update("apb_office_tel", e.target.value)}
            placeholder="02766-222333"
          />
        </Grid2>
        <Grid2>
          <FormInput
            label="Mobile Number +91"
            value={data.apb_mobile}
            onChange={(e) => update("apb_mobile", e.target.value)}
            placeholder="10-digit mobile"
          />
          <FormInput
            label="FAX Number (STD Code)"
            value={data.apb_fax ?? ""}
            onChange={(e) => update("apb_fax", e.target.value || null)}
            placeholder="FAX number"
          />
        </Grid2>
      </SectionCard>

      <SectionCard title="Nature of Possession" icon="🔑">
        <Grid2>
          <FormSelect
            label="Nature of possession"
            {...sel("apb_possession_type")}
            items={POSSESSION_TYPES}
            onChange={(e) => {
              update("apb_possession_type", e.target.value);
              update("apb_proof_doc", "");
            }}
          />
          <FormSelect
            label="Proof of Additional Place"
            {...sel("apb_proof_doc")}
            items={PROOF_OF_PREMISES.filter((p) => {
              if (data.apb_possession_type === "REN")
                return ["RLAT", "RNOC", "ELCB"].includes(p.value);
              if (data.apb_possession_type === "OWN")
                return ["LOWN", "TAXR", "CMUK", "ELCB"].includes(p.value);
              if (data.apb_possession_type === "CON")
                return ["CNLR", "ELCB"].includes(p.value);
              return true;
            })}
            disabled={!data.apb_possession_type}
            hint={
              !data.apb_possession_type
                ? "Select possession type first"
                : "Suggested based on possession"
            }
          />
        </Grid2>
        <FileInput
          label="Upload Document (PDF/JPEG, max 1MB)"
          value={data.apb_file}
          onChange={(v) => update("apb_file", v)}
          maxKb={1024}
        />
      </SectionCard>

      <SectionCard title="Nature of Business Activity" icon="💼">
        <InfoAlert>
          In case you need to upload multiple documents, please append all to a
          single file before uploading.
        </InfoAlert>
        <BusinessActivityCheckboxes data={data} update={update} prefix="apb_" />
      </SectionCard>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN TAB EXPORT
// ─────────────────────────────────────────────────────────────
export default function Tab3_PlaceOfBusiness(props) {
  const [userToggledApbOff, setUserToggledApbOff] = useState(false);

  return (
    <div className="section-container animate-fade-in">
      {/* ── PART A: PRINCIPAL PLACE ── */}
      <div style={{ marginBottom: 4 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "linear-gradient(135deg,#EEF4FF,#DBEAFE)",
              border: "2px solid #C7D9FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
            }}
          >
            🗺️
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>
            Principal Place of Business
          </h2>
        </div>
        <PrincipalPlaceSection
          {...props}
          onApbToggleOff={() => setUserToggledApbOff(true)}
        />
      </div>

      {/* ── PART B: ADDITIONAL PLACE ── */}
      <div
        style={{ borderTop: "3px solid #E2E8F0", paddingTop: 20, marginTop: 8 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "linear-gradient(135deg,#EEF4FF,#DBEAFE)",
              border: "2px solid #C7D9FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
            }}
          >
            🏬
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>
            Additional Place of Business
          </h2>
        </div>
        <AdditionalPlaceSection
          {...props}
          userToggledApbOff={userToggledApbOff}
          setUserToggledApbOff={setUserToggledApbOff}
        />
      </div>
    </div>
  );
}
