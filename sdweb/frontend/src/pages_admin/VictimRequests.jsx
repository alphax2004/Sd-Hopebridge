import { useCallback, useEffect, useState } from "react";
import { Sidebar, Topbar } from "../pages_alfa/sidebar";
import "./admin.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

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

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [processingId, setProcessingId] =
    useState(null);

  // =====================================================
  // LOAD REQUESTS
  // =====================================================

  const loadRequests = useCallback(async () => {

    try {

      setError("");

      const response = await fetch(
        `${API_URL}/api/requests`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to load victim requests"
        );
      }

      if (Array.isArray(data)) {

        setRequests(data);

      } else if (
        Array.isArray(data.requests)
      ) {

        setRequests(data.requests);

      } else if (
        Array.isArray(data.data)
      ) {

        setRequests(data.data);

      } else {

        setRequests([]);

      }

    } catch (err) {

      console.error(
        "Load victim requests error:",
        err
      );

      setError(
        err.message ||
        "Failed to load victim requests"
      );

    } finally {

      setLoading(false);

    }

  }, []);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    const timeout = setTimeout(() => {

      loadRequests();

    }, 0);

    return () => {

      clearTimeout(timeout);

    };

  }, [loadRequests]);

  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {

    const interval = setInterval(() => {

      loadRequests();

    }, 10000);

    return () => {

      clearInterval(interval);

    };

  }, [loadRequests]);

  // =====================================================
  // GET STATUS
  // =====================================================

  const getStatus = (request) => {

    return (
      request.status ||
      request.requestStatus ||
      "Pending"
    );

  };

  // =====================================================
  // GET PRIORITY
  // =====================================================

  const getPriority = (request) => {

    return (
      request.urgency ||
      request.priority ||
      "Low"
    );

  };

  // =====================================================
  // GET VICTIM NAME
  // =====================================================

  const getVictimName = (request) => {

    return (
      request.userId?.fullName ||
      request.user?.fullName ||
      request.fullName ||
      request.name ||
      "Unknown User"
    );

  };

  // =====================================================
  // GET PHONE
  // =====================================================

  const getPhone = (request) => {

    return (
      request.userId?.phone ||
      request.user?.phone ||
      request.phone ||
      "-"
    );

  };

  // =====================================================
  // GET LOCATION
  // =====================================================

  const getLocation = (request) => {

    return (
      request.location ||
      request.address ||
      "-"
    );

  };

  // =====================================================
  // GET DISASTER
  // =====================================================

  const getDisaster = (request) => {

    return (
      request.disaster ||
      request.disasterType ||
      request.incidentType ||
      "-"
    );

  };

  // =====================================================
  // GET REQUEST TYPE
  // =====================================================

  const getRequestType = (request) => {

    return (
      request.type ||
      request.need ||
      request.requestType ||
      "General Help"
    );

  };

  // =====================================================
  // GET FAMILY MEMBERS
  // =====================================================

  const getFamilyMembers = (request) => {

    return (
      request.familyMembers ??
      request.members ??
      request.numberOfPeople ??
      "-"
    );

  };

  // =====================================================
  // FILTER REQUESTS
  // =====================================================

  const filteredRequests = requests.filter(
    (request) => {

      const status =
        getStatus(request);

      const priority =
        getPriority(request);

      const statusMatch =
        statusFilter === "All" ||
        status.toLowerCase() ===
          statusFilter.toLowerCase();

      const priorityMatch =
        priorityFilter === "All" ||
        priority.toLowerCase() ===
          priorityFilter.toLowerCase();

      return (
        statusMatch &&
        priorityMatch
      );

    }
  );

  // =====================================================
  // UPDATE REQUEST STATUS
  // =====================================================

  const updateRequestStatus = async (
    id,
    action
  ) => {

    if (!id) {

      alert("Request ID is missing.");

      return;

    }

    try {

      setProcessingId(id);

      setError("");

      const endpoint =
        action === "approve"
          ? "approve"
          : "reject";

      const response = await fetch(
        `${API_URL}/api/requests/${id}/${endpoint}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          `Failed to ${action} request`
        );

      }

      // Reload latest database data
      await loadRequests();

    } catch (err) {

      console.error(
        `${action} request error:`,
        err
      );

      setError(
        err.message ||
        `Failed to ${action} request`
      );

      alert(
        err.message ||
        `Failed to ${action} request`
      );

    } finally {

      setProcessingId(null);

    }

  };

  // =====================================================
  // ACCEPT REQUEST
  // =====================================================

  const handleApprove = (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to accept this request?"
      );

    if (!confirmed) {
      return;
    }

    updateRequestStatus(
      id,
      "approve"
    );

  };

  // =====================================================
  // REJECT REQUEST
  // =====================================================

  const handleReject = (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to reject this request?"
      );

    if (!confirmed) {
      return;
    }

    updateRequestStatus(
      id,
      "reject"
    );

  };

  // =====================================================
  // LOADING
  // =====================================================

  if (
    loading &&
    requests.length === 0
  ) {

    return (

      <div className="admin-layout">

        <Sidebar variant="admin" />

        <div className="main-content">

          <Topbar
            variant="admin"
            userName="Admin"
            title="Victim Requests"
            subtitle="Monitor incoming help requests from victims."
          />

          <div className="admin-card">

            <p>
              Loading victim requests...
            </p>

          </div>

        </div>

      </div>

    );

  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="admin-layout">

      <Sidebar variant="admin" />

      <div className="main-content">

        <Topbar
          variant="admin"
          userName="Admin"
          title="Victim Requests"
          subtitle="Monitor incoming help requests from victims."
        />

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (

          <div className="admin-card">

            <p>{error}</p>

            <button
              type="button"
              className="filter-btn"
              onClick={loadRequests}
            >
              Retry
            </button>

          </div>

        )}

        {/* ==========================================
            FILTERS
        ========================================== */}

        <div className="filter-row">

          {/* STATUS FILTER */}

          <div className="filter-group">

            <span>Status:</span>

            {statusOptions.map(
              (status) => (

                <button
                  key={status}
                  type="button"
                  className={
                    statusFilter === status
                      ? "filter-btn active"
                      : "filter-btn"
                  }
                  onClick={() =>
                    setStatusFilter(status)
                  }
                >
                  {status}
                </button>

              )
            )}

          </div>

          {/* PRIORITY FILTER */}

          <div className="filter-group">

            <span>Priority:</span>

            {priorityOptions.map(
              (priority) => (

                <button
                  key={priority}
                  type="button"
                  className={
                    priorityFilter === priority
                      ? "filter-btn active"
                      : "filter-btn"
                  }
                  onClick={() =>
                    setPriorityFilter(
                      priority
                    )
                  }
                >
                  {priority}
                </button>

              )
            )}

          </div>

        </div>

        {/* ==========================================
            REQUEST TABLE
        ========================================== */}

        <div className="admin-card">

          <h3>
            All Requests
          </h3>

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

              </tr>

            </thead>

            <tbody>

              {filteredRequests.map(
                (request) => {

                  const status =
                    getStatus(request);

                  const priority =
                    getPriority(request);

                  const isProcessing =
                    processingId ===
                    request._id;

                  return (

                    <tr
                      key={request._id}
                    >

                      {/* VICTIM */}

                      <td>
                        {getVictimName(
                          request
                        )}
                      </td>

                      {/* PHONE */}

                      <td>
                        {getPhone(
                          request
                        )}
                      </td>

                      {/* LOCATION */}

                      <td>
                        {getLocation(
                          request
                        )}
                      </td>

                      {/* DISASTER */}

                      <td>
                        {getDisaster(
                          request
                        )}
                      </td>

                      {/* REQUEST */}

                      <td>
                        {getRequestType(
                          request
                        )}
                      </td>

                      {/* FAMILY MEMBERS */}

                      <td>
                        {getFamilyMembers(
                          request
                        )}
                      </td>

                      {/* PRIORITY */}

                      <td>

                        <span
                          className={`badge ${priority}`}
                        >
                          {priority}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`badge ${status}`}
                        >
                          {status}
                        </span>

                        {/* ==================================
                            ACCEPT / REJECT
                            Only pending requests
                        =================================== */}

                        {status.toLowerCase() ===
                          "pending" && (

                          <div
                            style={{
                              marginTop: "8px",
                              display: "flex",
                              gap: "6px",
                              flexWrap: "wrap",
                            }}
                          >

                            <button
                              type="button"
                              onClick={() =>
                                handleApprove(
                                  request._id
                                )
                              }
                              disabled={
                                isProcessing
                              }
                              style={{
                                cursor:
                                  isProcessing
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            >
                              {isProcessing
                                ? "..."
                                : "Accept"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleReject(
                                  request._id
                                )
                              }
                              disabled={
                                isProcessing
                              }
                              style={{
                                cursor:
                                  isProcessing
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            >
                              {isProcessing
                                ? "..."
                                : "Reject"}
                            </button>

                          </div>

                        )}

                      </td>

                    </tr>

                  );

                }
              )}

              {/* ==========================================
                  NO RESULT
              ========================================== */}

              {filteredRequests.length ===
                0 && (

                <tr>

                  <td colSpan="8">

                    {requests.length === 0
                      ? "No victim requests found."
                      : "No requests match this filter."
                    }

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}