import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { INITIAL_STATE, STORAGE_KEY } from "../constants/tabs.js";
import { validateField, TAB_REQUIRED_FIELDS } from "../constants/validation.js";
import { submitGSTForm } from "../api/gstApi.js";

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

  // Auto-save to localStorage on every formData change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {
      /* ignore quota errors */
    }
  }, [formData]);

  const computeErrors = useCallback((data) => {
    const errs = {};
    Object.keys(data).forEach((k) => {
      const err = validateField(k, data[k]);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  }, []);

  const touch = useCallback(
    (name) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, formData[name]),
      }));
    },
    [formData]
  );

  const applyAutoFill = useCallback((autoFilled) => {
    if (autoFilled && Object.keys(autoFilled).length > 0) {
      setFormData((prev) => ({ ...prev, ...autoFilled }));
    }
  }, []);

  const touchAllInTab = useCallback(
    (tabIdx) => {
      const fields = TAB_REQUIRED_FIELDS[tabIdx] || [];
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

  const handleSaveContinue = useCallback(
    (activeTab, totalTabs) => {
      const errCount = touchAllInTab(activeTab);
      if (errCount > 0) {
        setShowTabWarning(true);
        setTimeout(() => setShowTabWarning(false), 3000);
        return false;
      }
      setTabStatus((prev) => ({ ...prev, [activeTab]: "complete" }));
      if (activeTab < totalTabs - 1) {
        setActiveTab(activeTab + 1);
      } else {
        navigate("/review");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    },
    [touchAllInTab, navigate]
  );

  const handleSubmit = useCallback(async () => {
    touchAllInTab(10);
    const allErrors = computeErrors(formData);
    const criticalFields = ["declaration", "signatory", "place"];
    if (criticalFields.some((field) => allErrors[field])) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await submitGSTForm(formData, contactInfo);

      // Save data for success page summary before clearing
      localStorage.setItem(
        STORAGE_KEY + "_submitted",
        JSON.stringify(formData)
      );

      // Clear all session data on success
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("gst_stage");
      // Keep contact and verified status briefly for the success page if needed,
      // but SubmittedPage clears them on "Start New" anyway.
      // Actually, SubmittedPage needs gst_contact too.
      // localStorage.removeItem("gst_contact"); // Don't remove yet
      // localStorage.removeItem("gst_otp_verified");

      navigate("/submitted");
    } catch (err) {
      setApiError(
        err.message ||
          "Failed to submit. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, contactInfo, touchAllInTab, computeErrors, navigate]);

  const resetForm = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("gst_stage");
    localStorage.removeItem("gst_contact");
    localStorage.removeItem("gst_otp_verified");
    setFormData(INITIAL_STATE);
    setActiveTab(0);
    setTouched({});
    setErrors({});
    setTabStatus({});
    navigate("/");
  }, [navigate]);

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
    getTabErrors,
    computeErrors,
  };
}
