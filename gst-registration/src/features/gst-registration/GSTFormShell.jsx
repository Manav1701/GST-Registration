import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGSTForm } from "../../hooks/useGSTForm.js";
import { TABS } from "../../constants/tabs.js";

// Tab pages
import Tab1_BusinessAndGoods from "./tabs/Tab1_BusinessAndGoods.jsx";
import Tab2_People from "./tabs/Tab2_People.jsx";
import Tab3_PlaceOfBusiness from "./tabs/Tab3_PlaceOfBusiness.jsx";
import Tab4_AadhaarAndVerify from "./tabs/Tab4_AadhaarAndVerify.jsx";

export default function GSTFormShell() {
  const navigate = useNavigate();
  const {
    formData,
    contactInfo,
    errors,
    touched,
    tabStatus,
    activeTab,
    setActiveTab,
    showTabWarning,
    update,
    touch,
    handleSaveContinue,
    getTabErrors,
    fetchAddressByPin,
    fetchDrafts,
    loadDraft,
    clearDraft,
    draftsList,
    currentSubmissionId,
    resetForm,
    addPromoter,
    removePromoter,
  } = useGSTForm();

  const fileInputRef = useRef(null);
  const [uploadTarget, setUploadTarget] = useState(null);
  const [sidebarTab, setSidebarTab] = useState(import.meta.env.VITE_DEV ? "docs" : "pages");
  const [selectedDoc, setSelectedDoc] = useState(null);
  
  // Persistent Sidebar Reference Docs
  const [sidebarRefDocs, setSidebarRefDocs] = useState(() => {
    const saved = sessionStorage.getItem("gst_sidebar_refs");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    sessionStorage.setItem("gst_sidebar_refs", JSON.stringify(sidebarRefDocs));
  }, [sidebarRefDocs]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Drag-to-Pan State
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setDragStart({
      x: e.pageX,
      y: e.pageY,
      scrollLeft: scrollRef.current.scrollLeft,
      scrollTop: scrollRef.current.scrollTop
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX;
    const y = e.pageY;
    const walkX = (x - dragStart.x) * 1.1; // Speed multiplier
    const walkY = (y - dragStart.y) * 1.1;
    scrollRef.current.scrollLeft = dragStart.scrollLeft - walkX;
    scrollRef.current.scrollTop = dragStart.scrollTop - walkY;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // Helper to get all uploaded docs from formData
  const getUploadedDocs = () => {
    const docFields = [
      { id: "pan", field: "constitution_document", label: "Business PAN" },
      { id: "photo_1", field: "photo", label: "Promoter Photo" },
      { id: "aadhaar_1", field: "aadhaar", label: "Aadhaar Card" },
      { id: "ppb_proof", field: "ppb_file", label: "Premises Proof" },
      { id: "as_photo", field: "as_photo", label: "Signatory Photo" },
      { id: "as_proof", field: "as_proof_file", label: "Auth Letter/Proof" },
    ];
    // Dynamic promoters
    (formData.promoter_ids || []).forEach(sfx => {
      if (sfx) docFields.push({ id: `photo${sfx}`, field: `photo${sfx}`, label: `Partner Photo (${sfx.replace('_','')})` });
    });

    return docFields.map(doc => {
      const officialValue = formData[doc.field];
      const refValue = sidebarRefDocs[doc.field];
      return {
        ...doc,
        value: officialValue || refValue,
        isOfficial: !!officialValue,
        isReference: !!refValue && !officialValue
      };
    });
  };

  const handleSidebarUploadClick = (field) => {
    setUploadTarget(field);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !uploadTarget) return;

    if (file.size > 2 * 1024 * 1024) { 
      alert("File is too large (max 2MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      // STORE ONLY IN SIDEBAR STATE, NOT FORM DATA
      setSidebarRefDocs(prev => ({ ...prev, [uploadTarget]: base64 }));
      
      // Automatically preview
      const docData = getUploadedDocs().find(d => d.field === uploadTarget);
      if (docData) {
        setSelectedDoc({ ...docData, src: base64, isReference: true });
        setIsSidebarCollapsed(true);
        setZoom(1);
        setRotation(0);
      }
      setUploadTarget(null);
    };
    reader.readAsDataURL(file);
    e.target.value = ""; 
  };

  // Load existing submissions list for this specific mobile number or name
  useEffect(() => {
    // 1. Try saved contact info
    // 2. Try current form values (Live Search)
   const searchParam = contactInfo.mobile;
    fetchDrafts(searchParam);
  }, [fetchDrafts, contactInfo.mobile, formData.mobile, formData.legal_name]);

  // Sync active tab to sessionStorage so MainLayout progress bar can read it
  useEffect(() => {
    sessionStorage.setItem("gst_active_tab", String(activeTab));
  }, [activeTab]);

  const props = {
    data: formData,
    update,
    errors,
    touched,
    touch,
    fetchAddressByPin,
  };

  const pages = [
    <Tab1_BusinessAndGoods {...props} />,
    <Tab2_People
      {...props}
      addPromoter={addPromoter}
      removePromoter={removePromoter}
    />,
    <Tab3_PlaceOfBusiness {...props} />,
    <Tab4_AadhaarAndVerify {...props} />,
  ];

  const tabErrors = getTabErrors(activeTab, formData);

  return (
    <div className="main-container">
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: "none" }} 
        accept="image/*,.pdf"
        onChange={onFileChange} 
      />
      {/* Sidebar Workspace */}
      <aside className="sidebar-sticky" style={{ 
        width: isSidebarCollapsed ? 58 : 248, 
        flexShrink: 0, 
      }}>
        {isSidebarCollapsed ? (
          <button 
            onClick={() => setIsSidebarCollapsed(false)}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#1B4FD8",
              border: "none",
              boxShadow: "0 6px 16px rgba(27,79,216,0.3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "#fff",
              marginLeft: 7,
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            title="Expand Tools"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
          </button>
        ) : (
          <div
            className="sidebar-content"
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #E2E8F0",
              height: "calc(100vh - 110px)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 1px 5px rgba(15,23,42,0.05)",
              position: "relative"
            }}
          >
             {/* Dynamic Collapse Button (Floating) */}
             <button 
              onClick={() => setIsSidebarCollapsed(true)}
              style={{
                position: "absolute",
                top: 14,
                right: -14,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#fdfdfd",
                border: "1.5px solid #E2E8F0",
                color: "#1B4FD8",
                fontSize: 10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 110,
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#1B4FD8";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "#1B4FD8";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#1B4FD8";
                e.currentTarget.style.borderColor = "#E2E8F0";
              }}
              title="Collapse"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
            </button>
          {/* Professional Segmented Control */}
          <div style={{ 
            padding: "8px", 
            background: "#F1F5F9", 
            borderRadius: 12, 
            margin: "12px 10px 10px", 
            display: "flex", 
            gap: 6 
          }}>
            <button
              onClick={() => setSidebarTab("pages")}
              style={{
                flex: 1,
                padding: "8px 0",
                fontSize: 10.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderRadius: 8,
                background: sidebarTab === "pages" ? "#fff" : "transparent",
                color: sidebarTab === "pages" ? "#1B4FD8" : "#64748B",
                border: "none",
                boxShadow: sidebarTab === "pages" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20a2 2 0 002-2V5a2 2 0 00-2-2H6.5A2.5 2.5 0 004 5.5v14z"/></svg>
              Pages
            </button>
            <button
              onClick={() => setSidebarTab("docs")}
              style={{
                flex: 1,
                padding: "8px 0",
                fontSize: 10.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderRadius: 8,
                background: sidebarTab === "docs" ? "#fff" : "transparent",
                color: sidebarTab === "docs" ? "#1B4FD8" : "#64748B",
                border: "none",
                boxShadow: sidebarTab === "docs" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              Documents
              {getUploadedDocs().filter(d => d.value).length > 0 && (
                <div style={{ 
                  background: "#1B4FD8", 
                  color: "#fff", 
                  borderRadius: 20, 
                  minWidth: 16, 
                  height: 16, 
                  fontSize: 9, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontWeight: 800
                }}>
                  {getUploadedDocs().filter(d => d.value).length}
                </div>
              )}
            </button>
          </div>

          <div style={{ background: "#fff", borderTop: "1px solid #F1F5F9" }}>
            {sidebarTab === "pages" ? (
              <nav style={{ padding: "10px 0" }}>
                {TABS.map((tab, i) => {
                  const isActive = i === activeTab;
                  const isComplete = tabStatus[i] === "complete";
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setActiveTab(i);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "9px 18px",
                        background: isActive ? "#EEF4FF" : "transparent",
                        border: "none",
                        borderLeft: isActive
                          ? "3px solid #1B4FD8"
                          : "3px solid transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: isComplete ? 11 : 10.5,
                          fontWeight: 800,
                          background: isActive
                            ? "#1B4FD8"
                            : isComplete
                            ? "#D1FAE5"
                            : "#F1F5F9",
                          color: isActive
                            ? "#fff"
                            : isComplete
                            ? "#065F46"
                            : "#94A3B8",
                        }}
                      >
                        {isComplete ? "✓" : i + 1}
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "#1B4FD8" : "#475569",
                          lineHeight: 1.35,
                        }}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            ) : (
            <div style={{ padding: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                {getUploadedDocs().map((doc) => {
                  const targetTab = doc.id.includes("pan") ? 0 : 
                                    (doc.id.includes("ppb") ? 2 : 1);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => {
                        if (doc.value) {
                          setSelectedDoc({ ...doc, src: doc.value });
                          setIsSidebarCollapsed(true);
                          setZoom(1);
                          setRotation(0);
                        } else {
                          handleSidebarUploadClick(doc.field);
                        }
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: 10,
                        border: "1.5px solid",
                        borderColor: doc.value ? (selectedDoc?.id === doc.id ? "#1B4FD8" : "#E2E8F0") : "#F1F5F9",
                        background: doc.value ? "#fff" : "#F8FAFC",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        position: "relative"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ 
                          width: 32, height: 32, borderRadius: 6, 
                          background: doc.value ? "#EEF4FF" : "#F1F5F9", 
                          display: "flex", alignItems: "center", justifyContent: "center" 
                        }}>
                          {doc.value ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B4FD8" strokeWidth="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          ) : (
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#CBD5E1" }} />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: doc.value ? "#1E293B" : "#94A3B8" }}>
                            {doc.label}
                          </div>
                          <div style={{ fontSize: 9.5, color: doc.isOfficial ? "#10B981" : (doc.isReference ? "#1B4FD8" : "#64748B"), fontWeight: 700 }}>
                            {doc.isOfficial ? "Official Copy" : (doc.isReference ? "Reference Only" : "Click to Upload")}
                          </div>
                        </div>
                        {doc.value ? (
                          <div style={{ animation: "pulse 2s infinite" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          </div>
                        ) : (
                          <div style={{ width: 18, height: 18, borderRadius: "50%", border: "1px dashed #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 10, color: "#94A3B8" }}>+</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          </div>
          {/* Re-upload documents button */}
          <div style={{ padding: "10px 18px", borderTop: "1px solid #F1F5F9" }}>
            <button
              onClick={() => navigate("/documents")}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "#F8FAFC",
                border: "1.5px solid #E2E8F0",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                color: "#64748B",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              Re-upload Documents
            </button>
          </div>
            {/* Auto-saved indicator */}
            <div style={{ padding: "8px 18px 12px", background: "#F8FAFC" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                <span style={{ fontSize: 10.5, color: "#64748B", fontWeight: 600 }}>Auto-saved to browser</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Draft Selector Bar */}
        <div
          style={{
            background: currentSubmissionId
              ? "linear-gradient(to right,#FFFBEB,#FEF9C3)"
              : "linear-gradient(to right,#F8FAFC,#fff)",
            border: currentSubmissionId
              ? "1.5px solid #FCD34D"
              : "1.5px dashed #CBD5E1",
            borderRadius: 14,
            padding: "12px 20px",
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.3s",
            flexWrap: "wrap",
            gap: 12
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 200 }}>
            <div
              className="hide-mobile"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: currentSubmissionId ? "#FEF3C7" : "#F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0
              }}
            >
              {currentSubmissionId ? "📝" : "📂"}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: currentSubmissionId ? "#92400E" : "#64748B",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 2,
                }}
              >
                {currentSubmissionId
                  ? `✏️ Editing Record #${currentSubmissionId}`
                  : "Resume Application"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <select
                  value={currentSubmissionId || ""}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      // User deselected — go back to fresh new registration
                      clearDraft();
                    } else {
                      loadDraft(e.target.value);
                    }
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1E293B",
                    cursor: "pointer",
                    padding: "2px 0",
                    maxWidth: "100%"
                  }}
                >
                  <option value="">✨ New Registration (fresh form)</option>
                  {draftsList.map((draft) => (
                    <option key={draft.id} value={draft.id}>
                      👤 {draft.legal_name}
                    </option>
                  ))}
                </select>

                {/* Clear selection button — only visible when a draft is loaded */}
                {currentSubmissionId && (
                  <button
                    type="button"
                    title="Deselect this record and start a fresh new registration"
                    onClick={clearDraft}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "3px 10px",
                      background: "#FFF7ED",
                      border: "1px solid #FCD34D",
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: "#B45309",
                      cursor: "pointer",
                    }}
                  >
                    ✖ <span className="hide-mobile">Deselect</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={resetForm}
            style={{
              padding: "8px 16px",
              background: "#fff",
              border: "1.5px solid #E2E8F0",
              borderRadius: 9,
              fontSize: 12.5,
              fontWeight: 700,
              color: "#1B4FD8",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#F1F5F9")}
            onMouseOut={(e) => (e.target.style.background = "#fff")}
          >
            🏠 <span className="hide-mobile">Home</span>
          </button>
        </div>

        {showTabWarning && (
          <div
            style={{
              background: "#FFFBEB",
              border: "1px solid #F59E0B",
              borderRadius: 10,
              padding: "13px 17px",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}
          >
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "#92400E" }}>
              Please fix {tabErrors.length} validation error
              {tabErrors.length > 1 ? "s" : ""} before continuing.
            </span>
          </div>
        )}

        {/* Tab header */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: "18px 26px",
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
            flexWrap: "wrap",
            gap: 12
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "14px",
                background: "linear-gradient(135deg,#EEF4FF,#DBEAFE)",
                border: "2px solid #C7D9FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 800,
                color: "#1B4FD8",
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              {String(activeTab + 1).padStart(2, "0")}
            </div>
            <div>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: "#1B4FD8",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: 2,
                }}
              >
                {currentSubmissionId
                  ? "📝 Updating Entry #" + currentSubmissionId
                  : "🆕 New Registration"}
              </div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#1E293B",
                  letterSpacing: "-0.02em",
                }}
              >
                {TABS[activeTab].label}
              </h2>
            </div>
          </div>
          {currentSubmissionId && (
            <div
              style={{
                padding: "6px 14px",
                background: "#FEF3C7",
                color: "#92400E",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 14 }}>🛡️</span> EDIT MODE
            </div>
          )}
        </div>

        {pages[activeTab]}

        {/* Navigation footer */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: "16px 26px",
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
            flexWrap: "wrap",
            gap: 12
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (activeTab > 0) {
                setActiveTab(activeTab - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            disabled={activeTab === 0}
            className="nav-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 20px",
              border: "1.5px solid #E2E8F0",
              background: "#fff",
              borderRadius: 9,
              fontSize: 13.5,
              fontWeight: 600,
              color: activeTab === 0 ? "#CBD5E1" : "#374151",
              cursor: activeTab === 0 ? "not-allowed" : "pointer",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11.5, color: "#94A3B8", fontWeight: 600 }}>
              {activeTab + 1}/{TABS.length}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              {TABS.map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setActiveTab(i);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    width: i === activeTab ? 16 : 6,
                    height: 6,
                    borderRadius: 3,
                    background:
                      i === activeTab
                        ? "#1B4FD8"
                        : tabStatus[i] === "complete"
                        ? "#C7D9FF"
                        : "#E2E8F0",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveContinue(activeTab, TABS.length)}
            className="nav-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 22px",
              background: "linear-gradient(135deg,#1B4FD8,#2563EB)",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(27,79,216,0.28)",
            }}
          >
            {activeTab < TABS.length - 1 ? "Save & Continue" : "Go to Review"}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </main>

      {/* Right Preview Workspace (Dynamic 40-50%) */}
      {selectedDoc && (
        <aside style={{ 
          width: isSidebarCollapsed ? "50%" : "40%", 
          flexShrink: 0, 
          position: "sticky", 
          top: 82, 
          height: "calc(100vh - 110px)",
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-10px 0 35px rgba(15,23,42,0.12)",
          animation: "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden"
        }}>
          {/* Action Bar */}
          <div style={{ padding: "12px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#EEF4FF,#DBEAFE)", border: "1.5px solid #C7D9FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B4FD8" strokeWidth="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{selectedDoc.label}</div>
                <div style={{ fontSize: 10, color: "#1B4FD8", fontWeight: 700 }}>Workspace Tools</div>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F1F5F9", padding: "4px", borderRadius: 10 }}>
              <button 
                onClick={() => setZoom(z => Math.max(0.2, z - 0.2))}
                title="Zoom Out"
                style={{ width: 28, height: 28, border: "none", background: "#fff", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                - 
              </button>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#64748B", width: 34, textAlign: "center" }}>{Math.round(zoom * 100)}%</div>
              <button 
                onClick={() => setZoom(z => Math.min(4, z + 0.2))}
                title="Zoom In"
                style={{ width: 28, height: 28, border: "none", background: "#fff", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                + 
              </button>
              <div style={{ width: 1, height: 16, background: "#CBD5E1", margin: "0 4px" }} />
              <button 
                onClick={() => setRotation(r => r + 90)}
                title="Rotate 90°"
                style={{ width: 28, height: 28, border: "none", background: "#fff", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              </button>
              <button 
                onClick={() => handleSidebarUploadClick(selectedDoc.field)}
                title="Change File"
                style={{ width: 28, height: 28, border: "none", background: "#fff", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1B4FD8" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
              </button>
              <button 
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = selectedDoc.src;
                  link.download = `GST_Doc_${selectedDoc.label.replace(/\s/g,'_')}.png`;
                  link.click();
                }}
                title="Download"
                style={{ width: 28, height: 28, border: "none", background: "#fff", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              </button>
            </div>

            <button 
              onClick={() => setSelectedDoc(null)}
              style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "#F1F5F9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Zoomable Content Area */}
          <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onWheel={(e) => {
              // DIRECT ZOOM without requiring Ctrl for better UX in this split-view context
              e.preventDefault();
              const delta = e.deltaY > 0 ? -0.12 : 0.12;
              setZoom(z => Math.min(4, Math.max(0.1, z + delta)));
            }}
            style={{ 
              flex: 1, 
              overflow: "hidden", // Hide actual scrollbars for clean "Hand Pan" look
              background: "#1e293b", 
              position: "relative",
              display: "grid",
              placeItems: "center",
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
              touchAction: "none"
            }}
          >
            <div style={{ 
              transition: "transform 0.08s ease-out",
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: "center center",
              padding: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {selectedDoc.src ? (
                <img 
                  src={selectedDoc.src} 
                  alt={selectedDoc.label} 
                  style={{ 
                    maxWidth: "none", 
                    width: "auto",
                    height: "auto",
                    maxHeight: "70vh",
                    borderRadius: 4, 
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                    pointerEvents: "none" 
                  }} 
                />
              ) : (
                <div style={{ textAlign: "center", color: "#64748B" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📂</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Select a document to review</div>
                </div>
              )}
            </div>
            
            {/* Quick Zoom Indicator Overlay */}
            <div style={{ position: "absolute", bottom: 15, right: 15, padding: "5px 12px", background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, color: "#fff", fontSize: 11, fontWeight: 800, backdropFilter: "blur(6px)", zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              {Math.round(zoom * 100)}%
            </div>
          </div>

          <div style={{ padding: "10px 18px", background: "#fff", borderTop: "1px solid #F1F5F9", zIndex: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 14 }}>💡</span> <b>Scroll</b> to Zoom | <b>Click & Drag</b> to Pan (Left/Right/All)
              </p>
              <button 
                onClick={() => { setZoom(1); setRotation(0); }}
                style={{ border: "none", background: "none", color: "#1B4FD8", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
              >
                Reset View
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
