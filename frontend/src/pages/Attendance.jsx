import { apiFetch } from "../api.js";

import { useEffect, useState } from "react";
import "./Attendance.css";

const API = "/api";

function getToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function Attendance() {
  const [type, setType] = useState("activity");
  const [activities, setActivities] = useState([]);
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  const [selectedItem, setSelectedItem] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(getToday());

  const [records, setRecords] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [remarks, setRemarks] = useState({});

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [aRes, eRes, vRes] = await Promise.all([
          apiFetch(`${API}/activities/admin`, { credentials: "include" }),
          apiFetch(`${API}/events`, { credentials: "include" }),
          apiFetch(`${API}/volunteers`, { credentials: "include" }),
        ]);

        if (!aRes.ok || !eRes.ok || !vRes.ok) {
          throw new Error("Unable to load data. Please login again.");
        }

        const aData = await aRes.json();
        const eData = await eRes.json();
        const vData = await vRes.json();

        setActivities(Array.isArray(aData) ? aData : []);
        setEvents(Array.isArray(eData) ? eData : []);

        setVolunteers(
          (Array.isArray(vData) ? vData : []).filter(
            (v) => String(v.status).toUpperCase() === "ACTIVE"
          )
        );
      } catch (err) {
        setError(err.message);
      }
    }

    loadInitialData();
  }, []);

  // Load records for the selected activity/event and date
  useEffect(() => {
    let cancelled = false;

    async function loadAttendanceRecords() {
      if (!selectedItem || !attendanceDate) {
        setRecords([]);
        setAttendance({});
        setRemarks({});
        return;
      }

      setLoading(true);
      setError("");
      setMessage("");

      setRecords([]);
      setAttendance({});
      setRemarks({});

      try {
        const endpoint =
          type === "activity"
            ? `${API}/attendance/activity/${selectedItem}?date=${attendanceDate}`
            : `${API}/attendance/event/${selectedItem}?date=${attendanceDate}`;

        const response = await apiFetch(endpoint, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to load attendance records.");
        }

        const data = await response.json();

        if (cancelled) return;

        const attendanceMap = {};
        const remarksMap = {};

        data.forEach((record) => {
          const id = record.volunteer?.id ?? record.volunteerId;

          if (id != null) {
            attendanceMap[String(id)] = record.status;
            remarksMap[String(id)] = record.remarks || "";
          }
        });

        setRecords(data);
        setAttendance(attendanceMap);
        setRemarks(remarksMap);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAttendanceRecords();

    return () => {
      cancelled = true;
    };
  }, [selectedItem, type, attendanceDate]);

  function handleTypeChange(value) {
    setType(value);
    setSelectedItem("");
    setRecords([]);
    setAttendance({});
    setRemarks({});
    setError("");
    setMessage("");
  }

  function handleStatusChange(id, status) {
    setAttendance((prev) => ({
      ...prev,
      [String(id)]: status,
    }));
  }

  function handleRemarksChange(id, value) {
    setRemarks((prev) => ({
      ...prev,
      [String(id)]: value,
    }));
  }

  // Save attendance
  async function saveAttendance() {
    if (!selectedItem || !attendanceDate) {
      setError("Please select an activity/event and date.");
      return;
    }

    if (loading || saving) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const csrfResponse = await apiFetch(`${API}/auth/csrf`, {
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("Failed to obtain CSRF token.");
      }

      const csrfData = await csrfResponse.json();
      const token = csrfData.token;

      if (!token) {
        throw new Error("CSRF token missing. Please login again.");
      }

      let successCount = 0;
      let failureCount = 0;
      const failedNames = [];

      for (const volunteer of volunteers) {
        const volunteerId = volunteer.id;
        const key = String(volunteerId);
        const status = attendance[key] || "ABSENT";
        const volunteerRemarks = remarks[key] || "";

        // Match the existing record by volunteer + date + selected item
        const existingRecord = records.find((record) => {
          const recordVolunteerId =
            record.volunteer?.id ?? record.volunteerId;

          const recordItemId =
            type === "activity"
              ? record.activity?.id ?? record.activityId
              : record.event?.id ?? record.eventId;

          return (
            Number(recordVolunteerId) === Number(volunteerId) &&
            Number(recordItemId) === Number(selectedItem) &&
            record.attendanceDate === attendanceDate
          );
        });

        let response;

        if (existingRecord) {
          // Update the existing record, don't create a duplicate
          response = await apiFetch(`${API}/attendance/${existingRecord.id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": token,
            },
            body: JSON.stringify({
              status,
              remarks: volunteerRemarks,
            }),
          });
        } else {
          const payload = {
            volunteerId: Number(volunteerId),
            activityId: type === "activity" ? Number(selectedItem) : null,
            eventId: type === "event" ? Number(selectedItem) : null,
            status,
            attendanceDate,
            remarks: volunteerRemarks,
          };

          response = await apiFetch(`${API}/attendance`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": token,
            },
            body: JSON.stringify(payload),
          });
        }

        if (response.ok) {
          successCount++;
        } else {
          failureCount++;
          const text = await response.text();
          failedNames.push(
            `${volunteer.fullName || volunteerId}: ${text}`
          );
          console.error("Attendance error:", response.status, text);
        }
      }

      if (failureCount === 0) {
        setMessage(`Attendance saved successfully for ${successCount} volunteers!`);
      } else {
        setMessage(`Saved ${successCount}. Failed ${failureCount}.`);
        setError(failedNames.join("\n"));
      }

      // Refresh records for this date
      const endpoint =
        type === "activity"
          ? `${API}/attendance/activity/${selectedItem}?date=${attendanceDate}`
          : `${API}/attendance/event/${selectedItem}?date=${attendanceDate}`;

      const refresh = await apiFetch(endpoint, {
        credentials: "include",
      });

      if (refresh.ok) {
        const data = await refresh.json();

        const attendanceMap = {};
        const remarksMap = {};

        data.forEach((record) => {
          const id = record.volunteer?.id ?? record.volunteerId;

          if (id != null) {
            attendanceMap[String(id)] = record.status;
            remarksMap[String(id)] = record.remarks || "";
          }
        });

        setRecords(data);
        setAttendance(attendanceMap);
        setRemarks(remarksMap);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const presentCount = volunteers.filter(
    (v) => attendance[String(v.id)] === "PRESENT"
  ).length;

  const absentCount = volunteers.filter(
    (v) => attendance[String(v.id)] === "ABSENT"
  ).length;

  const lateCount = volunteers.filter(
    (v) => attendance[String(v.id)] === "LATE"
  ).length;

  const selectedList = type === "activity" ? activities : events;

  const selectedObject = selectedList.find(
    (item) => Number(item.id) === Number(selectedItem)
  );

  const selectedTitle =
    selectedObject?.title ||
    selectedObject?.eventName ||
    selectedObject?.name ||
    "Selected Item";

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <button onClick={() => window.location.href = "/dashboard"}>
          ← Back to Dashboard
        </button>

        <h1>Attendance Management</h1>
        <p>Manage volunteer attendance for activities and events.</p>
      </div>

      <div className="attendance-selection">
        <div className="attendance-field">
          <label>Attendance Type</label>
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="activity">Activity</option>
            <option value="event">Event</option>
          </select>
        </div>

        <div className="attendance-field">
          <label>Select {type === "activity" ? "Activity" : "Event"}</label>
          <select
            value={selectedItem}
            onChange={(e) => {
              setSelectedItem(e.target.value);
              setRecords([]);
              setAttendance({});
              setRemarks({});
              setError("");
              setMessage("");
            }}
          >
            <option value="">-- Select --</option>
            {selectedList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title || item.eventName || item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="attendance-field">
          <label>Attendance Date</label>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="attendance-alert error">{error}</div>
      )}

      {message && (
        <div className="attendance-alert success">{message}</div>
      )}

      {loading && (
        <div className="attendance-loading">Loading attendance...</div>
      )}

      {selectedItem && !loading && (
        <>
          <div className="attendance-stats">
            <div className="attendance-stat total">
              <span>Total Volunteers</span>
              <strong>{volunteers.length}</strong>
            </div>

            <div className="attendance-stat present">
              <span>Present</span>
              <strong>{presentCount}</strong>
            </div>

            <div className="attendance-stat absent">
              <span>Absent</span>
              <strong>{absentCount}</strong>
            </div>

            <div className="attendance-stat late">
              <span>Late</span>
              <strong>{lateCount}</strong>
            </div>
          </div>

          <div className="attendance-table-container">
            <div className="attendance-table-heading">
              <h2>{selectedTitle}</h2>
              <span>{attendanceDate}</span>
            </div>

            {volunteers.length === 0 ? (
              <div className="attendance-empty">
                No active volunteers found.
              </div>
            ) : (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Student ID</th>
                    <th>Volunteer Name</th>
                    <th>Unit</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {volunteers.map((volunteer, index) => {
                    const id = String(volunteer.id);
                    const status = attendance[id] || "ABSENT";

                    return (
                      <tr key={volunteer.id}>
                        <td>{index + 1}</td>
                        <td>{volunteer.studentId || "-"}</td>
                        <td>{volunteer.fullName || volunteer.name || "-"}</td>
                        <td>{volunteer.unitName || volunteer.unit?.unitName || "-"}</td>
                        <td>
                          <select
                            className={`attendance-status-select ${status}`}
                            value={status}
                            onChange={(e) =>
                              handleStatusChange(volunteer.id, e.target.value)
                            }
                          >
                            <option value="PRESENT">PRESENT</option>
                            <option value="ABSENT">ABSENT</option>
                            <option value="LATE">LATE</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Remarks"
                            value={remarks[id] || ""}
                            onChange={(e) =>
                              handleRemarksChange(volunteer.id, e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {volunteers.length > 0 && (
              <div className="attendance-actions">
                <button
                  className="attendance-save-button"
                  onClick={saveAttendance}
                  disabled={saving || loading}
                >
                  {saving ? "Saving..." : "Save Attendance"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Attendance;

