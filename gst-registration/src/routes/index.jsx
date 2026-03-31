import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import ContactPage from "../pages/ContactPage.jsx";
import OTPPage from "../pages/OTPPage.jsx";
import SelectionPage from "../pages/SelectionPage.jsx";
import DocumentUploadPage from "../pages/DocumentUploadPage.jsx";
import ReviewPage from "../pages/ReviewPage.jsx";
import SubmittedPage from "../pages/SubmittedPage.jsx";
import ServiceSelectionPage from "../pages/ServiceSelectionPage.jsx";
import GSTFormShell from "../features/gst-registration/GSTFormShell.jsx";
import MainLayout from "../components/layout/MainLayout.jsx";
import ADTLayout from "../components/layout/ADTLayout.jsx";

// ADT Pages
import ADTContactPage from "../pages/adt/ADTContactPage.jsx";
import ADTOTPPage from "../pages/adt/ADTOTPPage.jsx";
import ADTFormShell from "../features/adt-registration/ADTFormShell.jsx";

// Guards
function RequireContact({ service = "gst", children }) {
  const contact = (() => {
    try {
      return JSON.parse(localStorage.getItem(`${service}_contact`));
    } catch {
      return null;
    }
  })();
  if (!contact?.mobile) return <Navigate to={service === "gst" ? "/gst" : "/adt"} replace />;
  return children;
}

function RequireOTP({ service = "gst", children }) {
  const verified = localStorage.getItem(`${service}_otp_verified`);
  if (!verified) return <Navigate to={service === "gst" ? "/gst/otp" : "/adt/otp"} replace />;
  return children;
}

const router = createBrowserRouter([
  // Service Selection (ROOT)
  { path: "/", element: <ServiceSelectionPage /> },

  // GST FLOW
  { path: "/gst", element: <ContactPage /> },
  {
    path: "/gst/otp",
    element: (
      <RequireContact service="gst">
        <OTPPage />
      </RequireContact>
    ),
  },
  {
    path: "/gst/selection",
    element: (
      <RequireContact service="gst">
        <RequireOTP service="gst">
          <SelectionPage />
        </RequireOTP>
      </RequireContact>
    ),
  },
  {
    path: "/gst/documents",
    element: (
      <RequireContact service="gst">
        <RequireOTP service="gst">
          <DocumentUploadPage />
        </RequireOTP>
      </RequireContact>
    ),
  },
  {
    path: "/gst/form",
    element: (
      <RequireContact service="gst">
        <RequireOTP service="gst">
          <MainLayout>
            <GSTFormShell />
          </MainLayout>
        </RequireOTP>
      </RequireContact>
    ),
  },
  {
    path: "/gst/review",
    element: (
      <RequireContact service="gst">
        <RequireOTP service="gst">
          <MainLayout showReviewHeader>
            <ReviewPage />
          </MainLayout>
        </RequireOTP>
      </RequireContact>
    ),
  },
  { path: "/gst/submitted", element: <SubmittedPage /> },

  // ADT FLOW
  { path: "/adt", element: <ADTContactPage /> },
  {
    path: "/adt/otp",
    element: (
      <RequireContact service="adt">
        <ADTOTPPage />
      </RequireContact>
    ),
  },
  {
    path: "/adt/form",
    element: (
      <RequireContact service="adt">
        <RequireOTP service="adt">
          <ADTLayout>
            <ADTFormShell />
          </ADTLayout>
        </RequireOTP>
      </RequireContact>
    ),
  },

  // Fallback
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
