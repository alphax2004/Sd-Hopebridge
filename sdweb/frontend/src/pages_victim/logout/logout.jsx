import { useNavigate, useLocation } from "react-router-dom";
import"./logout.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Logout() {
  const navigate = useNavigate();
  const location = useLocation();
  const cameFrom = location.state?.from || "/dashboard";

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // network error হলেও frontend থেকে user কে বের করে দেই
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="logout-wrapper">
      

      <div className="logout-container">
        <div className="logout-card">
          <h2>Do you want to log out?</h2>

          <div className="logout-actions">
            <button className="logout-yes" onClick={handleLogout}>
              Yes
            </button>

            <button
              className="logout-no"
              onClick={() => navigate(cameFrom)}
            >
              No
            </button>
          </div>
        </div>

        <button
          className="logout-back"
          onClick={() => navigate(cameFrom)}
        >
          Back
        </button>
      </div>
    </div>
  );
}

