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


  function handleChange(e) {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }


  function handleTypeSelect(typeKey) {
    setFormData((prev) => ({
      ...prev,
      type: typeKey,
    }));
  }


  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !formData.items.trim() ||
      !formData.location.trim() ||
      !formData.contact.trim()
    ) {
      setError(
        "Must fillup Items, Location, and Contact number."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/requests`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Failed to submit request"
        );

        return;
      }

      setSubmitted(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      console.log(err);

      setError(
        "Server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }


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
              Redirecting you to the dashboard...
            </p>

          </div>

        ) : (

          <form
            className="form-card"
            onSubmit={handleSubmit}
          >

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
                />

              </div>

            </div>


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
                />

              </div>

            </div>


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
                />

              </div>

            </div>


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
                ></textarea>

              </div>

            </div>


            {error && (
              <p className="error-text">
                {error}
              </p>
            )}


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