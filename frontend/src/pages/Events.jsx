
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Events.css";

const API = "/api/events";

const emptyForm = {
  title: "",
  description: "",
  eventDate: "",
  location: "",
  organizer: "",
  status: "UPCOMING",
};

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // Fetch all events
  const loadEvents = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to fetch events.");
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Get CSRF token
  const getCsrfToken = async () => {
    const response = await fetch("/api/auth/csrf", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Could not obtain security token.");
    }

    const data = await response.json();
    return data.token;
  };

  // Open create form
  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  // Open edit form
  const openEditForm = (event) => {
    setForm({
      title: event.title || "",
      description: event.description || "",
      eventDate: event.eventDate || "",
      location: event.location || "",
      organizer: event.organizer || "",
      status: event.status || "UPCOMING",
    });

    setEditingId(event.id);
    setShowForm(true);
    setError("");
  };

  // Create or update event
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = await getCsrfToken();

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        eventDate: form.eventDate || null,
        location: form.location.trim(),
        organizer: form.organizer.trim(),
        status: form.status,
      };

      const url = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to save event.");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);

      await loadEvents();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete event
  const handleDelete = async (event) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );

    if (!confirmed) return;

    try {
      const token = await getCsrfToken();

      const response = await fetch(`${API}/${event.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete event.");
      }

      await loadEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  // Statistics
  const upcomingCount = events.filter(
    (event) => event.status === "UPCOMING"
  ).length;

  const completedCount = events.filter(
    (event) => event.status === "COMPLETED"
  ).length;

  const cancelledCount = events.filter(
    (event) => event.status === "CANCELLED"
  ).length;

  return (
    <div className="events-admin">

      {/* Header */}
      <div className="events-header">
        <div>
          <Link to="/dashboard" className="events-back">
            ← Back to Dashboard
          </Link>

          <h1>Events Management</h1>

          <p>
            Organize NSS events, schedules, venues and coordinators.
          </p>
        </div>

        <button
          className="event-add-btn"
          onClick={openCreateForm}
        >
          + Add Event
        </button>
      </div>

      {/* Statistics */}
      <div className="event-stat-grid">
        <div className="event-stat-card">
          <span>Total Events</span>
          <strong>{events.length}</strong>
        </div>

        <div className="event-stat-card">
          <span>Upcoming</span>
          <strong>{upcomingCount}</strong>
        </div>

        <div className="event-stat-card">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>

        <div className="event-stat-card">
          <span>Cancelled</span>
          <strong>{cancelledCount}</strong>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="event-error">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="event-form-card">
          <h2>
            {editingId ? "Edit Event" : "Create New Event"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="event-form-grid">

              <div className="event-field">
                <label>Event Title *</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={200}
                  required
                  placeholder="Enter event title"
                />
              </div>

              <div className="event-field">
                <label>Event Date</label>

                <input
                  type="date"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                />
              </div>

              <div className="event-field">
                <label>Location / Venue</label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter event venue"
                />
              </div>

              <div className="event-field">
                <label>Organizer</label>

                <input
                  type="text"
                  name="organizer"
                  value={form.organizer}
                  onChange={handleChange}
                  placeholder="Event organizer / coordinator"
                />
              </div>

              <div className="event-field">
                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="event-field event-full-width">
                <label>Description *</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  required
                  placeholder="Describe the NSS event..."
                />
              </div>

            </div>

            {/* Form buttons */}
            <div className="event-form-actions">
              <button
                type="button"
                className="event-cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="event-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Event"
                    : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events Table */}
      <div className="event-table-card">
        <div className="event-table-heading">
          <h2>All Events</h2>

          <button
            className="event-refresh-btn"
            onClick={loadEvents}
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <p className="event-loading">
            Loading events...
          </p>
        ) : events.length === 0 ? (
          <div className="event-empty">
            <h3>No events found</h3>

            <p>
              Create your first NSS event using the button above.
            </p>
          </div>
        ) : (
          <div className="event-table-scroll">
            <table className="event-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Organizer</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>#{event.id}</td>

                    <td>
                      <strong>{event.title}</strong>

                      <p className="event-description-preview">
                        {(event.description || "").slice(0, 90)}
                        {(event.description || "").length > 90
                          ? "..."
                          : ""}
                      </p>
                    </td>

                    <td>{event.eventDate || "—"}</td>

                    <td>{event.location || "—"}</td>

                    <td>{event.organizer || "—"}</td>

                    <td>
                      <span
                        className={`event-status status-${(
                          event.status || "upcoming"
                        ).toLowerCase()}`}
                      >
                        {event.status || "UPCOMING"}
                      </span>
                    </td>

                    <td>
                      <div className="event-actions">
                        <button
                          className="event-edit-btn"
                          onClick={() => openEditForm(event)}
                        >
                          Edit
                        </button>

                        <button
                          className="event-delete-btn"
                          onClick={() => handleDelete(event)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
