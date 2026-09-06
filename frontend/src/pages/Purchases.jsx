import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Purchases.css";

import API_BASE_URL from "../config";
function Purchases() {
  const navigate = useNavigate();

  // PURCHASE DATA
  const [purchases, setPurchases] = useState([]);

  // CURRENT USER
  const [user, setUser] = useState(null);

  // PURCHASE FORM
  const [supplierId, setSupplierId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");

  // MESSAGES
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");

  // Admin check
  const isAdmin = user?.role === "admin";

  // -------------------------------------------------
  // FETCH CURRENT LOGGED-IN USER
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
  // FETCH ALL PURCHASES
  // -------------------------------------------------

  const fetchPurchases = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/purchases/`,
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
            "Failed to load purchases"
        );

        return;
      }

      setPurchases(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Unable to connect to backend");
    }
  };

  // -------------------------------------------------
  // LOAD PAGE DATA
  // -------------------------------------------------

  useEffect(() => {
    fetchCurrentUser();
    fetchPurchases();
  }, []);

  // -------------------------------------------------
  // CREATE PURCHASE
  // ADMIN ONLY
  // -------------------------------------------------

  const handleCreatePurchase = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Extra frontend protection
    if (!isAdmin) {
      setError("Only admin can add purchases");
      return;
    }

    // Validation
    if (
      !supplierId ||
      !productId ||
      !quantity ||
      !purchasePrice
    ) {
      setError("All fields are required");
      return;
    }

    if (Number(supplierId) <= 0) {
      setError("Supplier ID must be greater than 0");
      return;
    }

    if (Number(productId) <= 0) {
      setError("Product ID must be greater than 0");
      return;
    }

    if (Number(quantity) <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (Number(purchasePrice) <= 0) {
      setError("Purchase price must be greater than 0");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/purchases/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            supplier_id: Number(supplierId),
            product_id: Number(productId),
            quantity: Number(quantity),
            purchase_price: Number(purchasePrice),
          }),
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
            "Failed to create purchase"
        );

        return;
      }

      // Clear form
      setSupplierId("");
      setProductId("");
      setQuantity("");
      setPurchasePrice("");

      setMessage("Purchase created successfully");
      setError("");

      // Refresh purchase history
      fetchPurchases();
    } catch (error) {
      console.error(error);

      setError("Unable to connect to backend");
      setMessage("");
    }
  };

  // -------------------------------------------------
  // FORMAT DATE
  // -------------------------------------------------

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();
  };

  // -------------------------------------------------
  // PAGE
  // -------------------------------------------------

  return (
    <div className="purchases-page">

      {/* HEADER */}

      <div className="purchases-header">
        <div>
          <h1>Purchases</h1>

          <p>
            Manage inventory purchases and purchase history
          </p>

          {user && (
            <p className="purchase-user-info">
              Logged in as:{" "}
              <strong>{user.username}</strong>{" "}
              <span>
                ({user.role})
              </span>
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

      {/* SUCCESS MESSAGE */}

      {message && (
        <p className="purchases-success">
          {message}
        </p>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <p className="purchases-error">
          {typeof error === "string"
            ? error
            : "Something went wrong"}
        </p>
      )}

      {/* ADMIN ONLY PURCHASE FORM */}

      {isAdmin && (
        <div className="purchase-form-card">
          <h2>Add Purchase</h2>

          <p>
            Add purchased stock from a supplier.
          </p>

          <form
            className="purchase-form"
            onSubmit={handleCreatePurchase}
          >
            {/* SUPPLIER ID */}

            <div className="purchase-form-group">
              <label>Supplier ID</label>

              <input
                type="number"
                min="1"
                placeholder="Enter Supplier ID"
                value={supplierId}
                onChange={(e) =>
                  setSupplierId(e.target.value)
                }
                required
              />
            </div>

            {/* PRODUCT ID */}

            <div className="purchase-form-group">
              <label>Product ID</label>

              <input
                type="number"
                min="1"
                placeholder="Enter Product ID"
                value={productId}
                onChange={(e) =>
                  setProductId(e.target.value)
                }
                required
              />
            </div>

            {/* QUANTITY */}

            <div className="purchase-form-group">
              <label>Quantity</label>

              <input
                type="number"
                min="1"
                placeholder="Enter Quantity"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                required
              />
            </div>

            {/* PURCHASE PRICE */}

            <div className="purchase-form-group">
              <label>Purchase Price</label>

              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Enter Purchase Price"
                value={purchasePrice}
                onChange={(e) =>
                  setPurchasePrice(e.target.value)
                }
                required
              />
            </div>

            <div className="purchase-form-actions">
              <button
                type="submit"
                className="add-purchase-button"
              >
                Add Purchase
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STAFF VIEW-ONLY MESSAGE */}

      {!isAdmin && user && (
        <div className="purchase-view-only">
          <p>
            You have view-only access to purchases.
          </p>
        </div>
      )}

      {/* PURCHASE HISTORY */}

      <div className="purchases-history">
        <div className="purchases-history-header">
          <h2>Purchase History</h2>

          <p>
            Total Purchases:{" "}
            <strong>{purchases.length}</strong>
          </p>
        </div>

        <div className="purchases-table-container">
          <table className="purchases-table">

            <thead>
              <tr>
                <th>S.No</th>
                <th>Purchase ID</th>
                <th>Supplier ID</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Purchase Price</th>
                <th>Total Amount</th>
                <th>Purchased By</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan="9">
                    No purchases found
                  </td>
                </tr>
              ) : (
                purchases.map(
                  (purchase, index) => (
                    <tr key={purchase.id}>

                      {/* SERIAL NUMBER */}

                      <td>
                        {index + 1}
                      </td>

                      {/* PURCHASE ID */}

                      <td>
                        {purchase.id}
                      </td>

                      {/* SUPPLIER */}

                      <td>
                        {purchase.supplier_id}
                      </td>

                      {/* PRODUCT */}

                      <td>
                        {purchase.product_id}
                      </td>

                      {/* QUANTITY */}

                      <td>
                        {purchase.quantity}
                      </td>

                      {/* PURCHASE PRICE */}

                      <td>
                        ₹
                        {Number(
                          purchase.purchase_price
                        ).toFixed(2)}
                      </td>

                      {/* TOTAL AMOUNT */}

                      <td>
                        ₹
                        {Number(
                          purchase.total_amount
                        ).toFixed(2)}
                      </td>

                      {/* PURCHASED BY USER ID */}

                      <td>
                        {purchase.purchased_by}
                      </td>

                      {/* DATE */}

                      <td>
                        {formatDate(
                          purchase.created_at
                        )}
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

export default Purchases;
