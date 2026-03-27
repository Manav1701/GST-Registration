import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { INITIAL_STATE, STORAGE_KEY } from "../constants/tabs.js";
import { validateField, TAB_REQUIRED_FIELDS } from "../constants/validation.js";
import { getStatesForCountry, COUNTRIES } from "../constants/dropdowns.js";
import {
  submitGSTForm,
  updateGSTForm,
  getSubmissions,
  getSubmission,
  saveDraft,
  getDraftsByMobile,
  getDraftById,
  getSubmissionsByMobile,
  deleteDraft,
} from "../api/gstApi.js";

// RECURSIVE SEARCH: Dives deep into any object to find a specific key-value pair
const findKeyDeep = (obj, targetKey) => {
  if (!obj || typeof obj !== "object") return undefined;
  if (Object.prototype.hasOwnProperty.call(obj, targetKey))
    return obj[targetKey];
  for (const k in obj) {
    if (obj[k] && typeof obj[k] === "object") {
      const result = findKeyDeep(obj[k], targetKey);
      if (result !== undefined) return result;
    }
  }
  return undefined;
};

// PAYLOAD EXTRACTOR: Dives deep into wrappers until it finds the actual form fields
const getFieldsRecursive = (obj) => {
  if (!obj || typeof obj !== "object") return {};
  // If this level has the core fields, this is the payload
  if (obj.legal_name || obj._contact_mobile || obj.trade_name || obj.mobile)
    return obj;
  // If it's a wrapper around form_data, dive in
  if (obj.form_data) return getFieldsRecursive(obj.form_data);
  return obj;
};

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

  const [currentSubmissionId, setCurrentSubmissionId] = useState(() => {
    try {
      const savedId = localStorage.getItem("gst_submission_id");
      return savedId ? parseInt(savedId, 10) : null;
    } catch {
      return null;
    }
  });

  const [currentDraftId, setCurrentDraftId] = useState(() => {
    try {
      const savedId = localStorage.getItem("gst_draft_id");
      return savedId ? parseInt(savedId, 10) : null;
    } catch {
      return null;
    }
  });

  const [draftsList, setDraftsList] = useState([]);
  const [submissionsList, setSubmissionsList] = useState([]);

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
      if (currentSubmissionId) {
        localStorage.setItem("gst_submission_id", currentSubmissionId.toString());
      } else {
        localStorage.removeItem("gst_submission_id");
      }
      
      if (currentDraftId) {
        localStorage.setItem("gst_draft_id", currentDraftId.toString());
      } else {
        localStorage.removeItem("gst_draft_id");
      }
    } catch {
      /* skip if quota full */
    }
  }, [formData, currentSubmissionId, currentDraftId]);

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
        return {
          stateName: po.State,
          district: po.District,
          city: po.Block || po.Name,
        };
      }
    } catch (err) {
      console.warn("[fetchAddressByPin] Failed:", err.message);
    }
    return null;
  }, []);

  const fetchDrafts = useCallback(async (mobile) => {
    if (!mobile) {
      setDraftsList([]);
      return;
    }
    try {
      const drafts = await getDraftsByMobile(mobile);
      setDraftsList(drafts || []);
    } catch (err) {
      console.error("Failed to load drafts:", err);
      setDraftsList([]);
    }
  }, []);

  const fetchSubmissionsByM = useCallback(async (mobile) => {
    if (!mobile) {
      setSubmissionsList([]);
      return;
    }
    try {
      const subs = await getSubmissionsByMobile(mobile);
      setSubmissionsList(subs || []);
    } catch (err) {
      console.error("Failed to load submissions:", err);
      setSubmissionsList([]);
    }
  }, []);

  const loadDraft = useCallback(async (id) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      const draft = await getDraftById(id);
      if (draft && draft.form_data) {
          setFormData({ ...INITIAL_STATE, ...draft.form_data });
          setCurrentDraftId(id);
          setActiveTab(draft.current_page || 0);
          
          // Clear current submission ID if we are switching to a draft
          setCurrentSubmissionId(null);
          localStorage.removeItem("gst_submission_id");
          
          setErrors({});
          setTouched({});
          setTabStatus({});
      }
    } catch (err) {
      console.error("Failed to load draft:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // New function to load a SUBMISSION for editing
  const loadSubmission = useCallback(async (id) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      // Fetches the full JSON from the server by ID
      const submission = await getSubmission(id);

      if (submission) {
        // USE SMART RECURSIVE EXTRACTOR to get fields from any depth level
        const raw = getFieldsRecursive(submission);
        const allStates = getStatesForCountry("IN");

        const processField = (key, val) => {
          // Only skip truly missing values — NOT false, NOT 0, NOT ""
          if (val === null || val === undefined) return val;

          const k = key.toLowerCase();

          // 1. DATE NORMALIZER (Ensure YYYY-MM-DD for HTML date inputs)
          if (k.includes("date") || k.includes("dob")) {
            if (typeof val !== "string") return val;
            const cleaned = val.replace(/[-]/g, "/");
            const parts = cleaned.split("/");
            if (parts.length === 3) {
              const [p1, p2, p3] = parts;
              if (p1.length === 4)
                return `${p1}-${p2.padStart(2, "0")}-${p3.padStart(2, "0")}`;
              return `${p3}-${p2.padStart(2, "0")}-${p1.padStart(2, "0")}`;
            }
            return val;
          }

          // 2. STATE MAPPER — convert full name to isoCode for dropdown
          if (
            k.includes("state") &&
            !k.includes("state_excise") &&
            !k.includes("statement")
          ) {
            const found = allStates.find(
              (s) =>
                s.label.toLowerCase() === String(val).toLowerCase() ||
                s.value === val
            );
            return found ? found.value : val;
          }

          // 3. COUNTRY MAPPER
          if (k.includes("country")) {
            if (val === "IND" || val === "India") return "IN";
            const found = COUNTRIES.find(
              (c) =>
                c.label.toLowerCase() === String(val).toLowerCase() ||
                c.value === val
            );
            return found ? found.value : val;
          }

          // 4. DISTRICT — pass through as-is
          if (k.includes("district")) return val;

          // 5. Booleans — keep as boolean, don't convert
          if (typeof val === "boolean") return val;

          // 6. Arrays — keep as-is
          if (Array.isArray(val)) return val;

          // 7. Objects — keep as-is
          if (typeof val === "object") return val;

          // 8. Everything else — pass through
          return val;
        };

        const processed = { ...raw };

        // 9. REPS & PROMOTERS SYNC: Map all gender fields to the unified 'radiogroup_1' scheme
        if (raw.radiogroup && !processed.radiogroup_1) {
          processed.radiogroup_1 = raw.radiogroup;
        }
        if (raw.radiogroup_2_2 && !processed.radiogroup_1_2) {
          processed.radiogroup_1_2 = raw.radiogroup_2_2;
        }
        if (raw.radiogroup_2 && !processed.radiogroup_2) {
          processed.radiogroup_2 = raw.radiogroup_2; // Ensure representative type stays separated
        }

        Object.keys(processed).forEach((key) => {
          processed[key] = processField(key, processed[key]);
        });

        // Strip any API wrapper keys that must never go into formData state
        [
          "form_key",
          "form_data",
          "id",
          "created_at",
          "updated_at",
          "raw_data",
        ].forEach((k) => delete processed[k]);

        // Clean merge: INITIAL_STATE as base, then DB values on top
        const nextData = {
          ...INITIAL_STATE,
          ...processed,
        };
        setFormData(nextData);
        setCurrentSubmissionId(id);
        setCurrentDraftId(null);
        
        // EXPLICIT PERSIST
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
        localStorage.setItem("gst_submission_id", String(id));
        localStorage.removeItem("gst_draft_id");
        
        setActiveTab(0);
        setErrors({});
        setTouched({});
        setTabStatus({});
      }
    } catch (err) {
      console.error("Failed to load submission:", err);
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
          "name_first",
          "name_last",
          "dob",
          "mobile",
          "email",
          "designation",
          "pan_proprietor",
          "country",
          "pin_code",
          "state_res",
          "district_res",
          "city_res",
          "road_street_res",
          "building_no_res",
        ];
        fields = ids.flatMap((id) =>
          baseFields.map((f) => (id ? `${f}${id}` : f))
        );
      }

      const newTouched = {};
      fields.forEach((f) => {
        newTouched[f] = true;
      });
      setTouched((prev) => ({ ...prev, ...newTouched }));
      const errs = computeErrors(formData);
      const newErrors = {};
      fields.forEach((f) => {
        if (errs[f]) newErrors[f] = errs[f];
      });
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return fields.filter((f) => errs[f]).length;
    },
    [formData, computeErrors]
  );

  const saveDraftToDB = useCallback(async (tabIdx) => {
    // Determine mobile number for identification
    const mobile = formData.mobile || formData._contact_mobile || contactInfo.mobile;
    if (!mobile) return null;

    try {
        // CRITICAL FIX: If we are CURRENTLY editing a previously submitted record,
        // we should update that record directly, NOT create a new draft.
        if (currentSubmissionId) {
            console.log("Syncing changes back to Submission #" + currentSubmissionId);
            return await updateGSTForm(currentSubmissionId, formData, contactInfo);
        }

        // Otherwise, save to Drafts table
        const result = await saveDraft(mobile, formData, tabIdx, currentDraftId);
        if (result.id && !currentDraftId) {
            setCurrentDraftId(result.id);
            // Also persist to localStorage so it's not lost on refresh
            localStorage.setItem("gst_draft_id", String(result.id));
        }
        return result;
    } catch (err) {
        console.error("Save Failed:", err);
        return null;
    }
  }, [formData, contactInfo.mobile, currentDraftId, currentSubmissionId]);

  const handleSaveContinue = useCallback(
    async (activeTabIdx, totalTabs, isContinue = true) => {
      if (errors.apb_notice) {
        setErrors((prev) => {
          const { apb_notice, ...rest } = prev;
          return rest;
        });
      }

      if (isContinue) {
          const errCount = touchAllInTab(activeTabIdx);
          if (errCount > 0) {
            setShowTabWarning(true);
            setTimeout(() => setShowTabWarning(false), 3000);
            return false;
          }
          setTabStatus((prev) => ({ ...prev, [activeTabIdx]: "complete" }));
          
          // AUTO-SYNC DATA on Continue
          await saveDraftToDB(activeTabIdx + 1);

          if (activeTabIdx < totalTabs - 1) {
            setActiveTab(activeTabIdx + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            navigate("/review");
          }
          return true;
      } else {
          // JUST SAVE (Manual Save)
          const res = await saveDraftToDB(activeTabIdx);
          return !!res;
      }
    },
    [touchAllInTab, navigate, errors.apb_notice, saveDraftToDB]
  );

  const handleSubmit = useCallback(async () => {
    touchAllInTab(3);
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

      // Cleanup Draft if exists
      if (currentDraftId) {
          await deleteDraft(currentDraftId);
      }

      localStorage.setItem(STORAGE_KEY + "_submitted", JSON.stringify(formData));
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("gst_submission_id");
      localStorage.removeItem("gst_draft_id");
      localStorage.removeItem("gst_stage");
      sessionStorage.removeItem("gst_sidebar_refs");
      
      setCurrentSubmissionId(null);
      setCurrentDraftId(null);
      navigate("/submitted");
    } catch (err) {
      setApiError(err.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formData,
    contactInfo,
    touchAllInTab,
    computeErrors,
    navigate,
    currentSubmissionId,
    currentDraftId,
    deleteDraft,
  ]);

  const resetForm = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("gst_stage");
    localStorage.removeItem("gst_submission_id");
    localStorage.removeItem("gst_draft_id");
    localStorage.removeItem("gst_contact");
    localStorage.removeItem("gst_otp_verified");
    setFormData(INITIAL_STATE);
    setCurrentSubmissionId(null);
    setCurrentDraftId(null);
    setActiveTab(0);
    setTouched({});
    setErrors({});
    setTabStatus({});
    navigate("/");
  }, [navigate, INITIAL_STATE]);

  // Clears the selected draft WITHOUT full reset — stays on the form page so
  // user can start filling a brand new registration after reviewing an old one.
  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("gst_submission_id");
    localStorage.removeItem("gst_draft_id");
    localStorage.removeItem("gst_submission_name");
    setFormData(INITIAL_STATE);
    setCurrentSubmissionId(null);
    setCurrentDraftId(null);
    setActiveTab(0);
    setTouched({});
    setErrors({});
    setTabStatus({});
  }, [INITIAL_STATE]);

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
        [`radiogroup_1${newSuffix}`]: null,
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
    formData,
    contactInfo,
    errors,
    touched,
    tabStatus,
    activeTab,
    setActiveTab,
    isSubmitting,
    apiError,
    showTabWarning,
    update,
    touch,
    applyAutoFill,
    handleSaveContinue,
    handleSubmit,
    resetForm,
    clearDraft,
    getTabErrors,
    computeErrors,
    fetchAddressByPin,
    fetchDrafts,
    fetchSubmissionsByM,
    loadDraft,
    loadSubmission,
    draftsList,
    submissionsList,
    currentSubmissionId,
    currentDraftId,
    addPromoter,
    removePromoter,
  };
}
