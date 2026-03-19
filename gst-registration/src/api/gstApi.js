import apiClient from "./index.js";
import ENDPOINTS from "./endpoints.js";
import { toBackendDate } from "../utils/dateUtils.js";
import { INDIAN_STATES } from "../constants/dropdowns.js";

const getStateName = (code) => {
  if (!code) return null;
  return INDIAN_STATES.find(s => s.value === code)?.label || code;
};

/**
 * POST /api/extract-document
 * Sends a base64-encoded document to the backend for OCR/field extraction.
 */
export const extractDocument = async (docType, fileBase64, mimeType) => {
  try {
    const { data } = await apiClient.post(ENDPOINTS.EXTRACT_DOCUMENT, {
      docType,
      fileBase64,
      mimeType,
    });
    return data;
  } catch (err) {
    console.warn(`[extractDocument] Failed for ${docType}:`, err.message);
    return { extracted: {}, confidence: 0 };
  }
};

/**
 * GET /api/drafts
 * Returns a list of {id, legal_name, mobile} for the dropdown.
 */
export const getDrafts = async (mobile) => {
  const { data } = await apiClient.get(ENDPOINTS.DRAFTS, {
    params: { mobile }
  });
  return data;
};

/**
 * GET /api/submissions/{id}
 * Fetches the full JSON data for a specific client.
 */
export const getSubmission = async (id) => {
  const { data } = await apiClient.get(`${ENDPOINTS.SUBMISSIONS}/${id}`);
  return data;
};

/**
 * POST /api/submissions
 * Creates a new submission.
 */
export const submitGSTForm = async (formData, contactInfo) => {
  const payload = buildPayload(formData, contactInfo);
  const wrappedPayload = {
    form_key: "gst_registration",
    form_data: payload,
  };
  const { data } = await apiClient.post(ENDPOINTS.SUBMISSIONS, wrappedPayload);
  return data;
};

/**
 * PUT /api/submissions/{id}
 * Updates an EXISTING submission in the database.
 */
export const updateGSTForm = async (id, formData, contactInfo) => {
  const payload = buildPayload(formData, contactInfo);
  const wrappedPayload = {
    form_key: "gst_registration",
    form_data: payload,
  };
  const { data } = await apiClient.put(`${ENDPOINTS.SUBMISSIONS}/${id}`, wrappedPayload);
  return data;
};

/**
 * Builds the complete API payload from formData.
 * Normalizes dates to DD/MM/YYYY, maps state codes to names, matches backend schema.
 */
function buildPayload(f, contact) {
  return {
    // Business Identity
    legal_name: f.legal_name,
    pan: f.pan,
    pan_date: toBackendDate(f.pan_date),
    "Constitution of Business": f["Constitution of Business"],
    trade_name: f.trade_name,
    state: getStateName(f.state),
    District: f.District,
    toggle: !!f.toggle,
    toggle_1: !!f.toggle_1,
    radioBlocks: (f.radioBlocks === null || f.radioBlocks === "") ? null : Number(f.radioBlocks),
    text: f.text,
    reason: f.reason,
    commencement_date: toBackendDate(f.commencement_date),
    commencement_date_1: toBackendDate(f.commencement_date_1),
    existing_registrations_list: (f.existing_registrations_list || []).map(
      (r) => ({
        ...r,
        date: toBackendDate(r.date),
      })
    ),
    file: f.file,
    proof_of_constitution: f.proof_of_constitution,
    constitution_document: f.constitution_document,
    district: f.district || null,
    "Reason to obtain registration": f["Reason to obtain registration"] || null,

    // Promoter 1
    name_first: f.name_first,
    name_middle: f.name_middle,
    name_last: f.name_last,
    father_first: f.father_first,
    father_middle: f.father_middle,
    father_last: f.father_last,
    dob: toBackendDate(f.dob),
    // Use contactInfo (registration number) if form mobile is empty.
    // This ensures the Privacy Filter works even before the form is filled.
    mobile: f.mobile || contact?.mobile,
    email: f.email || contact?.email,
    telephone: f.telephone || null,
    radiogroup: f.radiogroup || "",
    designation: f.designation,
    din: f.din,
    toggle_2: !!f.toggle_2,
    pan_proprietor: f.pan_proprietor,
    passport: f.passport,
    aadhaar: f.aadhaar,
    country: f.country,
    pin_code: f.pin_code,
    state_res: getStateName(f.state_res),
    district_res: f.district_res,
    city_res: f.city_res,
    locality: f.locality,
    road_street_res: f.road_street_res,
    premises_name: f.premises_name,
    building_no_res: f.building_no_res,
    floor_no_res: f.floor_no_res,
    landmark_res: f.landmark_res,
    photo: f.photo,
    "Also Authorized Signatory": !!f["Also Authorized Signatory"],

    // Promoter 2
    name_first_2: f.name_first_2,
    name_middle_2: f.name_middle_2,
    name_last_2: f.name_last_2,
    father_first_2: f.father_first_2,
    father_middle_2: f.father_middle_2,
    father_last_2: f.father_last_2,
    dob_2: toBackendDate(f.dob_2),
    mobile_2: f.mobile_2,
    email_2: f.email_2,
    telephone_2: f.telephone_2 || null,
    radiogroup_2_promoter: f.radiogroup_2_promoter || null,
    designation_2: f.designation_2,
    din_2: f.din_2,
    toggle_2_2: !!f.toggle_2_2,
    pan_proprietor_2: f.pan_proprietor_2,
    passport_2: f.passport_2,
    aadhaar_2: f.aadhaar_2,
    country_2: f.country_2,
    pin_code_2: f.pin_code_2,
    state_res_2: getStateName(f.state_res_2),
    district_res_2: f.district_res_2,
    city_res_2: f.city_res_2,
    locality_2: f.locality_2,
    road_street_res_2: f.road_street_res_2,
    premises_name_2: f.premises_name_2,
    building_no_res_2: f.building_no_res_2,
    floor_no_res_2: f.floor_no_res_2,
    landmark_res_2: f.landmark_res_2,
    photo_2: f.photo_2,
    "Also Authorized Signatory_2": !!f["Also Authorized Signatory_2"],

    // Authorized Signatory
    is_primary: !!f.is_primary,
    as_name_first: f.as_name_first,
    as_name_middle: f.as_name_middle,
    as_name_last: f.as_name_last,
    as_father_first: f.as_father_first,
    as_father_middle: f.as_father_middle,
    as_father_last: f.as_father_last,
    as_dob: toBackendDate(f.as_dob),
    as_mobile: f.as_mobile,
    as_email: f.as_email,
    as_telephone: f.as_telephone || null,
    radiogroup_1: f.radiogroup_1 || null,
    as_designation: f.as_designation,
    as_din: f.as_din,
    as_pan: f.as_pan,
    toggle_3: !!f.toggle_3,
    as_passport: f.as_passport,
    as_aadhaar: f.as_aadhaar,
    as_country: f.as_country,
    as_pin: f.as_pin,
    as_state: getStateName(f.as_state),
    as_district: f.as_district,
    as_city: f.as_city,
    as_locality: f.as_locality,
    as_road: f.as_road,
    as_premises: f.as_premises,
    as_bno: f.as_bno,
    as_floor: f.as_floor,
    as_landmark: f.as_landmark,
    as_proof_type: f.as_proof_type,
    as_proof_file: f.as_proof_file,
    as_photo: f.as_photo,

    // Authorized Representative
    toggle_4: !!f.toggle_4,
    radiogroup_2: f.radiogroup_2 || null,
    enrolment_id: f.enrolment_id,
    rep_name_first: f.rep_name_first,
    rep_name_middle: f.rep_name_middle,
    rep_name_last: f.rep_name_last,
    rep_designation: f.rep_designation,
    rep_mobile: f.rep_mobile,
    rep_email: f.rep_email,
    rep_pan: f.rep_pan,
    rep_aadhaar: f.rep_aadhaar,
    rep_telephone: f.rep_telephone || null,
    rep_fax: f.rep_fax,

    // Principal Place of Business
    ppb_pin: f.ppb_pin,
    ppb_state: getStateName(f.ppb_state),
    ppb_district: f.ppb_district,
    ppb_city: f.ppb_city,
    ppb_locality: f.ppb_locality,
    ppb_road: f.ppb_road,
    ppb_premises: f.ppb_premises,
    ppb_bno: f.ppb_bno,
    ppb_floor: f.ppb_floor,
    ppb_landmark: f.ppb_landmark,
    ppb_lat: f.ppb_lat,
    ppb_long: f.ppb_long,
    sector_circle: f.sector_circle,
    center_commissionerate: f.center_commissionerate,
    center_division: f.center_division,
    center_range: f.center_range,
    ppb_email: f.ppb_email,
    ppb_office_tel: f.ppb_office_tel || null,
    ppb_mobile: f.ppb_mobile,
    ppb_fax: f.ppb_fax,
    ppb_possession_type: f.ppb_possession_type,
    ppb_proof_doc: f.ppb_proof_doc,
    ppb_file: f.ppb_file,
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
    ba_others_specify: f.ba_others_specify,

    // Additional Place of Business
    toggle_5: !!f.toggle_5,
    apb_count: f.apb_count,
    apb_pin: f.apb_pin,
    apb_state: getStateName(f.apb_state),
    apb_district: f.apb_district,
    apb_city: f.apb_city,
    apb_locality: f.apb_locality,
    apb_road: f.apb_road,
    apb_premises: f.apb_premises,
    apb_bno: f.apb_bno,
    apb_floor: f.apb_floor,
    apb_landmark: f.apb_landmark,
    apb_lat: f.apb_lat,
    apb_long: f.apb_long,
    apb_email: f.apb_email,
    apb_office_tel: f.apb_office_tel || null,
    apb_mobile: f.apb_mobile,
    apb_fax: f.apb_fax,
    apb_possession_type: f.apb_possession_type,
    apb_proof_doc: f.apb_proof_doc,
    apb_file: f.apb_file,
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
    apb_others_specify: f.apb_others_specify,

    // Goods & Services
    hsn_search: f.hsn_search,
    commodities_list: (f.commodities_list || []).map(c => ({
      hsn_code: c.hsn_code || null,
      description: c.description || null
    })),
    sac_search: f.sac_search,
    services_list: (f.services_list || []).map(s => ({
      sac_code: s.sac_code || null,
      description: s.description || null
    })),

    // State Specific
    nature_of_possession_ppb: f.nature_of_possession_ppb,
    electricity_board: f.electricity_board,
    consumer_number: f.consumer_number,
    prof_tax_ec: f.prof_tax_ec,
    prof_tax_rc: f.prof_tax_rc,
    state_excise_lic: f.state_excise_lic,
    excise_person_name: f.excise_person_name,

    // Aadhaar
    opt_for_aadhaar: !!f.opt_for_aadhaar,

    // Verification
    declaration: !!f.declaration,
    signatory: f.signatory,
    place: f.place,
    designation_ver: f.designation_ver,
    date_ver: toBackendDate(f.date_ver),

    // System/Contact metadata for filtering drafts
    _contact_mobile: contact?.mobile,
    _contact_email: contact?.email,
  };
}
