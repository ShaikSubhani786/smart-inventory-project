import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import API_BASE_URL from "../config";
function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_products: 0,
    total_categories: 0,
    total_stock: 0,
    low_stock_products: 0,
    out_of_stock_products: 0,
  });

  const [user, setUser] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // -----------------------------
    // FETCH CURRENT USER
    // -----------------------------
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("access_token");
          navigate("/");
          return;
        }

        setUser(data);
      } catch (error) {
        console.error(error);

        setError("Unable to load user information");
      }
    };

    // -----------------------------
    // FETCH DASHBOARD
    // -----------------------------
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              data.detail ||
              "Failed to load dashboard"
          );

          return;
        }

        setStats(data);
      } catch (error) {
        console.error(error);

        setError("Unable to connect to backend");
      }
    };

    fetchCurrentUser();
    fetchDashboard();
  }, [navigate]);

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const handleLogout = () => {
    localStorage.removeItem("access_token");

    navigate("/");
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div>
          <h2>Smart Inventory</h2>

          {user && (
            <div className="sidebar-user">
              <p className="sidebar-username">
                {user.username}
              </p>

              <p className="sidebar-role">
                {user.role}
              </p>
            </div>
          )}

          <nav>
            <button
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                navigate("/products")
              }
            >
              Products
            </button>

            <button
              onClick={() =>
                navigate("/categories")
              }
            >
              Categories
            </button>

            <button
              onClick={() =>
                navigate("/suppliers")
              }
            >
              Suppliers
            </button>

            <button
              onClick={() =>
                navigate("/stock")
              }
            >
              Stock
            </button>

            <button
              onClick={() =>
                navigate("/sales")
              }
            >
              Sales
            </button>

            <button
              onClick={() =>
                navigate("/purchases")
              }
            >
              Purchases
            </button>

            <button
              onClick={() =>
                navigate("/reports")
              }
            >
              Reports
            </button>
          </nav>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>

            <p>
              Overview of your inventory system
            </p>
          </div>

          {user && (
            <div className="user-info">
              <h3>
                Welcome, {user.username}
              </h3>

              <p>
                <strong>Email:</strong>{" "}
                {user.email}
              </p>

              <p>
                <strong>Role:</strong>{" "}
                <span
                  className={`role-badge ${
                    user.role === "admin"
                      ? "admin-role"
                      : "user-role"
                  }`}
                >
                  {user.role}
                </span>
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {user.is_active
                  ? "Active"
                  : "Inactive"}
              </p>
            </div>
          )}
        </div>

        {/* ERROR */}

        {error && (
          <p className="dashboard-error">
            {error}
          </p>
        )}

        {/* DASHBOARD STATS */}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Products</h3>

            <p>{stats.total_products}</p>
          </div>

          <div className="stat-card">
            <h3>Total Categories</h3>

            <p>
              {stats.total_categories}
            </p>
          </div>

          <div className="stat-card">
            <h3>Total Stock</h3>

            <p>{stats.total_stock}</p>
          </div>

          <div className="stat-card">
            <h3>Low Stock</h3>

            <p>
              {stats.low_stock_products}
            </p>
          </div>

          <div className="stat-card">
            <h3>Out of Stock</h3>

            <p>
              {stats.out_of_stock_products}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
