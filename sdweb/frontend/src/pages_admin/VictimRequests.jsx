import { useState } from "react";
import { Sidebar, Topbar } from "../pages_alfa/sidebar";
import "./admin.css";

const statusOptions = ["All", "Pending", "Approved", "Volunteer Assigned", "Delivered"];
const priorityOptions = ["All", "Low", "Medium", "High", "Critical"];

const requests = [
  ["Rahim Uddin", "01711-000111", "Mirpur, Dhaka", "Flood", "Food", 4, "High", "Pending"],
  ["Karim Sheikh", "01811-000222", "Uttara, Dhaka", "Fire", "Medicine", 3, "Medium", "Approved"],
  ["Salma Akter", "01911-000333", "Dhaka", "Flood", "Water", 5, "High", "Delivered"],
  ["Hasan Mahmud", "01611-000444", "Sylhet", "Cyclone", "Shelter", 6, "Critical", "Volunteer Assigned"],
  ["Nusrat Jahan", "01511-000555", "Chattogram", "Earthquake", "Blanket", 2, "Low", "Pending"],
];

export default function VictimRequests() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const filtered = requests.filter(
    (r) =>
      (statusFilter === "All" || r[7] === statusFilter) &&
      (priorityFilter === "All" || r[6] === priorityFilter)
  );

  return (
    <div className="admin-layout">
      <Sidebar variant="admin" />

      <div className="main-content">
        <Topbar
          variant="admin"
          userName="Admin"
          title="Victim Requests"
          subtitle="Monitor incoming help requests from victims."
        />

        <div className="filter-row">
          <div className="filter-group">
            <span>Status:</span>
            {statusOptions.map((s) => (
              <button
                key={s}
                className={statusFilter === s ? "filter-btn active" : "filter-btn"}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <span>Priority:</span>
            {priorityOptions.map((p) => (
              <button
                key={p}
                className={priorityFilter === p ? "filter-btn active" : "filter-btn"}
                onClick={() => setPriorityFilter(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h3>All Requests</h3>
          <table>
            <thead>
              <tr>
                <th>Victim Name</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Disaster</th>
                <th>Need</th>
                <th>Family Members</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r[1]}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                  <td>{r[4]}</td>
                  <td>{r[5]}</td>
                  <td>
                    <span className={`badge ${r[6]}`}>{r[6]}</span>
                  </td>
                  <td>
                    <span className={`badge ${r[7]}`}>{r[7]}</span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>No requests match this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
