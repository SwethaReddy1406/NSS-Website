import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function ActivateVolunteer() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function getCsrfToken() {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="));

    return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Invalid activation link. Token is missing.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const csrfResponse = await fetch("/api/auth/csrf", {
        method: "GET",
        credentials: "include",
      });

      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.token || getCsrfToken();

      const response = await fetch("/api/volunteer-activation/activate", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-XSRF-TOKEN": csrfToken } : {}),
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Activation failed.");
      }

      setSuccess(true);
      setMessage(data.message || "Account activated successfully!");
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #e8f5e9, #e3f2fd)",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "white",
        padding: "35px",
        borderRadius: "15px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ textAlign: "center", color: "#1b5e20" }}>
          NSS Volunteer
        </h1>

        <h2 style={{ textAlign: "center" }}>
          Account Activation
        </h2>

        {success ? (
          <>
            <p style={{ color: "green", textAlign: "center" }}>
              {message}
            </p>

            <Link
              to="/login"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "20px",
                background: "#2e7d32",
                color: "white",
                padding: "12px",
                borderRadius: "8px",
                textDecoration: "none"
              }}
            >
              Go to Login
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Set Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (minimum 8 characters)"
              required
              minLength={8}
              style={{
                width: "100%",
                padding: "12px",
                margin: "10px 0 18px",
                boxSizing: "border-box"
              }}
            />

            <label>Confirm Password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
              style={{
                width: "100%",
                padding: "12px",
                margin: "10px 0 18px",
                boxSizing: "border-box"
              }}
            />

            {message && (
              <p style={{ color: "red", textAlign: "center" }}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              {loading ? "Activating..." : "Activate Account"}
            </button>
          </form>
        )}

        {!success && (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Already activated? <Link to="/login">Login</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default ActivateVolunteer;
