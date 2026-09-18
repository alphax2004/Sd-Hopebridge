import { useCallback, useEffect, useState } from "react";
import { Sidebar, Topbar } from "./sidebar";
import "./dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

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
      // Supports:
      // []
      // { requests: [] }
      // { data: [] }
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
      console.log(
        "LOAD REQUESTS ERROR:",
        err
      );

      setError(
        "Unable to connect to server. Please check whether the backend is running."
      );

      setRequests([]);

    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // INITIAL LOAD AND AUTO REFRESH
  // Every 10 seconds
  // ==========================================

  useEffect(() => {
    const initialLoad = setTimeout(loadRequests, 0);
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
  // BAR CHART DATA
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

    const date = new Date(
      request.createdAt
    );

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
  // MANUAL REFRESH
  // ==========================================

  const handleRefresh = async () => {
    await loadRequests();
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="main-content">

        <Topbar
          title="Welcome back, Sanjida 👋"
          subtitle="Stay safe, stay informed. We are here to help you."
        />

        {/* ==================================
            STAT CARDS
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
              All time requests
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
              Approved by NGO
            </div>

          </div>

        </div>


        {/* ==================================
            REQUEST CHART
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
            REQUEST TABLE
        ================================== */}

        <div className="table-card">

          <div className="card-header">

            <h3>
              Recent Requests
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


          {/* LOADING */}

          {loading ? (

            <div className="table-message">
              Loading requests...
            </div>


          ) : error ? (

            /* ERROR */

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

            /* NO REQUESTS */

            <div className="table-message">
              No requests found.
            </div>


          ) : (

            /* REQUEST TABLE */

            <div className="responsive-table">

              <table>

                <thead>

                  <tr>

                    <th>
                      Request ID
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Items
                    </th>

                    <th>
                      Quantity
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Priority
                    </th>

                    <th>
                      Status
                    </th>

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

                        <td>
                          #
                          {r?._id
                            ?.slice(-6)
                            .toUpperCase() ||
                            "------"}
                        </td>


                        <td>
                          {r?.type ||
                            r?.need ||
                            r?.requestType ||
                            "-"}
                        </td>


                        <td>
                          {r?.items || "-"}
                        </td>


                        <td>
                          {r?.quantity || "-"}
                        </td>


                        <td>
                          {r?.location ||
                            r?.address ||
                            "-"}
                        </td>


                        <td>
                          {r?.createdAt
                            ? new Date(
                                r.createdAt
                              ).toLocaleDateString()
                            : "-"}
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
                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}