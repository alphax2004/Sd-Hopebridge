import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sidebar, Topbar } from "../pages_victim/sidebar/sidebar";
import "./admin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const statusOptions = [
  "All",
  "Pending",
  "Approved",
  "Volunteer Assigned",
  "Delivered",
  "Rejected",
];

const priorityOptions = [
  "All",
  "Low",
  "Medium",
  "High",
  "Critical",
];

export default function VictimRequests() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isComponentMounted = useRef(false);
  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);
  
  // Advanced State: Multiple requests concurrently processing lock
  const [processingIds, setProcessingIds] = useState(new Set());

  // ==========================================
  // LOAD ALL VICTIM REQUESTS
  // ==========================================
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
          data?.message ||
          data?.error ||
          `HTTP Error ${response.status}: Failed to load victim requests`
        );
      }

      if (!isComponentMounted.current) return;

      // Polymorphic Array Extractor Architecture
      let extractedData = [];
      if (Array.isArray(data)) {
        extractedData = data;
      } else if (Array.isArray(data?.requests)) {
        extractedData = data.requests;
      } else if (Array.isArray(data?.data)) {
        extractedData = data.data;
      } else if (data && typeof data === "object") {
        extractedData = Object.values(data).find(Array.isArray) || [];
      }

      // Deep State Diffing (Prevents unnecessary DOM re-renders)
      setRequests((prev) => {
        const isIdentical = JSON.stringify(prev) === JSON.stringify(extractedData);
        return isIdentical ? prev : extractedData;
      });

      retryCountRef.current = 0; // Reset error retry backoff on success
    } catch (err) {
      if (err.name === "AbortError") {
        console.warn("Fetch operation aborted safely.");
        return;
      }

      console.error("Load victim requests critical error:", err);

      if (isComponentMounted.current) {
        setError(err.message || "Failed to load victim requests");
      }
    } finally {
      if (isComponentMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // Lifecycle Tracker
  useEffect(() => {
    isComponentMounted.current = true;
    const abortController = abortControllerRef.current;

    return () => {
      isComponentMounted.current = false;
      if (abortController) {
        abortController.abort();
      }
    };
  }, []);

  // ==========================================
  // INITIAL LOAD WITH DEFERRED EXECUTION
  // ==========================================
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadRequests();
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [loadRequests]);

  // ==========================================
  // RESILIENT EXPONENTIAL POLLING ENGINE
  // ==========================================
  useEffect(() => {
    let intervalId;

    const schedulePolling = () => {
      // Exponential backoff interval if error occurs (10s base, up to 60s max)
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
  // SAFE DATA ATTRIBUTE EXTRACTORS
  // ==========================================
  const getStatus = useCallback((request) => {
    if (!request || typeof request !== "object") return "Pending";
    return request.status || request.requestStatus || "Pending";
  }, []);

  const getPriority = useCallback((request) => {
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

  const getPhone = useCallback((request) => {
    if (!request || typeof request !== "object") return "-";
    return (
      request.userId?.phone ||
      request.user?.phone ||
      request.phone ||
      "-"
    );
  }, []);

  const getLocation = useCallback((request) => {
    if (!request || typeof request !== "object") return "-";
    return request.location || request.address || "-";
  }, []);

  const getDisaster = useCallback((request) => {
    if (!request || typeof request !== "object") return "-";
    return (
      request.disaster ||
      request.disasterType ||
      request.incidentType ||
      "-"
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
  // HIGH-PERFORMANCE MEMOIZED PIPELINE FILTER
  // ==========================================
  const filteredRequests = useMemo(() => {
    if (!Array.isArray(requests)) return [];

    const normStatusFilter = statusFilter.trim().toLowerCase();
    const normPriorityFilter = priorityFilter.trim().toLowerCase();

    return requests.filter((request) => {
      if (!request) return false;

      const status = getStatus(request).toLowerCase();
      const priority = getPriority(request).toLowerCase();

      const statusMatch =
        normStatusFilter === "all" || status === normStatusFilter;

      const priorityMatch =
        normPriorityFilter === "all" || priority === normPriorityFilter;

      return statusMatch && priorityMatch;
    });
  }, [requests, statusFilter, priorityFilter, getStatus, getPriority]);

  // ==========================================
  // ATOMIC OPTIMISTIC STATUS UPDATE PIPELINE
  // ==========================================
  const updateRequestStatus = async (id, action) => {
    if (!id) {
      alert("Request ID is missing.");
      return;
    }

    if (processingIds.has(id)) {
      return; // Lock prevent concurrent clicks on the same item
    }

    // Capture Snapshot for Reversion on Network Failure
    const previousStateSnapshot = [...requests];
    const targetStatus = action === "approve" ? "Approved" : "Rejected";

    try {
      // 1. Lock Target ID Processing State
      setProcessingIds((prev) => new Set(prev).add(id));
      setError("");

      // 2. Perform Optimistic State Mutation
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === id ? { ...req, status: targetStatus } : req
        )
      );

      const endpoint = action === "approve" ? "approve" : "reject";

      const response = await fetch(
        `${API_URL}/api/requests/${id}/${endpoint}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          `Failed to ${action} request on backend server`
        );
      }

      // 3. Re-Sync Backend State safely
      await loadRequests();
    } catch (err) {
      console.error(`Mutation Failure [Action: ${action}, ID: ${id}]:`, err);

      // Revert Optimistic Mutation on Failure
      setRequests(previousStateSnapshot);

      const errorMessage = err.message || `Failed to ${action} request`;
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      // Release ID Processing Lock
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // ==========================================
  // ACTION DISPATCHERS
  // ==========================================
  const handleApprove = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to accept this request?"
    );

    if (!confirmed) return;
    updateRequestStatus(id, "approve");
  };

  const handleReject = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this request?"
    );

    if (!confirmed) return;
    updateRequestStatus(id, "reject");
  };

  // ==========================================
  // INITIAL LOADING UI
  // ==========================================
  if (loading) {
    return (
      <div className="admin-layout">
        <Sidebar variant="admin" />

        <div className="main-content">
          <Topbar
            variant="admin"
            userName="Admin"
            title="Victim Requests"
            subtitle="View and manage requests submitted by victims."
          />

          <div className="admin-card">
            <div className="table-message">
              Loading victim requests...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN RENDER (UI Structural Parity Intact)
  // ==========================================
  return (
    <div className="admin-layout">
      <Sidebar variant="admin" />

      <div className="main-content">
        <Topbar
          variant="admin"
          userName="Admin"
          title="Victim Requests"
          subtitle="View and manage requests submitted by victims."
        />

        {/* ==================================
            ERROR
        ================================== */}
        {error && (
          <div className="admin-card">
            <div className="table-message error-message">
              {error}

              <br />

              <button
                className="action-btn"
                onClick={loadRequests}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* ==================================
            FILTERS
        ================================== */}
        <div className="admin-card">
          <div className="card-header">
            <h3>
              Request Filters
            </h3>
          </div>

          <div className="filter-container">
            <div className="filter-group">
              <label>
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                {statusOptions.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>
                Priority
              </label>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
              >
                {priorityOptions.map((priority) => (
                  <option
                    key={priority}
                    value={priority}
                  >
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ==================================
            REQUEST LIST
        ================================== */}
        <div className="admin-card">
          <div className="card-header">
            <h3>
              Victim Request List
            </h3>

            <button
              className="action-btn"
              onClick={loadRequests}
              disabled={processingIds.size > 0}
            >
              Refresh
            </button>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="table-message">
              No victim requests found.
            </div>
          ) : (
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      Victim
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Disaster
                    </th>

                    <th>
                      Request
                    </th>

                    <th>
                      Members
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
                  {filteredRequests.map((request, index) => {
                    const status = getStatus(request);
                    const priority = getPriority(request);
                    const requestId = request._id;
                    const isProcessing = processingIds.has(requestId);

                    return (
                      <tr
                        key={
                          requestId || `request-${index}`
                        }
                      >
                        <td>
                          {getVictimName(request)}
                        </td>

                        <td>
                          {getPhone(request)}
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
                            className={`status ${priority}`}
                          >
                            {priority}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status ${status}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td>
                          {status === "Pending" ? (
                            <div className="action-buttons">
                              <button
                                className="action-btn"
                                onClick={() =>
                                  handleApprove(requestId)
                                }
                                disabled={isProcessing}
                              >
                                {isProcessing
                                  ? "Processing..."
                                  : "Accept"}
                              </button>

                              <button
                                className="action-btn"
                                onClick={() =>
                                  handleReject(requestId)
                                }
                                disabled={isProcessing}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span>
                              Responded
                            </span>
                          )}
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