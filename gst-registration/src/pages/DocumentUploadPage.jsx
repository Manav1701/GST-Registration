import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DOCUMENT_CONFIGS } from "../constants/dropdowns.js";
import { extractDocument } from "../api/gstApi.js";
import { STORAGE_KEY } from "../constants/tabs.js";

export default function DocumentUploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [extracting, setExtracting] = useState(false);
  const [extractStatus, setExtractStatus] = useState({});
  const [allExtracted, setAllExtracted] = useState({});
  const [showPreview, setShowPreview] = useState(null);
  const [error, setError] = useState("");

  const handleFileSelect = (docKey, file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError(`File too large (max 5MB): ${file.name}`);
      return;
    }
    setError("");
    setFiles((prev) => ({ ...prev, [docKey]: file }));
    setExtractStatus((prev) => ({ ...prev, [docKey]: "idle" }));
    const reader = new FileReader();
    reader.onload = (e) =>
      setPreviews((prev) => ({ ...prev, [docKey]: e.target.result }));
    reader.readAsDataURL(file);
  };

  const removeFile = (docKey) => {
    setFiles((prev) => {
      const n = { ...prev };
      delete n[docKey];
      return n;
    });
    setPreviews((prev) => {
      const n = { ...prev };
      delete n[docKey];
      return n;
    });
    setExtractStatus((prev) => {
      const n = { ...prev };
      delete n[docKey];
      return n;
    });
  };

  const toBase64 = (file) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(",")[1]);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  const handleExtractAll = async () => {
    const docKeys = Object.keys(files);
    if (docKeys.length === 0) {
      setError("Please upload at least one document.");
      return;
    }
    setError("");
    setExtracting(true);
    const merged = { ...allExtracted };
    for (const docKey of docKeys) {
      if (extractStatus[docKey] === "done") continue;
      setExtractStatus((prev) => ({ ...prev, [docKey]: "loading" }));
      try {
        const file = files[docKey];
        const base64 = await toBase64(file);
        // extractDocument returns { extracted: {...}, confidence: 0.95 }
        // When backend is live, this auto-fills all matching form fields
        const result = await extractDocument(docKey, base64, file.type);
        if (result.extracted) {
          Object.entries(result.extracted).forEach(([k, v]) => {
            if (v !== null && v !== undefined && v !== "") merged[k] = v;
          });
        }
        setExtractStatus((prev) => ({ ...prev, [docKey]: "done" }));
      } catch {
        setExtractStatus((prev) => ({ ...prev, [docKey]: "error" }));
      }
    }
    setAllExtracted(merged);
    setExtracting(false);
  };

  // Apply auto-filled fields to formData in localStorage, then navigate to form
  const handleProceedToForm = () => {
    if (Object.keys(allExtracted).length > 0) {
      try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...existing, ...allExtracted })
        );
      } catch {
        /* ignore */
      }
    }
    navigate("/form");
  };

  const anyFileUploaded = Object.keys(files).length > 0;
  const totalFields = Object.keys(allExtracted).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F6FA",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #E2E8F0",
          boxShadow: "0 1px 5px rgba(15,23,42,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 24px",
            height: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg,#1B4FD8,#3B82F6)",
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1E293B" }}>
                GST Registration
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: "#1B4FD8",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                STEP 2 — DOCUMENT UPLOAD
              </div>
            </div>
          </div>
          {/* Steps */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {["Contact", "OTP", "Documents", "Form", "Review"].map((s, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                <div
                  style={{
                    width: i === 2 ? 28 : 24,
                    height: i === 2 ? 28 : 24,
                    borderRadius: "50%",
                    background:
                      i < 2 ? "#DCFCE7" : i === 2 ? "#1B4FD8" : "#E2E8F0",
                    color: i < 2 ? "#059669" : i === 2 ? "#fff" : "#94A3B8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                >
                  {i < 2 ? "✓" : i + 1}
                </div>
                {i < 4 && (
                  <div
                    style={{
                      width: 16,
                      height: 2,
                      background: i < 2 ? "#DCFCE7" : "#E2E8F0",
                      borderRadius: 1,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
        {/* Title */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: "22px 28px",
            marginBottom: 22,
            boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#1E293B",
                marginBottom: 6,
              }}
            >
              Upload Your Documents
            </h2>
            <p
              style={{
                fontSize: 13.5,
                color: "#64748B",
                lineHeight: 1.65,
                maxWidth: 560,
              }}
            >
              Upload your documents below. Click{" "}
              <strong style={{ color: "#1B4FD8" }}>Extract & Auto-fill</strong>{" "}
              to automatically fill form fields from your documents. Fields
              marked{" "}
              <span style={{ color: "#EF4444", fontWeight: 700 }}>*</span> are
              required.
            </p>
          </div>
          <div
            style={{
              background: "#EEF4FF",
              border: "1px solid #C7D9FF",
              borderRadius: 10,
              padding: "10px 16px",
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1B4FD8" }}>
              {Object.keys(files).length}/{DOCUMENT_CONFIGS.length}
            </div>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>
              Uploaded
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 16,
              color: "#DC2626",
              fontWeight: 600,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 16,
            marginBottom: 20,
          }}
        >
          {DOCUMENT_CONFIGS.map((doc) => {
            const file = files[doc.key];
            const preview = previews[doc.key];
            const status = extractStatus[doc.key] || "idle";
            const isImage = file && file.type.startsWith("image/");
            return (
              <div
                key={doc.key}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: `1.5px solid ${file ? doc.borderColor : "#E2E8F0"}`,
                  overflow: "hidden",
                  boxShadow: file
                    ? `0 2px 12px ${doc.bgColor}80`
                    : "0 1px 4px rgba(15,23,42,0.04)",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    padding: "13px 16px",
                    background: file ? doc.bgColor : "#F8FAFC",
                    borderBottom: "1px solid #F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      fontSize: 18,
                      background: file ? doc.bgColor : "#F1F5F9",
                      border: `1.5px solid ${
                        file ? doc.borderColor : "#E2E8F0"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {status === "loading" ? (
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          border: `2px solid ${doc.color}40`,
                          borderTopColor: doc.color,
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    ) : status === "done" ? (
                      "✅"
                    ) : status === "error" ? (
                      "⚠️"
                    ) : (
                      doc.icon
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: "#1E293B",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      {doc.label}
                      {!doc.optional && (
                        <span style={{ color: "#EF4444" }}>*</span>
                      )}
                      {doc.optional && (
                        <span
                          style={{
                            fontSize: 10,
                            background: "#F1F5F9",
                            color: "#94A3B8",
                            padding: "1px 6px",
                            borderRadius: 10,
                            fontWeight: 600,
                          }}
                        >
                          Optional
                        </span>
                      )}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}
                    >
                      {doc.description}
                    </div>
                  </div>
                  {status === "done" && (
                    <span
                      style={{
                        fontSize: 10.5,
                        background: "#DCFCE7",
                        color: "#059669",
                        padding: "3px 8px",
                        borderRadius: 20,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      Extracted
                    </span>
                  )}
                </div>
                <div style={{ padding: 14 }}>
                  {!file ? (
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px dashed #CBD5E1",
                        borderRadius: 10,
                        padding: "22px 16px",
                        cursor: "pointer",
                        background: "#FAFBFD",
                        minHeight: 100,
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = doc.color;
                        e.currentTarget.style.background = doc.bgColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#CBD5E1";
                        e.currentTarget.style.background = "#FAFBFD";
                      }}
                    >
                      <input
                        type="file"
                        accept={doc.accept}
                        style={{ display: "none" }}
                        onChange={(e) =>
                          handleFileSelect(doc.key, e.target.files[0])
                        }
                      />
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#94A3B8"
                        strokeWidth="1.5"
                        style={{ marginBottom: 8 }}
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                      <span
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#64748B",
                        }}
                      >
                        Click to upload
                      </span>
                      <span
                        style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}
                      >
                        JPG, PNG or PDF — max 5MB
                      </span>
                    </label>
                  ) : (
                    <div>
                      {isImage && preview && (
                        <div style={{ position: "relative", marginBottom: 10 }}>
                          <img
                            src={preview}
                            alt="preview"
                            style={{
                              width: "100%",
                              height: 120,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: `1px solid ${doc.borderColor}`,
                            }}
                          />
                          <button
                            onClick={() => setShowPreview(doc.key)}
                            style={{
                              position: "absolute",
                              top: 6,
                              right: 6,
                              background: "rgba(0,0,0,0.55)",
                              border: "none",
                              borderRadius: 6,
                              padding: "3px 8px",
                              fontSize: 11,
                              color: "#fff",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            View
                          </button>
                        </div>
                      )}
                      {!isImage && (
                        <div
                          style={{
                            background: doc.bgColor,
                            border: `1px solid ${doc.borderColor}`,
                            borderRadius: 8,
                            padding: "14px 14px",
                            marginBottom: 10,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={doc.color}
                            strokeWidth="1.5"
                          >
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <div>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#1E293B",
                              }}
                            >
                              {file.name}
                            </div>
                            <div style={{ fontSize: 11, color: "#94A3B8" }}>
                              {(file.size / 1024).toFixed(0)} KB
                            </div>
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11.5,
                            color: "#64748B",
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "70%",
                          }}
                        >
                          {file.name}
                        </span>
                        <button
                          onClick={() => removeFile(doc.key)}
                          style={{
                            background: "#FEF2F2",
                            border: "1px solid #FECACA",
                            borderRadius: 6,
                            padding: "3px 9px",
                            fontSize: 11.5,
                            color: "#DC2626",
                            fontWeight: 600,
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      <div
                        style={{
                          marginTop: 10,
                          padding: "8px 10px",
                          background: "#F8FAFC",
                          borderRadius: 7,
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: "#94A3B8",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginBottom: 4,
                          }}
                        >
                          Will auto-fill
                        </div>
                        <div
                          style={{ display: "flex", flexWrap: "wrap", gap: 4 }}
                        >
                          {doc.fillsFields.map((f) => (
                            <span
                              key={f}
                              style={{
                                fontSize: 10.5,
                                background: doc.bgColor,
                                color: doc.color,
                                border: `1px solid ${doc.borderColor}`,
                                borderRadius: 5,
                                padding: "2px 6px",
                                fontWeight: 600,
                              }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {totalFields > 0 && (
          <div
            style={{
              background: "#F0FDF4",
              border: "1.5px solid #BBF7D0",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#DCFCE7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 20,
              }}
            >
              ✅
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#166534" }}>
                {totalFields} field{totalFields > 1 ? "s" : ""} ready to
                auto-fill!
              </div>
              <div style={{ fontSize: 12, color: "#15803D", marginTop: 2 }}>
                Click "Proceed to Form" — these will be applied to your
                registration form automatically.
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
          }}
        >
          <button
            onClick={() => navigate("/form")}
            style={{
              background: "none",
              border: "1.5px solid #E2E8F0",
              borderRadius: 9,
              padding: "10px 20px",
              fontSize: 13.5,
              fontWeight: 600,
              color: "#64748B",
              cursor: "pointer",
            }}
          >
            Skip — Fill Manually
          </button>
          <div style={{ display: "flex", gap: 12 }}>
            {anyFileUploaded && (
              <button
                onClick={handleExtractAll}
                disabled={extracting}
                className="nav-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 22px",
                  background: extracting
                    ? "#E2E8F0"
                    : "linear-gradient(135deg,#D97706,#F59E0B)",
                  color: extracting ? "#94A3B8" : "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: extracting ? "not-allowed" : "pointer",
                  boxShadow: extracting
                    ? "none"
                    : "0 3px 10px rgba(217,119,6,0.3)",
                }}
              >
                {extracting ? (
                  <>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid #94A3B840",
                        borderTopColor: "#94A3B8",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    Extracting...
                  </>
                ) : (
                  <>🔍 Extract & Auto-fill</>
                )}
              </button>
            )}
            <button
              onClick={handleProceedToForm}
              className="nav-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 24px",
                background: "linear-gradient(135deg,#1B4FD8,#2563EB)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(27,79,216,0.28)",
              }}
            >
              Proceed to Form
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && previews[showPreview] && (
        <div
          onClick={() => setShowPreview(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", maxWidth: 600, width: "100%" }}
          >
            <img
              src={previews[showPreview]}
              alt="preview"
              style={{
                width: "100%",
                borderRadius: 12,
                boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
              }}
            />
            <button
              onClick={() => setShowPreview(null)}
              style={{
                position: "absolute",
                top: -14,
                right: -14,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#fff",
                border: "2px solid #E2E8F0",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: "#374151",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
