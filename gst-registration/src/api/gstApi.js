import { smartFetch } from "../utils/fetchUtils.js";
import ENDPOINTS from "./endpoints.js";
import { toBackendDate } from "../utils/dateUtils.js";
import { INDIAN_STATES } from "../constants/dropdowns.js";

// -- THE SAMPLE DATA READY AT THE TOP --
const SAMPLE_SUBMISSION = {
  id: 9, 
  form_key: "gst_registration",
  form_data: {
    legal_name: "Ravi Vishnukumar Somani (Sample)",
    pan: "DRMPS3552R",
    pan_date: "10/05/2010",
    "Constitution of Business": "Proprietorship",
    trade_name: "Example Trading Sec",
    state: "Gujarat",
    district_fixed: "Ahmedabad",
    toggle: false,
    toggle_1: false,
    radioBlocks: null,
    text: null,
    reason: "CRTH",
    commencement_date: "15/08/2020",
    existing_registrations_list: [],
    file: null,
    distict: "Ahmedabad",
    "Reason to obtain registration": "CRTH",
    proof_of_constitution: "",
    constitution_document: null,

    // PROMOTER DETAILS
    name_first: "Ravi",
    name_middle: "Vishnukumar",
    name_last: "Somani",
    father_first: "Vishnukumar",
    father_middle: "Amit",
    father_last: "Somani",
    dob: "15/08/1990",
    mobile: "6354967379",
    email: "laljoyce0503@gmail.com",
    telephone: "",
    radiogroup: "Male",
    designation: "Director",
    din: "12345687",
    toggle_2: true,
    pan_proprietor: "DRMPS3552D",
    passport: null,
    aadhaar: null,
    country: "IND",
    pin_code: "382418",
    state_res: "Gujarat",
    district_res: "Ahmedabad",
    city_res: "Daskroi",
    locality: "Siddheshwari",
    road_street_res: "D-13 Siddheshwari socitey",
    premises_name: "Joyce Sunil Lal",
    building_no_res: "12/a",
    floor_no_res: "G",
    landmark_res: "garden",
    photo: "gst_photo.jpeg",
    "Also Authorized Signatory": false,

    // PROMOTER 2 DETAILS
    promoter_ids: ["", "_2"],
    name_first_2: "Amit",
    name_middle_2: "Kumar",
    name_last_2: "Shah",
    father_first_2: "Raj",
    father_middle_2: "",
    father_last_2: "Shah",
    dob_2: "10/10/1985",
    mobile_2: "9876543210",
    email_2: "amit@example.com",
    telephone_2: "",
    radiogroup_2: "Male",
    designation_2: "Partner",
    din_2: "",
    toggle_2_2: true,
    pan_proprietor_2: "ABCDE1234F",
    passport_2: null,
    aadhaar_2: null,
    country_2: "IND",
    pin_code_2: "380001",
    state_res_2: "Gujarat",
    district_res_2: "Ahmedabad",
    city_res_2: "Ahmedabad",
    locality_2: "CG Road",
    road_street_res_2: "CG Road",
    premises_name_2: "Complex",
    building_no_res_2: "10",
    floor_no_res_2: "1",
    landmark_res_2: "",
    photo_2: "photo2.jpeg",
    "Also Authorized Signatory_2": true,

    // AUTHORIZED SIGNATORY
    as_name_first: "Ravi",
    as_name_middle: "Vishnukumar",
    as_name_last: "Somani",
    as_father_first: "Vishnukumar",
    as_father_middle: "Amit",
    as_father_last: "Somani",
    as_dob: "15/08/1990",
    as_mobile: "6354967379",
    as_email: "laljoyce0503@gmail.com",
    as_telephone: "",
    radiogroup_1: "Male",
    as_designation: "Director",
    as_din: "12345687",
    as_pan: "DRMPS3552D",
    toggle_3: true,
    as_passport: null,
    as_aadhaar: null,
    as_country: "IND",
    as_pin: "380008",
    as_state: "Gujarat",
    as_district: "Ahemdabad",
    as_city: "Ahemdabad",
    as_locality: "Maninagar",
    as_road: "D-13 Siddheshwari socitey",
    as_premises: "Joyce Sunil Lal",
    as_bno: "12/a",
    as_floor: "3",
    as_landmark: "garden",
    as_proof_type: "LOAU",
    as_proof_file: "gst_photo.jpeg",
    as_photo: "gst_photo.jpeg",

    // REPRESENTATIVE
    toggle_4: false,
    radiogroup_2: null,
    enrolment_id: "",
    rep_name_first: "",
    rep_name_middle: "",
    rep_name_last: "",
    rep_designation: "",
    rep_mobile: "",
    rep_email: "",
    rep_pan: "",
    rep_aadhaar: null,
    rep_telephone: "",
    rep_fax: null,

    // PPB
    toggle_5: false,
    ppb_pin: "382418",
    ppb_state: "Gujarat",
    ppb_district: "Ahmedabad",
    ppb_city: "Daskroi",
    ppb_locality: "Vatva",
    ppb_road: "Phase 1",
    ppb_premises: "Estate",
    ppb_bno: "A-1",
    ppb_floor: "G",
    ppb_landmark: "Near Bank",
    ppb_lat: null,
    ppb_long: null,
    ppb_email: "info@example.com",
    ppb_office_tel: "",
    ppb_mobile: "6354967379",
    ppb_fax: "",
    ppb_possession_type: "OWN",
    ppb_proof_doc: "ELCB",
    ppb_file: null,
    
    // BUSINESS ACTIVITIES
    ba_bonded_warehouse: false,
    ba_eou: false,
    ba_export: true,
    ba_factory: false,
    ba_import: true,
    ba_services: false,
    ba_leasing: false,
    ba_office: false,
    ba_recipient: false,
    ba_retail: false,
    ba_warehouse: false,
    ba_wholesale: false,
    ba_works_contract: false,
    ba_others: false,
    ba_others_specify: null,

    // APB
    apb_count: "",
    apb_pin: "",
    apb_state: "Gujarat",
    apb_district: null,
    apb_city: null,
    apb_locality: "",
    apb_road: "",
    apb_premises: "",
    apb_bno: "",
    apb_floor: "",
    apb_landmark: "",
    apb_lat: null,
    apb_long: null,
    apb_email: "",
    apb_office_tel: "",
    apb_mobile: "",
    apb_fax: null,
    apb_possession_type: "",
    apb_proof_doc: "",
    apb_file: null,
    apb_export: false,
    apb_import: false,

    // COMMISSIONERATE
    sector_circle: "Ghatak 1 (Ahmedabad)",
    center_commissionerate: "AHMEDABAD SOUTH",
    center_division: "WS06",
    center_range: "WS0601",

    // GOODS/SERVICES
    hsn_search: "",
    commodities_list: [],
    sac_search: "",
    services_list: [],

    // STATE SPECIFIC
    electricity_board: "",
    consumer_number: "",
    prof_tax_ec: "",
    prof_tax_rc: "",
    state_excise_lic: "",
    excise_person_name: "",

    // VERIFICATION
    opt_for_aadhaar: true,
    declaration: true,
    signatory: "Ravi Vishnukumar Somani",
    place: "BENGALURU",
    designation_ver: "Director",
    date_ver: "10/04/2024",

    is_primary: true
  }
};

const getStateName = (code) => {
  if (!code) return null;
  return INDIAN_STATES.find(s => s.value === code)?.label || code;
};

export const getSubmissions = async () => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "https://gst-fastapi-api-1.onrender.com";
  const url = `${apiBase}${ENDPOINTS.SUBMISSIONS}`;
  return await smartFetch(url, { 
    useProxy: false, // Turned off proxy because allorigins.win is failing/blocking localhost
    retries: 2, 
    backoff: 2000, 
    defaultData: [SAMPLE_SUBMISSION] 
  });
};

export const getSubmission = async (id) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "https://gst-fastapi-api-1.onrender.com";
  const url = `${apiBase}${ENDPOINTS.SUBMISSIONS}/${id}`;
  try {
    return await smartFetch(url, { useProxy: false });
  } catch (e) {
    if (String(id) === "9") return SAMPLE_SUBMISSION;
    throw e;
  }
};

export const submitGSTForm = async (formData, contactInfo) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "https://gst-fastapi-api-1.onrender.com";
  const url = `${apiBase}${ENDPOINTS.SUBMISSIONS}`;
  const payload = buildPayload(formData, contactInfo);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ form_key: "gst_registration", form_data: payload })
  });
  return await response.json();
};

export const updateGSTForm = async (id, formData, contactInfo) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "https://gst-fastapi-api-1.onrender.com";
  const url = `${apiBase}${ENDPOINTS.SUBMISSIONS}/${id}`;
  const payload = buildPayload(formData, contactInfo);
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ form_key: "gst_registration", form_data: payload })
  });
  return await response.json();
};

export const extractDocument = async (docType, fileBase64, mimeType) => {
  return { extracted: {}, confidence: 0 };
};

function buildPayload(f, contact) {
  // Explicitly mapping ALL fields perfectly matching dummy31.py backend expectations
  const payload = {
    // ==== BUSINESS DETAILS ====
    legal_name: f.legal_name || "",
    pan: f.pan || "",
    pan_date: toBackendDate(f.pan_date),
    "Constitution of Business": f["Constitution of Business"] || "",
    trade_name: f.trade_name || "",
    state: getStateName(f.state) || "",
    district_fixed: f.district_fixed || f.District || "",
    toggle: !!f.toggle,
    toggle_1: !!f.toggle_1,
    radioBlocks: f.radioBlocks || null,
    text: f.text || null,
    reason: f.reason || "",
    commencement_date: toBackendDate(f.commencement_date),
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
    country: f.country || "IND",
    pin_code: f.pin_code || "",
    state_res: getStateName(f.state_res),
    district_res: f.district_res || "",
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
    as_country: f.as_country || "IND",
    as_pin: f.as_pin || "",
    as_state: getStateName(f.as_state),
    as_district: f.as_district || null,
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
    ppb_state: f.ppb_state || "Gujarat",
    ppb_district: f.ppb_district || "",
    ppb_city: f.ppb_city || null,
    ppb_locality: f.ppb_locality || "",
    ppb_road: f.ppb_road || "",
    ppb_premises: f.ppb_premises || "",
    ppb_bno: f.ppb_bno || "",
    ppb_floor: f.ppb_floor || "",
    ppb_landmark: f.ppb_landmark || "",
    ppb_lat: f.ppb_lat || null,
    ppb_long: f.ppb_long || null,
    ppb_email: f.ppb_email || null,
    ppb_office_tel: f.ppb_office_tel || "",
    ppb_mobile: f.ppb_mobile || null,
    ppb_fax: f.ppb_fax || null,
    ppb_possession_type: f.ppb_possession_type || "",
    ppb_proof_doc: f.ppb_proof_doc || "",
    ppb_file: f.ppb_file || null,

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
    apb_state: f.apb_state || "Gujarat",
    apb_district: f.apb_district || null,
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
    opt_for_aadhaar: f.opt_for_aadhaar !== false, // Default is true 
    declaration: !!f.declaration,
    signatory: f.signatory || "",
    place: f.place || "",
    designation_ver: f.designation_ver || "Proprietor",
    date_ver: f.date_ver || "",
    is_primary: !!f.is_primary,

    // ==== CONTACT/META INFO ====
    _contact_mobile: contact?.mobile || "",
    _contact_email: contact?.email || "",
    promoter_ids: f.promoter_ids || [""],

    // Fallback: This ensures absolutely no custom data from the form state is lost 
    // even if it was missed in the list above, while keeping it explicit.
    ...f
  };

  // We explicitly loop to dynamically capture Promoter 2, Promoter 3, etc. 
  // so that fields like name_first_2, dob_2, state_res_2 are properly formatted and mapped!
  const promoterIds = f.promoter_ids || [""];
  promoterIds.forEach(id => {
    // We only need to deal with explicit conversion formatting for dynamic multiple promoters.
    // Base keys are handled above, but their date/state properties need dynamic processing here.
    const dobKey = id ? `dob${id}` : "dob";
    if (f[dobKey]) payload[dobKey] = toBackendDate(f[dobKey]);

    const stateKey = id ? `state_res${id}` : "state_res";
    if (f[stateKey]) payload[stateKey] = getStateName(f[stateKey]);

    // Backend (dummy31.py) strictly expects radiogroup_2_2 for the 2nd promoter (idx = 2)
    if (id) {
      const idxMatch = id.match(/\d+/);
      if (idxMatch) {
         const idx = idxMatch[0];
         const rgKey = `radiogroup${id}`; // e.g. radiogroup_2 in frontend
         if (f[rgKey]) {
           payload[`radiogroup_2_${idx}`] = f[rgKey]; // maps to radiogroup_2_2 expected by Python
         }
      }
    }
  });

  return payload;
}
