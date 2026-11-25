import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Activities.css";

const API = "/api/activities";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const emptyForm = {
    title: "",
    description: "",
    activityDate: "",
    location: "",
    images: "",
    status: "DRAFT",
  };

  const [form, setForm] = useState(emptyForm);

  // Fetch all activities including drafts
  const loadActivities = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/admin`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to fetch activities.");
      }

      const data = await response.json();
      setActivities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  // Handle text, date, select and textarea inputs
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

  // Upload selected images to backend
  const uploadActivityImages = async (files, token) => {
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API}/upload-image`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": token,
        },
        body: formData,
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Failed to upload ${file.name}`);
      }

      const imageUrl = await response.text();
      uploadedUrls.push(imageUrl.trim());
    }

    return uploadedUrls;
  };

  // Open create form
  const openCreateForm = () => {
    setForm({ ...emptyForm });
    setSelectedImages([]);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  // Open edit form
  const openEditForm = (activity) => {
    setForm({
      title: activity.title || "",
      description: activity.description || "",
      activityDate: activity.activityDate || "",
      location: activity.location || "",
      images: (activity.images || []).join(", "),
      status: activity.status || "DRAFT",
    });

    setSelectedImages([]);
    setEditingId(activity.id);
    setShowForm(true);
    setError("");
  };

  // Handle photo selection
  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = [];

    files.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`${file.name}: Only JPG, PNG and WEBP are allowed.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name}: Image must be smaller than 5 MB.`);
        return;
      }

      validFiles.push(file);
    });

    setSelectedImages((previous) => [...previous, ...validFiles]);

    // Allow selecting the same file again
    e.target.value = "";
  };

  // Remove a selected photo
  const removeSelectedImage = (index) => {
    setSelectedImages((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  // Create or update an activity
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = await getCsrfToken();

      // Upload new photos first
      const uploadedUrls = await uploadActivityImages(
        selectedImages,
        token
      );

      // Keep existing image paths
      const existingImages = form.images
        .split(",")
        .map((image) => image.trim())
        .filter((image) => image !== "");

      // Prepare activity data
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        activityDate: form.activityDate || null,
        location: form.location.trim(),
        images: [...existingImages, ...uploadedUrls],
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
        throw new Error(message || "Failed to save activity.");
      }

      // Reset form after successful save
      setShowForm(false);
      setForm({ ...emptyForm });
      setSelectedImages([]);
      setEditingId(null);

      await loadActivities();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete activity
  const handleDelete = async (activity) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${activity.title}"?`
    );

    if (!confirmed) return;

    try {
      const token = await getCsrfToken();

      const response = await fetch(`${API}/${activity.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete activity.");
      }

      await loadActivities();
    } catch (err) {
      setError(err.message);
    }
  };

  // Statistics
  const publishedCount = activities.filter(
    (activity) => activity.status === "PUBLISHED"
  ).length;

  const draftCount = activities.filter(
    (activity) => activity.status === "DRAFT"
  ).length;

  const archivedCount = activities.filter(
    (activity) => activity.status === "ARCHIVED"
  ).length;

  return (
    <div className="activities-admin">

      {/* Header */}
      <div className="activities-header">
        <div>
          <Link to="/dashboard" className="activities-back">
            ← Back to Dashboard
          </Link>

          <h1>Activities Management</h1>
          <p>Manage NSS activities, descriptions and publication status.</p>
        </div>

        <button
          className="activity-add-btn"
          onClick={openCreateForm}
        >
          + Add Activity
        </button>
      </div>

      {/* Statistics */}
      <div className="activity-stat-grid">
        <div className="activity-stat-card">
          <span>Total Activities</span>
          <strong>{activities.length}</strong>
        </div>

        <div className="activity-stat-card">
          <span>Published</span>
          <strong>{publishedCount}</strong>
        </div>

        <div className="activity-stat-card">
          <span>Drafts</span>
          <strong>{draftCount}</strong>
        </div>

        <div className="activity-stat-card">
          <span>Archived</span>
          <strong>{archivedCount}</strong>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="activity-error">
          {error}
        </div>
      )}

      {/* Activity form */}
      {showForm && (
        <div className="activity-form-card">
          <h2>{editingId ? "Edit Activity" : "Create New Activity"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="activity-form-grid">

              {/* Title */}
              <div className="activity-field">
                <label>Activity Title *</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={200}
                  required
                  placeholder="Enter activity title"
                />
              </div>

              {/* Date */}
              <div className="activity-field">
                <label>Activity Date</label>

                <input
                  type="date"
                  name="activityDate"
                  value={form.activityDate}
                  onChange={handleChange}
                />
              </div>

              {/* Location */}
              <div className="activity-field">
                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                />
              </div>

              {/* Status */}
              <div className="activity-field">
                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              {/* Description */}
              <div className="activity-field activity-full-width">
                <label>Description *</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  required
                  placeholder="Describe the NSS activity..."
                />
              </div>

              {/* Existing images */}
              <div className="activity-field activity-full-width">
                <label>Existing Image Paths</label>

                <textarea
                  name="images"
                  value={form.images}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Existing image paths, separated by commas"
                />

                <small>
                  When editing, existing images are preserved.
                  You may add new photos below.
                </small>
              </div>

              {/* Image upload */}
              <div className="activity-field activity-full-width">
                <label>Upload Activity Photos</label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageSelection}
                />

                <small>
                  JPG, PNG or WEBP. Maximum 5 MB per photo.
                </small>

                {/* Selected photos */}
                {selectedImages.length > 0 && (
                  <div className="selected-image-list">
                    <h4>Selected Photos ({selectedImages.length})</h4>

                    <ul>
                      {selectedImages.map((file, index) => (
                        <li key={`${file.name}-${index}`}>
                          <span>
                            {file.name} (
                            {(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>

                          <button
                            type="button"
                            onClick={() => removeSelectedImage(index)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>

            {/* Form buttons */}
            <div className="activity-form-actions">
              <button
                type="button"
                className="activity-cancel-btn"
                disabled={saving}
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm({ ...emptyForm });
                  setSelectedImages([]);
                  setError("");
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="activity-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Uploading & Saving..."
                  : editingId
                    ? "Update Activity"
                    : "Create Activity"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Activities table */}
      <div className="activity-table-card">
        <div className="activity-table-heading">
          <h2>All Activities</h2>

          <button
            className="activity-refresh-btn"
            onClick={loadActivities}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <p className="activity-loading">
            Loading activities...
          </p>
        ) : activities.length === 0 ? (
          <div className="activity-empty">
            <h3>No activities found</h3>
            <p>Create your first NSS activity using the button above.</p>
          </div>
        ) : (
          <div className="activity-table-scroll">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Activity</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td>#{activity.id}</td>

                    <td>
                      <strong>{activity.title}</strong>

                      <p className="activity-description-preview">
                        {(activity.description || "").slice(0, 90)}
                        {(activity.description || "").length > 90
                          ? "..."
                          : ""}
                      </p>
                    </td>

                    <td>{activity.activityDate || "—"}</td>

                    <td>{activity.location || "—"}</td>

                    <td>
                      <span
                        className={`activity-status status-${(
                          activity.status || "draft"
                        ).toLowerCase()}`}
                      >
                        {activity.status || "DRAFT"}
                      </span>
                    </td>

                    <td>
                      <div className="activity-actions">
                        <button
                          className="activity-edit-btn"
                          onClick={() => openEditForm(activity)}
                        >
                          Edit
                        </button>

                        <button
                          className="activity-delete-btn"
                          onClick={() => handleDelete(activity)}
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

export default Activities;
