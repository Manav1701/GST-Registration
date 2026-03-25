import { smartFetch } from "../utils/fetchUtils.js";
import ENDPOINTS from "./endpoints.js";
import { toBackendDate } from "../utils/dateUtils.js";
import { INDIAN_STATES, COUNTRIES } from "../constants/dropdowns.js";

const getStateName = (code) => {
  return (
    INDIAN_STATES.find(
      (s) =>
        s.label.toLowerCase() === String(code).toLowerCase() || s.value === code
    )?.label || code
  );
};

const getCountryName = (code) => {
  if (!code) return "India";
  if (code === "IN" || code === "IND") return "India";
  return COUNTRIES.find((c) => c.value === code)?.label || code;
};

export const getSubmissions = async () => {
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    "https://gst-fastapi-api-1.onrender.com";
  const url = `${apiBase}${ENDPOINTS.SUBMISSIONS}`;
  return await smartFetch(url, {
    useProxy: false, // Turned off proxy because allorigins.win is failing/blocking localhost
    retries: 2,
    backoff: 2000,
    defaultData: [],
  });
};

export const getSubmission = async (id) => {
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    "https://gst-fastapi-api-1.onrender.com";
  const url = `${apiBase}${ENDPOINTS.SUBMISSIONS}/${id}`;
  try {
    return await smartFetch(url, { useProxy: false });
  } catch (e) {
    throw e;
  }
};

export const submitGSTForm = async (formData, contactInfo) => {
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    "https://gst-fastapi-api-1.onrender.com";

  const response = await fetch(`${apiBase}${ENDPOINTS.SUBMISSIONS}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      form_key: "gst_registration",
      form_data: buildPayload(formData, contactInfo),
    }),
  });

  const result = await response.json();
  return result;
};

export const updateGSTForm = async (id, formData, contactInfo) => {
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    "https://gst-fastapi-api-1.onrender.com";

  if (!id || isNaN(Number(id))) {
    return submitGSTForm(formData, contactInfo);
  }

  const response = await fetch(`${apiBase}${ENDPOINTS.SUBMISSIONS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      form_key: "gst_registration",
      form_data: buildPayload(formData, contactInfo),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Update failed (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  return result;
};

export const extractDocument = async (docType, fileBase64, mimeType) => {
  return { extracted: {}, confidence: 0 };
};

function buildPayload(f, contact) {
  const payload = {
    // ==== BUSINESS DETAILS ====
    legal_name: f.legal_name || "",
    pan: f.pan || "",
    pan_date: toBackendDate(f.pan_date),
    "Constitution of Business": f["Constitution of Business"] || "",
    trade_name: f.trade_name || "",
    state: getStateName(f.state) || "",
    District: (f.District || f.district_fixed || "").substring(0, 5).toUpperCase(),
    district_fixed: (f.district_fixed || f.District || "").substring(0, 5).toUpperCase(),
    toggle: !!f.toggle,
    toggle_1: !!f.toggle_1,
    radioBlocks: f.radioBlocks ?? null,
    text: f.text || null,
    reason: f.reason || "", // ← was missing
    registration_type: f.registration_type || "Regular",
    commencement_date: toBackendDate(f.commencement_date),
    commencement_date_1: toBackendDate(f.commencement_date_1), // ← was missing
    liability_date: toBackendDate(f.commencement_date_1), // alias for backend
    is_casual: !!f.is_casual,
    existing_registrations_list: f.existing_registrations_list || [],
    file: f.file || null,
    proof_of_constitution: f.proof_of_constitution || "",
    constitution_document: f.constitution_document || null,

    // ==== PROMOTER 1 DETAILS ====
    name_first: f.name_first || "",
    name_middle: f.name_middle || "",
    name_last: f.name_last || "",
    father_first: f.father_first || "",
    father_middle: f.father_middle || "",
    father_last: f.father_last || "",
    dob: toBackendDate(f.dob),
    mobile: f.mobile || "",
    email: f.email || "",
    telephone: f.telephone || "",
    radiogroup: f.radiogroup || null,
    designation: f.designation || "",
    din: f.din || "",
    toggle_2: !!f.toggle_2,
    pan_proprietor: f.pan_proprietor || "",
    passport: f.passport || null,
    aadhaar: f.aadhaar || null,
    country: getCountryName(f.country),
    pin_code: f.pin_code || "",
    state_res: getStateName(f.state_res),
    district_res: (f.district_res || "").substring(0, 5).toUpperCase(),
    city_res: f.city_res || "",
    locality: f.locality || "",
    road_street_res: f.road_street_res || "",
    premises_name: f.premises_name || "",
    building_no_res: f.building_no_res || "",
    floor_no_res: f.floor_no_res || "",
    landmark_res: f.landmark_res || "",
    photo: f.photo || null,
    "Also Authorized Signatory": !!f["Also Authorized Signatory"],

    // ==== AUTHORIZED SIGNATORY ====
    is_primary: !!f.is_primary,
    as_name_first: f.as_name_first || "",
    as_name_middle: f.as_name_middle || "",
    as_name_last: f.as_name_last || "",
    as_father_first: f.as_father_first || "",
    as_father_middle: f.as_father_middle || "",
    as_father_last: f.as_father_last || "",
    as_dob: toBackendDate(f.as_dob),
    as_mobile: f.as_mobile || "",
    as_email: f.as_email || "",
    as_telephone: f.as_telephone || null,
    radiogroup_1: f.radiogroup_1 || null,
    as_designation: f.as_designation || "",
    as_din: f.as_din || "",
    as_pan: f.as_pan || "",
    toggle_3: !!f.toggle_3,
    as_passport: f.as_passport || null,
    as_aadhaar: f.as_aadhaar || null,
    as_country: getCountryName(f.as_country),
    as_pin: f.as_pin || "",
    as_state: getStateName(f.as_state),
    as_district: (f.as_district || "").substring(0, 5).toUpperCase(),
    as_city: f.as_city || null,
    as_locality: f.as_locality || null,
    as_road: f.as_road || null,
    as_premises: f.as_premises || null,
    as_bno: f.as_bno || null,
    as_floor: f.as_floor || null,
    as_landmark: f.as_landmark || null,
    as_proof_type: f.as_proof_type || "",
    as_proof_file: f.as_proof_file || null,
    as_photo: f.as_photo || null,

    // ==== REPRESENTATIVE ====
    toggle_4: !!f.toggle_4,
    radiogroup_2: f.radiogroup_2 || null,
    enrolment_id: f.enrolment_id || "",
    rep_name_first: f.rep_name_first || "",
    rep_name_middle: f.rep_name_middle || "",
    rep_name_last: f.rep_name_last || "",
    rep_designation: f.rep_designation || "",
    rep_mobile: f.rep_mobile || "",
    rep_email: f.rep_email || "",
    rep_pan: f.rep_pan || "",
    rep_aadhaar: f.rep_aadhaar || null,
    rep_telephone: f.rep_telephone || "",
    rep_fax: f.rep_fax || null,

    // ==== PPB (Principal Place of Business) ====
    toggle_5: !!f.toggle_5,
    ppb_pin: f.ppb_pin || "",
    ppb_state: getStateName(f.ppb_state) || "",
    ppb_district: (f.ppb_district || "").substring(0, 5).toUpperCase(),
    ppb_city: f.ppb_city || "",
    ppb_locality: f.ppb_locality || "",
    ppb_road: f.ppb_road || "",
    ppb_premises: f.ppb_premises || "",
    ppb_bno: f.ppb_bno || "",
    ppb_floor: f.ppb_floor || "",
    ppb_landmark: f.ppb_landmark || "",
    ppb_lat: f.ppb_lat || null,
    ppb_long: f.ppb_long || null,
    ppb_email: f.ppb_email || "",
    ppb_office_tel: f.ppb_office_tel || "",
    ppb_mobile: f.ppb_mobile || "",
    ppb_fax: f.ppb_fax || null,
    ppb_possession_type: f.ppb_possession_type || "",
    ppb_proof_doc: f.ppb_proof_doc || "",
    ppb_file: f.ppb_file || null,
    nature_of_possession_ppb: f.nature_of_possession_ppb || "", // ← was missing

    // ==== BUSINESS ACTIVITIES ====
    ba_bonded_warehouse: !!f.ba_bonded_warehouse,
    ba_eou: !!f.ba_eou,
    ba_export: !!f.ba_export,
    ba_factory: !!f.ba_factory,
    ba_import: !!f.ba_import,
    ba_services: !!f.ba_services,
    ba_leasing: !!f.ba_leasing,
    ba_office: !!f.ba_office,
    ba_recipient: !!f.ba_recipient,
    ba_retail: !!f.ba_retail,
    ba_warehouse: !!f.ba_warehouse,
    ba_wholesale: !!f.ba_wholesale,
    ba_works_contract: !!f.ba_works_contract,
    ba_others: !!f.ba_others,
    ba_others_specify: f.ba_others_specify || null,

    // ==== COMMISSIONERATE ====
    sector_circle: f.sector_circle || "",
    center_commissionerate: f.center_commissionerate || "",
    center_division: f.center_division || "",
    center_range: f.center_range || "",

    // ==== APB (Additional Places of Business) ====
    apb_count: f.apb_count || "",
    apb_pin: f.apb_pin || "",
    apb_state: f.apb_state || "",
    apb_district: (f.apb_district || "").substring(0, 5).toUpperCase(),
    apb_city: f.apb_city || null,
    apb_locality: f.apb_locality || "",
    apb_road: f.apb_road || "",
    apb_premises: f.apb_premises || "",
    apb_bno: f.apb_bno || "",
    apb_floor: f.apb_floor || "",
    apb_landmark: f.apb_landmark || "",
    apb_lat: f.apb_lat || null,
    apb_long: f.apb_long || null,
    apb_email: f.apb_email || "",
    apb_office_tel: f.apb_office_tel || "",
    apb_mobile: f.apb_mobile || "",
    apb_fax: f.apb_fax || null,
    apb_possession_type: f.apb_possession_type || "",
    apb_proof_doc: f.apb_proof_doc || "",
    apb_file: f.apb_file || null,
    apb_bonded_warehouse: !!f.apb_bonded_warehouse,
    apb_eou: !!f.apb_eou,
    apb_export: !!f.apb_export,
    apb_factory: !!f.apb_factory,
    apb_import: !!f.apb_import,
    apb_services: !!f.apb_services,
    apb_leasing: !!f.apb_leasing,
    apb_office: !!f.apb_office,
    apb_recipient: !!f.apb_recipient,
    apb_retail: !!f.apb_retail,
    apb_warehouse: !!f.apb_warehouse,
    apb_wholesale: !!f.apb_wholesale,
    apb_works_contract: !!f.apb_works_contract,
    apb_others: !!f.apb_others,
    apb_others_specify: f.apb_others_specify || null,

    // ==== GOODS/SERVICES ====
    hsn_search: f.hsn_search || "",
    commodities_list: f.commodities_list || [],
    sac_search: f.sac_search || "",
    services_list: f.services_list || [],

    // ==== STATE SPECIFIC ====
    electricity_board: f.electricity_board || "",
    consumer_number: f.consumer_number || "",
    prof_tax_ec: f.prof_tax_ec || "",
    prof_tax_rc: f.prof_tax_rc || "",
    state_excise_lic: f.state_excise_lic || "",
    excise_person_name: f.excise_person_name || "",

    // ==== VERIFICATION ====
    opt_for_aadhaar: f.opt_for_aadhaar !== false,
    declaration: !!f.declaration,
    signatory: f.signatory || "",
    place: f.place || "",
    designation_ver: f.designation_ver || "Proprietor",
    date_ver: toBackendDate(f.date_ver) || "",

    // ==== CONTACT/META INFO ====
    _contact_mobile: contact?.mobile || f.mobile || "", // fallback to promoter mobile
    _contact_email: contact?.email || f.email || "",
    promoter_ids: f.promoter_ids || [""],
  };

  // Strip API wrapper keys that should never be nested inside form_data
  [
    "form_key",
    "form_data",
    "id",
    "created_at",
    "updated_at",
    "raw_data",
  ].forEach((k) => delete payload[k]);

  // ==== DYNAMIC PROMOTER FIELDS (Promoter 2, 3, etc.) ====
  // All fields for each extra promoter are copied and formatted correctly
  const promoterIds = f.promoter_ids || [""];
  promoterIds.forEach((id) => {
    if (!id) return; // skip primary promoter — already handled above

    const sfx = id; // e.g. "_2"

    // All text/string fields — copy as-is with suffix
    const stringFields = [
      "name_first",
      "name_middle",
      "name_last",
      "father_first",
      "father_middle",
      "father_last",
      "mobile",
      "email",
      "telephone",
      "designation",
      "din",
      "pan_proprietor",
      "passport",
      "pin_code",
      "district_res",
      "city_res",
      "locality",
      "road_street_res",
      "premises_name",
      "building_no_res",
      "floor_no_res",
      "landmark_res",
    ];
    stringFields.forEach((base) => {
      const key = `${base}${sfx}`;
      const rawVal = f[key] || "";
      payload[key] = base.includes("district") ? rawVal.substring(0, 5).toUpperCase() : rawVal;
    });

    // Null-default fields
    const nullFields = ["aadhaar", "passport", "photo"];
    nullFields.forEach((base) => {
      const key = `${base}${sfx}`;
      payload[key] = f[key] || null;
    });

    // Boolean fields
    const boolFields = ["toggle_2", "Also Authorized Signatory"];
    boolFields.forEach((base) => {
      const key = `${base}${sfx}`;
      payload[key] = !!f[key];
    });

    // Date fields — format with toBackendDate
    const dobKey = `dob${sfx}`;
    payload[dobKey] = toBackendDate(f[dobKey]);

    // State field — convert to full name
    const stateKey = `state_res${sfx}`;
    payload[stateKey] = getStateName(f[stateKey]);

    // Country field
    const countryKey = `country${sfx}`;
    payload[countryKey] = getCountryName(f[countryKey]);

    // Gender radio — backend expects radiogroup_2_2 for promoter 2
    const idxMatch = sfx.match(/\d+/);
    if (idxMatch) {
      const idx = idxMatch[0];
      const rgKey = `radiogroup_1${sfx}`;
      payload[`radiogroup_1_${idx}`] = f[rgKey] || null;
    }
  });

  return payload;
}
