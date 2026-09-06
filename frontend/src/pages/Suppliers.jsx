import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Suppliers.css";

import API_BASE_URL from "../config";
function Suppliers() {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [editingSupplier, setEditingSupplier] = useState(null);

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
  // FETCH SUPPLIERS
  // -----------------------------

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/suppliers/`,
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
            "Failed to load suppliers"
        );
        return;
      }

      setSuppliers(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Unable to connect to backend");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchSuppliers();
  }, []);

  // -----------------------------
  // HANDLE FORM CHANGE
  // -----------------------------

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------
  // RESET FORM
  // -----------------------------

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    setEditingSupplier(null);
  };

  // -----------------------------
  // CREATE SUPPLIER
  // Admin only
  // -----------------------------

  const handleCreateSupplier = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      setError("Only admin can create suppliers");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/suppliers/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            data.detail ||
            "Failed to create supplier"
        );
        setMessage("");
        return;
      }

      resetForm();

      setError("");
      setMessage("Supplier created successfully");

      fetchSuppliers();
    } catch (error) {
      console.error(error);
      setError("Unable to connect to backend");
      setMessage("");
    }
  };

  // -----------------------------
  // EDIT SUPPLIER
  // Admin only
  // -----------------------------

  const handleEditSupplier = (supplier) => {
    if (!isAdmin) {
      setError("Only admin can edit suppliers");
      return;
    }

    setEditingSupplier(supplier);

    setFormData({
      name: supplier.name || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // -----------------------------
  // UPDATE SUPPLIER
  // Admin only
  // -----------------------------

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      setError("Only admin can update suppliers");
      return;
    }

    if (!editingSupplier) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/suppliers/${editingSupplier.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            data.detail ||
            "Failed to update supplier"
        );
        setMessage("");
        return;
      }

      resetForm();

      setError("");
      setMessage("Supplier updated successfully");

      fetchSuppliers();
    } catch (error) {
      console.error(error);
      setError("Unable to update supplier");
      setMessage("");
    }
  };

  // -----------------------------
  // CANCEL EDIT
  // -----------------------------

  const handleCancelEdit = () => {
    resetForm();
    setError("");
  };

  // -----------------------------
  // DELETE SUPPLIER
  // Admin only
  // -----------------------------

  const handleDeleteSupplier = async (supplierId) => {
    if (!isAdmin) {
      setError("Only admin can delete suppliers");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/suppliers/${supplierId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setError(
          data.message ||
            data.detail ||
            "Failed to delete supplier"
        );
        setMessage("");
        return;
      }

      if (
        editingSupplier &&
        editingSupplier.id === supplierId
      ) {
        resetForm();
      }

      setError("");
      setMessage("Supplier deleted successfully");

      fetchSuppliers();
    } catch (error) {
      console.error(error);
      setError("Unable to connect to backend");
      setMessage("");
    }
  };

  return (
    <div className="suppliers-page">
      <div className="suppliers-header">
        <div>
          <h1>Suppliers</h1>
          <p>Manage your suppliers</p>

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
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      {/* ADMIN ONLY SUPPLIER FORM */}

      {isAdmin && (
        <form
          className="supplier-form"
          onSubmit={
            editingSupplier
              ? handleUpdateSupplier
              : handleCreateSupplier
          }
        >
          <input
            type="text"
            name="name"
            placeholder="Supplier name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <div className="supplier-form-actions">
            <button type="submit">
              {editingSupplier
                ? "Update Supplier"
                : "Add Supplier"}
            </button>

            {editingSupplier && (
              <button
                type="button"
                className="cancel-supplier-button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {message && (
        <p className="suppliers-success">
          {message}
        </p>
      )}

      {error && (
        <p className="suppliers-error">
          {typeof error === "string"
            ? error
            : "Something went wrong"}
        </p>
      )}

      <div className="suppliers-table-container">
        <table className="suppliers-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>

              {isAdmin && (
                <th>Action</th>
              )}
            </tr>
          </thead>

          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? "7" : "6"}>
                  No suppliers found
                </td>
              </tr>
            ) : (
              suppliers.map((supplier, index) => (
                <tr key={supplier.id}>
                  <td>{index + 1}</td>
                  <td>{supplier.id}</td>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.address}</td>

                  {isAdmin && (
                    <td>
                      <div className="supplier-actions">
                        <button
                          type="button"
                          className="edit-supplier-button"
                          onClick={() =>
                            handleEditSupplier(supplier)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDeleteSupplier(
                              supplier.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Suppliers;
