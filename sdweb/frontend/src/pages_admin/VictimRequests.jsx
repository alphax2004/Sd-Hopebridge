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
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

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
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          "Failed to load victim requests"
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

  // ==========================================
  // INITIAL LOAD
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
  // GET STATUS
  // ==========================================

  const getStatus = (request) => {
    return (
      request.status ||
      request.requestStatus ||
      "Pending"
    );
  };

  // ==========================================
  // GET PRIORITY
  // ==========================================

  const getPriority = (request) => {
    return (
      request.urgency ||
      request.priority ||
      "Low"
    );
  };

  // ==========================================
  // GET VICTIM NAME
  // ==========================================

  const getVictimName = (request) => {
    return (
      request.userId?.fullName ||
      request.user?.fullName ||
      request.fullName ||
      request.name ||
      "Unknown User"
    );
  };

  // ==========================================
  // GET PHONE
  // ==========================================

  const getPhone = (request) => {
    return (
      request.userId?.phone ||
      request.user?.phone ||
      request.phone ||
      "-"
    );
  };

  // ==========================================
  // GET LOCATION
  // ==========================================

  const getLocation = (request) => {
    return (
      request.location ||
      request.address ||
      "-"
    );
  };

  // ==========================================
  // GET DISASTER
  // ==========================================

  const getDisaster = (request) => {
    return (
      request.disaster ||
      request.disasterType ||
      request.incidentType ||
      "-"
    );
  };

  // ==========================================
  // GET REQUEST TYPE
  // ==========================================

  const getRequestType = (request) => {
    return (
      request.type ||
      request.need ||
      request.requestType ||
      "General Help"
    );
  };

  // ==========================================
  // GET FAMILY MEMBERS
  // ==========================================

  const getFamilyMembers = (request) => {
    return (
      request.familyMembers ??
      request.members ??
      request.numberOfPeople ??
      "-"
    );
  };

  // ==========================================
  // FILTER REQUESTS
  // ==========================================

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

  // ==========================================
  // UPDATE REQUEST STATUS
  // ==========================================

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
            "Content-Type":
              "application/json",
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          `Failed to ${action} request`
        );
      }

      // Reload request list
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

  // ==========================================
  // ACCEPT
  // ==========================================

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

  // ==========================================
  // REJECT
  // ==========================================

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

  // ==========================================
  // LOADING UI
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
  // MAIN UI
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
                  setStatusFilter(
                    e.target.value
                  )
                }
              >

                {statusOptions.map(
                  (status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>

                  )
                )}

              </select>

            </div>


            <div className="filter-group">

              <label>
                Priority
              </label>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(
                    e.target.value
                  )
                }
              >

                {priorityOptions.map(
                  (priority) => (

                    <option
                      key={priority}
                      value={priority}
                    >
                      {priority}
                    </option>

                  )
                )}

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
              disabled={processingId !== null}
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

                  {filteredRequests.map(
                    (request) => {

                      const status =
                        getStatus(
                          request
                        );

                      const priority =
                        getPriority(
                          request
                        );

                      const requestId =
                        request._id;

                      return (

                        <tr
                          key={
                            requestId
                          }
                        >

                          <td>
                            {getVictimName(
                              request
                            )}
                          </td>


                          <td>
                            {getPhone(
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

                            {status ===
                            "Pending" ? (

                              <div className="action-buttons">

                                <button
                                  className="action-btn"
                                  onClick={() =>
                                    handleApprove(
                                      requestId
                                    )
                                  }
                                  disabled={
                                    processingId ===
                                    requestId
                                  }
                                >
                                  {processingId ===
                                  requestId
                                    ? "Processing..."
                                    : "Accept"}
                                </button>


                                <button
                                  className="action-btn"
                                  onClick={() =>
                                    handleReject(
                                      requestId
                                    )
                                  }
                                  disabled={
                                    processingId ===
                                    requestId
                                  }
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

                    }
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