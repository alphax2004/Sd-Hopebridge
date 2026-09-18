import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages_alfa/landingpage";
import Login from "./pages_alfa/login";
import Register from "./pages_alfa/register";
import EmailVerification from "./pages_alfa/EmailVerification";
import Dashboard from "./pages_alfa/dashboard";
import RequestHelp from "./pages_alfa/RequestHelp";
import Profile from "./pages_alfa/Profile";
import Password from "./pages_alfa/Password";
import DisasterCenter from "./pages_alfa/DisasterCenter";
import Logout from "./pages_alfa/logout";

import AdminDashboard from "./pages_admin/AdminDashboard";
import VictimRequests from "./pages_admin/VictimRequests";
import ReliefManagement from "./pages_admin/ReliefManagement";
import AdminDisasterCentre from "./pages_admin/AdminDisasterCentre";
import AdminProfile from "./pages_admin/AdminProfile";
import AdminPassword from "./pages_admin/AdminPassword";
import RequireAdmin from "./pages_admin/RequireAdmin";

export default function App() {
  return (
    <div className="app-container">
      <style>{`
        :root {
          --text-color: #000;
          --primary-orange: rgb(240, 160, 12);
          --card-bg: #f6e9cc;
          --cream-bg: #fbf3e3;
        }

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

        body {
          font-family: Arial, sans-serif;
          color: var(--text-color);
        }

        h1,
        h2,
        h3,
        h4,
        p,
        label,
        a,
        span {
          color: var(--text-color);
          font-weight: bold;
        }

        button {
          font-family: Arial, sans-serif;
          color: black;
          font-weight: bold;
          cursor: pointer;
        }

        .app-container {
          width: 100%;
          min-height: 100vh;
        }
      `}</style>

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/verify-email"
          element={<EmailVerification />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/request-help"
          element={<RequestHelp />}
        />

        <Route
          path="/disaster-center"
          element={<DisasterCenter />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/password"
          element={<Password />}
        />

        <Route
          path="/logout"
          element={<Logout />}
        />

        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/victim-requests"
          element={
            <RequireAdmin>
              <VictimRequests />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/relief-management"
          element={
            <RequireAdmin>
              <ReliefManagement />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/disaster-centre"
          element={
            <RequireAdmin>
              <AdminDisasterCentre />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <RequireAdmin>
              <AdminProfile />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/password"
          element={
            <RequireAdmin>
              <AdminPassword />
            </RequireAdmin>
          }
        />

        <Route
          path="*"
          element={<LandingPage />}
        />
      </Routes>
    </div>
  );
}