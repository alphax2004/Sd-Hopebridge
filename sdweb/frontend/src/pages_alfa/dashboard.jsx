import { Sidebar, Topbar } from "./sidebar";
import"./dashboard.css";

const stats = [
  ["fa-clipboard-list", "Total Requests", 12, "All time requests"],
  ["fa-clock", "Pending Requests", 4, "Waiting for approval"],
  ["fa-circle-check", "Approved Requests", 5, "Approved by NGO"],
];

const barData = [
  ["Sun", 3],
  ["Mon", 5],
  ["Tue", 6],
  ["Wed", 8],
  ["Thu", 4],
  ["Fri", 7],
  ["Sat", 3],
];

const requests = [
  ["#REQ-0012", "Food", "Rice, Dal, Oil, Salt", "4 Items", "Sylhet, Bangladesh", "12 May 2026", "High", "Pending"],
  ["#REQ-0011", "Shelter", "Tents, Tarpaulin", "2 Items", "Sunamganj, Bangladesh", "10 May 2026", "Medium", "Approved"],
];

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      

      <Sidebar />

      <div className="main-content">
        <Topbar
          title="Welcome back, Sanjida 👋"
          subtitle="Stay safe, stay informed. We are here to help you."
        />

        <div className="stat-cards">
          {stats.map((s) => (
            <div className="stat-card" key={s[1]}>
              <div className="stat-card-top">
                <div className="stat-icon">
                  <i className={`fa-solid ${s[0]}`}></i>
                </div>
                <div className="stat-label">{s[1]}</div>
              </div>

              <div className="stat-value">{s[2]}</div>
              <div className="stat-note">{s[3]}</div>
            </div>
          ))}
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3>Requests Over Time</h3>
            <button className="action-btn">This Week</button>
          </div>

          <div className="bar-chart">
            {barData.map((b) => (
              <div className="bar-col" key={b[0]}>
                <div className="bar" style={{ height: `${b[1] * 18}px` }} />
                <span>{b[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="table-card">
          <div className="card-header">
            <h3>Recent Requests</h3>
            <button className="action-btn">View All</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Type</th>
                <th>Items</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Date</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((r) => (
                <tr key={r[0]}>
                  {r.slice(0, 7).map((x, i) => (
                    <td key={i}>{x}</td>
                  ))}
                  <td>
                    <span className={`status ${r[7]}`}>{r[7]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
