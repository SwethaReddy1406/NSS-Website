import { apiFetch } from "../../api.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "/api/contact";

function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadMessages() {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(API, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load contact messages.");
      }

      const data = await response.json();

      setMessages(
        [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function getCsrfToken() {
    const response = await apiFetch("/api/auth/csrf", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Unable to obtain security token.");
    }

    const data = await response.json();
    return data.token;
  }

  async function updateStatus(id, status) {
    setError("");
    setSuccess("");

    try {
      const csrf = await getCsrfToken();

      const response = await apiFetch(`${API}/${id}/status?status=${status}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": csrf,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update message status.");
      }

      setSuccess(`Message marked as ${status}.`);
      await loadMessages();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteMessage(id) {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const csrf = await getCsrfToken();

      const response = await apiFetch(`${API}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": csrf,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete message.");
      }

      setSuccess("Message deleted successfully.");
      await loadMessages();
    } catch (err) {
      setError(err.message);
    }
  }

  const newCount = messages.filter((m) => m.status === "NEW").length;
  const readCount = messages.filter((m) => m.status === "READ").length;
  const resolvedCount = messages.filter((m) => m.status === "RESOLVED").length;

  const filteredMessages =
    filter === "ALL"
      ? messages
      : messages.filter((m) => m.status === filter);

  const statusColors = {
    NEW: { background: "#fee2e2", color: "#991b1b" },
    READ: { background: "#fef3c7", color: "#92400e" },
    RESOLVED: { background: "#dcfce7", color: "#166534" },
  };

  const cardStyle = {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    marginBottom: "18px",
  };

  const buttonStyle = {
    padding: "9px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    marginRight: "8px",
    marginTop: "8px",
  };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1150px",
        margin: "auto",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
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

      <h1>Contact Messages</h1>
      <p>View and manage messages submitted through the Contact Us form.</p>

      {error && (
        <p style={{ color: "#b91c1c", background: "#fee2e2", padding: "12px" }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{ color: "#166534", background: "#dcfce7", padding: "12px" }}>
          {success}
        </p>
      )}

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "16px",
          margin: "24px 0",
        }}
      >
        {[
          { label: "Total Messages", value: messages.length, color: "#1d4ed8" },
          { label: "New", value: newCount, color: "#dc2626" },
          { label: "Read", value: readCount, color: "#d97706" },
          { label: "Resolved", value: resolvedCount, color: "#16a34a" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
            }}
          >
            <p style={{ margin: 0, color: "#64748b" }}>{stat.label}</p>
            <h2 style={{ margin: "10px 0 0", color: stat.color }}>
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Filters and refresh */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["ALL", "NEW", "READ", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: "9px 15px",
                borderRadius: "7px",
                border: "1px solid #cbd5e1",
                cursor: "pointer",
                background: filter === status ? "#153d67" : "#fff",
                color: filter === status ? "#fff" : "#334155",
                fontWeight: "600",
              }}
            >
              {status === "ALL" ? "All Messages" : status}
            </button>
          ))}
        </div>

        <button
          onClick={loadMessages}
          disabled={loading}
          style={{
            ...buttonStyle,
            background: "#153d67",
            color: "#fff",
          }}
        >
          {loading ? "Refreshing..." : "Refresh Messages"}
        </button>
      </div>

      {/* Messages */}
      {loading ? (
        <p>Loading messages...</p>
      ) : filteredMessages.length === 0 ? (
        <div style={cardStyle}>
          <p>
            {filter === "ALL"
              ? "No contact messages received yet."
              : `No ${filter.toLowerCase()} messages.`}
          </p>
        </div>
      ) : (
        filteredMessages.map((item) => (
          <div key={item.id} style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: "8px" }}>
                {item.subject}
              </h2>

              <span
                style={{
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  height: "fit-content",
                  ...statusColors[item.status],
                }}
              >
                {item.status}
              </span>
            </div>

            <p>
              <strong>From:</strong> {item.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${item.email}`}>{item.email}</a>
            </p>

            <p style={{ color: "#64748b", fontSize: "14px" }}>
              <strong>Date:</strong>{" "}
              {item.createdAt
                ? new Date(item.createdAt).toLocaleString()
                : "Date unavailable"}
            </p>

            <div
              style={{
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
                margin: "16px 0",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {item.message}
            </div>

            <div>
              {item.status === "NEW" && (
                <button
                  onClick={() => updateStatus(item.id, "READ")}
                  style={{
                    ...buttonStyle,
                    background: "#f59e0b",
                    color: "#fff",
                  }}
                >
                  Mark as Read
                </button>
              )}

              {item.status !== "RESOLVED" && (
                <button
                  onClick={() => updateStatus(item.id, "RESOLVED")}
                  style={{
                    ...buttonStyle,
                    background: "#16a34a",
                    color: "#fff",
                  }}
                >
                  Mark Resolved
                </button>
              )}

              {item.status === "RESOLVED" && (
                <button
                  onClick={() => updateStatus(item.id, "NEW")}
                  style={{
                    ...buttonStyle,
                    background: "#64748b",
                    color: "#fff",
                  }}
                >
                  Reopen
                </button>
              )}

              <button
                onClick={() => deleteMessage(item.id)}
                style={{
                  ...buttonStyle,
                  background: "#dc2626",
                  color: "#fff",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ContactMessages;
