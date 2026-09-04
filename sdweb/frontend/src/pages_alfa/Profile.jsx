import { useEffect, useState } from "react";
import { Sidebar, Topbar } from "./sidebar";

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
    role: "user",
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
            role: data.role || "user",
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
      <style>{`
        .profile-page {
          min-height: 100vh;
          display: flex;
          background: #fbf3e3;
          font-family: Arial, sans-serif;
        }

        .profile-main {
          flex: 1;
          padding: 25px;
        }

        .profile-card {
          max-width: 650px;
          background: white;
          padding: 30px;
          margin-top: 25px;
          border-radius: 12px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-group label {
          display: block;
          margin-bottom: 7px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 7px;
        }

        .update-btn {
          padding: 13px 25px;
          border: none;
          border-radius: 7px;
          background: rgb(240, 160, 12);
          cursor: pointer;
        }

        .message {
          padding: 10px;
          margin-bottom: 15px;
          background: #f6e9cc;
          border-radius: 7px;
        }
      `}</style>

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