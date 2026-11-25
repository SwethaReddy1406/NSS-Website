import { apiFetch } from "../../api.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Notifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API = "/api/notifications";

  async function loadAnnouncements() {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(`${API}/sent`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load announcement history");
      }

      setAnnouncements(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function sendAnnouncement(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !message.trim()) {
      setError("Please enter both title and message.");
      return;
    }

    setSending(true);

    try {
      const csrfResponse = await apiFetch("/api/auth/csrf", {
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("Unable to obtain security token.");
      }

      const csrf = await csrfResponse.json();

      const response = await apiFetch(`${API}/announce`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrf.token,
        },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send announcement.");
      }

      setSuccess(
        `Announcement saved and sent. Recipients: ${result.recipients}`
      );

      setTitle("");
      setMessage("");

      await loadAnnouncements();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1100px", margin: "auto" }}>
      <Link
        to="/dashboard"
        style={{
          display: "inline-block",
          marginBottom: "20px",
          color: "#153d67",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        ← Back to Dashboard
      </Link>

      <h1>Notifications</h1>
      <p>Send announcements and view previously sent announcements.</p>

      {error && (
        <p style={{ color: "#dc2626", background: "#fee2e2", padding: "12px" }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{ color: "#15803d", background: "#dcfce7", padding: "12px" }}>
          {success}
        </p>
      )}

      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "10px",
          marginBottom: "30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Send Announcement</h2>

        <form onSubmit={sendAnnouncement}>
          <div style={{ marginBottom: "16px" }}>
            <label>Announcement Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
              required
              placeholder="Enter announcement title"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Announcement Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              required
              rows={5}
              placeholder="Write your announcement..."
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          <button type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send Announcement"}
          </button>
        </form>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h2>Sent Announcement History</h2>

          <button onClick={loadAnnouncements} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh History"}
          </button>
        </div>

        {loading ? (
          <p>Loading announcement history...</p>
        ) : announcements.length === 0 ? (
          <p>No announcements have been sent yet.</p>
        ) : (
          announcements.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#fff",
                padding: "20px",
                marginTop: "14px",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{item.title}</h3>

              <p style={{ whiteSpace: "pre-wrap" }}>{item.message}</p>

              <hr style={{ border: "none", borderTop: "1px solid #eee" }} />

              <p style={{ fontSize: "13px", color: "#555" }}>
                Sent by: {item.sentBy}
              </p>

              <p style={{ fontSize: "13px", color: "#555" }}>
                Recipients: {item.recipientCount}
              </p>

              <p style={{ fontSize: "13px", color: "#555" }}>
                Date: {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
