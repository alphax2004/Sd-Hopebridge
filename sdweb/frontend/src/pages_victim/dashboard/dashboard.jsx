import { useCallback, useEffect, useState } from "react";
import { Sidebar, Topbar } from "../sidebar/sidebar";
import "./dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [urgencyFilter, setUrgencyFilter] = useState("All");

  // ==========================================
  // FILTER REQUESTS
  // ==========================================
  const filteredRequests = requests.filter((request) => {
    const urgency = String(
      request?.urgency || request?.priority || "Low"
    ).toLowerCase();
    if (urgencyFilter === "All") {
      return true;
    }
    return urgency === urgencyFilter.toLowerCase();
  });

 // ==========================================
  // LOAD USER REQUESTS
  // ==========================================
  const fetchRequestsData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/requests/my`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      const contentType = response.headers.get("content-type") || "";
      let data = null;
      if (contentType.includes("application/json")) {
        data = await response.json().catch(() => null);
      }
      if (!response.ok) {
        // 401 (Invalid token / Expired) বা 403 হলে কোনো এরর মেসেজ UI-তে দেখাবে না
        if (response.status === 401 || response.status === 403) {
          setError("");
        } else {
          setError("Failed to load requests.");
        }
        setRequests([]);
        return;
      }
      if (Array.isArray(data)) {
        setRequests(data);
        setError("");
      } else if (Array.isArray(data?.requests)) {
        setRequests(data.requests);
        setError("");
      } else if (Array.isArray(data?.data)) {
        setRequests(data.data);
        setError("");
      } else {
        setError("");
        setRequests([]);
      }
    } catch (err) {
      console.error("LOAD REQUESTS ERROR:", err);
      setError("");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // INITIAL LOAD
  // ==========================================
  useEffect(() => {
    const loadData = async () => {
      await fetchRequestsData();
    };
    loadData();
  }, [fetchRequestsData]);

  // ==========================================
  // STATISTICS
  // ==========================================
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((request) => {
    const status = String(
      request?.status || request?.requestStatus || ""
    ).toLowerCase();
    return status === "pending";
  }).length;
  const approvedRequests = requests.filter((request) => {
    const status = String(
      request?.status || request?.requestStatus || ""
    ).toLowerCase();
    return status === "approved";
  }).length;

  // ==========================================
  // APPROVED REQUEST COUNT BY DAY
  // ==========================================
  const approvedBarData = [
    ["Sun", 0],
    ["Mon", 0],
    ["Tue", 0],
    ["Wed", 0],
    ["Thu", 0],
    ["Fri", 0],
    ["Sat", 0],
  ];
  requests.forEach((request) => {
    const status = String(
      request?.status || request?.requestStatus || ""
    ).toLowerCase();
    if (status !== "approved" || !request?.createdAt) return;
    const date = new Date(request.createdAt);
    if (Number.isNaN(date.getTime())) return;
    const day = date.getDay();
    approvedBarData[day][1]++;
  });

  // ==========================================
  // Y-AXIS
  // ==========================================
  const maxApprovedInDay = Math.max(
    ...approvedBarData.map((item) => item[1])
  );
  const yAxisMax = Math.max(5, maxApprovedInDay);
  const yAxisValues = [];
  for (let value = yAxisMax; value >= 0; value--) {
    yAxisValues.push(value);
  }

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================
  function formatDate(dateValue) {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    return Number.isNaN(date.getTime())
      ? "-"
      : date.toLocaleDateString();
  }

  function formatTime(dateValue) {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    return Number.isNaN(date.getTime())
      ? "-"
      : date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Welcome back, Sanjida 👋"
          subtitle="Stay safe, stay informed. We are here to help you."
        />
        {/* STAT CARDS */}
        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon">
                <i className="fa-solid fa-clipboard-list"></i>
              </div>
              <div className="stat-label">Total Requests</div>
            </div>
            <div className="stat-value">{totalRequests}</div>
            <div className="stat-note">(All time requests)</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon">
                <i className="fa-solid fa-clock"></i>
              </div>
              <div className="stat-label">Pending Requests</div>
            </div>
            <div className="stat-value">{pendingRequests}</div>
            <div className="stat-note">(Waiting for approval)</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="stat-label">Approved Requests</div>
            </div>
            <div className="stat-value">{approvedRequests}</div>
            <div className="stat-note">(Approved by NGO)</div>
          </div>
        </div>

        {/* APPROVED REQUESTS OVER TIME */}
        <div className="approved-request-section">
          <div className="approved-request-heading">
            <h2>Approved Requests Over Time</h2>
            <p>Number of approved requests submitted each day</p>
          </div>
          <div className="chart-card">
            <div className="graph-wrapper">
              <div className="graph-y-axis">
                {yAxisValues.map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>
              <div className="graph-area">
                <div className="graph-grid">
                  {yAxisValues.map((value) => (
                    <div
                      className="graph-grid-line"
                      key={value}
                    ></div>
                  ))}
                </div>
                <div className="graph-bars">
                  {approvedBarData.map(([day, count]) => {
                    const barHeight =
                      count === 0
                        ? 0
                        : (count / yAxisMax) * 100;
                    return (
                      <div
                        className="graph-bar-column"
                        key={day}
                      >
                        {count > 0 && (
                          <span className="graph-bar-value">
                            {count}
                          </span>
                        )}
                        <div
                          className="graph-bar"
                          style={{
                            height: `${barHeight}%`,
                          }}
                          title={`${count} approved request(s)`}
                        ></div>
                        <span className="graph-day">
                          {day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT REQUESTS */}
        <div className="recent-request-section">
          <div className="recent-request-heading">
            <h2>Recent Requests</h2>
            <p>Complete details of your submitted help requests</p>
          </div>
          <div className="table-card">
            <div className="card-header">
              <div className="filter-wrapper">
                <button
                  className="action-btn"
                  onClick={() =>
                    setFilterOpen(!filterOpen)
                  }
                >
                  <i className="fa-solid fa-filter"></i>
                  Filter
                </button>
                {filterOpen && (
                  <div className="filter-dropdown">
                    <button
                      className={
                        urgencyFilter === "All"
                          ? "active-filter"
                          : ""
                      }
                      onClick={() => {
                        setUrgencyFilter("All");
                        setFilterOpen(false);
                      }}
                    >
                      All
                    </button>
                    <button
                      className={
                        urgencyFilter === "High"
                          ? "active-filter"
                          : ""
                      }
                      onClick={() => {
                        setUrgencyFilter("High");
                        setFilterOpen(false);
                      }}
                    >
                      High
                    </button>
                    <button
                      className={
                        urgencyFilter === "Medium"
                          ? "active-filter"
                          : ""
                      }
                      onClick={() => {
                        setUrgencyFilter("Medium");
                        setFilterOpen(false);
                      }}
                    >
                      Medium
                    </button>
                    <button
                      className={
                        urgencyFilter === "Low" ? "active-filter" : ""
                      }
                      onClick={() => {
                        setUrgencyFilter("Low");
                        setFilterOpen(false);
                      }}
                    >
                      Low
                    </button>
                  </div>
                )}
              </div>
            </div>
            {loading ? (
              <div className="table-message">
                Loading requests...
              </div>
            ) : error ? (
              <div className="table-message error-message">
                {error}
              </div>
            ) : requests.length === 0 ? (
              <div className="table-message">
                <i className="fa-solid fa-clipboard-list"></i>
                <p>No requests found.</p>
                <span>
                  Your submitted help requests will appear here.
                </span>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="table-message">
                <i className="fa-solid fa-filter"></i>
                <p>No {urgencyFilter.toLowerCase()} urgency requests found.</p>
                <span>
                  Try selecting another filter.
                </span>
              </div>
            ) : (
              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Type</th>
                      <th>Items / Requirement</th>
                      <th>Quantity / People</th>
                      <th>Urgency</th>
                      <th>Location</th>
                      <th>Contact</th>
                      <th>Notes</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((r) => {
                      const status = r?.status || r?.requestStatus || "Pending";
                      const urgency = r?.urgency || r?.priority || "Low";
                      return (
                        <tr
                          key={
                            r?._id ||
                            `${r?.createdAt}-${r?.type}`
                          }
                        >
                          <td>
                            <span className="request-id">
                              #
                              {r?._id?.slice(-6).toUpperCase() || "------"}
                            </span>
                          </td>
                          <td>
                            <div className="request-type">
                              <i
                                className={
                                  r?.type === "Food"
                                    ? "fa-solid fa-bowl-food"
                                    : r?.type === "Shelter"
                                    ? "fa-solid fa-house"
                                    : r?.type === "Medical"
                                    ? "fa-solid fa-kit-medical"
                                    : r?.type === "Water"
                                    ? "fa-solid fa-droplet"
                                    : "fa-solid fa-circle-info"
                                }
                              ></i>
                              <span>
                                {r?.type || r?.need || r?.requestType || "-"}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="request-detail">
                              <strong>
                                {r?.items || "-"}
                              </strong>
                            </div>
                          </td>

                          <td>
                            {r?.quantity || "-"}
                          </td>
                          <td>
                            <span
                              className={`status ${String(
                                urgency
                              ).toLowerCase()}`}
                            >
                              {urgency}
                            </span>
                          </td>
                          <td>
                            <div className="location-detail">
                              <i className="fa-solid fa-location-dot"></i>
                              <span>
                                {r?.location || r?.address || "-"}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="contact-detail">
                              <i className="fa-solid fa-phone"></i>
                              <span>
                                {r?.contact || r?.phone || "-"}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="notes-detail">
                              {r?.notes || "No additional notes"}
                            </div>
                          </td>
                          <td>
                            {formatDate(r?.createdAt)}
                          </td>
                          <td>
                            {formatTime(r?.createdAt)}
                          </td>
                          <td>
                            <span
                              className={`status ${String(
                                status
                              ).toLowerCase()}`}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}