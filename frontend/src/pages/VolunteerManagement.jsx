import { apiFetch } from "../api.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./VolunteerManagement.css";

const API = "/api/volunteers";

const emptyForm = {
  fullName: "",
  studentId: "",
  email: "",
  phone: "",
  department: "",
  academicYear: "",
  unitName: "",
};

function VolunteerManagement() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [form, setForm] = useState(emptyForm);

  // Activation link states
  const [activationLink, setActivationLink] = useState("");
  const [activationVolunteerId, setActivationVolunteerId] = useState(null);
  const [activationLoadingId, setActivationLoadingId] = useState(null);

  // Load volunteers
  const loadVolunteers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(API, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load volunteers.");
      }

      const data = await response.json();
      setVolunteers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  // Get CSRF token
  const getCsrfToken = async () => {
    const response = await apiFetch("/api/auth/csrf", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Could not obtain security token.");
    }

    const data = await response.json();
    return data.token;
  };

  // Form input handler
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Open create form
  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // Open edit form
  const openEditForm = (volunteer) => {
    setForm({
      fullName: volunteer.fullName || "",
      studentId: volunteer.studentId || "",
      email: volunteer.email || "",
      phone: volunteer.phone || "",
      department: volunteer.department || "",
      academicYear: volunteer.academicYear || "",
      unitName: volunteer.unitName || "",
    });

    setEditingId(volunteer.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // Create or update volunteer
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = await getCsrfToken();

      const payload = {
        fullName: form.fullName.trim(),
        studentId: form.studentId.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        department: form.department.trim(),
        academicYear: form.academicYear.trim(),
        unitName: form.unitName.trim(),
      };

      const url = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? "PUT" : "POST";

      const response = await apiFetch(url, {
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
        throw new Error(message || "Failed to save volunteer.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      setSuccess(
        editingId
          ? "Volunteer updated successfully."
          : "Volunteer added successfully."
      );

      await loadVolunteers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Approve or reject registration
  const handleStatusChange = async (volunteer, status) => {
    const action = status === "ACTIVE" ? "approve" : "reject";

    if (
      !window.confirm(
        `Are you sure you want to ${action} ${volunteer.fullName}?`
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");
    setActivationLink("");

    try {
      const token = await getCsrfToken();

      const response = await apiFetch(
        `${API}/${volunteer.id}/status?status=${status}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "X-XSRF-TOKEN": token,
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Failed to ${action} volunteer.`);
      }

      setSuccess(`Volunteer ${action}d successfully.`);
      await loadVolunteers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Generate volunteer activation link
  const handleGenerateActivation = async (volunteer) => {
    setError("");
    setSuccess("");
    setActivationLink("");
    setActivationVolunteerId(null);
    setActivationLoadingId(volunteer.id);

    try {
      const token = await getCsrfToken();

      const response = await apiFetch(
        `/api/volunteer-activation/${volunteer.id}/generate`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "X-XSRF-TOKEN": token,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate activation link."
        );
      }

      setActivationLink(data.activationUrl);
      setActivationVolunteerId(volunteer.id);
      setSuccess(
        `Activation link generated for ${volunteer.fullName}.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActivationLoadingId(null);
    }
  };

  // Copy activation link
  const handleCopyActivationLink = async () => {
    try {
      await navigator.clipboard.writeText(activationLink);
      setSuccess("Activation link copied to clipboard!");
    } catch {
      setError("Unable to copy link. Please copy it manually.");
    }
  };

  // Delete volunteer
  const handleDelete = async (volunteer) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${volunteer.fullName}?`
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const token = await getCsrfToken();

      const response = await apiFetch(`${API}/${volunteer.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": token,
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to delete volunteer.");
      }

      setSuccess("Volunteer deleted successfully.");
      setActivationLink("");
      await loadVolunteers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Search and filter
  const filteredVolunteers = volunteers.filter((volunteer) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (volunteer.fullName || "").toLowerCase().includes(searchText) ||
      (volunteer.studentId || "").toLowerCase().includes(searchText) ||
      (volunteer.email || "").toLowerCase().includes(searchText) ||
      (volunteer.unitName || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      volunteer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = volunteers.filter(
    (v) => v.status === "PENDING"
  ).length;

  const activeCount = volunteers.filter(
    (v) => v.status === "ACTIVE"
  ).length;

  const rejectedCount = volunteers.filter(
    (v) => v.status === "REJECTED"
  ).length;

  return (
    <div className="volunteer-management">

      {/* Header */}
      <div className="volunteer-management-header">
        <div>
          <Link to="/dashboard" className="volunteer-management-back">
            ← Back to Dashboard
          </Link>

          <h1>Volunteer Management</h1>

          <p>
            Manage NSS volunteers, registrations and approval requests.
          </p>
        </div>

        <button
          className="volunteer-add-btn"
          onClick={openCreateForm}
        >
          + Add Volunteer
        </button>
      </div>

      {/* Statistics */}
      <div className="volunteer-management-stats">
        <div className="volunteer-stat-card">
          <span>Total Volunteers</span>
          <strong>{volunteers.length}</strong>
        </div>

        <div className="volunteer-stat-card">
          <span>Pending Approval</span>
          <strong>{pendingCount}</strong>
        </div>

        <div className="volunteer-stat-card">
          <span>Active Volunteers</span>
          <strong>{activeCount}</strong>
        </div>

        <div className="volunteer-stat-card">
          <span>Rejected</span>
          <strong>{rejectedCount}</strong>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="volunteer-management-error">
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            background: "#e8f7ec",
            color: "#176b35",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {success}
        </div>
      )}

      {/* Activation link panel */}
      {activationLink && (
        <div
          style={{
            padding: "18px",
            marginBottom: "20px",
            border: "1px solid #b7dfc2",
            borderRadius: "10px",
            background: "#f2fbf4",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            Volunteer Account Activation Link
          </h3>

          <p>
            Share this link with the volunteer. They can open it
            and create their own password.
          </p>

          <input
            type="text"
            readOnly
            value={activationLink}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={handleCopyActivationLink}
            style={{
              padding: "10px 18px",
              cursor: "pointer",
            }}
          >
            📋 Copy Activation Link
          </button>

          <button
            onClick={() => {
              setActivationLink("");
              setActivationVolunteerId(null);
            }}
            style={{
              padding: "10px 18px",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="volunteer-form-card">
          <h2>{editingId ? "Edit Volunteer" : "Add New Volunteer"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="volunteer-form-grid">

              <div className="volunteer-field">
                <label>Full Name *</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  maxLength={120}
                  placeholder="Enter full name"
                />
              </div>

              <div className="volunteer-field">
                <label>Student ID *</label>
                <input
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  disabled={Boolean(editingId)}
                  placeholder="Enter student ID"
                />
              </div>

              <div className="volunteer-field">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  placeholder="Enter email address"
                />
              </div>

              <div className="volunteer-field">
                <label>Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={20}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="volunteer-field">
                <label>Department</label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Example: CSE"
                />
              </div>

              <div className="volunteer-field">
                <label>Academic Year</label>
                <input
                  name="academicYear"
                  value={form.academicYear}
                  onChange={handleChange}
                  placeholder="Example: P2"
                />
              </div>

              <div className="volunteer-field volunteer-full-width">
                <label>NSS Unit</label>
                <input
                  name="unitName"
                  value={form.unitName}
                  onChange={handleChange}
                  placeholder="Example: NSS Unit 1"
                />
              </div>

            </div>

            <div className="volunteer-form-actions">
              <button
                type="button"
                className="volunteer-cancel-btn"
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
                className="volunteer-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Volunteer"
                    : "Add Volunteer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Volunteers table */}
      <div className="volunteer-table-card">

        <div className="volunteer-table-heading">
          <h2>All Volunteers</h2>

          <button
            className="volunteer-refresh-btn"
            onClick={loadVolunteers}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Search and filters */}
        <div className="volunteer-filters">
          <input
            type="search"
            placeholder="Search name, ID, email or unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="volunteer-loading">
            Loading volunteers...
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="volunteer-empty">
            <h3>No volunteers found</h3>
            <p>Try changing your search or add a volunteer.</p>
          </div>
        ) : (
          <div className="volunteer-table-scroll">
            <table className="volunteer-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Unit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredVolunteers.map((volunteer) => (
                  <tr key={volunteer.id}>
                    <td>#{volunteer.id}</td>
                    <td>{volunteer.studentId}</td>
                    <td>
                      <strong>{volunteer.fullName}</strong>
                    </td>
                    <td>{volunteer.email}</td>
                    <td>{volunteer.phone || "—"}</td>
                    <td>{volunteer.unitName || "—"}</td>

                    <td>
                      <span
                        className={`volunteer-status status-${(
                          volunteer.status || "PENDING"
                        ).toLowerCase()}`}
                      >
                        {volunteer.status || "PENDING"}
                      </span>
                    </td>

                    <td>
                      <div className="volunteer-actions">

                        {volunteer.status === "PENDING" && (
                          <>
                            <button
                              className="volunteer-approve-btn"
                              onClick={() =>
                                handleStatusChange(volunteer, "ACTIVE")
                              }
                            >
                              Approve
                            </button>

                            <button
                              className="volunteer-reject-btn"
                              onClick={() =>
                                handleStatusChange(volunteer, "REJECTED")
                              }
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {volunteer.status === "ACTIVE" && (
                          <button
                            onClick={() =>
                              handleGenerateActivation(volunteer)
                            }
                            disabled={
                              activationLoadingId === volunteer.id
                            }
                            style={{
                              padding: "7px 10px",
                              cursor: "pointer",
                              background: "#2563eb",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                            }}
                          >
                            {activationLoadingId === volunteer.id
                              ? "Generating..."
                              : "🔑 Activation Link"}
                          </button>
                        )}

                        <button
                          className="volunteer-edit-btn"
                          onClick={() => openEditForm(volunteer)}
                        >
                          Edit
                        </button>

                        <button
                          className="volunteer-delete-btn"
                          onClick={() => handleDelete(volunteer)}
                        >
                          Delete
                        </button>
                      </div>

                      {activationVolunteerId === volunteer.id &&
                        activationLink && (
                          <div style={{ marginTop: "8px" }}>
                            <small>
                              Activation link generated above.
                            </small>
                          </div>
                        )}
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

export default VolunteerManagement;
