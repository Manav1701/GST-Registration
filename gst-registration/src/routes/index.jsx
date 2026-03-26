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
import GSTFormShell from "../features/gst-registration/GSTFormShell.jsx";
import MainLayout from "../components/layout/MainLayout.jsx";

// Guard: redirect to /contact if no session data
function RequireContact({ children }) {
  const contact = (() => {
    try {
      return JSON.parse(localStorage.getItem("gst_contact"));
    } catch {
      return null;
    }
  })();
  if (!contact?.mobile) return <Navigate to="/" replace />;
  return children;
}

function RequireOTP({ children }) {
  const verified = localStorage.getItem("gst_otp_verified");
  if (!verified) return <Navigate to="/otp" replace />;
  return children;
}

const router = createBrowserRouter([
  { path: "/", element: <ContactPage /> },
  {
    path: "/otp",
    element: (
      <RequireContact>
        <OTPPage />
      </RequireContact>
    ),
  },
  {
    path: "/selection",
    element: (
      <RequireContact>
        <RequireOTP>
          <SelectionPage />
        </RequireOTP>
      </RequireContact>
    ),
  },
  {
    path: "/documents",
    element: (
      <RequireContact>
        <RequireOTP>
          <DocumentUploadPage />
        </RequireOTP>
      </RequireContact>
    ),
  },
  {
    path: "/form",
    element: (
      <RequireContact>
        <RequireOTP>
          <MainLayout>
            <GSTFormShell />
          </MainLayout>
        </RequireOTP>
      </RequireContact>
    ),
  },
  {
    path: "/review",
    element: (
      <RequireContact>
        <RequireOTP>
          <MainLayout showReviewHeader>
            <ReviewPage />
          </MainLayout>
        </RequireOTP>
      </RequireContact>
    ),
  },
  { path: "/submitted", element: <SubmittedPage /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
