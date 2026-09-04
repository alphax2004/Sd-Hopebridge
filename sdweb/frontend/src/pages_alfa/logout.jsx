import { useNavigate, useLocation } from "react-router-dom";

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
      <style>{css}</style>

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

const css = `
.logout-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--cream-bg);
}

.logout-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logout-card {
  background: white;
  padding: 80px 100px;
  border-radius: 20px;
  text-align: center;
}

.logout-card h2 {
  margin: 0 0 25px;
  font-size: 40px;
}

.logout-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.logout-yes,
.logout-no {
  padding: 20px 40px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  background: var(--primary-orange);
}

.logout-yes:hover,
.logout-no:hover,
.logout-back:hover {
  background: rgb(242, 241, 239);
  border: 1px solid orange;
}

.logout-back {
  margin-top: 20px;
  padding: 12px 35px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  background: var(--primary-orange);
}
`;