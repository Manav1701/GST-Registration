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
    trade_name: "Example Trading Sec",
    mobile: "6354967379",
    pan: "DRMPS3552R",
    name_first: "Ravi",
    name_middle: "Vishnukumar",
    name_last: "Somani",
    dob: "15/08/1990",
    email: "laljoyce0503@gmail.com",
    din: "12345687",
    as_mobile: "6354967379",
    as_email: "laljoyce0503@gmail.com",
    ppb_pin: "382418",
    ppb_state: "Gujarat",
    ppb_district: "Ahmedabad",
    ppb_city: "Daskroi",
    ppb_premises: "Joyce Sunil Lal",
    ppb_bno: "12/a",
    ppb_road: "D-13 Siddheshwari socitey , Behind rushikesh nagar housing",
    ppb_possession_type: "OWN",
    ppb_proof_doc: "ELCB",
    radiogroup: "Female",
    designation: "Director",
    pan_proprietor: "DRMPS3552D",
    signatory: "Ravi Vishnukumar Somani",
    declaration: true,
    place: "BENGALURU",
    date_ver: "10/04/2024",
    as_pan: "DRMPS3552D",
    as_dob: "15/08/1990",
    as_pin: "380008",
    as_state: "Gujarat",
    as_district: "Ahemdabad",
    as_city: "Ahemdabad",
    as_premises: "Joyce Sunil Lal",
    as_bno: "12/a",
    as_road: "D-13 Siddheshwari socitey , Behind rushikesh nagar housing",
    as_floor: "3",
    as_landmark: "garden",
    as_designation: "Director",
    as_father_first: "Vishnukumar",
    as_father_middle: "Amit",
    as_father_last: "Somani",
    as_proof_type: "LOAU",
    as_proof_file: "gst_photo.jpeg",
    as_photo: "gst_photo.jpeg",
    ba_export: true,
    ba_import: true,
    opt_for_aadhaar: true,
    sector_circle: "Ghatak 1 (Ahmedabad)",
    center_commissionerate: "AHMEDABAD SOUTH",
    center_division: "WS06",
    center_range: "WS0601"
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
    useProxy: true, // MUST BE TRUE to avoid immediate CORS error
    retries: 2, 
    backoff: 2000, 
    defaultData: [SAMPLE_SUBMISSION] 
  });
};

export const getSubmission = async (id) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "https://gst-fastapi-api-1.onrender.com";
  const url = `${apiBase}${ENDPOINTS.SUBMISSIONS}/${id}`;
  try {
    return await smartFetch(url, { useProxy: true });
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
  return {
    ...f,
    pan_date: toBackendDate(f.pan_date),
    dob: toBackendDate(f.dob),
    dob_2: toBackendDate(f.dob_2),
    commencement_date: toBackendDate(f.commencement_date),
    state: getStateName(f.state),
    state_res: getStateName(f.state_res),
    state_res_2: getStateName(f.state_res_2),
    _contact_mobile: contact?.mobile,
    _contact_email: contact?.email
  };
}
