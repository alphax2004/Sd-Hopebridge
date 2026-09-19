import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sidebar, Topbar } from "../pages_victim/sidebar/sidebar";
import "./admin.css";

// Environment Dynamic Configuration Engine
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const POLLING_INTERVAL_MS = 10000;
const MAX_BACKOFF_DELAY_MS = 60000;
const CACHE_TTL_MS = 30000;

// Enterprise In-Memory Cache Store for Instant Hydration
const globalRequestCache = {
  data: null,
  timestamp: 0,
};

export default function AdminDashboard() {
  // Core State Engine
  const [requests, setRequests] = useState(() => globalRequestCache.data || []);
  const [loading, setLoading] = useState(!globalRequestCache.data);
  const [error, setError] = useState("");

  // Enterprise Concurrency & Execution Control References
  const abortControllerRef = useRef(null);
  const isComponentMountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const pollingTimerRef = useRef(null);

  // ==========================================
  // SAFE DATA EXTRACTION & TRANSFORM ENGINE
  // ==========================================
  const extractRequestsData = useCallback((responseData) => {
    if (!responseData) return [];
    if (Array.isArray(responseData)) return responseData;
    if (Array.isArray(responseData.requests)) return responseData.requests;
    if (Array.isArray(responseData.data)) return responseData.data;
    if (Array.isArray(responseData.items)) return responseData.items;
    
    if (typeof responseData === "object") {
      const nestedArray = Object.values(responseData).find(Array.isArray);
      return nestedArray || [];
    }
    return [];
  }, []);

  // ==========================================
  // RESILIENT GETTER HELPERS WITH FALLBACKS
  // ==========================================
  const getStatus = useCallback((request) => {
    if (!request || typeof request !== "object") return "Pending";
    return request.status || request.requestStatus || request.state || "Pending";
  }, []);

  const getUrgency = useCallback((request) => {
    if (!request || typeof request !== "object") return "Low";
    return request.urgency || request.priority || request.urgencyLevel || "Low";
  }, []);

  const getVictimName = useCallback((request) => {
    if (!request || typeof request !== "object") return "Unknown User";
    return (
      request.userId?.fullName ||
      request.user?.fullName ||
      request.fullName ||
      request.userName ||
      request.name ||
      "Unknown User"
    );
  }, []);

  const getLocation = useCallback((request) => {
    if (!request || typeof request !== "object") return "Unknown";
    return (
      request.location ||
      request.address ||
      request.victimAddress ||
      request.district ||
      "Unknown"
    );
  }, []);

  const getDisaster = useCallback((request) => {
    if (!request || typeof request !== "object") return "Unknown";
    return (
      request.disaster ||
      request.disasterType ||
      request.incidentType ||
      request.eventType ||
      "Unknown"
    );
  }, []);

  const getRequestType = useCallback((request) => {
    if (!request || typeof request !== "object") return "General Help";
    return (
      request.type ||
      request.need ||
      request.requestType ||
      request.category ||
      "General Help"
    );
  }, []);

  const getFamilyMembers = useCallback((request) => {
    if (!request || typeof request !== "object") return "-";
    return (
      request.familyMembers ??
      request.members ??
      request.numberOfPeople ??
      request.personCount ??
      "-"
    );
  }, []);

  // ==========================================
  // ENTERPRISE DATA FETCHING ENGINE WITH ABORT
  // ==========================================
  const loadRequests = useCallback(async (isSilentBackground = false) => {
    // Abort active ongoing fetch to eliminate race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (isComponentMountedRef.current) {
        if (!isSilentBackground) {
          setError("");
        }
      }

      const response = await fetch(`${API_URL}/api/requests`, {
        method: "GET",
        credentials: "include",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
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

      const rawData = await response.json();

      if (!isComponentMountedRef.current) return;

      const extractedRequests = extractRequestsData(rawData);

      // Hydrate Global In-Memory Cache Store
      globalRequestCache.data = extractedRequests;
      globalRequestCache.timestamp = Date.now();

      // Deep Memory Diffing to skip unneeded renders
      setRequests((prev) => {
        const isUnchanged = JSON.stringify(prev) === JSON.stringify(extractedRequests);
        return isUnchanged ? prev : extractedRequests;
      });

      retryCountRef.current = 0; // Reset exponential backoff retry counter
    } catch (err) {
      if (err.name === "AbortError") {
        return; // Suppress safe abort controller errors
      }

      console.error("Critical Load Requests Failure:", err);

      if (isComponentMountedRef.current) {
        // Retain cached data on network error if available
        if (requests.length === 0) {
          setError(err.message || "Failed to load victim requests");
        }
      }
    } finally {
      if (isComponentMountedRef.current) {
        setLoading(false);
      }
    }
  }, [extractRequestsData, requests.length]);

  // ==========================================
  // COMPONENT LIFECYCLE MANAGEMENT
  // ==========================================
  useEffect(() => {
    isComponentMountedRef.current = true;

    return () => {
      isComponentMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
      }
    };
  }, []);

  // Initial Fetching with Cache Validity Checker
  useEffect(() => {
    const isCacheFresh =
      globalRequestCache.data &&
      Date.now() - globalRequestCache.timestamp < CACHE_TTL_MS;

    if (!isCacheFresh) {
      const timeoutId = setTimeout(() => {
        loadRequests(false);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [loadRequests]);

  // Self-Healing Exponential Backoff Auto-Polling Loop
  useEffect(() => {
    let isSubscribed = true;

    const scheduleNextPoll = () => {
      const computedDelay = error
        ? Math.min(
            POLLING_INTERVAL_MS * Math.pow(2, retryCountRef.current),
            MAX_BACKOFF_DELAY_MS
          )
        : POLLING_INTERVAL_MS;

      pollingTimerRef.current = setTimeout(async () => {
        if (!isSubscribed) return;

        if (error) {
          retryCountRef.current += 1;
        }

        await loadRequests(true);
        if (isSubscribed) {
          scheduleNextPoll();
        }
      }, computedDelay);
    };

    scheduleNextPoll();

    return () => {
      isSubscribed = false;
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
      }
    };
  }, [loadRequests, error]);

  // ==========================================
  // SINGLE-PASS O(N) HIGH PERFORMANCE AGGREGATION ENGINE
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

    for (let i = 0; i < requests.length; i++) {
      const req = requests[i];
      const status = getStatus(req).toLowerCase();
      const urgency = getUrgency(req).toLowerCase();

      // Status aggregation
      if (status === "pending") counts.pendingRequests++;
      else if (status === "approved") counts.approvedRequests++;
      else if (status === "rejected") counts.rejectedRequests++;
      else if (status === "volunteer assigned" || status === "assigned") counts.volunteerAssignedRequests++;
      else if (status === "delivered" || status === "completed") counts.deliveredRequests++;

      // Urgency aggregation
      if (urgency === "low") counts.lowPriorityRequests++;
      else if (urgency === "medium") counts.mediumPriorityRequests++;
      else if (urgency === "high") counts.highPriorityRequests++;
      else if (urgency === "critical") counts.criticalRequests++;
    }

    // Dynamic Emergency Level Calculator
    let computedEmergencyLevel = "Low";
    if (counts.criticalRequests > 0) {
      computedEmergencyLevel = "Critical";
    } else if (counts.highPriorityRequests > 0) {
      computedEmergencyLevel = "High";
    } else if (counts.mediumPriorityRequests > 0) {
      computedEmergencyLevel = "Medium";
    }

    return { ...counts, emergencyLevel: computedEmergencyLevel };
  }, [requests, getStatus, getUrgency]);

  // ==========================================
  // OPTIMIZED MEMOIZED SORTED RECENT REQUESTS
  // ==========================================
  const recentRequests = useMemo(() => {
    if (!requests || requests.length === 0) return [];

    return [...requests]
      .sort((a, b) => {
        const dateA = new Date(
          a?.createdAt || a?.created_at || a?.timestamp || 0
        ).getTime();
        const dateB = new Date(
          b?.createdAt || b?.created_at || b?.timestamp || 0
        ).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [requests]);

  // Refresh Trigger Handler
  const handleRefresh = async () => {
    setLoading(true);
    await loadRequests(false);
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