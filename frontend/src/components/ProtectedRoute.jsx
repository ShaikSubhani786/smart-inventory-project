import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import API_BASE_URL from "../config";
function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem("access_token");
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        setAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error("Authentication check failed:", error);

        localStorage.removeItem("access_token");
        setAuthenticated(false);
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
