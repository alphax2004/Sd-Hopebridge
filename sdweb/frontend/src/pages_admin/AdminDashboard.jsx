import { useCallback, useEffect, useState } from "react";
import { Sidebar, Topbar } from "../pages_victim/sidebar/sidebar";
import "./admin.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/api/requests`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load victim requests"
        );
      }

      if (Array.isArray(data)) {
        setRequests(data);
      } else if (Array.isArray(data.requests)) {
        setRequests(data.requests);
      } else if (Array.isArray(data.data)) {
        setRequests(data.data);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Load requests error:", err);
      setError(
        err.message || "Failed to load victim requests"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadRequests();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadRequests]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadRequests();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadRequests]);

  // Get request status
  const getStatus = (request) =>
    request.status || request.requestStatus || "Pending";

  // Get request urgency
  const getUrgency = (request) =>
    request.urgency || request.priority || "Low";

  // =========================
  // REQUEST COUNTS
  // =========================

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) =>
      getStatus(request).toLowerCase() === "pending"
  ).length;

  const approvedRequests = requests.filter(
    (request) =>
      getStatus(request).toLowerCase() === "approved"
  ).length;

  const rejectedRequests = requests.filter(
    (request) =>
      getStatus(request).toLowerCase() === "rejected"
  ).length;

  const volunteerAssignedRequests = requests.filter(
    (request) =>
      getStatus(request).toLowerCase() ===
      "volunteer assigned"
  ).length;

  const deliveredRequests = requests.filter(
    (request) =>
      getStatus(request).toLowerCase() === "delivered"
  ).length;

  // =========================
  // PRIORITY COUNTS
  // =========================

  const lowPriorityRequests = requests.filter(
    (request) =>
      getUrgency(request).toLowerCase() === "low"
  ).length;

  const mediumPriorityRequests = requests.filter(
    (request) =>
      getUrgency(request).toLowerCase() === "medium"
  ).length;

  const highPriorityRequests = requests.filter(
    (request) =>
      getUrgency(request).toLowerCase() === "high"
  ).length;

  const criticalRequests = requests.filter(
    (request) =>
      getUrgency(request).toLowerCase() === "critical"
  ).length;

  // =========================
  // EMERGENCY LEVEL
  // =========================

  let emergencyLevel = "Low";

  if (criticalRequests > 0) {
    emergencyLevel = "Critical";
  } else if (highPriorityRequests > 0) {
    emergencyLevel = "High";
  } else if (mediumPriorityRequests > 0) {
    emergencyLevel = "Medium";
  }

  // =========================
  // REQUEST INFORMATION
  // =========================

  const getVictimName = (request) =>
    request.userId?.fullName ||
    request.user?.fullName ||
    request.fullName ||
    request.name ||
    "Unknown User";

  const getLocation = (request) =>
    request.location ||
    request.address ||
    "Unknown";

  const getDisaster = (request) =>
    request.disaster ||
    request.disasterType ||
    request.incidentType ||
    "Unknown";

  const getRequestType = (request) =>
    request.type ||
    request.need ||
    request.requestType ||
    "General Help";

  const getFamilyMembers = (request) =>
    request.familyMembers ??
    request.members ??
    request.numberOfPeople ??
    "-";

  // =========================
  // RECENT REQUESTS
  // =========================

  const recentRequests = [...requests]
    .sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a.created_at || 0
      );

      const dateB = new Date(
        b.createdAt || b.created_at || 0
      );

      return dateB - dateA;
    })
    .slice(0, 5);

  // =========================
  // REFRESH
  // =========================

  const handleRefresh = async () => {
    setLoading(true);
    await loadRequests();
  };

  // =========================
  // LOADING
  // =========================

  if (loading && requests.length === 0) {
    return (
      <div className="admin-layout">
        <Sidebar variant="admin" />

        <div className="main-content">
          <Topbar
            variant="admin"
            userName="Admin"
            title="Admin Dashboard"
            subtitle="Monitor disaster relief activities and victim requests."
          />

          <div className="admin-card">
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="admin-layout">
      <Sidebar variant="admin" />

      <div className="main-content">
        <Topbar
          variant="admin"
          userName="Admin"
          title="Admin Dashboard"
          subtitle="Monitor disaster relief activities and victim requests."
        />

        {/* ERROR */}
        {error && (
          <div className="admin-card">
            <p>{error}</p>

            <button
              type="button"
              className="filter-btn"
              onClick={handleRefresh}
            >
              Retry
            </button>
          </div>
        )}

        {/* =========================
            STAT CARDS
        ========================= */}

        <div className="stats-grid">

          {/* 1. Total Requests */}
          <div className="stat-card">
            <h4>Total Requests</h4>
            <h2>{totalRequests}</h2>
            <p>All requests</p>
          </div>

          {/* 2. Pending Requests */}
          <div className="stat-card">
            <h4>Pending Requests</h4>
            <h2>{pendingRequests}</h2>
            <p>Awaiting approval</p>
          </div>

          {/* 3. Approved */}
          <div className="stat-card">
            <h4>Approved</h4>
            <h2>{approvedRequests}</h2>
            <p>Accepted requests</p>
          </div>

          {/* 4. Rejected */}
          <div className="stat-card">
            <h4>Rejected</h4>
            <h2>{rejectedRequests}</h2>
            <p>Rejected requests</p>
          </div>

          {/* 5. Volunteer Assigned */}
          <div className="stat-card">
            <h4>Volunteer Assigned</h4>
            <h2>{volunteerAssignedRequests}</h2>
            <p>Assigned to volunteer</p>
          </div>

          {/* 6. Delivered */}
          <div className="stat-card">
            <h4>Delivered</h4>
            <h2>{deliveredRequests}</h2>
            <p>Successfully delivered</p>
          </div>

          {/* 7. High Priority */}
          <div className="stat-card">
            <h4>High Priority</h4>
            <h2>{highPriorityRequests}</h2>
            <p>High urgency</p>
          </div>

          {/* 8. Critical */}
          <div className="stat-card">
            <h4>Critical</h4>
            <h2>{criticalRequests}</h2>
            <p>Critical urgency</p>
          </div>

        </div>

        {/* =========================
            EMERGENCY OVERVIEW
        ========================= */}

        <div className="admin-card">
          <h3>Emergency Overview</h3>

          <p>
            Current Emergency Level:{" "}
            <strong>{emergencyLevel}</strong>
          </p>

          <p>
            Low Priority: {lowPriorityRequests}
          </p>

          <p>
            Medium Priority: {mediumPriorityRequests}
          </p>

          <p>
            High Priority: {highPriorityRequests}
          </p>

          <p>
            Critical: {criticalRequests}
          </p>
        </div>

        {/* =========================
            RECENT VICTIM REQUESTS
        ========================= */}

        <div className="admin-card">
          <h3>Recent Victim Requests</h3>

          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Victim</th>
                  <th>Location</th>
                  <th>Disaster</th>
                  <th>Request</th>
                  <th>Members</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentRequests.map((request) => {
                  const status = getStatus(request);
                  const urgency = getUrgency(request);

                  return (
                    <tr key={request._id}>
                      <td>
                        {getVictimName(request)}
                      </td>

                      <td>
                        {getLocation(request)}
                      </td>

                      <td>
                        {getDisaster(request)}
                      </td>

                      <td>
                        {getRequestType(request)}
                      </td>

                      <td>
                        {getFamilyMembers(request)}
                      </td>

                      <td>
                        <span
                          className={`badge ${urgency}`}
                        >
                          {urgency}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${status}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {recentRequests.length === 0 && (
                  <tr>
                    <td colSpan="7">
                      No victim requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================
            PRIORITY BREAKDOWN
        ========================= */}

        <div className="admin-card">
          <h3>Priority Breakdown</h3>

          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Total Requests</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    <span className="badge Low">
                      Low
                    </span>
                  </td>

                  <td>
                    {lowPriorityRequests}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="badge Medium">
                      Medium
                    </span>
                  </td>

                  <td>
                    {mediumPriorityRequests}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="badge High">
                      High
                    </span>
                  </td>

                  <td>
                    {highPriorityRequests}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="badge Critical">
                      Critical
                    </span>
                  </td>

                  <td>
                    {criticalRequests}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================
            REQUEST STATUS
        ========================= */}

        <div className="admin-card">
          <h3>Request Status</h3>

          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    <span className="badge Pending">
                      Pending
                    </span>
                  </td>

                  <td>
                    {pendingRequests}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="badge Approved">
                      Approved
                    </span>
                  </td>

                  <td>
                    {approvedRequests}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="badge Rejected">
                      Rejected
                    </span>
                  </td>

                  <td>
                    {rejectedRequests}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="badge Volunteer Assigned">
                      Volunteer Assigned
                    </span>
                  </td>

                  <td>
                    {volunteerAssignedRequests}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="badge Delivered">
                      Delivered
                    </span>
                  </td>

                  <td>
                    {deliveredRequests}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}