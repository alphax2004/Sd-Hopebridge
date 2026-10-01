import { useEffect, useState } from "react";
import { Sidebar, Topbar } from "../sidebar/sidebar";
import "./DisasterCenter.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const types = ["All", "Flood", "Cyclone", "Fire", "Landslide"];

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
          { credentials: "include" }
        );

        if (!response.ok)
          throw new Error("Failed to load");

        const result = await response.json();

        setData({
          disasters: result.disasters || [],
          shelters: result.shelters || [],
          news: result.news || [],
        });
      } catch (err) {
        console.log("DISASTER CENTRE ERROR:", err);
        setError("Unable to load emergency information.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="disaster-layout">
        <Sidebar />
        <div className="main-content">
          <div className="dc-message">
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
    (item) =>
      Number(item.occupied) < Number(item.capacity)
  ).length;

  const filteredList =
    filter === "All"
      ? activeDisasters
      : activeDisasters.filter(
          (item) => item.type === filter
        );

  return (
    <div className="disaster-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar
          title="Disaster Center"
          subtitle="Real-time emergency information"
        />

        {/* HERO */}
        <div className="dc-hero">
          <div>
            <span className="dc-live">
              <span></span>
              LIVE UPDATES
            </span>

            <h2>Stay informed. Stay safe.</h2>

            <p>
              Check current disaster alerts, shelters
              and important emergency news.
            </p>
          </div>

          <div className="dc-hero-icon">
            <i className="fa-solid fa-shield-heart"></i>
          </div>
        </div>

        {error && (
          <div className="dc-error">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="stat-cards">
          <div className="stat-card">
            <div className="dc-stat-icon">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <div className="stat-value">
                {activeDisasters.length}
              </div>
              <div className="stat-label">
                Active Disasters
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="dc-stat-icon">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <div>
              <div className="stat-value">
                {highRisk}
              </div>
              <div className="stat-label">
                High Risk Alerts
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="dc-stat-icon">
              <i className="fa-solid fa-house"></i>
            </div>
            <div>
              <div className="stat-value">
                {openShelters}
              </div>
              <div className="stat-label">
                Open Shelters
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="dc-stat-icon">
              <i className="fa-solid fa-newspaper"></i>
            </div>
            <div>
              <div className="stat-value">
                {data.news.length}
              </div>
              <div className="stat-label">
                News Updates
              </div>
            </div>
          </div>
        </div>

        {/* ALERTS */}
        <div className="dc-section">
          <div className="dc-section-header">
            <div>
              <h3>Emergency Alerts</h3>
              <p>Current active disaster information</p>
            </div>

            <span className="dc-status">
              <span></span>
              Updated
            </span>
          </div>

          <div className="filter-row">
            {types.map((type) => (
              <button
                key={type}
                className={
                  filter === type
                    ? "filter-btn active"
                    : "filter-btn"
                }
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="disaster-list">
            {filteredList.length === 0 ? (
              <div className="dc-empty">
                <i className="fa-solid fa-circle-check"></i>
                <h4>No active alerts</h4>
                <p>
                  There are no active disasters in
                  this category.
                </p>
              </div>
            ) : (
              filteredList.map((item, index) => (
                <div
                  className="disaster-card"
                  key={item._id || index}
                >
                  <div className="disaster-icon">
                    <i
                      className={`fa-solid ${
                        item.icon ||
                        "fa-triangle-exclamation"
                      }`}
                    ></i>
                  </div>

                  <div className="disaster-info">
                    <div className="dc-title-row">
                      <h4>{item.title}</h4>

                      <span
                        className={`severity ${item.severity}`}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <p className="dc-location">
                      <i className="fa-solid fa-location-dot"></i>
                      {item.location}
                    </p>

                    <p className="dc-description">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SHELTERS */}
        <div className="dc-section">
          <div className="dc-section-header">
            <div>
              <h3>Emergency Shelters</h3>
              <p>Available shelters and capacity</p>
            </div>
          </div>

          <div className="victim-shelter-grid">
            {data.shelters.length === 0 ? (
              <div className="dc-empty">
                No shelter information available.
              </div>
            ) : (
              data.shelters.map((item, index) => {
                const capacity =
                  Number(item.capacity) || 0;

                const occupied =
                  Number(item.occupied) || 0;

                const available = Math.max(
                  capacity - occupied,
                  0
                );

                const percent = capacity
                  ? Math.min(
                      (occupied / capacity) * 100,
                      100
                    )
                  : 0;

                return (
                  <div
                    className="victim-shelter-card"
                    key={item._id || index}
                  >
                    <div className="shelter-heading">
                      <div className="shelter-icon">
                        <i className="fa-solid fa-house"></i>
                      </div>

                      <div>
                        <h4>{item.name}</h4>

                        <p>
                          <i className="fa-solid fa-location-dot"></i>
                          {item.location}
                        </p>
                      </div>
                    </div>

                    <div className="shelter-capacity">
                      <span>
                        {occupied} / {capacity}
                      </span>

                      <span>
                        {available} spots left
                      </span>
                    </div>

                    <div className="victim-progress">
                      <div
                        style={{
                          width: `${percent}%`,
                        }}
                      ></div>
                    </div>

                    <span
                      className={
                        available > 0
                          ? "shelter-open"
                          : "shelter-full"
                      }
                    >
                      {available > 0 ? "Open" : "Full"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* NEWS */}
        <div className="dc-section">
          <div className="dc-section-header">
            <div>
              <h3>Important News</h3>
              <p>Latest emergency updates</p>
            </div>
          </div>

          <div className="victim-news-grid">
            {data.news.length === 0 ? (
              <div className="dc-empty">
                No news updates available.
              </div>
            ) : (
              data.news.map((item, index) => (
                <div
                  className="victim-news-card"
                  key={item._id || index}
                >
                  <div className="news-icon">
                    <i
                      className={`fa-solid ${
                        item.icon || "fa-newspaper"
                      }`}
                    ></i>
                  </div>

                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}