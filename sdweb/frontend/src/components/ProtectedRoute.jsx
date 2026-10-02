import { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  allowedRoles,
  redirectTo,
}) {
  const location = useLocation();
  const auth = useAuth();

  // Fallback state if rendered without AuthProvider
  const [localUser, setLocalUser] = useState(null);
  const [localLoading, setLocalLoading] = useState(auth ? false : true);

  useEffect(() => {
    if (auth) return;

    let cancelled = false;
    const verifySelf = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          if (!cancelled) setLocalUser(data);
        } else {
          if (!cancelled) setLocalUser(null);
        }
      } catch (err) {
        console.error("Local auth check error:", err);
        if (!cancelled) setLocalUser(null);
      } finally {
        if (!cancelled) setLocalLoading(false);
      }
    };

    verifySelf();
    return () => {
      cancelled = true;
    };
  }, [auth]);

  const user = auth ? auth.user : localUser;
  const loading = auth ? auth.loading : localLoading;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#fbf3e3",
          color: "#000",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #f6e9cc",
            borderTop: "4px solid rgb(240, 160, 12)",
            borderRadius: "50%",
            animation: "auth-spin 0.8s linear infinite",
            marginBottom: "16px",
          }}
        />
        <style>{`
          @keyframes auth-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>
          Verifying access...
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <Navigate
        to={redirectTo || "/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  // Admin access required, but user is not admin
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to={redirectTo || "/dashboard"} replace />;
  }

  // Explicit allowed roles specified, and user does not match
  if (
    Array.isArray(allowedRoles) &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    const fallbackPath = user.role === "admin" ? "/admin/dashboard" : "/dashboard";
    return <Navigate to={redirectTo || fallbackPath} replace />;
  }

  return children ? children : <Outlet />;
}
