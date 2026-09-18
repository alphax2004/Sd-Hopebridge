import { useEffect, useState } from "react";
import { Sidebar, Topbar } from "../pages_alfa/sidebar";
import "./admin.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

export default function AdminDashboard() {

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState("");

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD REQUESTS
  // ==========================================

  async function loadRequests() {
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
      // BACKEND ERROR
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
            "Admin access required."
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
      // CHECK DATA
      // ========================================

      if (!Array.isArray(data)) {
        setError(
          "Invalid request data received from server."
        );

        setRequests([]);

        return;
      }


      setRequests(data);

    } catch (err) {

      console.log(
        "LOAD REQUESTS ERROR:",
        err
      );

      setError(
        "Unable to connect to server"
      );

    } finally {

      setLoading(false);

    }
  }


  // ==========================================
  // INITIAL LOAD + AUTO REFRESH
  // ==========================================

  useEffect(() => {

    let cancelled = false;

    async function fetchInitialRequests() {

      try {

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


        // ======================================
        // BACKEND ERROR
        // ======================================

        if (!response.ok) {

          if (
            response.status === 401
          ) {

            setError(
              "Your session has expired. Please login again."
            );

          } else if (
            response.status === 403
          ) {

            setError(
              "Admin access required."
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


        // ======================================
        // CHECK DATA
        // ======================================

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


    // Initial API call
    fetchInitialRequests();


    // ========================================
    // AUTO REFRESH EVERY 10 SECONDS
    // ========================================

    const interval =
      setInterval(() => {

        if (!cancelled) {
          loadRequests();
        }

      }, 10000);


    return () => {

      cancelled = true;

      clearInterval(interval);

    };

  }, []);


  // ==========================================
  // APPROVE / REJECT REQUEST
  // ==========================================

  async function updateRequest(
    id,
    action
  ) {

    try {

      setActionLoading(id);


      const response = await fetch(
        `${API_URL}/api/requests/${id}/${action}`,
        {
          method: "PUT",

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


      if (!response.ok) {

        alert(
          data?.error ||
          data?.message ||
          "Failed to update request"
        );

        return;
      }


      // ========================================
      // UPDATE TABLE WITHOUT RELOADING
      // ========================================

      setRequests((prev) =>
        prev.map((request) =>
          request._id === id
            ? {
                ...request,

                status:
                  action === "approve"
                    ? "Approved"
                    : "Rejected",
              }
            : request
        )
      );

    } catch (err) {

      console.log(
        "UPDATE REQUEST ERROR:",
        err
      );

      alert(
        "Server error. Please try again."
      );

    } finally {

      setActionLoading("");

    }
  }


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

  const rejectedRequests =
    requests.filter(
      (r) =>
        r.status === "Rejected"
    ).length;


  const stats = [
    [
      "fa-clipboard-list",
      "Victim Requests",
      totalRequests,
    ],

    [
      "fa-clock",
      "Pending Requests",
      pendingRequests,
    ],

    [
      "fa-circle-check",
      "Approved Requests",
      approvedRequests,
    ],

    [
      "fa-circle-xmark",
      "Rejected Requests",
      rejectedRequests,
    ],

    [
      "fa-triangle-exclamation",
      "Emergency Level",
      "HIGH",
    ],
  ];


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-layout">

      <Sidebar variant="admin" />

      <div className="main-content">

        <Topbar
          variant="admin"
          userName="Admin"
          title="Admin Dashboard"
          subtitle="Overview of relief operations and requests."
        />


        <div className="admin-stat-cards">

          {stats.map((s) => (

            <div
              className="admin-stat-card"
              key={s[1]}
            >

              <div className="stat-icon">

                <i
                  className={`fa-solid ${s[0]}`}
                ></i>

              </div>

              <div className="stat-label">
                {s[1]}
              </div>

              <div className="stat-value">
                {s[2]}
              </div>

            </div>

          ))}

        </div>


        <div className="admin-card">

          <div className="admin-card-header">

            <h3>
              Request Overview
            </h3>

            <button
              className="admin-refresh-btn"
              onClick={loadRequests}
              disabled={loading}
            >

              <i className="fa-solid fa-rotate"></i>

              {loading
                ? "Loading..."
                : "Refresh"}

            </button>

          </div>


          {loading ? (

            <div className="admin-message">
              Loading requests...
            </div>

          ) : error ? (

            <div className="admin-message error-message">
              {error}
            </div>

          ) : requests.length === 0 ? (

            <div className="admin-message">
              No victim requests yet.
            </div>

          ) : (

            <div className="admin-table-wrapper">

              <table>

                <thead>

                  <tr>

                    <th>
                      Victim
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Need
                    </th>

                    <th>
                      Items
                    </th>

                    <th>
                      Priority
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
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
                          {r.userId?.fullName ||
                            "Unknown"}
                        </td>


                        <td>
                          {r.location}
                        </td>


                        <td>
                          {r.type}
                        </td>


                        <td>
                          {r.items}
                        </td>


                        <td>

                          <span
                            className={`badge ${r.urgency}`}
                          >
                            {r.urgency}
                          </span>

                        </td>


                        <td>

                          <span
                            className={`badge ${r.status}`}
                          >
                            {r.status}
                          </span>

                        </td>


                        <td>

                          {r.status ===
                          "Pending" ? (

                            <div className="request-actions">

                              <button
                                className="approve-btn"
                                disabled={
                                  actionLoading ===
                                  r._id
                                }
                                onClick={() =>
                                  updateRequest(
                                    r._id,
                                    "approve"
                                  )
                                }
                              >

                                <i className="fa-solid fa-check"></i>

                                {actionLoading ===
                                r._id
                                  ? "..."
                                  : "Accept"}

                              </button>


                              <button
                                className="reject-btn"
                                disabled={
                                  actionLoading ===
                                  r._id
                                }
                                onClick={() =>
                                  updateRequest(
                                    r._id,
                                    "reject"
                                  )
                                }
                              >

                                <i className="fa-solid fa-xmark"></i>

                                Reject

                              </button>

                            </div>

                          ) : (

                            <span className="action-done">
                              {r.status}
                            </span>

                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        <div className="admin-card">

          <h3>
            Emergency Level
          </h3>

          <div className="emergency-indicator">

            <span className="level-dot"></span>

            <span className="level-text">
              Current Level: HIGH
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}