import { useState } from "react";
import { Sidebar, Topbar } from "./sidebar";

const stats = [
  ["fa-triangle-exclamation", "Active Disasters", 6],
  ["fa-map-location-dot", "High Risk Zones", 9],
  ["fa-hands-helping", "Ongoing Relief Ops", 14],
];

const types = ["All", "Flood", "Cyclone", "Fire", "Landslide"];

const disasters = [
  ["fa-droplet", "Flash Flood", "Flood", "Sylhet, Bangladesh", "3 hours ago", "High"],
  ["fa-wind", "Cyclone Warning", "Cyclone", "Cox's Bazar, Bangladesh", "1 day ago", "Medium"],
  ["fa-fire", "Market Fire", "Fire", "Chattogram, Bangladesh", "5 hours ago", "High"],
  ["fa-mountain", "Landslide Risk", "Landslide", "Bandarban, Bangladesh", "2 days ago", "Low"],
];

export default function DisasterCenter({ goTo }) {
  const [filter, setFilter] = useState("All");

  const filteredList =
    filter === "All" ? disasters : disasters.filter((d) => d[2] === filter);

  return (
    <div className="disaster-layout">
      <style>{css}</style>

      <Sidebar goTo={goTo} current="disasterCenter" />

      <div className="main-content">
        <Topbar
          title="Disaster Center"
          subtitle="Real-time updates on ongoing disasters"
        />

        {/* Stats */}
        <div className="stat-cards">
          {stats.map((s) => (
            <div className="stat-card" key={s[1]}>
              <i className={`fa-solid ${s[0]}`}></i>
              <div>
                <div className="stat-value">{s[2]}</div>
                <div className="stat-label">{s[1]}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter buttons */}
        <div className="filter-row">
          {types.map((t) => (
            <button
              key={t}
              className={filter === t ? "filter-btn active" : "filter-btn"}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Disaster list */}
        <div className="disaster-list">
          {filteredList.map((d, i) => (
            <div className="disaster-card" key={i}>
              <div className="disaster-icon">
                <i className={`fa-solid ${d[0]}`}></i>
              </div>

              <div className="disaster-info">
                <h4>{d[1]}</h4>
                <p>{d[3]} · {d[4]}</p>
              </div>

              <span className={`severity ${d[5]}`}>{d[5]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const css = `
.disaster-layout {
  display: flex;
  min-height: 100vh;
  background: var(--cream-bg);
}

.main-content {
  flex: 1;
  padding: 24px 35px;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 16px;
}

.stat-card {
  background: #fdf1e3;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-card i {
  font-size: 22px;
  color: var(--primary-orange);
}

.stat-value {
  font-size: 22px;
}

.stat-label {
  font-size: 12px;
  color: #555;
}

.filter-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.filter-btn {
  padding: 8px 18px;
  border: 1px solid #eee3d0;
  border-radius: 20px;
  background: white;
  font-size: 13px;
  cursor: pointer;
}

.filter-btn.active {
  background: var(--primary-orange);
  border-color: var(--primary-orange);
}

.disaster-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.disaster-card {
  background: white;
  border: 1px solid #eee3d0;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.disaster-icon {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 10px;
  background: #fdf1e3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-orange);
  font-size: 18px;
}

.disaster-info {
  flex: 1;
  text-align: left;
}

.disaster-info h4 {
  margin: 0 0 4px;
  font-size: 15px;
}

.disaster-info p {
  margin: 0;
  font-size: 13px;
  color: #555;
}

.severity {
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 12px;
}

.severity.High {
  color: #d94b4b;
  background: #d94b4b22;
}

.severity.Medium {
  color: #d99e1f;
  background: #d99e1f22;
}

.severity.Low {
  color: #4caf7d;
  background: #4caf7d22;
}
`;