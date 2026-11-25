import { apiFetch } from "../api.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const csrfResponse = await apiFetch("/api/auth/csrf", {
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("Unable to initialize login.");
      }

      const csrfData = await csrfResponse.json();

      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfData.token,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password.");
      }

      const expectedRole =
        selectedRole === "coordinator"
          ? "ROLE_COORDINATOR"
          : "ROLE_VOLUNTEER";

      if (data.role !== expectedRole) {
        await apiFetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "X-XSRF-TOKEN": csrfData.token,
          },
        });

        throw new Error(
          `This account is not registered as a ${selectedRole}. Please select the correct login.`
        );
      }

      if (selectedRole === "coordinator") {
        navigate("/dashboard");
      } else {
        navigate("/volunteer-dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    setSelectedRole("");
    setEmail("");
    setPassword("");
    setError("");
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>NSS</div>

        {!selectedRole ? (
          <>
            <h1 style={styles.heading}>Welcome to NSS</h1>

            <p style={styles.subtitle}>
              RGUKT Basar
              <br />
              Choose your login type
            </p>

            <div style={styles.roleContainer}>
              <button
                style={styles.roleButton}
                onClick={() => setSelectedRole("volunteer")}
              >
                <span style={styles.roleIcon}>🎓</span>
                <span style={styles.roleTitle}>Volunteer Login</span>
                <span style={styles.roleDescription}>
                  Access your profile, attendance and notifications
                </span>
                <span style={styles.arrow}>→</span>
              </button>

              <button
                style={styles.roleButton}
                onClick={() => setSelectedRole("coordinator")}
              >
                <span style={styles.roleIcon}>🛡️</span>
                <span style={styles.roleTitle}>Coordinator Login</span>
                <span style={styles.roleDescription}>
                  Manage volunteers and NSS activities
                </span>
                <span style={styles.arrow}>→</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 style={styles.heading}>
              {selectedRole === "coordinator"
                ? "Coordinator Login"
                : "Volunteer Login"}
            </h1>

            <p style={styles.subtitle}>
              {selectedRole === "coordinator"
                ? "RGUKT Basar — Administration"
                : "RGUKT Basar — Volunteer Portal"}
            </p>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleLogin}>
              <label style={styles.label}>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={styles.input}
              />

              <label style={styles.label}>Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={styles.input}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.loginButton,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <button onClick={goBack} style={styles.backButton}>
              ← Change Login Type
            </button>
          </>
        )}

        <a href="/" style={styles.websiteLink}>
          ← Back to NSS Website
        </a>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #eaf2fb, #f5f8fc)",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "440px",
    padding: "36px",
    background: "white",
    borderRadius: "18px",
    boxShadow: "0 12px 40px rgba(20, 55, 90, 0.12)",
    boxSizing: "border-box",
  },

  logo: {
    width: "60px",
    height: "60px",
    margin: "0 auto 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    background: "#153d67",
    color: "white",
    fontWeight: "bold",
    fontSize: "22px",
  },

  heading: {
    textAlign: "center",
    color: "#153d67",
    marginBottom: "10px",
  },

  subtitle: {
    textAlign: "center",
    color: "#78879a",
    marginBottom: "28px",
    lineHeight: "1.6",
  },

  roleContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  roleButton: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    padding: "22px",
    background: "#ffffff",
    border: "1px solid #d9e2ec",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "0.2s",
  },

  roleIcon: {
    fontSize: "30px",
    marginBottom: "12px",
  },

  roleTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#153d67",
    marginBottom: "8px",
  },

  roleDescription: {
    fontSize: "13px",
    color: "#718096",
    lineHeight: "1.5",
    paddingRight: "20px",
  },

  arrow: {
    position: "absolute",
    right: "20px",
    top: "50%",
    fontSize: "22px",
    color: "#153d67",
    transform: "translateY(-50%)",
  },

  label: {
    display: "block",
    margin: "15px 0 8px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#34465b",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    border: "1px solid #d9e2ec",
    borderRadius: "9px",
    fontSize: "15px",
  },

  loginButton: {
    width: "100%",
    padding: "14px",
    marginTop: "24px",
    background: "#153d67",
    color: "white",
    border: "none",
    borderRadius: "9px",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
  },

  error: {
    background: "#fff0f0",
    color: "#b42318",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "14px",
  },

  backButton: {
    display: "block",
    width: "100%",
    marginTop: "18px",
    padding: "10px",
    background: "transparent",
    border: "none",
    color: "#28699b",
    cursor: "pointer",
    fontSize: "14px",
  },

  websiteLink: {
    display: "block",
    textAlign: "center",
    marginTop: "22px",
    color: "#28699b",
    textDecoration: "none",
    fontSize: "14px",
  },
};

export default Login;
