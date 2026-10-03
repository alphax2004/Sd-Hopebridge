import { useEffect, useState } from "react";
import { Sidebar, Topbar } from "../../pages_victim/sidebar/sidebar";
import "../admin.css";
import "./AdminDisasterCentre.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const empty = { disasters: [], shelters: [] };

export default function AdminDisasterCentre() {
  const [data, setData] = useState(empty);
  const [show, setShow] = useState("");
  const [form, setForm] = useState({
    title: "", type: "Flood", location: "", severity: "Medium",
    description: "", icon: "fa-droplet"
  });

  const [shelter, setShelter] = useState({
    name: "", location: "", capacity: "", occupied: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/disaster-centre`, {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Failed to load");
        const result = await res.json();
        setData({
          disasters: result.disasters || [],
          shelters: result.shelters || []
        });
      } catch (error) {
        console.error("Failed to load disaster centre:", error);
      }
    };
    loadData();
  }, []);

  // Auto-save: state update + database e save
  const persist = async (next) => {
    setData(next);
    try {
      const res = await fetch(`${API_URL}/api/disaster-centre`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(next)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Save failed");
      setData({
        disasters: result.data.disasters || [],
        shelters: result.data.shelters || []
      });
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const addAlert = () => {
    if (!form.title.trim() || !form.location.trim()) return;

    persist({
      ...data,
      disasters: [...data.disasters, {
        ...form,
        title: form.title.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        active: true
      }]
    });

    setForm({
      title: "", type: "Flood", location: "", severity: "Medium",
      description: "", icon: "fa-droplet"
    });
    setShow("");
  };

  const addShelter = () => {
    if (!shelter.name.trim() || !shelter.location.trim()) return;

    const capacity = Number(shelter.capacity) || 0;
    const occupied = Math.min(Number(shelter.occupied) || 0, capacity);

    persist({
      ...data,
      shelters: [...data.shelters, {
        name: shelter.name.trim(),
        location: shelter.location.trim(),
        capacity, occupied
      }]
    });

    setShelter({
      name: "", location: "", capacity: "", occupied: ""
    });
    setShow("");
  };
  const changeType = (e) => {
    const type = e.target.value;
    const icons = {
      Flood: "fa-droplet",
      Cyclone: "fa-wind",
      Fire: "fa-fire",
      Landslide: "fa-mountain"
    };
    setForm({ ...form, type, icon: icons[type] });
  };

  

  const active = data.disasters.filter(x => x.active).length;

  return (
    <div className="admin-layout">
      <Sidebar variant="admin" />

      <div className="main-content">
        <Topbar
          variant="admin"
          userName="Admin"
          title="Disaster Centre"
          subtitle="Manage emergency information"
        />

        <div className="disaster-admin-hero">
          <div>
            <span className="live-label">
              <span />
              LIVE UPDATES
            </span>
            <h2>Stay informed. Stay safe.</h2>
            <p>Check current disaster alerts and emergency shelters.</p>
          </div>
        </div>

       

        <div className="admin-stat-cards">
          <Stat icon="fa-triangle-exclamation" title="Active Alerts" value={active} />
          <Stat icon="fa-house" title="Shelters" value={data.shelters.length} />
          {/* <Stat
            icon="fa-clock"
            title="Last Checked"
            value={new Date().toLocaleTimeString([], {
              hour: "2-digit", minute: "2-digit"
            })}
          /> */}
        </div>

        <Section
          title="Emergency Alerts"
          sub="Information visible to victims"
          button="Add Alert"
          click={() => setShow(show === "alert" ? "" : "alert")}
        >
          {show === "alert" && (
            <Form>
              <input
                placeholder="Alert title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />

              <select value={form.type} onChange={changeType}>
                <option>Flood</option>
                <option>Cyclone</option>
                <option>Fire</option>
                <option>Landslide</option>
              </select>

              <input
                placeholder="Location"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
              />

              <select
                value={form.severity}
                onChange={e => setForm({ ...form, severity: e.target.value })}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <textarea
                placeholder="Short description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />

              <button className="form-save" onClick={addAlert}>
                Add Alert
              </button>
            </Form>
          )}

          <div className="admin-alert-list">
            {data.disasters.map((x, i) => (
              <div
                className={`admin-alert-item ${x.active ? "" : "inactive"}`}
                key={x._id || i}
              >
                <div className="alert-icon">
                  <i className={`fa-solid ${x.icon}`} />
                </div>

                <div className="alert-details">
                  <div className="alert-title-row">
                    <h4>{x.title}</h4>
                    <span className={`badge ${x.severity}`}>{x.severity}</span>
                  </div>
                  <p>
                    <i className="fa-solid fa-location-dot" /> {x.location}
                  </p>
                  <small>{x.description}</small>
                </div>

                
                
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Emergency Shelters"
          sub="Current shelter capacity"
          button="Add Shelter"
          click={() => setShow(show === "shelter" ? "" : "shelter")}
        >
          {show === "shelter" && (
            <Form>
              <input
                placeholder="Shelter name"
                value={shelter.name}
                onChange={e => setShelter({ ...shelter, name: e.target.value })}
              />

              <input
                placeholder="Location"
                value={shelter.location}
                onChange={e => setShelter({ ...shelter, location: e.target.value })}
              />

              <input
                type="number"
                min="0"
                placeholder="Capacity"
                value={shelter.capacity}
                onChange={e => setShelter({ ...shelter, capacity: e.target.value })}
              />

              <input
                type="number"
                min="0"
                placeholder="Occupied"
                value={shelter.occupied}
                onChange={e => setShelter({ ...shelter, occupied: e.target.value })}
              />

              <button className="form-save" onClick={addShelter}>
                Add Shelter
              </button>
            </Form>
          )}

          <div className="shelter-grid">
            {data.shelters.map((x, i) => {
              const cap = Number(x.capacity) || 0;
              const occ = Number(x.occupied) || 0;
              const available = Math.max(cap - occ, 0);
              const percent = cap ? Math.min((occ / cap) * 100, 100) : 0;

              return (
                <div className="shelter-card" key={x._id || i}>
                  <div className="shelter-top">
                    <div>
                      <h4>{x.name}</h4>
                      <p>
                        <i className="fa-solid fa-location-dot" /> {x.location}
                      </p>
                    </div>
                  </div>

                  <div className="capacity-row">
                    <span>{occ} occupied</span>
                    <span>{available} available</span>
                  </div>

                  <div className="capacity-bar">
                    <div style={{ width: `${percent}%` }} />
                  </div>

                  <div className="capacity-bottom">
                    <span>Capacity: {cap}</span>
                    <b className={available ? "open-text" : "full-text"}>
                      {available ? "Open" : "Full"}
                    </b>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Stat({ icon, title, value }) {
  return (
    <div className="admin-stat-card">
      <div className="stat-icon">
        <i className={`fa-solid ${icon}`} />
      </div>
      <div className="stat-label">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function Section({ title, sub, button, click, children }) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <h3>{title}</h3>
          <p className="section-subtitle">{sub}</p>
        </div>

        <button className="small-add-btn" onClick={click}>
          <i className="fa-solid fa-plus" /> {button}
        </button>
      </div>

      {children}
    </div>
  );
}

function Form({ children }) {
  return <div className="simple-form">{children}</div>;
}