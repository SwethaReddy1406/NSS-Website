import { useEffect, useState } from "react";

function NotificationBar() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchAnnouncements() {
      try {
        const response = await fetch(
          "/api/notifications/public/announcements"
        );

        if (!response.ok) {
          throw new Error("Failed to load announcements");
        }

        const data = await response.json();

        if (isMounted) {
          setAnnouncements(data);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError("Announcements are temporarily unavailable.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAnnouncements();

    const interval = setInterval(fetchAnnouncements, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // API returns announcements newest first.
  const latestAnnouncement = announcements[0];

  return (
    <section className="notifications">

      <div className="notification-header">
        <span className="notification-label">NEW</span>
        <h2>Announcements</h2>
      </div>

      {loading && (
        <div className="notification-empty">
          Loading announcements...
        </div>
      )}

      {!loading && error && (
        <div className="notification-empty notification-error">
          {error}
        </div>
      )}

      {!loading && !error && !latestAnnouncement && (
        <div className="notification-empty">
          <span className="notification-icon">📢</span>
          <p>
            NSS RGUKT Basar — Upcoming activities, events and
            important announcements will be displayed here.
          </p>
        </div>
      )}

      {!loading && !error && latestAnnouncement && (
        <article className="announcement-card">

          <div className="announcement-highlight">
            <span className="notification-icon">📢</span>
            <span className="announcement-badge">
              LATEST
            </span>
          </div>

          <div className="announcement-details">

            <h3>{latestAnnouncement.title}</h3>

            <p className="announcement-message">
              {latestAnnouncement.message}
            </p>

            <span className="announcement-date">
              🕒 {formatDate(latestAnnouncement.createdAt)}
            </span>

          </div>

        </article>
      )}

    </section>
  );
}

export default NotificationBar;
