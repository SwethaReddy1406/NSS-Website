import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UnitsManagement.css";

const API = "/api/units";

function UnitsManagement() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    unitName: "",
    unitNumber: "",
    coordinatorName: "",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);

  // Fetch units from backend
  const loadUnits = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load units.");
      }

      const data = await response.json();
      setUnits(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

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

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (unit) => {
    setForm({
      unitName: unit.unitName || "",
      unitNumber: unit.unitNumber ?? "",
      coordinatorName: unit.coordinatorName || "",
      description: unit.description || "",
    });

    setEditingId(unit.id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = await getCsrfToken();

      const payload = {
        unitName: form.unitName.trim(),
        unitNumber: form.unitNumber === "" ? null : Number(form.unitNumber),
        coordinatorName: form.coordinatorName.trim(),
        description: form.description.trim(),
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
        throw new Error(
          message || "Failed to save unit. Check the entered details."
        );
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadUnits();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (unit) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${unit.unitName}?`
    );

    if (!confirmed) return;

    setError("");

    try {
      const token = await getCsrfToken();

      const response = await fetch(`${API}/${unit.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": token,
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to delete unit.");
      }

      await loadUnits();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="units-management">

      {/* Page header */}
      <div className="units-management-header">
        <div>
          <Link to="/dashboard" className="units-management-back">
            ← Back to Dashboard
          </Link>

          <h1>Units Management</h1>

          <p>
            Manage NSS units, unit coordinators and unit information.
          </p>
        </div>

        <button
          className="unit-add-btn"
          onClick={openCreateForm}
        >
          + Add Unit
        </button>
      </div>

      {/* Statistics */}
      <div className="unit-management-stats">
        <div className="unit-management-stat">
          <span>Total Units</span>
          <strong>{units.length}</strong>
        </div>

        <div className="unit-management-stat">
          <span>Units Assigned</span>
          <strong>
            {units.filter((unit) => unit.coordinatorName).length}
          </strong>
        </div>

        <div className="unit-management-stat">
          <span>Without Coordinator</span>
          <strong>
            {units.filter((unit) => !unit.coordinatorName).length}
          </strong>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="unit-management-error">
          {error}
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <div className="unit-management-form-card">
          <h2>{editingId ? "Edit Unit" : "Add New Unit"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="unit-management-form-grid">

              <div className="unit-management-field">
                <label>Unit Name *</label>

                <input
                  type="text"
                  name="unitName"
                  value={form.unitName}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  placeholder="Example: NSS Unit 1"
                />
              </div>

              <div className="unit-management-field">
                <label>Unit Number</label>

                <input
                  type="number"
                  name="unitNumber"
                  value={form.unitNumber}
                  onChange={handleChange}
                  min="1"
                  placeholder="Example: 1"
                />
              </div>

              <div className="unit-management-field unit-management-full">
                <label>Coordinator Name</label>

                <input
                  type="text"
                  name="coordinatorName"
                  value={form.coordinatorName}
                  onChange={handleChange}
                  placeholder="Enter coordinator name"
                />
              </div>

              <div className="unit-management-field unit-management-full">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe this NSS unit and its activities..."
                />
              </div>

            </div>

            <div className="unit-management-form-actions">
              <button
                type="button"
                className="unit-management-cancel"
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
                className="unit-management-save"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Unit"
                    : "Create Unit"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Units table */}
      <div className="unit-management-table-card">
        <div className="unit-management-table-heading">
          <h2>All NSS Units</h2>

          <button
            className="unit-management-refresh"
            onClick={loadUnits}
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="unit-management-loading">
            Loading units...
          </div>
        ) : units.length === 0 ? (
          <div className="unit-management-empty">
            <h3>No units found</h3>
            <p>Add your first NSS unit to get started.</p>
          </div>
        ) : (
          <div className="unit-management-table-scroll">
            <table className="unit-management-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Unit Number</th>
                  <th>Unit Name</th>
                  <th>Coordinator</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {units.map((unit) => (
                  <tr key={unit.id}>
                    <td>#{unit.id}</td>

                    <td>{unit.unitNumber ?? "—"}</td>

                    <td>
                      <strong>{unit.unitName}</strong>
                    </td>

                    <td>{unit.coordinatorName || "Not assigned"}</td>

                    <td>
                      <span className="unit-management-description">
                        {unit.description || "—"}
                      </span>
                    </td>

                    <td>
                      <div className="unit-management-actions">
                        <button
                          className="unit-management-edit"
                          onClick={() => openEditForm(unit)}
                        >
                          Edit
                        </button>

                        <button
                          className="unit-management-delete"
                          onClick={() => handleDelete(unit)}
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

export default UnitsManagement;
