import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const ADT_STORAGE_KEY = "adt_form_v3_keys"; // New key to avoid conflicts

// ADT-1 Original Website Keys (MCA V3 Portal Mapping)
export const ADT_INITIAL_STATE = {
  cin: "", // Company Identification Number
  companyName: "",
  companyEmailId: "",
  isClass139_2: "", // Was companyClass
  natureOfAppt: "", // Was NOP
  otherNature: "",
  agm_selection: "", // Was AGM_S
  agmDate: "", // Was AGM_Date
  appDate: "", // Was DOA
  isJointAuditors: "", // Was Joint_AUD
  countAuditors: "1", // Was CountAud

  // Nested List: Matches the 'auditorDetailsList' key in the Original API
  auditorDetailsList: [
    {
      serialNo: "1",
      audCategory: "Auditor's Firm", // Firm or Individual
      audMembershipNo: "",
      audName: "",
      audPan: "",
      audAddr1: "",
      audAddrCity: "",
      audAddrDistrict: "",
      audAddrState: "",
      audEmail: "",
      
      firmFRN: "",
      firmName: "",
      firmPan: "",
      firmEmail: "",
      firmAddr1: "",
      firmCity: "",
      firmDistrict: "",
      firmState: "",
      
      WithinLimit: "", // Statutory Requirement
      tenure: "1",
      fyStart: "",
      fyEnd: ""
    }
  ],
  
  RecommendationAudit: "", 
  SRNINC_28: "",
  AuditorCasualVacancyReason_raw: "",
  otherReason: "",
  SRNRelevant: "",
  DateCasualVacancy: "",
  RegNoAudVacancyfirm: "",
  MembershipNoAud: "",
  ReasonCasualVacancy: "",
  
  declResolutionNumber: "",
  declDate: "",
  DSCDesignation: "",
  DIN_PAN_MembershipNo: "",
  declaration: false,
  place: ""
};

export function useADTForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(ADT_STORAGE_KEY);
      if (!saved) return ADT_INITIAL_STATE;
      return { ...ADT_INITIAL_STATE, ...JSON.parse(saved) };
    } catch {
      return ADT_INITIAL_STATE;
    }
  });

  const [contactInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("adt_contact")) || { mobile: "", email: "" };
    } catch {
      return { mobile: "", email: "" };
    }
  });

  useEffect(() => {
    localStorage.setItem(ADT_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const update = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const addAuditor = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      auditorDetailsList: [
        ...prev.auditorDetailsList,
        { ...ADT_INITIAL_STATE.auditorDetailsList[0], serialNo: (prev.auditorDetailsList.length + 1).toString() }
      ]
    }));
  }, []);

  const removeAuditor = useCallback((idx) => {
    setFormData(prev => {
      const next = prev.auditorDetailsList.filter((_, i) => i !== idx);
      // Re-index serial numbers
      const reindexed = next.map((aud, i) => ({ ...aud, serialNo: (i+1).toString() }));
      return { ...prev, auditorDetailsList: reindexed };
    });
  }, []);

  const updateAuditor = useCallback((index, field, value) => {
    setFormData(prev => {
      const nextList = [...prev.auditorDetailsList];
      nextList[index] = { ...nextList[index], [field]: value };
      return { ...prev, auditorDetailsList: nextList };
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const payload = {
      form_key: "adt_1_filing",
      form_data: {
        ...formData,
        countAuditors: (formData?.auditorDetailsList || []).length.toString(),
        // Final mapping audit: 
        // Ensure all numeric strings are indeed strings and booleans are as required by Original API
      }
    };

    console.log("Submitting to Original ADT-1 Bridge:", payload);

    try {
      // Points to our NEW ADT Bridge API
      const response = await fetch("http://localhost:8001/api/adt/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Bridge API Failure");

      const result = await response.json();
      localStorage.removeItem(ADT_STORAGE_KEY);
      localStorage.setItem("adt_submitted_data", JSON.stringify(payload));
      navigate("/gst/submitted");
      return result;
    } catch (error) {
      console.error(error);
      throw error; // Let UI handle the error state
    }
  }, [formData, navigate]);

  return {
    formData,
    contactInfo,
    update,
    addAuditor,
    removeAuditor,
    updateAuditor,
    handleSubmit
  };
}
