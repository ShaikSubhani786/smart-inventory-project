import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API_BASE_URL from "../config";

function Categories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access_token");

  // ---------------------------------
  // COMMON AUTH HEADERS
  // ---------------------------------
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  // ---------------------------------
  // FETCH CURRENT USER
  // ---------------------------------
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/me`,
        {
          headers: authHeaders,
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/");
        return;
      }

      if (!response.ok) {
        setError(
          data.detail ||
            data.message ||
            "Unable to load user information"
        );
        return;
      }

      setUser(data);
    } catch (err) {
      console.error("User fetch error:", err);
      setError("Unable to connect to backend");
    }
  };

  // ---------------------------------
  // FETCH CATEGORIES
  // ---------------------------------
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/categories/`,
        {
          headers: authHeaders,
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/");
        return;
      }

      if (!response.ok) {
        setError(
          data.detail ||
            data.message ||
            "Failed to load categories"
        );
        return;
      }

      setCategories(
        Array.isArray(data) ? data : []
      );

      setError("");
    } catch (err) {
      console.error(
        "Categories fetch error:",
        err
      );

      setError("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------
  // INITIAL LOAD
  // ---------------------------------
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchCurrentUser();
    fetchCategories();
  }, []);

  // ---------------------------------
  // ADD CATEGORY - ADMIN ONLY
  // ---------------------------------
  const handleAddCategory = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/categories/`,
        {
          method: "POST",
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/");
        return;
      }

      if (response.status === 403) {
        setError(
          "Only administrators can add categories"
        );
        return;
      }

      if (!response.ok) {
        setError(
          data.detail ||
            data.message ||
            "Failed to add category"
        );
        return;
      }

      setName("");
      setDescription("");

      setMessage(
        "Category added successfully"
      );

      await fetchCategories();
    } catch (err) {
      console.error(
        "Add category error:",
        err
      );

      setError("Unable to connect to backend");
    }
  };

  // ---------------------------------
  // DELETE CATEGORY - ADMIN ONLY
  // ---------------------------------
  const handleDeleteCategory = async (
    categoryId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/");
        return;
      }

      if (response.status === 403) {
        setError(
          "Only administrators can delete categories"
        );
        return;
      }

      if (!response.ok) {
        setError(
          data.detail ||
            data.message ||
            "Failed to delete category"
        );
        return;
      }

      setMessage(
        "Category deleted successfully"
      );

      await fetchCategories();
    } catch (err) {
      console.error(
        "Delete category error:",
        err
      );

      setError("Unable to connect to backend");
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        ← Back to Dashboard
      </button>

      <h1>Categories</h1>

      {user && (
        <p>
          Logged in as{" "}
          <strong>{user.username}</strong>{" "}
          ({user.role})
        </p>
      )}

      {error && (
        <p
          style={{
            color: "#b91c1c",
            background: "#fee2e2",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          {error}
        </p>
      )}

      {message && (
        <p
          style={{
            color: "#166534",
            background: "#dcfce7",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          {message}
        </p>
      )}

      {/* ADMIN CREATE FORM */}
      {user?.role === "admin" && (
        <form
          onSubmit={handleAddCategory}
          style={{
            marginTop: "25px",
            marginBottom: "30px",
            padding: "20px",
            background: "white",
            borderRadius: "10px",
          }}
        >
          <h2>Add Category</h2>

          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <button type="submit">
            Add Category
          </button>
        </form>
      )}

      {/* CATEGORY LIST */}
      <h2>Category List</h2>

      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "15px",
          }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "10px",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <h3>
                {category.name}
              </h3>

              <p>
                {category.description ||
                  "No description"}
              </p>

              {user?.role === "admin" && (
                <button
                  onClick={() =>
                    handleDeleteCategory(
                      category.id
                    )
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;