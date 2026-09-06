import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Reports.css";

import API_BASE_URL from "../config";
function Reports() {
  const navigate = useNavigate();

  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [user, setUser] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access_token");

  // -------------------------------------------------
  // FETCH CURRENT USER
  // -------------------------------------------------

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

  // -------------------------------------------------
  // FETCH LOW STOCK REPORT
  // -------------------------------------------------

  const fetchLowStockReport = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/reports/low-stock`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/");
          return;
        }

        setError(
          data.message ||
            data.detail ||
            "Failed to load low-stock report"
        );

        setLoading(false);
        return;
      }

      setLowStockProducts(data);
      setError("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to backend");
      setLoading(false);
    }
  };

  // -------------------------------------------------
  // LOAD PAGE
  // -------------------------------------------------

  useEffect(() => {
    fetchCurrentUser();
    fetchLowStockReport();
  }, []);

  // -------------------------------------------------
  // PAGE
  // -------------------------------------------------

  return (
    <div className="reports-page">

      {/* HEADER */}

      <div className="reports-header">
        <div>
          <h1>Reports</h1>

          <p>
            View inventory reports and low-stock products
          </p>

          {user && (
            <p className="reports-user-info">
              Logged in as:{" "}
              <strong>{user.username}</strong>{" "}
              ({user.role})
            </p>
          )}
        </div>

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      {/* REPORT CARD */}

      <div className="report-card">

        <div className="report-title-row">
          <div>
            <h2>Low Stock Report</h2>

            <p>
              Products that have reached or fallen below
              their minimum stock level.
            </p>
          </div>

          <button
            type="button"
            className="refresh-report-button"
            onClick={fetchLowStockReport}
          >
            Refresh
          </button>
        </div>

        {/* SUMMARY */}

        <div className="report-summary">
          <div className="report-summary-card">
            <span>Low Stock Products</span>

            <strong>
              {lowStockProducts.length}
            </strong>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <p className="reports-error">
            {typeof error === "string"
              ? error
              : "Something went wrong"}
          </p>
        )}

        {/* REPORT TABLE */}

        {loading ? (
          <p className="reports-loading">
            Loading report...
          </p>
        ) : (
          <div className="reports-table-container">

            <table className="reports-table">

              <thead>
                <tr>
                  <th>S.No</th>
                  <th>ID</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Current Stock</th>
                  <th>Minimum Stock</th>
                  <th>Category ID</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {lowStockProducts.length === 0 ? (
                  <tr>
                    <td colSpan="9">
                      No low-stock products found
                    </td>
                  </tr>
                ) : (
                  lowStockProducts.map(
                    (product, index) => (
                      <tr key={product.id}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {product.id}
                        </td>

                        <td>
                          <div className="report-product">

                            {product.image_url && (
                              <img
                                src={
                                  product.image_url.startsWith(
                                    "http"
                                  )
                                    ? product.image_url
                                    : `${API_BASE_URL}${product.image_url}`
                                }
                                alt={product.name}
                              />
                            )}

                            <div>
                              <strong>
                                {product.name}
                              </strong>

                              <small>
                                {product.description ||
                                  "No description"}
                              </small>
                            </div>

                          </div>
                        </td>

                        <td>
                          {product.sku}
                        </td>

                        <td>
                          ₹
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </td>

                        <td>
                          {product.quantity}
                        </td>

                        <td>
                          {product.minimum_stock}
                        </td>

                        <td>
                          {product.category_id}
                        </td>

                        <td>
                          <span className="low-stock-badge">
                            Low Stock
                          </span>
                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
}

export default Reports;
