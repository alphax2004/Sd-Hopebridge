import { useCallback, useEffect, useState } from "react";
import { Sidebar, Topbar } from "../pages_alfa/sidebar";
import "./admin.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET STATUS
  // ==========================================

  const getStatus = (request) => {
    return (
      request?.status ||
      request?.requestStatus ||
      "Pending"
    );
  };

  // ==========================================
  // GET URGENCY
  // ==========================================

  const getUrgency = (request) => {
    return (
      request?.urgency ||
      request?.priority ||
      "Low"
    );
  };

  // ==========================================
  // LOAD ALL VICTIM REQUESTS
  // ==========================================

  const loadRequests = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/requests`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data = null;

      if (contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else if (response.status === 403) {
          setError(
            "You are not allowed to view victim requests."
          );
        } else {
          setError(
            data?.message ||
            data?.error ||
            "Failed to load victim requests."
          );
        }

        setRequests([]);
        return;
      }

      // Backend can return:
      // []
      // { requests: [] }
      // { data: [] }

      if (Array.isArray(data)) {
        setRequests(data);
      } else if (Array.isArray(data?.requests)) {
        setRequests(data.requests);
      } else if (Array.isArray(data?.data)) {
        setRequests(data.data);
      } else {
        setRequests([]);
      }

    } catch (err) {
      console.log(
        "ADMIN LOAD REQUESTS ERROR:",
        err
      );

      setError(
        "Unable to connect to server. Please check whether the backend is running."
      );

      setRequests([]);
    }
  }, []);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const fetchInitialRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/requests`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const contentType =
          response.headers.get("content-type") || "";

        let data = null;

        if (contentType.includes("application/json")) {
          data = await response.json();
        }

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          if (response.status === 401) {
            setError(
              "Your session has expired. Please login again."
            );
          } else if (response.status === 403) {
            setError(
              "You are not allowed to view victim requests."
            );
          } else {
            setError(
              data?.message ||
              data?.error ||
              "Failed to load victim requests."
            );
          }

          setRequests([]);
          return;
        }

        if (Array.isArray(data)) {
          setRequests(data);
        } else if (Array.isArray(data?.requests)) {
          setRequests(data.requests);
        } else if (Array.isArray(data?.data)) {
          setRequests(data.data);
        } else {
          setRequests([]);
        }

      } catch (err) {
        if (cancelled) {
          return;
        }

        console.log(
          "ADMIN INITIAL LOAD ERROR:",
          err
        );

        setError(
          "Unable to connect to server. Please check whether the backend is running."
        );

        setRequests([]);

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchInitialRequests();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================
  // AUTO REFRESH
  // Every 10 seconds
  // ==========================================

  useEffect(() => {
    const interval = setInterval(() => {
      loadRequests();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [loadRequests]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) =>
      getStatus(request).toLowerCase() ===
      "pending"
  ).length;

  const approvedRequests = requests.filter(
    (request) =>
      getStatus(request).toLowerCase() ===
      "approved"
  ).length;

  const rejectedRequests = requests.filter(
    (request) =>
      getStatus(request).toLowerCase() ===
      "rejected"
  ).length;

  const volunteerAssignedRequests =
    requests.filter(
      (request) =>
        getStatus(request).toLowerCase() ===
        "volunteer assigned"
    ).length;

  const deliveredRequests =
    requests.filter(
      (request) =>
        getStatus(request).toLowerCase() ===
        "delivered"
    ).length;

  // ==========================================
  // PRIORITY COUNTS
  // ==========================================

  const lowPriorityRequests =
    requests.filter(
      (request) =>
        getUrgency(request).toLowerCase() ===
        "low"
    ).length;

  const mediumPriorityRequests =
    requests.filter(
      (request) =>
        getUrgency(request).toLowerCase() ===
        "medium"
    ).length;

  const highPriorityRequests =
    requests.filter(
      (request) =>
        getUrgency(request).toLowerCase() ===
        "high"
    ).length;

  const criticalRequests =
    requests.filter(
      (request) =>
        getUrgency(request).toLowerCase() ===
        "critical"
    ).length;

  // ==========================================
  // EMERGENCY LEVEL
  // ==========================================

  let emergencyLevel = "Low";

  if (criticalRequests > 0) {
    emergencyLevel = "Critical";
  } else if (highPriorityRequests > 0) {
    emergencyLevel = "High";
  } else if (mediumPriorityRequests > 0) {
    emergencyLevel = "Medium";
  }

  // ==========================================
  // BAR CHART
  // ==========================================

  const barData = [
    ["Sun", 0],
    ["Mon", 0],
    ["Tue", 0],
    ["Wed", 0],
    ["Thu", 0],
    ["Fri", 0],
    ["Sat", 0],
  ];

  requests.forEach((request) => {
    if (!request?.createdAt) {
      return;
    }

    const date = new Date(request.createdAt);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const day = date.getDay();

    if (barData[day]) {
      barData[day][1]++;
    }
  });

  const maxBarValue = Math.max(
    ...barData.map((item) => item[1]),
    1
  );

  // ==========================================
  // RECENT REQUESTS
  // ==========================================

  const recentRequests = [...requests]
    .sort((a, b) => {
      const dateA = new Date(
        a?.createdAt ||
        a?.created_at ||
        0
      );

      const dateB = new Date(
        b?.createdAt ||
        b?.created_at ||
        0
      );

      return dateB - dateA;
    })
    .slice(0, 5);

  // ==========================================
  // GET VICTIM NAME
  // ==========================================

  const getVictimName = (request) => {
    return (
      request?.userId?.fullName ||
      request?.user?.fullName ||
      request?.fullName ||
      request?.name ||
      "Unknown User"
    );
  };

  // ==========================================
  // GET LOCATION
  // ==========================================

  const getLocation = (request) => {
    return (
      request?.location ||
      request?.address ||
      "Unknown"
    );
  };

  // ==========================================
  // GET DISASTER
  // ==========================================

  const getDisaster = (request) => {
    return (
      request?.disaster ||
      request?.disasterType ||
      request?.incidentType ||
      "Unknown"
    );
  };

  // ==========================================
  // GET REQUEST TYPE
  // ==========================================

  const getRequestType = (request) => {
    return (
      request?.type ||
      request?.need ||
      request?.requestType ||
      "General Help"
    );
  };

  // ==========================================
  // GET FAMILY MEMBERS
  // ==========================================

  const getFamilyMembers = (request) => {
    return (
      request?.familyMembers ??
      request?.members ??
      request?.numberOfPeople ??
      "-"
    );
  };

  // ==========================================
  // MANUAL REFRESH
  // ==========================================

  const handleRefresh = async () => {
    setLoading(true);

    try {
      await loadRequests();
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOADING
  // ==========================================

  if (loading && requests.length === 0) {
    return (
      <div className="dashboard-layout">

        <Sidebar variant="admin" />

        <div className="main-content">

          <Topbar
            variant="admin"
            userName="Admin"
            title="Admin Dashboard"
            subtitle="Monitor disaster relief activities and victim requests."
          />

          <div className="chart-card">
            <div className="table-message">
              Loading dashboard...
            </div>
          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="dashboard-layout">

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
          <div className="table-card">

            <div className="table-message error-message">

              {error}

              <br />

              <button
                className="action-btn"
                onClick={handleRefresh}
              >
                Retry
              </button>

            </div>

          </div>
        )}

        {/* ==================================
            FIRST STAT ROW
        ================================== */}

        <div className="stat-cards">

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon">
                <i className="fa-solid fa-clipboard-list"></i>
              </div>

              <div className="stat-label">
                Total Requests
              </div>

            </div>

            <div className="stat-value">
              {totalRequests}
            </div>

            <div className="stat-note">
              All victim requests
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon">
                <i className="fa-solid fa-clock"></i>
              </div>

              <div className="stat-label">
                Pending Requests
              </div>

            </div>

            <div className="stat-value">
              {pendingRequests}
            </div>

            <div className="stat-note">
              Waiting for approval
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>

              <div className="stat-label">
                Approved Requests
              </div>

            </div>

            <div className="stat-value">
              {approvedRequests}
            </div>

            <div className="stat-note">
              Accepted requests
            </div>

          </div>

        </div>


        {/* ==================================
            SECOND STAT ROW
        ================================== */}

        <div className="stat-cards">

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon">
                <i className="fa-solid fa-circle-xmark"></i>
              </div>

              <div className="stat-label">
                Rejected Requests
              </div>

            </div>

            <div className="stat-value">
              {rejectedRequests}
            </div>

            <div className="stat-note">
              Rejected requests
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon">
                <i className="fa-solid fa-truck"></i>
              </div>

              <div className="stat-label">
                Volunteer Assigned
              </div>

            </div>

            <div className="stat-value">
              {volunteerAssignedRequests}
            </div>

            <div className="stat-note">
              Assigned to volunteers
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon">
                <i className="fa-solid fa-box"></i>
              </div>

              <div className="stat-label">
                Delivered
              </div>

            </div>

            <div className="stat-value">
              {deliveredRequests}
            </div>

            <div className="stat-note">
              Successfully delivered
            </div>

          </div>

        </div>


        {/* ==================================
            REQUEST GRAPH
        ================================== */}

        <div className="chart-card">

          <div className="card-header">

            <h3>
              Requests Over Time
            </h3>

            <button
              className="action-btn"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : "Refresh"}
            </button>

          </div>


          <div className="bar-chart">

            {barData.map((b) => {

              const barHeight =
                b[1] === 0
                  ? 3
                  : Math.max(
                      (b[1] / maxBarValue) * 150,
                      10
                    );

              return (
                <div
                  className="bar-col"
                  key={b[0]}
                >

                  <div
                    className="bar"
                    style={{
                      height: `${barHeight}px`,
                    }}
                    title={`${b[1]} request(s)`}
                  />

                  <span>
                    {b[0]}
                  </span>

                </div>
              );
            })}

          </div>

        </div>


        {/* ==================================
            EMERGENCY OVERVIEW
        ================================== */}

        <div className="chart-card">

          <div className="card-header">

            <h3>
              Emergency Overview
            </h3>

          </div>

          <div className="table-message">

            <p>
              Current Emergency Level:{" "}
              <strong>
                {emergencyLevel}
              </strong>
            </p>

            <p>
              Low Priority:{" "}
              {lowPriorityRequests}
            </p>

            <p>
              Medium Priority:{" "}
              {mediumPriorityRequests}
            </p>

            <p>
              High Priority:{" "}
              {highPriorityRequests}
            </p>

            <p>
              Critical:{" "}
              {criticalRequests}
            </p>

          </div>

        </div>


        {/* ==================================
            RECENT VICTIM REQUESTS
        ================================== */}

        <div className="table-card">

          <div className="card-header">

            <h3>
              Recent Victim Requests
            </h3>

            <button
              className="action-btn"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : "Refresh"}
            </button>

          </div>


          {loading ? (

            <div className="table-message">
              Loading requests...
            </div>

          ) : recentRequests.length === 0 ? (

            <div className="table-message">
              No victim requests found.
            </div>

          ) : (

            <div className="responsive-table">

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

                  {recentRequests.map(
                    (request, index) => {

                      const status =
                        getStatus(request);

                      const urgency =
                        getUrgency(request);

                      return (
                        <tr
                          key={
                            request?._id ||
                            `recent-request-${index}`
                          }
                        >

                          <td>
                            {getVictimName(
                              request
                            )}
                          </td>

                          <td>
                            {getLocation(
                              request
                            )}
                          </td>

                          <td>
                            {getDisaster(
                              request
                            )}
                          </td>

                          <td>
                            {getRequestType(
                              request
                            )}
                          </td>

                          <td>
                            {getFamilyMembers(
                              request
                            )}
                          </td>

                          <td>
                            <span
                              className={`status ${urgency}`}
                            >
                              {urgency}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`status ${status}`}
                            >
                              {status}
                            </span>
                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>


        {/* ==================================
            PRIORITY BREAKDOWN
        ================================== */}

        <div className="table-card">

          <div className="card-header">

            <h3>
              Priority Breakdown
            </h3>

          </div>

          <div className="responsive-table">

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
                    <span className="status Low">
                      Low
                    </span>
                  </td>
                  <td>
                    {lowPriorityRequests}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="status Medium">
                      Medium
                    </span>
                  </td>
                  <td>
                    {mediumPriorityRequests}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="status High">
                      High
                    </span>
                  </td>
                  <td>
                    {highPriorityRequests}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="status Critical">
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


        {/* ==================================
            STATUS BREAKDOWN
        ================================== */}

        <div className="table-card">

          <div className="card-header">

            <h3>
              Request Status
            </h3>

          </div>

          <div className="responsive-table">

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
                    <span className="status Pending">
                      Pending
                    </span>
                  </td>
                  <td>
                    {pendingRequests}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="status Approved">
                      Approved
                    </span>
                  </td>
                  <td>
                    {approvedRequests}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="status Rejected">
                      Rejected
                    </span>
                  </td>
                  <td>
                    {rejectedRequests}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="status Volunteer">
                      Volunteer Assigned
                    </span>
                  </td>
                  <td>
                    {volunteerAssignedRequests}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="status Delivered">
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