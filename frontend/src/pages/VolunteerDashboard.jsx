import { apiFetch } from "../api.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function VolunteerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function csrf() {
    const res = await apiFetch("/api/auth/csrf", {
      credentials: "include",
    });
    const data = await res.json();
    return data.token;
  }

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.all([
        apiFetch("/api/auth/me", { credentials: "include" }),
        apiFetch("/api/notifications", { credentials: "include" }),
        apiFetch("/api/notifications/count", { credentials: "include" }),
        apiFetch("/api/activities", { credentials: "include" }),
        apiFetch("/api/events", { credentials: "include" }),
        apiFetch("/api/attendance/my", { credentials: "include" }),
        apiFetch("/api/volunteers/my-profile", { credentials: "include" }),
      ]);

      if (!results[0].ok) {
        navigate("/login");
        return;
      }

      const me = await results[0].json();

      if (me.role !== "ROLE_VOLUNTEER") {
        navigate("/login");
        return;
      }

      setUser(me);

      if (results[6].ok) {
        setProfile(await results[6].json());
      }

      if (results[1].ok) {
        const data = await results[1].json();
        setNotifications(Array.isArray(data) ? data : []);
      }

      if (results[2].ok) {
        const data = await results[2].json();
        setUnread(data.unreadCount || 0);
      }

      if (results[3].ok) {
        const data = await results[3].json();
        setActivities(Array.isArray(data) ? data : []);
      }

      if (results[4].ok) {
        const data = await results[4].json();
        setEvents(Array.isArray(data) ? data : []);
      }

      if (results[5].ok) {
        const data = await results[5].json();
        setAttendance(Array.isArray(data) ? data : []);
      } else {
        setAttendance([]);
      }

    } catch {
      setError("Unable to load dashboard. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Mark one notification as read
  async function markRead(id) {
    try {
      const token = await csrf();

      const res = await apiFetch(`/api/notifications/${id}/read`, {
        method: "PUT",
        credentials: "include",
        headers: { "X-XSRF-TOKEN": token },
      });

      if (!res.ok) throw new Error();

      setNotifications((list) =>
        list.map((n) => n.id === id ? { ...n, read: true } : n)
      );

      setUnread((count) => Math.max(0, count - 1));

    } catch {
      setError("Unable to update notification.");
    }
  }

  // Mark all notifications as read
  async function markAllRead() {
    try {
      const token = await csrf();

      const res = await apiFetch("/api/notifications/read-all", {
        method: "PUT",
        credentials: "include",
        headers: { "X-XSRF-TOKEN": token },
      });

      if (!res.ok) throw new Error();

      setNotifications((list) =>
        list.map((n) => ({ ...n, read: true }))
      );

      setUnread(0);

    } catch {
      setError("Unable to mark notifications as read.");
    }
  }

  // Logout
  async function logout() {
    try {
      const token = await csrf();

      await apiFetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { "X-XSRF-TOKEN": token },
      });

    } finally {
      navigate("/login", { replace: true });
    }
  }

  // Common card style
  const card = {
    background: "white",
    padding: 20,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    marginBottom: 15,
  };

  // Attendance counts
  const presentCount = attendance.filter(
    (a) => a.status === "PRESENT"
  ).length;

  const absentCount = attendance.filter(
    (a) => a.status === "ABSENT"
  ).length;

  const lateCount = attendance.filter(
    (a) => a.status === "LATE"
  ).length;

  if (loading) {
    return <div style={{ padding: 40 }}>Loading dashboard...</div>;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f3f6f9",
      fontFamily: "Arial"
    }}>

      {/* HEADER */}
      <header style={{
        background: "#14532d",
        color: "white",
        padding: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10
      }}>
        <div>
          <h1 style={{ margin: 0 }}>NSS Volunteer Dashboard</h1>
          <p>Not Me, But You</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/")}>
            Visit Website
          </button>

          <button onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main style={{
        maxWidth: 1100,
        margin: "auto",
        padding: 20
      }}>

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        {/* WELCOME */}
        <section style={card}>
          <h2>Welcome!</h2>
          <p>
            Logged in as: <strong>{user?.email}</strong>
          </p>
        </section>

        {/* MY PROFILE */}
        <section style={card}>
          <h2>My Profile</h2>

          {profile ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 12
            }}>
              <p><strong>Full Name:</strong> {profile.fullName || "—"}</p>
              <p><strong>Student ID:</strong> {profile.studentId || "—"}</p>
              <p><strong>Email:</strong> {profile.email || "—"}</p>
              <p><strong>Phone:</strong> {profile.phone || "—"}</p>
              <p><strong>Department:</strong> {profile.department || "—"}</p>
              <p><strong>Academic Year:</strong> {profile.academicYear || "—"}</p>
              <p><strong>NSS Unit:</strong> {profile.unitName || "—"}</p>
              <p><strong>Status:</strong> {profile.status || "—"}</p>
            </div>
          ) : (
            <p>Profile information unavailable.</p>
          )}
        </section>

        {/* SUMMARY CARDS */}
        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: 15
        }}>
          <div style={card}>
            <h3>Notifications</h3>
            <h1>{notifications.length}</h1>
          </div>

          <div style={card}>
            <h3>Unread</h3>
            <h1>{unread}</h1>
          </div>

          <div style={card}>
            <h3>Activities</h3>
            <h1>{activities.length}</h1>
          </div>

          <div style={card}>
            <h3>Events</h3>
            <h1>{events.length}</h1>
          </div>

          <div style={card}>
            <h3>My Attendance</h3>
            <h1>{attendance.length}</h1>
          </div>
        </section>

        {/* ATTENDANCE SUMMARY */}
        <section style={card}>
          <h2>My Attendance Summary</h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
            gap: 15
          }}>
            <div style={{
              background: "#dcfce7",
              padding: 15,
              borderRadius: 10,
              textAlign: "center"
            }}>
              <h3>Present</h3>
              <h1 style={{ color: "#166534" }}>
                {presentCount}
              </h1>
            </div>

            <div style={{
              background: "#fee2e2",
              padding: 15,
              borderRadius: 10,
              textAlign: "center"
            }}>
              <h3>Absent</h3>
              <h1 style={{ color: "#991b1b" }}>
                {absentCount}
              </h1>
            </div>

            <div style={{
              background: "#fef3c7",
              padding: 15,
              borderRadius: 10,
              textAlign: "center"
            }}>
              <h3>Late</h3>
              <h1 style={{ color: "#92400e" }}>
                {lateCount}
              </h1>
            </div>
          </div>
        </section>

        {/* MY ATTENDANCE RECORDS */}
        <section style={card}>
          <h2>My Attendance Records</h2>

          {attendance.length === 0 ? (
            <p>
              No attendance records available yet.
            </p>
          ) : (
            [...attendance]
              .sort((a, b) =>
                new Date(b.attendanceDate) -
                new Date(a.attendanceDate)
              )
              .map((a) => {

                const itemName =
                  a.activity?.title ||
                  a.activity?.name ||
                  a.event?.title ||
                  a.event?.name ||
                  (a.activity ? "Activity" : "Event");

                const statusColor =
                  a.status === "PRESENT" ? "#166534" :
                  a.status === "ABSENT" ? "#991b1b" :
                  "#92400e";

                const statusBackground =
                  a.status === "PRESENT" ? "#dcfce7" :
                  a.status === "ABSENT" ? "#fee2e2" :
                  "#fef3c7";

                return (
                  <article
                    key={a.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: 10,
                      padding: 15,
                      marginTop: 12,
                      background: "#fff"
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 10
                    }}>
                      <h3 style={{ margin: 0 }}>
                        {itemName}
                      </h3>

                      <span style={{
                        background: statusBackground,
                        color: statusColor,
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontWeight: "bold"
                      }}>
                        {a.status}
                      </span>
                    </div>

                    <p>
                      <strong>Date:</strong>{" "}
                      {a.attendanceDate || "Not specified"}
                    </p>

                    <p>
                      <strong>Type:</strong>{" "}
                      {a.activity ? "Activity" : "Event"}
                    </p>

                    {a.remarks && (
                      <p>
                        <strong>Remarks:</strong> {a.remarks}
                      </p>
                    )}
                  </article>
                );
              })
          )}
        </section>

        {/* NOTIFICATIONS */}
        <section style={card}>
          <h2>Announcements & Notifications</h2>

          {unread > 0 && (
            <button onClick={markAllRead}>
              Mark All as Read
            </button>
          )}

          {notifications.length === 0 ? (
            <p>
              No notifications yet. Coordinator announcements will appear here.
            </p>
          ) : (
            notifications.map((n) => (
              <article
                key={n.id}
                style={{
                  padding: 15,
                  marginTop: 12,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: n.read ? "white" : "#fff8e6"
                }}
              >
                <h3>{n.title}</h3>

                <p style={{ whiteSpace: "pre-wrap" }}>
                  {n.message}
                </p>

                <small>
                  {n.createdAt
                    ? new Date(n.createdAt).toLocaleString()
                    : ""}
                  {" · "}
                  {n.read ? "Read" : "Unread"}
                </small>

                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    style={{ marginLeft: 12 }}
                  >
                    Mark Read
                  </button>
                )}
              </article>
            ))
          )}
        </section>

        {/* ACTIVITIES */}
        <section style={card}>
          <h2>Activities</h2>

          {activities.length === 0 ? (
            <p>No activities available.</p>
          ) : (
            activities.map((a) => (
              <article
                key={a.id}
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: 10
                }}
              >
                <h3>{a.title || a.name || "Activity"}</h3>
                <p>{a.description || ""}</p>
              </article>
            ))
          )}
        </section>

        {/* EVENTS */}
        <section style={card}>
          <h2>Events</h2>

          {events.length === 0 ? (
            <p>No events available.</p>
          ) : (
            events.map((e) => (
              <article
                key={e.id}
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: 10
                }}
              >
                <h3>{e.title || e.name || "Event"}</h3>
                <p>{e.description || ""}</p>
              </article>
            ))
          )}
        </section>

        {/* REFRESH */}
        <button onClick={loadData}>
          Refresh Dashboard
        </button>

      </main>
    </div>
  );
}

export default VolunteerDashboard;
