import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sales.css";

import API_BASE_URL from "../config";
function Sales() {
  const navigate = useNavigate();

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [sales, setSales] = useState([]);
  const [user, setUser] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
  // FETCH SALES
  // -------------------------------------------------

  const fetchSales = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/sales/`,
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
            "Failed to load sales"
        );

        return;
      }

      setSales(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Unable to connect to backend");
    }
  };

  // -------------------------------------------------
  // LOAD PAGE
  // -------------------------------------------------

  useEffect(() => {
    fetchCurrentUser();
    fetchSales();
  }, []);

  // -------------------------------------------------
  // CREATE SALE
  // ALL LOGGED-IN USERS
  // -------------------------------------------------

  const handleCreateSale = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !productId ||
      !quantity ||
      !price
    ) {
      setError(
        "Product ID, quantity and price are required"
      );
      return;
    }

    if (Number(productId) <= 0) {
      setError(
        "Product ID must be greater than 0"
      );
      return;
    }

    if (Number(quantity) <= 0) {
      setError(
        "Quantity must be greater than 0"
      );
      return;
    }

    if (Number(price) <= 0) {
      setError(
        "Price must be greater than 0"
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/sales/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            product_id: Number(productId),
            quantity: Number(quantity),
            price: Number(price),
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
            "Failed to create sale"
        );

        return;
      }

      setMessage("Sale created successfully");
      setError("");

      setProductId("");
      setQuantity("");
      setPrice("");

      fetchSales();
    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to backend"
      );

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

  return (
    <div className="sales-page">

      {/* HEADER */}

      <div className="sales-header">
        <div>
          <h1>Sales Management</h1>

          <p>
            Create sales and view sales history
          </p>

          {user && (
            <p className="sales-user-info">
              Logged in as:{" "}
              <strong>{user.username}</strong>{" "}
              ({user.role})
            </p>
          )}
        </div>

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back to Dashboard
        </button>
      </div>

      {/* SUCCESS */}

      {message && (
        <p className="sales-success">
          {message}
        </p>
      )}

      {/* ERROR */}

      {error && (
        <p className="sales-error">
          {typeof error === "string"
            ? error
            : "Something went wrong"}
        </p>
      )}

      {/* CREATE SALE */}

      <div className="sales-form-card">
        <h2>Create Sale</h2>

        <p>
          Record a new product sale.
        </p>

        <form
          className="sales-form"
          onSubmit={handleCreateSale}
        >

          <div className="sales-form-group">
            <label>
              Product ID
            </label>

            <input
              type="number"
              min="1"
              placeholder="Enter Product ID"
              value={productId}
              onChange={(e) =>
                setProductId(
                  e.target.value
                )
              }
              required
            />
          </div>

          <div className="sales-form-group">
            <label>
              Quantity
            </label>

            <input
              type="number"
              min="1"
              placeholder="Enter Quantity"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }
              required
            />
          </div>

          <div className="sales-form-group">
            <label>
              Selling Price
            </label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter Price"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              required
            />
          </div>

          <div className="sales-form-actions">
            <button
              type="submit"
              className="create-sale-button"
            >
              Create Sale
            </button>
          </div>

        </form>
      </div>

      {/* SALES HISTORY */}

      <div className="sales-history">

        <div className="sales-history-header">
          <h2>Sales History</h2>

          <p>
            Total Sales:{" "}
            <strong>
              {sales.length}
            </strong>
          </p>
        </div>

        <div className="sales-table-container">

          <table className="sales-table">

            <thead>
              <tr>
                <th>S.No</th>
                <th>ID</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Amount</th>
                <th>Sold By</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {sales.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    No sales found
                  </td>
                </tr>
              ) : (
                sales.map(
                  (sale, index) => (
                    <tr key={sale.id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {sale.id}
                      </td>

                      <td>
                        {sale.product_id}
                      </td>

                      <td>
                        {sale.quantity}
                      </td>

                      <td>
                        ₹
                        {Number(
                          sale.price
                        ).toFixed(2)}
                      </td>

                      <td>
                        ₹
                        {Number(
                          sale.total_amount
                        ).toFixed(2)}
                      </td>

                      <td>
                        {sale.sold_by}
                      </td>

                      <td>
                        {formatDate(
                          sale.created_at
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

export default Sales;
