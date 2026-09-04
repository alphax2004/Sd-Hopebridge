import { useState } from "react";
import { Sidebar, Topbar } from "./sidebar";

import"./DisasterCenter.css";
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

export default function DisasterCenter() {
  const [filter, setFilter] = useState("All");

  const filteredList =
    filter === "All" ? disasters : disasters.filter((d) => d[2] === filter);

  return (
    <div className="disaster-layout">
      

      <Sidebar />

      <div className="main-content">
        <Topbar
          title="Disaster Center"
          subtitle="Real-time updates on ongoing disasters"
        />

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
