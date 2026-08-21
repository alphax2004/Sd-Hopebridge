import { useState } from "react";
import { Sidebar, Topbar } from "./sidebar";

const helpTypes = [
  { key: "Food", icon: "fa-bowl-food" },
  { key: "Shelter", icon: "fa-house" },
  { key: "Medical", icon: "fa-kit-medical" },
  { key: "Water", icon: "fa-droplet" },
];

export default function RequestHelp({ goTo }) {
  const [formData, setFormData] = useState({
    type: "Food",
    items: "",
    quantity: "",
    urgency: "Medium",
    location: "",
    contact: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleTypeSelect(typeKey) {
    setFormData((prev) => ({ ...prev, type: typeKey }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.items.trim() || !formData.location.trim() || !formData.contact.trim()) {
      setError("Must fillup Items, Location, and Contact number.");
      return;
    }

    setError("");
    console.log("Request submitted:", formData);
    setSubmitted(true);

    setTimeout(() => {
      goTo("dashboard");
    }, 2500);
  }

  return (
    <div className="request-help-layout">
      <style>{css}</style>

      <Sidebar goTo={goTo} current="requestHelp" />

      <div className="main-content">
        <Topbar
          title="Request Help"
          subtitle="Fill out the form below - we'll route it to nearby NGOs."
        />

        {submitted ? (
          <div className="success-card">
            <i className="fa-solid fa-circle-check"></i>
            <h3>Request submitted!</h3>
            <p>Redirecting you to the dashboard...</p>
          </div>
        ) : (
          <form className="form-card" onSubmit={handleSubmit}>
            <div className="field-group">
              <label>Type of help</label>
              <div className="type-grid">
                {helpTypes.map((t) => (
                  <div
                    key={t.key}
                    className={`type-card ${formData.type === t.key ? "active" : ""}`}
                    onClick={() => handleTypeSelect(t.key)}
                  >
                    <i className={`fa-solid ${t.icon}`}></i>
                    <span>{t.key}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="field-group">
              <label>Items needed</label>
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
                <label>Quantity / people affected</label>
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
                <label>Urgency</label>
                <div className="input-box">
                  <select name="urgency" value={formData.urgency} onChange={handleChange}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field-group">
              <label>Location</label>
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
              <label>Contact number</label>
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
              <label>Additional notes (optional)</label>
              <div className="input-box textarea-box">
                <textarea
                  name="notes"
                  placeholder="Anything else NGOs should know..."
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="submit-btn">
              <i className="fa-solid fa-paper-plane"></i> Submit request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const css = `
.request-help-layout {
  display: flex;
  min-height: 100vh;
  background: var(--cream-bg);
}

.main-content {
  flex: 1;
  padding: 24px 35px;
}

.form-card {
  background: white;
  border: 1px solid #eee3d0;
  border-radius: 14px;
  padding: 24px 28px;
  max-width: 640px;
}

.field-group {
  margin-bottom: 18px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field-group label {
  display: block;
  font-size: 13px;
  margin-bottom: 8px;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.type-card {
  border: 1px solid #eee3d0;
  border-radius: 10px;
  padding: 12px 6px;
  text-align: center;
  cursor: pointer;
  color: #888;
}

.type-card i {
  font-size: 18px;
}

.type-card span {
  display: block;
  font-size: 11px;
  margin-top: 4px;
}

.type-card:hover {
  border-color: var(--primary-orange);
}

.type-card.active {
  background: #fdf1e3;
  border-color: var(--primary-orange);
  color: black;
}

.input-box {
  display: flex;
  align-items: center;
  padding: 11px 14px;
  border: 1px solid #f1dca0;
  border-radius: 10px;
  background: var(--cream-bg);
  gap: 8px;
}

.input-box i {
  color: #888;
  font-size: 14px;
}

.input-box input,
.input-box select {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: Arial, sans-serif;
  font-size: 13px;
  width: 100%;
  
}

.textarea-box {
  align-items: flex-start;
}

.input-box textarea {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: Arial, sans-serif;
  font-size: 13px;
  min-height: 60px;
  resize: none;
}

.error-text {
  color: #d94b4b;
  font-size: 13px;
  margin: 0 0 14px;
}

.submit-btn {
  width: 100%;
  padding: 13px;
  background: var(--primary-orange);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
}

.submit-btn:hover {
  background: rgb(242, 241, 239);
  border: 1px solid orange;
}

.success-card {
  background: white;
  border: 1px solid #eee3d0;
  border-radius: 14px;
  padding: 60px 30px;
  max-width: 640px;
  text-align: center;
}

.success-card i {
  font-size: 46px;
  color: #4caf7d;
  margin-bottom: 14px;
}

.success-card h3 {
  margin: 0 0 6px;
  font-size: 20px;
}

.success-card p {
  margin: 0;
  font-size: 13px;
  color: #555;
}
`;