import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages_victim/landingpage/landingpage";
import Login from "./pages_victim/login/login";
import Register from "./pages_victim/register/register";
import EmailVerification from "./pages_victim/emailverification/EmailVerification";
import Dashboard from "./pages_victim/dashboard/dashboard";
import RequestHelp from "./pages_victim/requesthelp/RequestHelp";
import Profile from "./pages_victim/profile/Profile";
import Password from "./pages_victim/password/Password";
import DisasterCenter from "./pages_victim/disaster_center/DisasterCenter";
import Logout from "./pages_victim/logout/logout";

import AdminDashboard from "./pages_admin/AdminDashboard/AdminDashboard";
import VictimRequests from "./pages_admin/VictimRequests/VictimRequests";
import AdminDisasterCentre from "./pages_admin/AdminDisasterCentre/AdminDisasterCentre";
import AdminProfile from "./pages_admin/AdminProfile";
import AdminPassword from "./pages_admin/AdminPassword";

export default function App() {
  return (
    <AuthProvider>
      <div className="app-container">

        <style>{`
          /* ========================================
             HOPEBRIDGE GLOBAL COLOR SYSTEM
          ======================================== */

          :root {
            /* Main Text */
            --text-color: #16110d;
            --text-secondary: #2c261f;
            --text-muted: #8a7b6a;

            /* Brand Colors */
            --primary-orange: #e89b24;
            --dark-orange: #c87816;
            --light-orange: #fff0cc;

            /* Background Colors */
            --cream-bg: #fbf7ef;
            --card-bg: #ffffff;
            --soft-bg: #fff9ee;

            /* Sidebar */
            --sidebar-bg: #e8dcc5;
            --sidebar-border: #d2c09f;
            --sidebar-active: #30251d;
            --sidebar-hover: #fff0cc;

            /* Borders */
            --border-color: #e8dcc8;
            --border-light: #f0e5d3;

            /* Success */
            --success: #4f8058;
            --success-bg: #e1f1e4;
            --success-border: #c3ddc8;

            /* Danger */
            --danger: #a8543d;
            --danger-bg: #f6dcd5;
            --danger-border: #e8c6c0;

            /* Info */
            --info: #527fa8;
            --info-bg: #e3edfa;
            --info-border: #c5d8ed;

            /* Warning */
            --warning: #a97816;
            --warning-bg: #fff1c9;
            --warning-border: #e9d29a;

            /* Shadows */
            --shadow-sm:
              0 3px 12px rgba(80, 55, 25, 0.06);

            --shadow-md:
              0 6px 18px rgba(80, 55, 25, 0.09);
          }


          /* ========================================
             GLOBAL RESET
          ======================================== */

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }


          html,
          body,
          #root {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100vh;
          }


          /* ========================================
             BODY
          ======================================== */

          body {
            font-family: Arial, Helvetica, sans-serif;
            background: var(--cream-bg);
            color: var(--text-color);
          }


          /* ========================================
             HEADINGS
          ======================================== */

          h1,
          h2,
          h3,
          h4 {
            color: var(--text-color);
            font-weight: 700;
          }


          /* ========================================
             PARAGRAPH
          ======================================== */

          p {
            color: var(--text-secondary);
            font-weight: 600;
          }


          /* ========================================
             LABEL
          ======================================== */

          label {
            color: var(--text-color);
            font-weight: 600;
          }


          /* ========================================
             LINKS
          ======================================== */

          a {
            color: var(--dark-orange);
            font-weight: 600;
            text-decoration: none;
          }


          /* ========================================
             SPAN
          ======================================== */

          span {
            color: inherit;
          }


          /* ========================================
             BUTTON
          ======================================== */

          button {
            font-family: Arial, Helvetica, sans-serif;
            color: var(--text-color);
            font-weight: 700;
            cursor: pointer;
          }


          /* ========================================
             INPUT / SELECT / TEXTAREA
          ======================================== */

          input,
          select,
          textarea {
            font-family: Arial, Helvetica, sans-serif;
          }


          /* ========================================
             APP CONTAINER
          ======================================== */

          .app-container {
            width: 100%;
            min-height: 100vh;
            background: var(--cream-bg);
          }


          /* ========================================
             SELECTION
          ======================================== */

          ::selection {
            background: #f6d77f;
            color: #30251d;
          }


          /* ========================================
             RESPONSIVE
          ======================================== */

          @media (max-width: 768px) {
            body {
              overflow-x: hidden;
            }

            .app-container {
              width: 100%;
              min-height: 100vh;
            }
          }
        `}</style>

        <Routes>

          {/* ========================================
              PUBLIC ROUTES
          ======================================== */}

          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/verify-email"
            element={<EmailVerification />}
          />


          {/* ========================================
              PROTECTED USER / VICTIM ROUTES
          ======================================== */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/request-help"
            element={
              <ProtectedRoute>
                <RequestHelp />
              </ProtectedRoute>
            }
          />

          <Route
            path="/disaster-center"
            element={
              <ProtectedRoute>
                <DisasterCenter />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/password"
            element={
              <ProtectedRoute>
                <Password />
              </ProtectedRoute>
            }
          />

          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />


          {/* ========================================
              PROTECTED ADMIN ROUTES
          ======================================== */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/victim-requests"
            element={
              <ProtectedRoute requireAdmin>
                <VictimRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/disaster-centre"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDisasterCentre />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute requireAdmin>
                <AdminProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/password"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPassword />
              </ProtectedRoute>
            }
          />


          {/* ========================================
              FALLBACK
          ======================================== */}

          <Route
            path="*"
            element={<LandingPage />}
          />

        </Routes>

      </div>
    </AuthProvider>
  );
}