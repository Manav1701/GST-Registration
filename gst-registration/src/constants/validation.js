export const PATTERNS = {
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  mobile: /^[6-9]\d{9}$/,
  pin: /^\d{6}$/,
  aadhaar: /^\d{12}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  din: /^\d{8}$/,
};

export const validateField = (name, value, allData = {}) => {
  const v = value === null || value === undefined ? "" : String(value).trim();
  const required = (label) => (!v ? `${label} is required` : null);
  const pattern = (p, msg) => (v && !p.test(v) ? msg : null);

  const isRepEnabled = !!allData.toggle_4;
  const isGSTP = allData.radiogroup_2 === "GST Practitioner";
  const isOther = allData.radiogroup_2 === "Other";

  const rules = {
    legal_name: () => required("Legal Name"),
    pan: () => required("PAN") || pattern(PATTERNS.pan, "PAN must be in format: ABCDE1234F"),
    pan_date: () => required("PAN Creation Date"),
    "Constitution of Business": () => required("Constitution of Business"),
    trade_name: () => required("Trade Name"),
    state: () => required("State"),
    District: () => required("District"),
    reason: () => required("Reason to obtain registration"),
    commencement_date: () => required("Date of commencement"),
    commencement_date_1: () => required("Date of liability to register"),
    name_first: () => required("First Name"),
    name_last: () => required("Last Name"),
    dob: () => required("Date of Birth"),
    mobile: () => required("Mobile Number") || pattern(PATTERNS.mobile, "Mobile must be 10 digits starting with 6-9"),
    email: () => required("Email") || pattern(PATTERNS.email, "Invalid email address"),
    designation: () => required("Designation"),
    pan_proprietor: () => required("PAN") || pattern(PATTERNS.pan, "PAN must be in format: ABCDE1234F"),
    country: () => required("Country"),
    pin_code: () => required("PIN Code") || pattern(PATTERNS.pin, "PIN Code must be 6 digits"),
    state_res: () => required("State"),
    district_res: () => required("District"),
    city_res: () => required("City / Town / Village"),
    road_street_res: () => required("Road / Street"),
    building_no_res: () => required("Building No."),
    as_name_first: () => required("First Name"),
    as_name_last: () => required("Last Name"),
    as_dob: () => required("Date of Birth"),
    as_mobile: () => required("Mobile") || pattern(PATTERNS.mobile, "Mobile must be 10 digits starting with 6-9"),
    as_email: () => required("Email") || pattern(PATTERNS.email, "Invalid email address"),
    as_designation: () => required("Designation"),
    as_pan: () => required("PAN") || pattern(PATTERNS.pan, "PAN must be in format: ABCDE1234F"),
    as_pin: () => required("PIN Code") || pattern(PATTERNS.pin, "PIN Code must be 6 digits"),
    ppb_pin: () => required("PIN Code") || pattern(PATTERNS.pin, "PIN Code must be 6 digits"),
    ppb_state: () => required("State"),
    ppb_premises: () => required("Building/Premises Name"),
    ppb_bno: () => required("Building No."),
    sector_circle: () => required("Sector / Circle / Ward"),
    center_commissionerate: () => required("Center Commissionerate"),
    center_division: () => required("Center Division"),
    center_range: () => required("Center Range"),
    ppb_possession_type: () => required("Nature of possession"),
    ppb_proof_doc: () => required("Proof document type"),
    nature_of_possession_ppb: () => required("Nature of possession"),
    electricity_board: () => required("Electricity Board"),
    consumer_number: () => required("Consumer Number"),
    declaration: () => (value !== true ? "You must accept the declaration to submit" : null),
    signatory: () => required("Authorized Signatory"),
    place: () => required("Place"),
    // Authorized Rep fields - conditional
    radiogroup_2: () => (isRepEnabled ? required("Type of Representative") : null),
    enrolment_id: () => (isRepEnabled && isGSTP ? required("Enrolment ID") : null),
    rep_name_first: () => (isRepEnabled && isOther ? required("First Name") : null),
    rep_name_last: () => (isRepEnabled && isOther ? required("Last Name") : null),
    rep_mobile: () => (v ? pattern(PATTERNS.mobile, "Mobile must be 10 digits starting with 6-9") : (isRepEnabled && isOther ? required("Mobile") : null)),
    rep_email: () => (v ? pattern(PATTERNS.email, "Invalid email address") : (isRepEnabled && isOther ? required("Email") : null)),
    rep_pan: () => (v ? pattern(PATTERNS.pan, "PAN must be in format: ABCDE1234F") : (isRepEnabled && isOther ? required("PAN") : null)),
    rep_aadhaar: () => v && pattern(PATTERNS.aadhaar, "Aadhaar must be 12 digits"),
    aadhaar: () => v && pattern(PATTERNS.aadhaar, "Aadhaar must be 12 digits"),
    din: () => v && pattern(PATTERNS.din, "DIN must be 8 digits"),
    as_din: () => v && pattern(PATTERNS.din, "DIN must be 8 digits"),
  };

  return rules[name] ? rules[name]() : null;
};

export const TAB_REQUIRED_FIELDS = {
  0: ["legal_name","pan","pan_date","Constitution of Business","trade_name","state","District","reason","commencement_date","commencement_date_1"],
  1: ["name_first","name_last","dob","mobile","email","designation","pan_proprietor","country","pin_code","state_res","district_res","city_res","road_street_res","building_no_res"],
  2: [],
  3: ["as_name_first","as_name_last","as_dob","as_mobile","as_email","as_designation","as_pan","as_pin"],
  4: ["radiogroup_2", "enrolment_id", "rep_name_first","rep_name_last","rep_mobile","rep_email","rep_pan"],
  5: ["ppb_pin","ppb_state","ppb_premises","ppb_bno","sector_circle","center_commissionerate","center_division","center_range","ppb_possession_type","ppb_proof_doc"],
  6: [],
  7: [],
  8: ["nature_of_possession_ppb","electricity_board","consumer_number"],
  9: [],
  10: ["declaration","signatory","place"],
};
