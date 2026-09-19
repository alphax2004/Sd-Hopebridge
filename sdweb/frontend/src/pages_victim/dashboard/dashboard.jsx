import { useCallback, useEffect, useState } from "react";
import { Sidebar, Topbar } from "../sidebar/sidebar";
import "./dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD USER REQUESTS
  // ==========================================

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/requests/my`,
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

      // ========================================
      // BACKEND ERROR
      // ========================================

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else if (response.status === 403) {
          setError(
            "You are not allowed to view these requests."
          );
        } else {
          setError(
            data?.error ||
              data?.message ||
              "Failed to load requests."
          );
        }

        setRequests([]);
        return;
      }

      // ========================================
      // BACKEND RESPONSE
      // ========================================

      if (Array.isArray(data)) {
        setRequests(data);
      } else if (Array.isArray(data?.requests)) {
        setRequests(data.requests);
      } else if (Array.isArray(data?.data)) {
        setRequests(data.data);
      } else {
        setError(
          "Invalid request data received from server."
        );

        setRequests([]);
      }
    } catch (err) {
      console.log("LOAD REQUESTS ERROR:", err);

      setError(
        "Unable to connect to server. Please check whether the backend is running."
      );

      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // INITIAL LOAD + AUTO REFRESH
  // ==========================================

  useEffect(() => {
    const initialLoad = setTimeout(() => {
      loadRequests();
    }, 0);

    const interval = setInterval(() => {
      loadRequests();
    }, 10000);

    return () => {
      clearTimeout(initialLoad);
      clearInterval(interval);
    };
  }, [loadRequests]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) =>
      String(
        request?.status ||
          request?.requestStatus ||
          ""
      ).toLowerCase() === "pending"
  ).length;

  const approvedRequests = requests.filter(
    (request) =>
      String(
        request?.status ||
          request?.requestStatus ||
          ""
      ).toLowerCase() === "approved"
  ).length;

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
      request?.status ||
        request?.requestStatus ||
        ""
    ).toLowerCase();

    // Only approved requests are counted
    if (status !== "approved") {
      return;
    }

    if (!request?.createdAt) {
      return;
    }

    const date = new Date(request.createdAt);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const day = date.getDay();

    // Each approved request = 1
    // Quantity is NOT used here.
    approvedBarData[day][1]++;
  });
  // GRAPH SCALE
// Graph will always show 0 to 5
const yAxisMax = 5;

const yAxisValues = [];

for (let value = yAxisMax; value >= 0; value--) {
  yAxisValues.push(value);
}
  // ==========================================
  // MANUAL REFRESH
  // ==========================================

  const handleRefresh = async () => {
    await loadRequests();
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  function formatDate(dateValue) {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString();
  }

  // ==========================================
  // FORMAT TIME
  // ==========================================

  function formatTime(dateValue) {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="main-content">

        {/* ==================================
            TOPBAR
        ================================== */}

        <Topbar
          title="Welcome back, Sanjida 👋"
          subtitle="Stay safe, stay informed. We are here to help you."
        />

        {/* ==================================
            STAT CARDS
        ================================== */}

        <div className="stat-cards">

          {/* TOTAL */}

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
              All time requests
            </div>

          </div>


          {/* PENDING */}

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


          {/* APPROVED */}

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
              Approved by NGO
            </div>

          </div>

        </div>


        {/* ==================================
            APPROVED REQUESTS OVER TIME
        ================================== */}

        <div className="approved-request-section">

          {/* OUTSIDE BOX HEADING */}

          <div className="approved-request-heading">

            <h2>
              Approved Requests Over Time
            </h2>

            <p>
              Number of approved requests submitted each day
            </p>

          </div>


          {/* GRAPH BOX */}

          <div className="chart-card">

            <div className="card-header">

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


            {/* GRAPH */}

            <div className="graph-wrapper">

              {/* Y AXIS */}

              <div className="graph-y-axis">

                {yAxisValues.map((value) => (
                  <span key={value}>
                    {value}
                  </span>
                ))}

              </div>


              {/* GRAPH AREA */}

              <div className="graph-area">

                {/* GRID */}

                <div className="graph-grid">

                  {yAxisValues.map((value) => (
                    <div
                      className="graph-grid-line"
                      key={value}
                    ></div>
                  ))}

                </div>


                {/* BARS */}

                <div className="graph-bars">

                  {approvedBarData.map((item) => {

                    const day = item[0];
                    const count = item[1];

                    const barHeight =
                      count === 0
                        ? 0
                        : (count / yAxisMax) * 100;

                    return (
                      <div
                        className="graph-bar-column"
                        key={day}
                      >

                        {/* VALUE */}

                        {count > 0 && (
                          <span className="graph-bar-value">
                            {count}
                          </span>
                        )}


                        {/* BAR */}

                        <div
                          className="graph-bar"
                          style={{
                            height: `${barHeight}%`,
                          }}
                          title={`${count} approved request(s)`}
                        ></div>


                        {/* DAY */}

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


        {/* ==================================
            RECENT REQUESTS
        ================================== */}

        <div className="recent-request-section">

          {/* OUTSIDE BOX HEADING */}

          <div className="recent-request-heading">

            <h2>
              Recent Requests
            </h2>

            <p>
              Complete details of your submitted help requests
            </p>

          </div>


          {/* TABLE BOX */}

          <div className="table-card">

            <div className="card-header">

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


            {/* LOADING */}

            {loading ? (

              <div className="table-message">
                Loading requests...
              </div>


            ) : error ? (

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


            ) : requests.length === 0 ? (

              <div className="table-message">

                <i className="fa-solid fa-clipboard-list"></i>

                <p>
                  No requests found.
                </p>

                <span>
                  Your submitted help requests will appear here.
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

                    {requests.map((r) => {

                      const status =
                        r?.status ||
                        r?.requestStatus ||
                        "Pending";

                      const urgency =
                        r?.urgency ||
                        r?.priority ||
                        "Low";

                      return (

                        <tr
                          key={
                            r?._id ||
                            `${r?.createdAt}-${r?.type}`
                          }
                        >

                          {/* REQUEST ID */}

                          <td>

                            <span className="request-id">
                              #
                              {r?._id
                                ?.slice(-6)
                                .toUpperCase() ||
                                "------"}
                            </span>

                          </td>


                          {/* TYPE */}

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
                                {r?.type ||
                                  r?.need ||
                                  r?.requestType ||
                                  "-"}
                              </span>

                            </div>

                          </td>


                          {/* ITEMS */}

                          <td>

                            <div className="request-detail">

                              <strong>
                                {r?.items || "-"}
                              </strong>

                            </div>

                          </td>


                          {/* QUANTITY */}

                          <td>
                            {r?.quantity || "-"}
                          </td>


                          {/* URGENCY */}

                          <td>

                            <span
                              className={`status ${String(
                                urgency
                              ).toLowerCase()}`}
                            >
                              {urgency}
                            </span>

                          </td>


                          {/* LOCATION */}

                          <td>

                            <div className="location-detail">

                              <i className="fa-solid fa-location-dot"></i>

                              <span>
                                {r?.location ||
                                  r?.address ||
                                  "-"}
                              </span>

                            </div>

                          </td>


                          {/* CONTACT */}

                          <td>

                            <div className="contact-detail">

                              <i className="fa-solid fa-phone"></i>

                              <span>
                                {r?.contact ||
                                  r?.phone ||
                                  "-"}
                              </span>

                            </div>

                          </td>


                          {/* NOTES */}

                          <td>

                            <div className="notes-detail">

                              {r?.notes
                                ? r.notes
                                : "No additional notes"}

                            </div>

                          </td>


                          {/* DATE */}

                          <td>
                            {formatDate(
                              r?.createdAt
                            )}
                          </td>


                          {/* TIME */}

                          <td>
                            {formatTime(
                              r?.createdAt
                            )}
                          </td>


                          {/* STATUS */}

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