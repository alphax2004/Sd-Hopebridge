import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Topbar } from "./sidebar";
import "./RequestHelp.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

const helpTypes = [
  {
    key: "Food",
    icon: "fa-bowl-food",
  },
  {
    key: "Shelter",
    icon: "fa-house",
  },
  {
    key: "Medical",
    icon: "fa-kit-medical",
  },
  {
    key: "Water",
    icon: "fa-droplet",
  },
];

export default function RequestHelp() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      type: "Food",
      items: "",
      quantity: "",
      urgency: "Medium",
      location: "",
      contact: "",
      notes: "",
    });

  const [error, setError] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  function handleChange(e) {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove old error while typing
    if (error) {
      setError("");
    }
  }

  // ==========================================
  // SELECT HELP TYPE
  // ==========================================

  function handleTypeSelect(typeKey) {
    if (loading) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      type: typeKey,
    }));
  }

  // ==========================================
  // VALIDATE FORM
  // ==========================================

  function validateForm() {
    const items =
      formData.items.trim();

    const location =
      formData.location.trim();

    const contact =
      formData.contact.trim();

    // Required fields

    if (!items) {
      return "Please enter the items you need.";
    }

    if (!location) {
      return "Please enter your location.";
    }

    if (!contact) {
      return "Please enter your contact number.";
    }

    // Bangladesh phone validation
    const cleanContact =
      contact.replace(/\s|-/g, "");

    const phonePattern =
      /^01[3-9]\d{8}$/;

    if (!phonePattern.test(cleanContact)) {
      return "Please enter a valid Bangladesh contact number, for example 01XXXXXXXXX.";
    }

    // Items length

    if (items.length < 2) {
      return "Please provide a little more detail about the items needed.";
    }

    // Location length

    if (location.length < 2) {
      return "Please enter a valid location.";
    }

    return "";
  }

  // ==========================================
  // SUBMIT REQUEST
  // ==========================================

  async function handleSubmit(e) {
    e.preventDefault();

    // Prevent double submit
    if (loading) {
      return;
    }

    setError("");

    // Validate
    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const cleanContact =
        formData.contact
          .trim()
          .replace(/\s|-/g, "");

      const requestData = {
        type: formData.type,
        items: formData.items.trim(),
        quantity:
          formData.quantity.trim(),
        urgency: formData.urgency,
        location:
          formData.location.trim(),
        contact: cleanContact,
        notes: formData.notes.trim(),
      };

      const response = await fetch(
        `${API_URL}/api/requests`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify(
            requestData
          ),
        }
      );

      // ========================================
      // SAFE RESPONSE
      // ========================================

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      let data = null;

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        data =
          await response.json();
      }

      // ========================================
      // SERVER ERROR
      // ========================================

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else if (
          response.status === 403
        ) {
          setError(
            "You are not allowed to submit a request."
          );
        } else if (
          response.status === 400
        ) {
          setError(
            data?.error ||
            data?.message ||
            "Please check the information you entered."
          );
        } else {
          setError(
            data?.error ||
            data?.message ||
            "Failed to submit request. Please try again."
          );
        }

        return;
      }

      // ========================================
      // SUCCESS
      // ========================================

      setSubmitted(true);

      // Clear form after successful submission

      setFormData({
        type: "Food",
        items: "",
        quantity: "",
        urgency: "Medium",
        location: "",
        contact: "",
        notes: "",
      });

      // Go to dashboard
      // Dashboard will show Pending status

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      console.log(
        "REQUEST SUBMIT ERROR:",
        err
      );

      setError(
        "Unable to connect to server. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="request-help-layout">

      <Sidebar current="requestHelp" />

      <div className="main-content">

        <Topbar
          title="Request Help"
          subtitle="Fill out the form below - we'll route it to nearby NGOs."
        />

        {submitted ? (

          <div className="success-card">

            <i className="fa-solid fa-circle-check"></i>

            <h3>
              Request submitted!
            </h3>

            <p>
              Your request has been sent successfully.
            </p>

            <p>
              Redirecting you to the dashboard...
            </p>

          </div>

        ) : (

          <form
            className="form-card"
            onSubmit={handleSubmit}
          >

            {/* ==================================
                TYPE OF HELP
            ================================== */}

            <div className="field-group">

              <label>
                Type of help
              </label>

              <div className="type-grid">

                {helpTypes.map((t) => (

                  <div
                    key={t.key}
                    className={`type-card ${
                      formData.type === t.key
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleTypeSelect(
                        t.key
                      )
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" ||
                        e.key === " "
                      ) {
                        handleTypeSelect(
                          t.key
                        );
                      }
                    }}
                  >

                    <i
                      className={`fa-solid ${t.icon}`}
                    ></i>

                    <span>
                      {t.key}
                    </span>

                  </div>

                ))}

              </div>

            </div>


            {/* ==================================
                ITEMS
            ================================== */}

            <div className="field-group">

              <label>
                Items needed
              </label>

              <div className="input-box">

                <input
                  type="text"
                  name="items"
                  placeholder="e.g. Rice, Dal, Oil, Salt"
                  value={formData.items}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={300}
                />

              </div>

            </div>


            {/* ==================================
                QUANTITY + URGENCY
            ================================== */}

            <div className="field-row">

              <div className="field-group">

                <label>
                  Quantity / people affected
                </label>

                <div className="input-box">

                  <input
                    type="text"
                    name="quantity"
                    placeholder="e.g. 4 items or 6 people"
                    value={formData.quantity}
                    onChange={handleChange}
                    disabled={loading}
                    maxLength={100}
                  />

                </div>

              </div>


              <div className="field-group">

                <label>
                  Urgency
                </label>

                <div className="input-box">

                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    disabled={loading}
                  >

                    <option value="High">
                      High
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Low">
                      Low
                    </option>

                  </select>

                </div>

              </div>

            </div>


            {/* ==================================
                LOCATION
            ================================== */}

            <div className="field-group">

              <label>
                Location
              </label>

              <div className="input-box">

                <i className="fa-solid fa-location-dot"></i>

                <input
                  type="text"
                  name="location"
                  placeholder="Village / Upazila / District"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={250}
                />

              </div>

            </div>


            {/* ==================================
                CONTACT
            ================================== */}

            <div className="field-group">

              <label>
                Contact number
              </label>

              <div className="input-box">

                <i className="fa-solid fa-phone"></i>

                <input
                  type="text"
                  name="contact"
                  placeholder="01XXXXXXXXX"
                  value={formData.contact}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={20}
                />

              </div>

            </div>


            {/* ==================================
                NOTES
            ================================== */}

            <div className="field-group">

              <label>
                Additional notes (optional)
              </label>

              <div className="input-box textarea-box">

                <textarea
                  name="notes"
                  placeholder="Anything else NGOs should know..."
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={500}
                ></textarea>

              </div>

            </div>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

              <p className="error-text">
                {error}
              </p>

            )}


            {/* ==================================
                SUBMIT
            ================================== */}

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >

              <i className="fa-solid fa-paper-plane"></i>

              {loading
                ? "Submitting..."
                : " Submit request"}

            </button>

          </form>

        )}

      </div>

    </div>
  );
}