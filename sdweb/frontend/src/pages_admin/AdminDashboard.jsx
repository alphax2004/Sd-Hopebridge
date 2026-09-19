import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sidebar, Topbar } from "../pages_victim/sidebar/sidebar";
import "./admin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Concurrent Execution & Retry Tracker References
  const abortControllerRef = useRef(null);
  const isComponentMountedRef = useRef(true);
  const retryCountRef = useRef(0);

  // ==========================================
  // ENTERPRISE DATA FETCHING ENGINE WITH ABORT
  // ==========================================
  const loadRequests = useCallback(async () => {
    // Abort active ongoing fetch to eliminate race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (isComponentMountedRef.current) {
        setError("");
      }

      const response = await fetch(`${API_URL}/api/requests`, {
        method: "GET",
        credentials: "include",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: Failed to load victim requests`
        );
      }

      const data = await response.json();

      if (!isComponentMountedRef.current) return;

      // Safe Extraction Algorithm
      let extractedRequests = [];
      if (Array.isArray(data)) {
        extractedRequests = data;
      } else if (Array.isArray(data?.requests)) {
        extractedRequests = data.requests;
      } else if (Array.isArray(data?.data)) {
        extractedRequests = data.data;
      } else if (data && typeof data === "object") {
        extractedRequests = Object.values(data).find(Array.isArray) || [];
      }

      // Memory Diffing to skip unnecessary state updates
      setRequests((prev) => {
        const isUnchanged = JSON.stringify(prev) === JSON.stringify(extractedRequests);
        return isUnchanged ? prev : extractedRequests;
      });

      retryCountRef.current = 0; // Reset exponential retry count
    } catch (err) {
      if (err.name === "AbortError") {
        return; // Suppress safe abort errors
      }

      console.error("Load requests error:", err);

      if (isComponentMountedRef.current) {
        setError(err.message || "Failed to load victim requests");
      }
    } finally {
      if (isComponentMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Component Lifecycle Management
  useEffect(() => {
    isComponentMountedRef.current = true;
    return () => {
      isComponentMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Initial Fetching
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadRequests();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadRequests]);

  // Exponential Backoff Auto-Polling
  useEffect(() => {
    let intervalId;

    const schedulePolling = () => {
      const baseDelay = 10000;
      const computedDelay = error
        ? Math.min(baseDelay * Math.pow(2, retryCountRef.current), 60000)
        : baseDelay;

      intervalId = setInterval(() => {
        if (error) retryCountRef.current += 1;
        loadRequests();
      }, computedDelay);
    };

    schedulePolling();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [loadRequests, error]);

  // ==========================================
  // RESILIENT GETTER HELPERS
  // ==========================================
  const getStatus = useCallback((request) => {
    if (!request || typeof request !== "object") return "Pending";
    return request.status || request.requestStatus || "Pending";
  }, []);

  const getUrgency = useCallback((request) => {
    if (!request || typeof request !== "object") return "Low";
    return request.urgency || request.priority || "Low";
  }, []);

  const getVictimName = useCallback((request) => {
    if (!request || typeof request !== "object") return "Unknown User";
    return (
      request.userId?.fullName ||
      request.user?.fullName ||
      request.fullName ||
      request.name ||
      "Unknown User"
    );
  }, []);

  const getLocation = useCallback((request) => {
    if (!request || typeof request !== "object") return "Unknown";
    return request.location || request.address || "Unknown";
  }, []);

  const getDisaster = useCallback((request) => {
    if (!request || typeof request !== "object") return "Unknown";
    return (
      request.disaster ||
      request.disasterType ||
      request.incidentType ||
      "Unknown"
    );
  }, []);

  const getRequestType = useCallback((request) => {
    if (!request || typeof request !== "object") return "General Help";
    return (
      request.type ||
      request.need ||
      request.requestType ||
      "General Help"
    );
  }, []);

  const getFamilyMembers = useCallback((request) => {
    if (!request || typeof request !== "object") return "-";
    return (
      request.familyMembers ??
      request.members ??
      request.numberOfPeople ??
      "-"
    );
  }, []);

  // ==========================================
  // SINGLE-PASS O(N) AGGREGATION ENGINE
  // ==========================================
  const {
    totalRequests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    volunteerAssignedRequests,
    deliveredRequests,
    lowPriorityRequests,
    mediumPriorityRequests,
    highPriorityRequests,
    criticalRequests,
    emergencyLevel,
  } = useMemo(() => {
    const counts = {
      totalRequests: requests.length,
      pendingRequests: 0,
      approvedRequests: 0,
      rejectedRequests: 0,
      volunteerAssignedRequests: 0,
      deliveredRequests: 0,
      lowPriorityRequests: 0,
      mediumPriorityRequests: 0,
      highPriorityRequests: 0,
      criticalRequests: 0,
    };

    requests.forEach((req) => {
      const status = getStatus(req).toLowerCase();
      const urgency = getUrgency(req).toLowerCase();

      // Status aggregation
      if (status === "pending") counts.pendingRequests++;
      else if (status === "approved") counts.approvedRequests++;
      else if (status === "rejected") counts.rejectedRequests++;
      else if (status === "volunteer assigned") counts.volunteerAssignedRequests++;
      else if (status === "delivered") counts.deliveredRequests++;

      // Urgency aggregation
      if (urgency === "low") counts.lowPriorityRequests++;
      else if (urgency === "medium") counts.mediumPriorityRequests++;
      else if (urgency === "high") counts.highPriorityRequests++;
      else if (urgency === "critical") counts.criticalRequests++;
    });

    let emergencyLevel = "Low";
    if (counts.criticalRequests > 0) {
      emergencyLevel = "Critical";
    } else if (counts.highPriorityRequests > 0) {
      emergencyLevel = "High";
    } else if (counts.mediumPriorityRequests > 0) {
      emergencyLevel = "Medium";
    }

    return { ...counts, emergencyLevel };
  }, [requests, getStatus, getUrgency]);

  // ==========================================
  // MEMOIZED SORTED RECENT REQUESTS
  // ==========================================
  const recentRequests = useMemo(() => {
    return [...requests]
      .sort((a, b) => {
        const dateA = new Date(a?.createdAt || a?.created_at || 0).getTime();
        const dateB = new Date(b?.createdAt || b?.created_at || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [requests]);

  // Refresh Handler
  const handleRefresh = async () => {
    setLoading(true);
    await loadRequests();
  };

  // ==========================================
  // LOADING UI
  // ==========================================
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

  // ==========================================
  // DASHBOARD UI (EXACT SAME UI & ELEMENTS)
  // ==========================================
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
                {recentRequests.map((request, requestIndex) => {
                  const status = getStatus(request);
                  const urgency = getUrgency(request);

                  return (
                    <tr key={request._id || request.id || `request-${requestIndex}`}>
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