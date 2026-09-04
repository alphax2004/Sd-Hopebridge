import { useEffect, useState } from "react";
import { Sidebar, Topbar } from "./sidebar";
import "./Profile.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Profile() {
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    bloodGroup: "",
    phone: "",
    location: "",
    role: "",
    verified: false,
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/users/profile`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile"
          );
        }

        if (!cancelled) {
          setFormData({
            id: data._id || data.id || "",
            fullName: data.fullName || "",
            email: data.email || "",
            bloodGroup: data.bloodGroup || "",
            phone: data.phone || "",
            location: data.location || "",
            role: data.role || "",
            verified: data.verified || false,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error.message);
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/users/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            fullName: formData.fullName,
            bloodGroup: formData.bloodGroup,
            phone: formData.phone,
            location: formData.location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Update failed"
        );
      }

      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <Sidebar />

      <div className="profile-main">
        <Topbar
          title="My Profile"
          subtitle="Manage your personal information."
        />

        <div className="profile-card">

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <form onSubmit={handleUpdate}>

            <div className="form-group">
              <label>Full Name</label>

              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                value={formData.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Blood Group</label>

              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                <option value="">
                  Select Blood Group
                </option>

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

            <div className="form-group">
              <label>Phone</label>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Role</label>

              <input
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

            <div className="form-group">
              <label>Verification Status</label>

              <input
                value={
                  formData.verified
                    ? "Verified"
                    : "Not Verified"
                }
                disabled
              />
            </div>

            <button
              className="update-btn"
              type="submit"
            >
              Update Profile
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
