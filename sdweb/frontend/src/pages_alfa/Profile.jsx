import { useEffect, useState } from "react";
import { Sidebar, Topbar } from "./sidebar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Profile() {
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    bloodGroup: "",
    phone: "",
    location: "",
    role: "user",
    verified: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        if (!cancelled) {
          setFormData({
            id: data._id || data.id || "",
            fullName: data.fullName || "",
            email: data.email || "",
            bloodGroup: data.bloodGroup || "",
            phone: data.phone || "",
            location: data.location || "",
            role: data.role || "user",
            verified: data.verified || false,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = async () => {
    if (!isEditing) {
      setIsEditing(true);
      setMessage("");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/users/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: formData.fullName,
          bloodGroup: formData.bloodGroup,
          phone: formData.phone,
          location: formData.location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      setMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-layout">
        <style>{css}</style>
        <Sidebar current="profile" />
        <div className="main-content">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.id) {
    return (
      <div className="profile-layout">
        <style>{css}</style>
        <Sidebar current="profile" />
        <div className="main-content">
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-layout">
      <style>{css}</style>

      <Sidebar current="profile" />

      <div className="main-content">
        <div className="profile-topbar">
          <Topbar
            title="My Profile"
            subtitle="Manage your personal information"
          />
        </div>

        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}

        <div className="profile-card">
          <div className="avatar-circle">
            <i className="fa-solid fa-user"></i>
          </div>

          <div className="profile-info">
            <h3>{formData.fullName}</h3>
            <p>{formData.email}</p>

            <div className="badges">
              {formData.verified && (
                <span className="badge badge-verified">Verified Account</span>
              )}
              <span className="badge badge-blood">{formData.bloodGroup}</span>
              <span className="badge badge-role">
                {formData.role === "ngo"
                  ? "NGO"
                  : formData.role === "admin"
                  ? "Admin"
                  : "User"}
              </span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>Personal Information</h3>

          <div className="field-row">
            <div className="field-group">
              <label>Full Name</label>
              <div className="input-box">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="field-group">
              <label>Phone Number</label>
              <div className="input-box">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label>Email Address</label>
              <div className="input-box">
                <input type="email" value={formData.email} disabled />
              </div>
            </div>

            <div className="field-group">
              <label>Blood Group</label>
              <div className="input-box">
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field-group">
            <label>Location</label>
            <div className="input-box">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label>Role</label>
              <div className="input-box">
                <input
                  type="text"
                  value={
                    formData.role === "ngo"
                      ? "NGO"
                      : formData.role === "admin"
                      ? "Admin"
                      : "User"
                  }
                  disabled
                />
              </div>
            </div>

            <div className="field-group">
              <label>Verification Status</label>
              <div className="input-box">
                <input
                  type="text"
                  value={formData.verified ? "Verified" : "Not Verified"}
                  disabled
                />
              </div>
            </div>
          </div>

          <button
            className="edit-btn"
            onClick={handleEditClick}
            disabled={saving}
          >
            <i className={`fa-solid ${isEditing ? "fa-check" : "fa-pen"}`}></i>{" "}
            {saving
              ? "Saving..."
              : isEditing
              ? "Save Profile"
              : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

const css = `
.profile-layout {
  display: flex;
  min-height: 100vh;
  background: var(--cream-bg);
}

.main-content {
  flex: 1;
  padding: 24px 35px;
}

.profile-topbar {
  margin: 0;
  padding: 0;
}

.error-text {
  color: #c0392b;
  font-weight: bold;
  margin-bottom: 16px;
}

.success-text {
  color: #1f8a4d;
  font-weight: bold;
  margin-bottom: 16px;
}

.profile-card {
  background: white;
  border: 1px solid #eee3d0;
  border-radius: 14px;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 0 0 16px;
}

.avatar-circle {
  width: 90px;
  height: 90px;
  min-width: 90px;
  border-radius: 50%;
  background: #f1dca0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  color: #d99e1f;
}

.profile-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 6px;
}

.profile-info h3 {
  margin: 4px 0 4px;
  font-size: 22px;
}

.profile-info p {
  margin: 0 0 10px;
  font-size: 14px;
  color: #555;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
}

.badge-verified {
  color: #135a38b8;
  background: #74d6a5dc;
}

.badge-blood {
  color: #d94b4b;
  background: #d94b4b22;
}

.badge-role {
  color: #8a5a1f;
  background: #f0a00c33;
}

.info-card {
  background: white;
  border: 1px solid #eee3d0;
  border-radius: 14px;
  padding: 24px 28px;
  margin: 0 0 16px;
}

.info-card h3 {
  margin: 0 0 18px !important;
  text-align: left !important;
  font-size: 19px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field-group {
  margin-bottom: 18px;
  text-align: left;
}

.field-group label {
  display: block;
  font-size: 13px;
  margin-bottom: 8px;
}

.input-box {
  display: flex;
  align-items: center;
  padding: 11px 14px;
  border: 1px solid #f1dca0;
  border-radius: 10px;
  background: var(--cream-bg);
}

.input-box input,
.input-box select {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
}

.input-box input:disabled,
.input-box select:disabled {
  color: black;
  opacity: 1;
  cursor: default;
}

.edit-btn {
  padding: 13px 26px;
  background: var(--primary-orange);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
}

.edit-btn:disabled {
  opacity: 0.6;
}

.edit-btn:hover {
  background: rgb(242, 241, 239);
  border: 1px solid orange;
}
`;
