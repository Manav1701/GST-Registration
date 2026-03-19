import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { INITIAL_STATE, STORAGE_KEY } from "../constants/tabs.js";
import { validateField, TAB_REQUIRED_FIELDS } from "../constants/validation.js";
import { submitGSTForm, updateGSTForm, getSubmissions, getSubmission } from "../api/gstApi.js";

export function useGSTForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...INITIAL_STATE, ...JSON.parse(saved) } : INITIAL_STATE;
    } catch {
      return INITIAL_STATE;
    }
  });

  const [currentSubmissionId, setCurrentSubmissionId] = useState(null);
  const [draftsList, setDraftsList] = useState([]);

  const [contactInfo] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("gst_contact")) || {
          mobile: "",
          email: "",
        }
      );
    } catch {
      return { mobile: "", email: "" };
    }
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [tabStatus, setTabStatus] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showTabWarning, setShowTabWarning] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch { /* skip if quota full */ }
  }, [formData]);

  const computeErrors = useCallback((data) => {
    const errs = {};
    Object.keys(data).forEach((k) => {
      const err = validateField(k, data[k], data);
      if (err) errs[k] = err;
    });
    return errs;
  }, []);

  const getTabErrors = useCallback(
    (tabIdx, data) => {
      const fields = TAB_REQUIRED_FIELDS[tabIdx] || [];
      const errs = computeErrors(data);
      return fields.filter((field) => errs[field]);
    },
    [computeErrors]
  );

  const update = useCallback((name, value) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      const err = validateField(name, value, next);
      setErrors((errs) => ({ ...errs, [name]: err }));
      return next;
    });
  }, []);

  const touch = useCallback(
    (name) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, formData[name], formData),
      }));
    },
    [formData]
  );

  const applyAutoFill = useCallback((autoFilled) => {
    if (autoFilled && Object.keys(autoFilled).length > 0) {
      setFormData((prev) => ({ ...prev, ...autoFilled }));
    }
  }, []);

  const fetchAddressByPin = useCallback(async (pin) => {
    if (!pin || pin.length !== 6) return null;
    try {
      const resp = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const result = await resp.json();
      if (result?.[0]?.Status === "Success" && result[0].PostOffice?.[0]) {
        const po = result[0].PostOffice[0];
        return { stateName: po.State, district: po.District, city: po.Block || po.Name };
      }
    } catch (err) { console.warn("[fetchAddressByPin] Failed:", err.message); }
    return null;
  }, []);

  const fetchDrafts = useCallback(async (mobile) => {
    try {
      if (!mobile) {
        setDraftsList([]);
        return;
      }
      
      // FETCH ALL from existing API
      const allSubmissions = await getSubmissions();
      
      // FILTER in Frontend by mobile
      const filtered = allSubmissions.filter(s => {
        const data = s.form_data || {};
        return String(data.mobile) === String(mobile) || 
               String(data._contact_mobile) === String(mobile) || 
               String(data.as_mobile) === String(mobile);
      });

      // Show Legal Name in dropdown
      const drafts = filtered.map(s => ({
        id: s.id,
        legal_name: s.form_data?.legal_name || s.form_data?.trade_name || `Draft ${s.id}`
      }));

      setDraftsList(drafts);
    } catch (err) { 
      console.error("Failed to load drafts from submissions:", err); 
      setDraftsList([]);
    }
  }, []);

  const loadDraft = useCallback(async (id) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      // Fetches the full JSON from the server by ID
      const submission = await getSubmission(id);
      
      if (submission && submission.form_data) {
        // Deep merge INITIAL_STATE with form_data to handle missing keys
        setFormData({ ...INITIAL_STATE, ...submission.form_data });
        setCurrentSubmissionId(id);
        setActiveTab(0);
        setErrors({});
        setTouched({});
        setTabStatus({});
      }
    } catch (err) {
      console.error("Failed to populate form from submission:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const touchAllInTab = useCallback(
    (tabIdx) => {
      let fields = TAB_REQUIRED_FIELDS[tabIdx] || [];

      // DYNAMIC PROMOTER VALIDATION: Generate fields for all added promoters
      if (tabIdx === 1) {
        const ids = formData.promoter_ids || [""];
        const baseFields = [
          "name_first", "name_last", "dob", "mobile", "email", 
          "designation", "pan_proprietor", "country", "pin_code", 
          "state_res", "district_res", "city_res", "road_street_res", "building_no_res"
        ];
        fields = ids.flatMap(id => baseFields.map(f => id ? `${f}${id}` : f));
      }

      const newTouched = {};
      fields.forEach((f) => { newTouched[f] = true; });
      setTouched((prev) => ({ ...prev, ...newTouched }));
      const errs = computeErrors(formData);
      const newErrors = {};
      fields.forEach((f) => { if (errs[f]) newErrors[f] = errs[f]; });
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return fields.filter((f) => errs[f]).length;
    },
    [formData, computeErrors]
  );

  const handleSaveContinue = useCallback(
    (activeTabIdx, totalTabs) => {
      if (errors.apb_notice) {
        setErrors(prev => { const { apb_notice, ...rest } = prev; return rest; });
      }
      const errCount = touchAllInTab(activeTabIdx);
      if (errCount > 0) {
        setShowTabWarning(true);
        setTimeout(() => setShowTabWarning(false), 3000);
        return false;
      }
      setTabStatus((prev) => ({ ...prev, [activeTabIdx]: "complete" }));
      if (activeTabIdx < totalTabs - 1) {
        setActiveTab(activeTabIdx + 1);
      } else {
        navigate("/review");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    },
    [touchAllInTab, navigate, errors.apb_notice]
  );

  const handleSubmit = useCallback(async () => {
    touchAllInTab(10);
    const allErrors = computeErrors(formData);
    const criticalFields = ["declaration", "signatory", "place"];
    if (criticalFields.some((field) => allErrors[field])) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      if (currentSubmissionId) {
        await updateGSTForm(currentSubmissionId, formData, contactInfo);
      } else {
        await submitGSTForm(formData, contactInfo);
      }

      localStorage.setItem(STORAGE_KEY + "_submitted", JSON.stringify(formData));
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("gst_stage");
      navigate("/submitted");
    } catch (err) {
      setApiError(err.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, contactInfo, touchAllInTab, computeErrors, navigate, currentSubmissionId]);

  const resetForm = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("gst_stage");
    localStorage.removeItem("gst_contact");
    localStorage.removeItem("gst_otp_verified");
    setFormData(INITIAL_STATE);
    setCurrentSubmissionId(null);
    setActiveTab(0);
    setTouched({});
    setErrors({});
    setTabStatus({});
    navigate("/");
  }, [navigate]);

  const addPromoter = useCallback(() => {
    setFormData((prev) => {
      const ids = prev.promoter_ids || [""];
      const nextIdx = ids.length + 1;
      const newSuffix = `_${nextIdx}`;
      return {
        ...prev,
        promoter_ids: [...ids, newSuffix],
        [`name_first${newSuffix}`]: "",
        [`dob${newSuffix}`]: "",
        [`mobile${newSuffix}`]: "",
        [`email${newSuffix}`]: "",
        [`pan_proprietor${newSuffix}`]: "",
        [`photo${newSuffix}`]: null,
        [`country${newSuffix}`]: "IND",
        [`radiogroup${newSuffix}`]: null,
        [`toggle_2${newSuffix}`]: false,
        [`Also Authorized Signatory${newSuffix}`]: false,
      };
    });
  }, []);

  const removePromoter = useCallback((idToRemove) => {
    if (!idToRemove) return; // Can't remove the primary promoter
    setFormData((prev) => {
      const ids = (prev.promoter_ids || [""]).filter((id) => id !== idToRemove);
      return { ...prev, promoter_ids: ids };
    });
  }, []);

  return {
    formData, contactInfo, errors, touched, tabStatus, activeTab,
    setActiveTab, isSubmitting, apiError, showTabWarning, update,
    touch, applyAutoFill, handleSaveContinue, handleSubmit, resetForm,
    getTabErrors, computeErrors, fetchAddressByPin, fetchDrafts, 
    loadDraft, draftsList, currentSubmissionId, addPromoter, removePromoter
  };
}
