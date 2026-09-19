import { Sidebar, Topbar } from "../pages_victim/sidebar/sidebar";
import "./admin.css";

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

        <div className="admin-card">
          <h3>Available Resources</h3>
          {resources.map(([label, pct]) => (
            <div className="progress-row" key={label}>
              <div className="progress-row-top">
                <span>{label}</span>
                <span>{pct}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }}></div>
              </div>
            </div>
          ))}

          <div className="progress-row-top" style={{ marginTop: 8 }}>
            <span>Total Available Resources (Average)</span>
            <span>{averageAvailable}%</span>
          </div>
        </div>

        <div className="admin-card">
          <h3>Relief Distribution</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Distributed</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {distribution.map(([item, distributed, remaining]) => (
                <tr key={item}>
                  <td>{item}</td>
                  <td>{distributed}</td>
                  <td>{remaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
