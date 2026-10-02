import { Sidebar, Topbar } from "../../pages_victim/sidebar/sidebar";
import "../admin.css";
import "./ReliefManagement.css";

const resources = [
  ["Food", 75],
  ["Medicine", 90],
  ["Water", 60],
  ["Blanket", 40],
  ["Tent", 30],
];

const distribution = [
  ["Food", 300, 150],
  ["Water", 250, 100],
  ["Medicine", 180, 70],
  ["Blanket", 120, 80],
];

const averageAvailable = Math.round(
  resources.reduce((sum, [, pct]) => sum + pct, 0) / resources.length
);

export default function ReliefManagement() {
  return (
    <div className="admin-layout">
      <Sidebar variant="admin" />

      <div className="main-content">
        <Topbar
          variant="admin"
          userName="Admin"
          title="Relief Management"
          subtitle="Track NGO relief resources and distribution."
        />

        <div className="admin-card relief-card">
          <h3>Available Resources</h3>
          <p className="relief-card-sub">Resource capacity and warehouse stock levels</p>
          <div className="resources-list">
            {resources.map(([label, pct]) => (
              <div className="progress-row" key={label}>
                <div className="progress-row-top">
                  <span>{label}</span>
                  <span className="progress-percentage">{pct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="average-row">
            <span>Total Available Resources (Average)</span>
            <span className="average-badge">{averageAvailable}%</span>
          </div>
        </div>

        <div className="admin-card relief-card">
          <h3>Relief Distribution</h3>
          <p className="relief-card-sub">Items dispatched and remaining in stock</p>
          <div className="relief-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Distributed</th>
                  <th>Remaining</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {distribution.map(([item, distributed, remaining]) => (
                  <tr key={item}>
                    <td>
                      <div className="item-name">
                        <i
                          className={
                            item === "Food"
                              ? "fa-solid fa-bowl-food"
                              : item === "Water"
                              ? "fa-solid fa-droplet"
                              : item === "Medicine"
                              ? "fa-solid fa-kit-medical"
                              : item === "Blanket"
                              ? "fa-solid fa-rug"
                              : "fa-solid fa-box"
                          }
                        ></i>
                        <span>{item}</span>
                      </div>
                    </td>
                    <td>{distributed} units</td>
                    <td>{remaining} units</td>
                    <td>
                      <span
                        className={`status ${
                          remaining > 100 ? "approved" : "high"
                        }`}
                      >
                        {remaining > 100 ? "Sufficient" : "Low Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
