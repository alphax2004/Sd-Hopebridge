import { Sidebar, Topbar } from "./sidebar";

const stats = [
  ["fa-clipboard-list", "Total Requests", 12, "All time requests"],
  ["fa-clock", "Pending Requests", 4, "Waiting for approval"],
  ["fa-circle-check", "Approved Requests", 5, "Approved by NGO"],
];

const barData = [
  ["Sun", 3], ["Mon", 5], ["Tue", 6], ["Wed", 8],
  ["Thu", 4], ["Fri", 7], ["Sat", 3],
];

const requests = [
  ["#REQ-0012", "Food", "Rice, Dal, Oil, Salt", "4 Items",
   "Sylhet, Bangladesh", "12 May 2026", "High", "Pending"],
  ["#REQ-0011", "Shelter", "Tents, Tarpaulin", "2 Items",
   "Sunamganj, Bangladesh", "10 May 2026", "Medium", "Approved"],
];

export default function Dashboard({ goTo }) {
  return (
    <div className="dashboard-layout">
      <style>{css}</style>

      <Sidebar goTo={goTo} current="dashboard" />

      <div className="main-content">

        <Topbar
          title="Welcome back, Sanjida 👋"
          subtitle="Stay safe, stay informed. We are here to help you."
        />

        {/* Statistics */}
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

        {/* Chart */}
        <div className="chart-card">
          <div className="card-header">
            <h3>Requests Over Time</h3>
            <button className="action-btn">This Week</button>
          </div>

          <div className="bar-chart">
            {barData.map((b) => (
              <div className="bar-col" key={b[0]}>
                <div
                  className="bar"
                  style={{ height: `${b[1] * 18}px` }}
                />
                <span>{b[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Requests */}
        <div className="table-card">
          <div className="card-header">
            <h3>Recent Requests</h3>
            <button className="action-btn view-all">View All</button>
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
                    <span className={`status ${r[7]}`}>
                      {r[7]}
                    </span>
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

const css = `
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: var(--cream-bg);
}

.main-content {
  flex: 1;
  padding: 24px 35px;
}

/* Stats */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}

.stat-card {
  background: #fdf1e3;
  border-radius: 14px;
  padding: 10px 14px;
  text-align: left !important;
}

.stat-card-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: var(--primary-orange);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-label {
  font-size: 15px;
  font-weight: bold;
}

.stat-value {
  margin: 6px 0 2px 46px;
  font-size: 24px;
  font-weight: bold;
  color: black;
  text-align: left !important;
}

.stat-note {
  margin-left: 46px;
  font-size: 12px;
  font-weight: bold;
  color: #555;
  text-align: left !important;
}

/* Cards */
.chart-card,
.table-card {
  background: white;
  border: 1px solid #eee3d0;
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 14px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-header h3 {
  margin: 0;
  font-size: 17px;
  font-weight: bold;
}

/* Buttons */
.action-btn {
  background: var(--primary-orange);
  border: 1px solid var(--primary-orange);
  border-radius: 7px;
  padding: 7px 15px;
  font-weight: bold;
  cursor: pointer;
}

.action-btn:hover {
  background: white;
}

/* Chart */
.bar-chart {
  height: 150px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 25px;
}

.bar-col {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.bar {
  width: 70px;
  background: var(--primary-orange);
  border-radius: 5px 5px 0 0;
}

.bar-col span {
  margin-top: 7px;
  font-size: 12px;
  font-weight: bold;
}

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
}

th {
  font-size: 11px;
  font-weight: bold;
}

td {
  font-size: 12px;
  font-weight: bold;
}

.status {
  padding: 5px 9px;
  border-radius: 20px;
}

.Pending {
  color: #f0a63a;
  background: #f0a63a22;
}

.Approved {
  color: #4caf7d;
  background: #4caf7d22;
}
`;