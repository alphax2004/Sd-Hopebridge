import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Topbar } from "./sidebar";
import "./Password.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Password() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/users/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Password change failed"
        );
      }

      setMessage("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="password-page">
      <Sidebar />

      <div className="password-main">
        <Topbar
          title="Change Password"
          subtitle="Update your account password."
        />

        <div className="password-card">
          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password</label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="change-btn"
            >
              Change Password
            </button>
          </form>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/profile")}
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
