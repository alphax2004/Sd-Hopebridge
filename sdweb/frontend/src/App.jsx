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
import ReliefManagement from "./pages_admin/ReliefManagement/ReliefManagement";
import AdminDisasterCentre from "./pages_admin/AdminDisasterCentre/AdminDisasterCentre";
import AdminProfile from "./pages_admin/AdminProfile";
import AdminPassword from "./pages_admin/AdminPassword";

export default function App() {
  return (
    <AuthProvider>
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
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<EmailVerification />} />

          {/* Protected User / Victim Routes */}
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

          {/* Protected Admin Routes */}
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
            path="/admin/relief-management"
            element={
              <ProtectedRoute requireAdmin>
                <ReliefManagement />
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

          {/* Fallback */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
