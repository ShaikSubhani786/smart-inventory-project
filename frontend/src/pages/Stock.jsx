import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Stock.css";

import API_BASE_URL from "../config";
function Stock() {
  const navigate = useNavigate();

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");

  const isAdmin = user?.role === "admin";

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
  // FETCH STOCK HISTORY
  // -----------------------------

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/stock/history`,
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
            "Failed to load stock history"
        );
        return;
      }

      setTransactions(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Unable to connect to backend");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchHistory();
  }, []);

  // -----------------------------
  // STOCK IN / STOCK OUT
  // Admin only
  // -----------------------------

  const handleStockTransaction = async (type) => {
    if (!isAdmin) {
      setError(
        "Only admin can perform stock transactions"
      );
      setMessage("");
      return;
    }

    if (!productId || !quantity) {
      setError(
        "Product ID and quantity are required"
      );
      setMessage("");
      return;
    }

    if (Number(quantity) <= 0) {
      setError(
        "Quantity must be greater than 0"
      );
      setMessage("");
      return;
    }

    try {
      const endpoint =
        type === "in"
          ? `${API_BASE_URL}/api/v1/stock/in`
          : `${API_BASE_URL}/api/v1/stock/out`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: Number(productId),
          quantity: Number(quantity),
          remarks: remarks,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            data.detail ||
            "Stock transaction failed"
        );
        setMessage("");
        return;
      }

      setMessage(
        type === "in"
          ? "Stock added successfully"
          : "Stock removed successfully"
      );

      setError("");
      setProductId("");
      setQuantity("");
      setRemarks("");

      fetchHistory();
    } catch (error) {
      console.error(error);
      setError("Unable to connect to backend");
      setMessage("");
    }
  };

  return (
    <div className="stock-page">
      <div className="stock-header">
        <div>
          <h1>Stock Management</h1>

          <p>
            Manage stock in, stock out and
            transaction history
          </p>

          {user && (
            <p>
              Logged in as:{" "}
              <strong>{user.username}</strong>{" "}
              ({user.role})
            </p>
          )}
        </div>

        <button
          className="back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back to Dashboard
        </button>
      </div>

      {/* ADMIN ONLY STOCK TRANSACTION FORM */}

      {isAdmin && (
        <div className="stock-form-card">
          <h2>Stock Transaction</h2>

          <div className="stock-form">
            <input
              type="number"
              min="1"
              placeholder="Product ID"
              value={productId}
              onChange={(e) =>
                setProductId(e.target.value)
              }
            />

            <input
              type="number"
              min="1"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Remarks"
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
            />

            <div className="stock-buttons">
              <button
                className="stock-in-button"
                onClick={() =>
                  handleStockTransaction("in")
                }
              >
                Stock In
              </button>

              <button
                className="stock-out-button"
                onClick={() =>
                  handleStockTransaction("out")
                }
              >
                Stock Out
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <p className="stock-success">
          {message}
        </p>
      )}

      {error && (
        <p className="stock-error">
          {error}
        </p>
      )}

      <div className="stock-history">
        <h2>Transaction History</h2>

        {!isAdmin && user && (
          <p>
            You have view-only access to stock
            history.
          </p>
        )}

        <div className="stock-table-container">
          <table className="stock-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>ID</th>
                <th>Product ID</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Remarks</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    No stock transactions found
                  </td>
                </tr>
              ) : (
                transactions.map(
                  (transaction, index) => (
                    <tr key={transaction.id}>
                      <td>{index + 1}</td>

                      <td>{transaction.id}</td>

                      <td>
                        {transaction.product_id}
                      </td>

                      <td>
                        {
                          transaction.transaction_type
                        }
                      </td>

                      <td>
                        {transaction.quantity}
                      </td>

                      <td>
                        {transaction.remarks || "-"}
                      </td>

                      <td>
                        {transaction.created_at
                          ? new Date(
                              transaction.created_at
                            ).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Stock;
