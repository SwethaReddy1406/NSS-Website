import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./dashboard/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [units, setUnits] = useState([]);
  const [activities, setActivities] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          meResponse,
          unitsResponse,
          activitiesResponse,
          volunteersResponse,
          eventsResponse,
          notificationResponse,
        ] = await Promise.all([
          fetch("/api/auth/me", { credentials: "include" }),
          fetch("/api/units", { credentials: "include" }),
          fetch("/api/activities", { credentials: "include" }),
          fetch("/api/volunteers", { credentials: "include" }),
          fetch("/api/events", { credentials: "include" }),
          fetch("/api/notifications/count", { credentials: "include" }),
        ]);

        if (meResponse.ok) {
          setUser(await meResponse.json());
        }

        if (unitsResponse.ok) {
          const data = await unitsResponse.json();
          setUnits(Array.isArray(data) ? data : []);
        }

        if (activitiesResponse.ok) {
          const data = await activitiesResponse.json();
          setActivities(Array.isArray(data) ? data : []);
        }

        if (volunteersResponse.ok) {
          const data = await volunteersResponse.json();
          setVolunteers(Array.isArray(data) ? data : []);
        }

        if (eventsResponse.ok) {
          const data = await eventsResponse.json();
          setEvents(Array.isArray(data) ? data : []);
        }

        if (notificationResponse.ok) {
          const data = await notificationResponse.json();

          const count =
            typeof data === "number"
              ? data
              : data.count ?? data.unreadCount ?? 0;

          setUnreadCount(Number(count) || 0);
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function handleLogout() {
    try {
      const csrfResponse = await fetch("/api/auth/csrf", {
        credentials: "include",
      });

      const csrfData = await csrfResponse.json();

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": csrfData.token,
        },
      });

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  }

  const stats = [
    {
      title: "Total Units",
      value: loading ? "..." : units.length,
      icon: "🏢",
      color: "blue",
    },
    {
      title: "Total Activities",
      value: loading ? "..." : activities.length,
      icon: "🌱",
      color: "green",
    },
    {
      title: "Total Events",
      value: loading ? "..." : events.length,
      icon: "📅",
      color: "orange",
    },
    {
      title: "Total Volunteers",
      value: loading ? "..." : volunteers.length,
      icon: "👥",
      color: "purple",
    },
  ];

  const actions = [
    {
      title: "Manage Activities",
      description: "View and manage NSS activities",
      icon: "🌱",
      link: "/dashboard/activities",
    },
    {
      title: "Manage Events",
      description: "Create and organize NSS events",
      icon: "📅",
      link: "/events",
    },
    {
      title: "Manage Units",
      description: "Manage NSS units",
      icon: "🏢",
      link: "/units-management",
    },
    {
      title: "Manage Volunteers",
      description: "Review registrations and manage volunteers",
      icon: "👥",
      link: "/volunteers",
    },
    {
      title: "Attendance",
      description: "Track volunteer attendance",
      icon: "📝",
      link: "/attendance",
    },
    {
      title: "Notifications",
      description: "Send announcements and view sent history",
      icon: "🔔",
      link: "/dashboard/notifications",
    },
  ];

  return (
    <div className="admin-dashboard">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <span className="dashboard-logo">NSS</span>

          <div>
            <h2>NSS Admin</h2>
            <p>RGUKT Basar</p>
          </div>
        </div>

        <nav className="dashboard-nav">
          <Link to="/dashboard" className="dashboard-active">
            📊 Dashboard
          </Link>

          <Link to="/dashboard/activities">🌱 Activities</Link>
          <Link to="/events">📅 Events</Link>
          <Link to="/units-management">🏢 Units</Link>
          <Link to="/volunteers">👥 Volunteers</Link>
          <Link to="/attendance">📝 Attendance</Link>

          <Link to="/dashboard/notifications">
            🔔 Notifications
            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  background: "#ef4444",
                  color: "white",
                  borderRadius: "20px",
                  padding: "2px 8px",
                  fontSize: "12px",
                }}
              >
                {unreadCount}
              </span>
            )}
          </Link>

          <Link to="/dashboard/contact-messages">✉️ Contact Messages</Link>
        </nav>

        <div className="dashboard-sidebar-bottom">
          <Link to="/">↩ Visit Website</Link>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "10px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to NSS administration</p>
          </div>

          <div className="dashboard-admin-profile">
            <div className="admin-avatar">
              {(user?.email || "A").charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user?.email || "Coordinator"}</strong>
              <small>Coordinator</small>
            </div>
          </div>
        </header>

        <section className="dashboard-welcome">
          <div>
            <span>NOT ME, BUT YOU</span>
            <h2>Welcome to NSS Dashboard 👋</h2>

            <p>
              Manage activities, events, units and volunteers from one place.
            </p>
          </div>

          <div className="welcome-icon">🌿</div>
        </section>

        <section className="dashboard-stats">
          {stats.map((stat) => (
            <div className="dashboard-stat-card" key={stat.title}>
              <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>

              <div>
                <p>{stat.title}</p>
                <h2>{stat.value}</h2>
              </div>
            </div>
          ))}
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <h2>Quick Actions</h2>
            <p>Manage NSS operations</p>
          </div>

          <div className="quick-actions-grid">
            {actions.map((action) => (
              <Link
                to={action.link}
                className="quick-action-card"
                key={action.title}
              >
                <span>{action.icon}</span>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="dashboard-footer">
          National Service Scheme | RGUKT Basar
          <br />
          Not Me, But You
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
