import { useEffect, useState } from "react";
import { Sidebar, Topbar } from "../sidebar/sidebar";
import "./DisasterCenter.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

const types = [
  "All",
  "Flood",
  "Cyclone",
  "Fire",
  "Landslide",
];

export default function DisasterCenter() {
  const [data, setData] = useState({
    disasters: [],
    shelters: [],
    news: [],
  });

  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/disaster-centre`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load");
        }

        const result = await response.json();

        setData({
          disasters: result.disasters || [],
          shelters: result.shelters || [],
          news: result.news || [],
        });

        setError("");
      } catch (err) {
        console.log("DISASTER CENTRE ERROR:", err);
        setError("Unable to load emergency information.");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const interval = setInterval(loadData, 5000);

    window.addEventListener("focus", loadData);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", loadData);
    };
  }, []);

  if (loading) {
    return (
      <div className="disaster-layout">
        <Sidebar />

        <div className="main-content">
          <div className="admin-message">
            Loading emergency information...
          </div>
        </div>
      </div>
    );
  }

  const activeDisasters = data.disasters.filter(
    (item) => item.active
  );

  const highRisk = activeDisasters.filter(
    (item) => item.severity === "High"
  ).length;

  const openShelters = data.shelters.filter(
    (item) => Number(item.occupied || 0) < Number(item.capacity || 0)
  ).length;

  const filteredList =
    filter === "All"
      ? activeDisasters
      : activeDisasters.filter((item) => item.type === filter);

  return (
    <div className="disaster-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar
          title="Disaster Centre"
          subtitle="Real-time emergency information"
        />

        <div className="disaster-admin-hero">
          <div>
            <span className="live-label">
              <span />
              LIVE UPDATES
            </span>
            <h2>Stay informed. Stay safe.</h2>
            <p>
              Check current disaster alerts and emergency shelters.
            </p>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <div className="admin-stat-cards">
          <Stat
            icon="fa-triangle-exclamation"
            title="Active Disasters"
            value={activeDisasters.length}
          />
          <Stat
            icon="fa-bolt"
            title="High Risk Alerts"
            value={highRisk}
          />
          <Stat
            icon="fa-house"
            title="Open Shelters"
            value={openShelters}
          />
        </div>

        <Section
          title="Emergency Alerts"
          sub="Current active disaster information"
        >
          <div className="filter-row">
            {types.map((type) => (
              <button
                key={type}
                className={
                  filter === type ? "filter-btn active" : "filter-btn"
                }
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="admin-alert-list">
            {filteredList.length === 0 ? (
              <div className="dc-empty">
                <i className="fa-solid fa-circle-check"></i>
                <h4>No active alerts</h4>
                <p>There are no active disasters in this category.</p>
              </div>
            ) : (
              filteredList.map((x, i) => (
                <div className="admin-alert-item" key={x._id || i}>
                  <div className="alert-icon">
                    <i
                      className={`fa-solid ${x.icon || "fa-triangle-exclamation"}`}
                    />
                  </div>

                  <div className="alert-details">
                    <div className="alert-title-row">
                      <h4>{x.title}</h4>
                      <span className={`badge ${x.severity}`}>
                        {x.severity}
                      </span>
                    </div>

                    <p>
                      <i className="fa-solid fa-location-dot" />{" "}
                      {x.location}
                    </p>

                    <small>{x.description}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </Section>

        <Section
          title="Emergency Shelters"
          sub="Available safe places"
        >
          <div className="shelter-grid">
            {data.shelters.length === 0 ? (
              <div className="dc-empty">
                <i className="fa-solid fa-house-circle-check"></i>
                <h4>No shelters listed</h4>
                <p>There are no shelters available right now.</p>
              </div>
            ) : (
              data.shelters.map((shelter, i) => {
                const capacity = Number(shelter.capacity || 0);
                const occupied = Number(shelter.occupied || 0);
                const available = capacity - occupied;
                const filled = capacity ? (occupied / capacity) * 100 : 0;

                return (
                  <div className="shelter-card" key={shelter._id || i}>
                    <div className="shelter-top">
                      <div>
                        <h4>{shelter.name}</h4>
                        <p>
                          <i className="fa-solid fa-location-dot" />{" "}
                          {shelter.location}
                        </p>
                      </div>
                    </div>

                    <div className="capacity-row">
                      <span>{occupied} occupied</span>
                      <span>{Math.max(available, 0)} available</span>
                    </div>

                    <div className="capacity-bar">
                      <div style={{ width: `${Math.min(filled, 100)}%` }} />
                    </div>

                    <div className="capacity-bottom">
                      <span>Capacity: {capacity}</span>
                      <b className={available > 0 ? "open-text" : "full-text"}>
                        {available > 0 ? "Open" : "Full"}
                      </b>
                    </div>
                  </div>
                );
              })
            )}
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

function Section({ title, sub, children }) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <h3>{title}</h3>
          <p className="section-subtitle">{sub}</p>
        </div>
      </div>

      {children}
    </div>
  );
}