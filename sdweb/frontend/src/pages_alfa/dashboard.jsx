import { useEffect, useState } from "react";
import { Sidebar, Topbar } from "./sidebar";
import "./dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

export default function Dashboard() {
  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD USER REQUESTS
  // ==========================================

  const loadRequests = async () => {
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


      // ========================================
      // Read response safely
      // ========================================

      const contentType =
        response.headers.get(
          "content-type"
        );

      let data = null;

      if (
        contentType &&
        contentType.includes(
          "application/json"
        )
      ) {
        data = await response.json();
      }


      // ========================================
      // Backend error
      // ========================================

      if (!response.ok) {

        if (response.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else if (
          response.status === 403
        ) {
          setError(
            "You are not allowed to view these requests."
          );
        } else {
          setError(
            data?.error ||
            data?.message ||
            "Failed to load requests"
          );
        }

        setRequests([]);

        return;
      }


      // ========================================
      // Check response data
      // ========================================

      if (!Array.isArray(data)) {
        setError(
          "Invalid request data received from server."
        );

        setRequests([]);

        return;
      }


      // ========================================
      // Save requests
      // ========================================

      setRequests(data);

    } catch (err) {

      console.log(
        "LOAD REQUESTS ERROR:",
        err
      );

      setError(
        "Unable to connect to server"
      );

      setRequests([]);

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialRequests() {
      try {
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
          response.headers.get(
            "content-type"
          );

        let data = null;

        if (
          contentType &&
          contentType.includes(
            "application/json"
          )
        ) {
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
          } else if (
            response.status === 403
          ) {
            setError(
              "You are not allowed to view these requests."
            );
          } else {
            setError(
              data?.error ||
              data?.message ||
              "Failed to load requests"
            );
          }

          setRequests([]);
          setLoading(false);

          return;
        }


        if (!Array.isArray(data)) {
          setError(
            "Invalid request data received from server."
          );

          setRequests([]);
          setLoading(false);

          return;
        }


        setRequests(data);
        setError("");
        setLoading(false);

      } catch (err) {

        if (cancelled) {
          return;
        }

        console.log(
          "LOAD REQUESTS ERROR:",
          err
        );

        setError(
          "Unable to connect to server"
        );

        setRequests([]);
        setLoading(false);
      }
    }

    fetchInitialRequests();

    return () => {
      cancelled = true;
    };
  }, []);


  // ==========================================
  // STATISTICS
  // ==========================================

  const totalRequests =
    requests.length;

  const pendingRequests =
    requests.filter(
      (r) =>
        r.status === "Pending"
    ).length;

  const approvedRequests =
    requests.filter(
      (r) =>
        r.status === "Approved"
    ).length;


  const stats = [
    [
      "fa-clipboard-list",
      "Total Requests",
      totalRequests,
      "All time requests",
    ],

    [
      "fa-clock",
      "Pending Requests",
      pendingRequests,
      "Waiting for approval",
    ],

    [
      "fa-circle-check",
      "Approved Requests",
      approvedRequests,
      "Approved by NGO",
    ],
  ];


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

    if (!request.createdAt) {
      return;
    }

    const date =
      new Date(
        request.createdAt
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return;
    }

    const day =
      date.getDay();

    barData[day][1]++;
  });


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


        {/* ================================== */}
        {/* STAT CARDS */}
        {/* ================================== */}

        <div className="stat-cards">

          {stats.map((s) => (

            <div
              className="stat-card"
              key={s[1]}
            >

              <div className="stat-card-top">

                <div className="stat-icon">

                  <i
                    className={`fa-solid ${s[0]}`}
                  ></i>

                </div>

                <div className="stat-label">
                  {s[1]}
                </div>

              </div>


              <div className="stat-value">
                {s[2]}
              </div>


              <div className="stat-note">
                {s[3]}
              </div>

            </div>

          ))}

        </div>


        {/* ================================== */}
        {/* REQUEST CHART */}
        {/* ================================== */}

        <div className="chart-card">

          <div className="card-header">

            <h3>
              Requests Over Time
            </h3>

            <button className="action-btn">
              This Week
            </button>

          </div>


          <div className="bar-chart">

            {barData.map((b) => (

              <div
                className="bar-col"
                key={b[0]}
              >

                <div
                  className="bar"
                  style={{
                    height:
                      `${Math.max(
                        b[1] * 18,
                        b[1] === 0
                          ? 3
                          : 0
                      )}px`,
                  }}
                />

                <span>
                  {b[0]}
                </span>

              </div>

            ))}

          </div>

        </div>


        {/* ================================== */}
        {/* REQUEST TABLE */}
        {/* ================================== */}

        <div className="table-card">

          <div className="card-header">

            <h3>
              Recent Requests
            </h3>

            <button
              className="action-btn"
              onClick={loadRequests}
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : "Refresh"}
            </button>

          </div>


          {/* ================================= */}
          {/* LOADING */}
          {/* ================================= */}

          {loading ? (

            <div className="table-message">
              Loading requests...
            </div>


          ) : error ? (

            /* ================================= */
            /* ERROR */
            /* ================================= */

            <div className="table-message error-message">

              {error}

            </div>


          ) : requests.length === 0 ? (

            /* ================================= */
            /* NO REQUESTS */
            /* ================================= */

            <div className="table-message">
              No requests found.
            </div>


          ) : (

            /* ================================= */
            /* REQUEST TABLE */
            /* ================================= */

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

                  {requests.map(
                    (r) => (

                      <tr
                        key={r._id}
                      >

                        <td>
                          #
                          {r._id
                            ?.slice(-6)
                            .toUpperCase()}
                        </td>


                        <td>
                          {r.type}
                        </td>


                        <td>
                          {r.items}
                        </td>


                        <td>
                          {r.quantity ||
                            "-"}
                        </td>


                        <td>
                          {r.location}
                        </td>


                        <td>

                          {r.createdAt
                            ? new Date(
                                r.createdAt
                              ).toLocaleDateString()
                            : "-"}

                        </td>


                        <td>
                          {r.urgency}
                        </td>


                        <td>

                          <span
                            className={`status ${r.status}`}
                          >
                            {r.status}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}