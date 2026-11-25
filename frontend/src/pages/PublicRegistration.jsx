import { useState } from "react";
import { Link } from "react-router-dom";
import "./PublicRegistration.css";

const initialForm = {
  fullName: "",
  studentId: "",
  email: "",
  phone: "",
  department: "",
  academicYear: "",
  unitName: "",
};

function PublicRegistration() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const csrfResponse = await fetch("/api/auth/csrf", {
        credentials: "include",
      });

      if (!csrfResponse.ok) throw new Error("Unable to get security token.");

      const csrfData = await csrfResponse.json();

      const response = await fetch("/api/volunteers", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfData.token,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Registration failed. Please try again.");
      }

      setSuccess(
        "Registration submitted successfully! Your application is pending coordinator approval."
      );
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="public-registration-page">
      <header className="registration-header">
        <Link to="/" className="registration-brand">
          NSS · RGUKT BASAR
        </Link>
        <Link to="/" className="registration-home-link">Home</Link>
      </header>

      <main className="registration-container">
        <div className="registration-heading">
          <p className="registration-eyebrow">NOT ME, BUT YOU</p>
          <h1>Join National Service Scheme</h1>
          <p>Register as an NSS volunteer and be a part of positive change.</p>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          {error && <div className="registration-message error">{error}</div>}
          {success && <div className="registration-message success">{success}</div>}

          <div className="registration-grid">
            <label>
              Full Name *
              <input name="fullName" value={form.fullName} onChange={handleChange}
                required placeholder="Enter your full name" />
            </label>

            <label>
              Student ID *
              <input name="studentId" value={form.studentId} onChange={handleChange}
                required placeholder="Enter your student ID" />
            </label>

            <label>
              Email *
              <input name="email" type="email" value={form.email} onChange={handleChange}
                required placeholder="Enter your email" />
            </label>

            <label>
              Phone Number *
              <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                required placeholder="Enter phone number" />
            </label>

            <label>
              Department *
              <input name="department" value={form.department} onChange={handleChange}
                required placeholder="Your department" />
            </label>

            <label>
              Academic Year *
              <input name="academicYear" value={form.academicYear} onChange={handleChange}
                required placeholder="e.g. PUC-2 / E2 / E3" />
            </label>

            <label className="registration-full-width">
              NSS Unit *
              <input name="unitName" value={form.unitName} onChange={handleChange}
                required placeholder="Enter your NSS unit" />
            </label>
          </div>

          <button type="submit" className="registration-submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Registration"}
          </button>

          <p className="registration-note">
            Your registration will be reviewed by the NSS coordinator.
          </p>
        </form>

        <p className="registration-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </main>
    </div>
  );
}

export default PublicRegistration;
