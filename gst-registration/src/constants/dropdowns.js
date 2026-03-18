import { Country, State, City } from 'country-state-city';

// --- Dynamic Global Data Helpers ---
export const getAllCountries = () => 
  Country.getAllCountries().map(c => ({ value: c.isoCode, label: c.name }));

export const getStatesForCountry = (countryCode) => 
  State.getStatesOfCountry(countryCode).map(s => ({ value: s.isoCode, label: s.name }));

export const getCitiesForState = (countryCode, stateCode) => 
  City.getCitiesOfState(countryCode, stateCode).map(c => ({ value: c.name, label: c.name }));

// Maintain compatibility with existing code where static objects were expected
export const COUNTRIES = getAllCountries();
export const INDIAN_STATES = getStatesForCountry('IN');
// DISTRICT_MAP will now be dynamic based on selection, so we export a helper or a proxy
export const DISTRICT_MAP = {}; // Placeholder to avoid import errors, logic will use helpers

// --- Static GST constants ---

export const CONSTITUTION_TYPES = [
  { value: "FCO", label: "Foreign Company" },
  { value: "FLL", label: "Foreign Limited Liability Partnership" },
  { value: "GOV", label: "Government Department" },
  { value: "HUF", label: "Hindu Undivided Family" },
  { value: "LLP", label: "Limited Liability Partnership" },
  { value: "LOC", label: "Local Authority" },
  { value: "OTH", label: "Others" },
  { value: "PAR", label: "Partnership" },
  { value: "PVT", label: "Private Limited Company" },
  { value: "PRO", label: "Proprietorship" },
  { value: "PUB", label: "Public Limited Company" },
  { value: "PSU", label: "Public Sector Undertaking" },
  { value: "SCT", label: "Society/ Club/ Trust/ AOP" },
  { value: "STB", label: "Statutory Body" },
  { value: "ULC", label: "Unlimited Company" },
];

export const REGISTRATION_REASONS = [
  { value: "CRTH", label: "Crossing the Threshold" },
  { value: "INSS", label: "Inter-State supply" },
  { value: "VOLN", label: "Voluntary Basis" },
  { value: "TBCO", label: "Transfer / Succession of business" },
  { value: "DPRO", label: "Death of the Proprietor" },
  { value: "DMER", label: "De-merger" },
  { value: "CICB", label: "Change in constitution of business" },
  { value: "MEAM", label: "Merger / Amalgamation" },
  { value: "ECOM", label: "E-Commerce Operator" },
  { value: "DSEP", label: "Selling through e-Commerce portal" },
  { value: "LPRS", label: "Liability to pay as recipient of goods or services" },
  { value: "ISDN", label: "Input Service Distributor only" },
  { value: "SBOP", label: "Supplies on behalf of other taxable Person" },
  { value: "SEZU", label: "SEZ Unit" },
  { value: "SDEV", label: "SEZ Developer" },
  { value: "NOTA", label: "Others" },
  { value: "AIRP", label: "Corporate Debtor undergoing the Corporate Insolvency Resolution Process with IRP/RP" },
];

export const REG_TYPES = [
  { value: "gstin", label: "GSTIN" },
  { value: "tmpgstin", label: "Temporary ID" },
  { value: "svat", label: "Registration Number under VAT (TIN)" },
  { value: "cst", label: "Central Sales Tax Registration Number" },
  { value: "ce", label: "Central Excise Registration Number" },
  { value: "svtax", label: "Service Tax Registration Number" },
  { value: "iec", label: "Importer/Exporter Code Number" },
  { value: "etax", label: "Entry Tax Registration Number" },
  { value: "entax", label: "Entertainment Tax Registration Number" },
  { value: "hltax", label: "Hotel And Luxury Tax Registration Number" },
  { value: "cin", label: "Corporate Identity Number" },
  { value: "llpin", label: "LLP Identification Number" },
  { value: "exact", label: "Registration under Medicinal and Toilet Preparations Act" },
  { value: "seact", label: "Registration under Shops and Establishment Act" },
  { value: "othr", label: "Others (Please specify)" },
];

export const POSSESSION_TYPES = [
  { value: "CON", label: "Consent" },
  { value: "LES", label: "Leased" },
  { value: "OTH", label: "Others" },
  { value: "OWN", label: "Own" },
  { value: "REN", label: "Rented" },
  { value: "SHA", label: "Shared" },
];

export const PROOF_OF_PREMISES = [
  { value: "ELCB", label: "Electricity Bill" },
  { value: "LOWN", label: "Legal ownership document" },
  { value: "CMUK", label: "Municipal Khata Copy" },
  { value: "TAXR", label: "Property Tax Receipt" },
  { value: "RLAT", label: "Rent / Lease Agreement" },
  { value: "CNLR", label: "Consent Letter" },
  { value: "RNOC", label: "Rent / Lease Agreement with NOC" },
];

export const PROOF_OF_CONSTITUTION = [
  { value: "PARD", label: "Partnership Deed" },
  { value: "APSC", label: "Any proof substantiating Constitution" },
  { value: "CINC", label: "Certificate of Incorporation" },
  { value: "REGC", label: "Registration Certificate" },
  { value: "CEST", label: "Certificate for Establishment" },
];

export const ELECTRICITY_BOARDS = [
  { value: "DGVCL", label: "Dakshin Gujarat Vij Company Limited" },
  { value: "GIFT", label: "Gift Power Company Limited" },
  { value: "MGVCL", label: "Madhya Gujarat Vij Company Limited" },
  { value: "PGVCL", label: "Paschim Gujarat Vij Company Limited" },
  { value: "TORRENT", label: "Torrent Power Limited" },
  { value: "UGVCL", label: "Uttar Gujarat Vij Company Limited" },
];

export const AUTH_SIGNATORY_PROOF = [
  { value: "LOAU", label: "Letter of Authorisation" },
  { value: "CRBC", label: "Copy of resolution passed by BoD / Managing Committee" },
];

export const REP_DESIGNATIONS = [
  { value: "cah", label: "Chartered Accountant holding COP" },
  { value: "csh", label: "Company Secretary holding COP" },
  { value: "CTA", label: "Cost Accountant holding COP" },
  { value: "lcip", label: "Lawyer currently licensed to practise" },
  { value: "re", label: "Retired employee of Centre / State Revenue Department" },
  { value: "oth", label: "Others" },
];

const GHATAK_NAMES = [
  "Ahmedabad","Gan","Kalol","Him","Modasa","Idar","Prantij","Mehsana","Visnagar","Vijapur",
  "Kadi","Pal","Deesa","Unza","Sidhhpur","Patan","Vadodara","Godhara","Dahod","Nadiad",
  "Anand","Kapadvanj","Petlad","Khambhat","Bharuch","Ankleshwar","Surat","Vyara","Valsad",
  "Bilimora","Navsari","Vapi","Bhavnagar","Mahuva","S-Nagar","Dhrangadhra","Amrli","S.Kundla",
  "Junagadh","Porbandar","Varaval","Rajkot","Gondal","Jetpur","Dhoraji","Upleta","Jamnagar",
  "Jam-Khambhalia","Bhuj","Gandhidham",
];
export const GHATAK_ITEMS = GHATAK_NAMES.map((n, i) => ({
  value: `Ghatak ${i + 1} (${n})`,
  label: `Ghatak ${i + 1} (${n})`,
}));

export const DOCUMENT_CONFIGS = [
  {
    key: "aadhaar_card", label: "Aadhaar Card", icon: "🪪",
    description: "Front side of Aadhaar card",
    accept: "image/jpeg,image/png,application/pdf",
    color: "#1B4FD8", bgColor: "#EEF4FF", borderColor: "#C7D9FF",
    fillsFields: ["name_first","name_last","name_middle","dob","building_no_res","road_street_res","city_res","state_res","pin_code","aadhaar","district_res"],
  },
  {
    key: "pan_card", label: "PAN Card", icon: "🗂️",
    description: "Clear photo or scan of PAN card",
    accept: "image/jpeg,image/png,application/pdf",
    color: "#059669", bgColor: "#F0FDF4", borderColor: "#BBF7D0",
    fillsFields: ["pan","pan_proprietor","legal_name","name_first","name_last","dob","pan_date"],
  },
  {
    key: "address_proof", label: "Rent Agreement / Tax Bill / Electricity Bill", icon: "🏠",
    description: "Any one valid address proof document",
    accept: "image/jpeg,image/png,application/pdf",
    color: "#D97706", bgColor: "#FFFBEB", borderColor: "#FDE68A",
    fillsFields: ["ppb_premises","ppb_bno","ppb_road","ppb_locality","ppb_pin","ppb_state","consumer_number","ppb_district"],
  },
  {
    key: "photograph", label: "Photograph", icon: "📷",
    description: "Recent passport size photo (JPEG only)",
    accept: "image/jpeg,image/png",
    color: "#7C3AED", bgColor: "#F5F3FF", borderColor: "#DDD6FE",
    fillsFields: ["photo","as_photo","photo_2"],
  },
  {
    key: "msme_certificate", label: "MSME Certificate", icon: "📜",
    description: "If available — optional document",
    accept: "image/jpeg,image/png,application/pdf",
    color: "#0891B2", bgColor: "#ECFEFF", borderColor: "#A5F3FC",
    optional: true,
    fillsFields: ["trade_name","legal_name","commencement_date"],
  },
  {
    key: "bank_document", label: "Cancel Cheque / Bank Statement", icon: "🏦",
    description: "First page of bank statement or cancel cheque",
    accept: "image/jpeg,image/png,application/pdf",
    color: "#BE185D", bgColor: "#FDF2F8", borderColor: "#FBCFE8",
    fillsFields: ["legal_name"],
  },
];

export const PIN_DATA = {
  "380001": { state: "GJ", district: "GJAHM", city: "Ahmedabad" },
  "380015": { state: "GJ", district: "GJAHM", city: "Vastrapur" },
  "395003": { state: "GJ", district: "GJSUT", city: "Surat" },
  "400001": { state: "MH", district: "MHMUM", city: "Mumbai" },
  "411001": { state: "MH", district: "MHPUN", city: "Pune" },
  "110001": { state: "DL", district: "DLNDL", city: "New Delhi" },
  "302001": { state: "RJ", district: "RJJAI", city: "Jaipur" },
};
