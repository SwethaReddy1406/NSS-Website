import { apiFetch } from "../api.js";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    apiFetch("/api/auth/me", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          setAuthenticated(false);
          return null;
        }

        return response.json();
      })
      .then((data) => {
        if (!data) return;

        setAuthenticated(
          data.success && data.role === "ROLE_COORDINATOR"
        );
      })
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Checking authentication...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
