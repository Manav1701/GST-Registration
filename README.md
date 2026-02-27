  # 🧾 GST Registration Portal — Form REG-01

A modern, production-ready **React + Vite** web application for GST New Registration (Form REG-01). Built with a clean multi-step flow: Contact → OTP Verification → Document Upload (with AI Auto-fill) → 11-Tab Form → Review → Submit.

---

## 📸 Screenshots

### Contact Page
![Contact Page](screenshots/contact.png)

### OTP Verification
![OTP Verification](screenshots/otp.png)

### Document Upload
![Document Upload](screenshots/upload.png)

### Registration Form
![Registration Form](screenshots/form.png)

### Review & Submit
![Review & Submit](screenshots/review.png)
---

## ✨ Features

- **Multi-step flow** — Contact → OTP → Documents → Form → Review → Submitted
- **11-tab registration form** covering all GST REG-01 sections
- **Document upload with AI auto-fill** — Upload Aadhaar, PAN, address proof → fields auto-populate (when backend is connected)
- **Live validation** — Field-level validation with real-time error messages
- **Auto-save** — Form data saved to `localStorage` on every keystroke, survives page refresh
- **Route guards** — Pages protected, can't skip OTP or jump to form without completing prior steps
- **Review page** — See all entered data before final submission
- **Fully responsive** — Works on desktop and tablet
- **No CSS framework** — Pure inline styles, zero external CSS dependencies

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite 5** | Build tool & dev server |
| **React Router v6** | Client-side routing with guards |
| **Axios** | HTTP client for API calls |
| **localStorage** | Auto-save form state |

---

## 📁 Project Structure

```
gst-registration/
│
├── index.html                          # HTML entry point
├── vite.config.js                      # Vite configuration
├── package.json                        # Dependencies & scripts
├── .env                                # Environment variables (API URL)
│
└── src/
    ├── main.jsx                        # React DOM root
    ├── App.jsx                         # Global styles + router render
    │
    ├── api/
    │   ├── index.js                    # Axios instance with interceptors
    │   ├── endpoints.js                # All API URL constants
    │   └── gstApi.js                   # extractDocument() + submitGSTForm() + buildPayload()
    │
    ├── components/
    │   ├── ui/
    │   │   └── index.jsx               # All reusable UI primitives:
    │   │                               #   FormInput, FormSelect, FormToggle,
    │   │                               #   FormRadioGroup, FormCheckbox, FileInput,
    │   │                               #   SectionCard, InfoAlert, Grid2, Grid3, DynamicList
    │   ├── layout/
    │   │   └── MainLayout.jsx          # Sticky header + progress bar wrapper
    │   └── shared/
    │       ├── OtpDigitBox.jsx         # Single OTP digit input box
    │       ├── ReviewSection.jsx       # Review card (label-value grid)
    │       └── BusinessActivityCheckboxes.jsx  # Shared checkbox grid (PPB + APB)
    │
    ├── constants/
    │   ├── dropdowns.js                # All dropdown data: districts, countries,
    │   │                               # constitution types, document configs, etc.
    │   ├── validation.js               # PATTERNS, validateField(), TAB_REQUIRED_FIELDS
    │   └── tabs.js                     # TABS array, INITIAL_STATE, STORAGE_KEY
    │
    ├── hooks/
    │   └── useGSTForm.js               # All form state, validation, auto-save, submit logic
    │
    ├── pages/
    │   ├── ContactPage.jsx             # Step 1 — Mobile + Email input
    │   ├── OTPPage.jsx                 # Step 2 — OTP verification (mobile + email)
    │   ├── DocumentUploadPage.jsx      # Step 3 — Upload docs + AI extract + auto-fill
    │   ├── ReviewPage.jsx              # Step 5 — Review all data + submit button
    │   └── SubmittedPage.jsx           # Step 6 — Success screen
    │
    ├── features/
    │   └── gst-registration/
    │       ├── GSTFormShell.jsx        # Sidebar + tab switcher + nav footer
    │       └── tabs/
    │           ├── Tab0_BusinessDetails.jsx    # Business identity, registration details
    │           ├── Tab1_Promoter.jsx           # Promoter 1 (shared component)
    │           ├── Tab2_Promoter2.jsx          # Promoter 2 (reuses Tab1 with suffix)
    │           ├── Tab3_AuthSignatory.jsx      # Authorized Signatory details
    │           ├── Tab4_AuthRep.jsx            # Authorized Representative
    │           ├── Tab5_PPB.jsx                # Principal Place of Business
    │           ├── Tab6_APB.jsx                # Additional Place of Business
    │           ├── Tab7_GoodsServices.jsx      # HSN / SAC codes
    │           ├── Tab8_StateSpecific.jsx      # Gujarat-specific info
    │           ├── Tab9_Aadhaar.jsx            # Aadhaar authentication table
    │           └── Tab10_Verification.jsx      # Declaration + verification
    │
    ├── routes/
    │   └── index.jsx                   # createBrowserRouter + RequireContact + RequireOTP guards
    │
    └── utils/
        └── dateUtils.js                # toISODate() — normalizes DD/MM/YYYY → YYYY-MM-DD
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) **v18 or higher**
- [npm](https://www.npmjs.com/) **v9 or higher**

Check your versions:
```bash
node --version   # should be v18+
npm --version    # should be v9+
```

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/your-username/gst-registration.git
cd gst-registration
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up environment variables:**
```bash
cp .env .env.local
```
Then open `.env.local` and update:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```
> Replace with your actual backend URL.

**4. Start the development server:**
```bash
npm run dev
```

**5. Open in browser:**
```
http://localhost:5173
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API base URL — required for form submission and document extraction
VITE_API_BASE_URL=http://127.0.0.1:8000
```

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ Yes | Base URL of your Django/FastAPI/Node backend |

> **Note:** All Vite env variables must start with `VITE_` to be accessible in the browser.

---

## 🔌 Backend API Integration

The frontend expects these API endpoints on your backend:

### 1. Send OTP
```
POST /api/otp/send
Body: { "mobile": "9876543210", "email": "user@example.com" }
Response: { "success": true }
```

### 2. Verify OTP
```
POST /api/otp/verify
Body: { "mobile": "9876543210", "otp": "123456" }
Response: { "success": true, "token": "jwt-token-here" }
```

### 3. Extract Document Fields ⭐ (AI Auto-fill)
```
POST /api/extract-document
Body: {
  "docType": "aadhaar_card",
  "fileBase64": "base64encodedstring...",
  "mimeType": "image/jpeg"
}
```

**Expected Response:**
```json
{
  "extracted": {
    "name_first": "Ravi",
    "name_middle": "Vishnukumar",
    "name_last": "Somani",
    "dob": "1990-05-10",
    "aadhaar": "123456789012",
    "pin_code": "380015",
    "state_res": "Gujarat",
    "district_res": "Ahmedabad",
    "city_res": "Ahmedabad",
    "road_street_res": "MG Road",
    "building_no_res": "12"
  },
  "confidence": 0.94
}
```

> The field names in `extracted` must **exactly match** the field keys in `INITIAL_STATE` (see `src/constants/tabs.js`).

### 4. Submit GST Form
```
POST /api/submissions
Body: { ...complete form payload }
Response: { "success": true, "applicationId": "REG-2024-XXXXX" }
```

---

## 🗂️ Document Types & Auto-fill Fields

Each document type fills specific form fields when extracted:

| Document | `docType` key | Fields Auto-filled |
|---|---|---|
| Aadhaar Card | `aadhaar_card` | `name_first`, `name_last`, `dob`, `aadhaar`, `pin_code`, `state_res`, `district_res`, `city_res`, `road_street_res`, `building_no_res` |
| PAN Card | `pan_card` | `pan`, `pan_proprietor`, `legal_name`, `name_first`, `name_last`, `dob`, `pan_date` |
| Address Proof | `address_proof` | `ppb_premises`, `ppb_bno`, `ppb_road`, `ppb_locality`, `ppb_pin`, `ppb_state`, `consumer_number`, `ppb_district` |
| Photograph | `photograph` | `photo`, `as_photo`, `photo_2` |
| MSME Certificate | `msme_certificate` | `trade_name`, `legal_name`, `commencement_date` |
| Bank Document | `bank_document` | `legal_name` |

---

## 📋 Form Sections (11 Tabs)

| Tab | Section | Key Fields |
|---|---|---|
| 0 | Business Details | Legal name, PAN, constitution, trade name, reason to register |
| 1 | Promoter / Partner 1 | Personal info, address, PAN, Aadhaar, photo |
| 2 | Promoter / Partner 2 | Same as Tab 1 with second promoter data |
| 3 | Authorized Signatory | Name, DOB, PAN, address, proof document |
| 4 | Authorized Representative | GST Practitioner or other representative |
| 5 | Principal Place of Business | Address, jurisdiction, contact, nature of possession |
| 6 | Additional Place of Business | Second business address (optional) |
| 7 | Goods & Services | HSN codes (goods) + SAC codes (services) |
| 8 | State Specific Info | Electricity board, consumer number, PT registration |
| 9 | Aadhaar Authentication | Lists all persons requiring Aadhaar verification |
| 10 | Verification | Declaration checkbox, authorized signatory, date |

---

## 🔐 Route Guards

The app uses route protection to prevent users from skipping steps:

```
/              → ContactPage       (always accessible)
/otp           → OTPPage           (requires: mobile + email saved)
/documents     → DocumentUpload    (requires: OTP verified)
/form          → GSTFormShell      (requires: OTP verified)
/review        → ReviewPage        (requires: OTP verified)
/submitted     → SubmittedPage     (always accessible)
*              → Redirect to /
```

Guards check `localStorage` for:
- `gst_contact` — set after ContactPage
- `gst_otp_verified` — set after OTPPage

---

## 💾 Local Storage Keys

| Key | Set When | Contains |
|---|---|---|
| `gst_contact` | After ContactPage | `{ mobile, email }` |
| `gst_otp_verified` | After OTPPage | `"1"` |
| `gst_reg_form_data` | Every form field change | Complete form state object |

> Form data is automatically restored on page refresh. Users never lose their progress.

---

## 🧩 Key Components Explained

### `useGSTForm.js` — The Brain
Central hook that manages everything:
- `formData` — complete form state
- `update(name, value)` — update a single field
- `touch(name)` — mark field as touched (show errors)
- `handleSaveContinue()` — validate tab → move to next
- `handleSubmit()` — validate all → POST to API → navigate to `/submitted`
- Auto-saves to `localStorage` on every change

### `components/ui/index.jsx` — UI Primitives
All form components in one file:
- `FormInput` — text/date/email/tel input with label + error
- `FormSelect` — dropdown with label + error
- `FormToggle` — Yes/No toggle switch
- `FormRadioGroup` — horizontal radio options
- `FormCheckbox` — single checkbox with label
- `FileInput` — drag & drop file upload
- `SectionCard` — white card with colored header
- `InfoAlert` — info/warning/success alert box
- `Grid2` / `Grid3` — 2 or 3 column responsive grid
- `DynamicList` — add/remove dynamic list entries

### `api/gstApi.js` — API Layer
- `extractDocument(docType, base64, mimeType)` — sends document to backend for OCR extraction
- `submitGSTForm(formData, contactInfo)` — builds full payload + submits
- `buildPayload()` — maps all form fields to API schema, normalizes dates

### `utils/dateUtils.js` — Date Normalizer
Converts any date format to `YYYY-MM-DD` for the backend:
```js
toISODate("27/09/2011")  // → "2011-09-27"
toISODate("2011-09-27")  // → "2011-09-27" (passthrough)
toISODate("27-09-2011")  // → "2011-09-27"
```

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder. Deploy this folder to any static hosting:

**Deploy to Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Deploy to Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Deploy to Nginx:**
```nginx
server {
    listen 80;
    root /var/www/gst-registration/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

> ⚠️ The `try_files /index.html` line is **required** for React Router to work on page refresh.

---

## 🐛 Common Issues & Fixes

### 1. Page refresh gives 404
**Problem:** React Router routes return 404 on refresh when hosted.  
**Fix:** Configure your server to serve `index.html` for all routes (see Nginx config above). On Netlify, create `public/_redirects`:
```
/* /index.html 200
```

### 2. API calls failing (CORS error)
**Problem:** Backend not allowing requests from frontend origin.  
**Fix:** Add CORS headers in your backend:
```python
# Django example
CORS_ALLOWED_ORIGINS = ["http://localhost:5173", "https://your-domain.com"]
```

### 3. Auto-fill not working
**Problem:** Document extraction returns empty fields.  
**Fix:** Check that:
- `VITE_API_BASE_URL` is set correctly in `.env`
- Backend returns field names that **exactly match** `INITIAL_STATE` keys
- Backend response format is `{ "extracted": {...}, "confidence": 0.9 }`

### 4. Form data lost on refresh
**Problem:** `localStorage` quota exceeded or browser private mode.  
**Fix:** This is handled gracefully — form falls back to `INITIAL_STATE`. In private mode, localStorage is cleared when tab closes (by design).

### 5. Date fields showing wrong format
**Problem:** Backend sending `DD/MM/YYYY` but HTML date inputs need `YYYY-MM-DD`.  
**Fix:** All dates pass through `toISODate()` in `utils/dateUtils.js` before API submission. For pre-filling from backend, ensure your backend also returns `YYYY-MM-DD`.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request

### Commit Message Convention
```
feat:     new feature
fix:      bug fix
docs:     documentation changes
style:    formatting, no logic change
refactor: code restructure
chore:    build tools, dependencies
```

---

## 📝 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your.email@example.com

---

## 🙏 Acknowledgements

- [GST Portal](https://www.gst.gov.in/) — Official GST registration reference
- [React](https://react.dev/) — UI library
- [Vite](https://vitejs.dev/) — Build tool
- [React Router](https://reactrouter.com/) — Routing
- [Axios](https://axios-http.com/) — HTTP client
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — Font

---

<div align="center">

**Made with ❤️ for the Indian GST ecosystem**

⭐ Star this repo if it helped you!

</div>
