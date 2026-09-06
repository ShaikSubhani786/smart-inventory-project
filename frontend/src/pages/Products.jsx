import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";

import API_BASE_URL from "../config";
function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [page, setPage] = useState(1);
  const limit = 5;

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  // CURRENT LOGGED-IN USER
  const [user, setUser] = useState(null);

  // EDIT STATE
  const [editingProduct, setEditingProduct] = useState(null);

  // PRODUCT FORM
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minimumStock, setMinimumStock] = useState(5);
  const [newCategoryId, setNewCategoryId] = useState("");

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
  // FETCH PRODUCTS
  // -----------------------------

  const fetchProducts = async () => {
    const skip = (page - 1) * limit;

    let url =
      `${API_BASE_URL}/api/v1/products/?` +
      `skip=${skip}` +
      `&limit=${limit}` +
      `&sort_by=id` +
      `&order=asc`;

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    if (categoryId) {
      url += `&category_id=${categoryId}`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            data.detail ||
            "Failed to load products"
        );
        return;
      }

      setProducts(data.items);
      setTotal(data.total);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Unable to connect to backend");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  // -----------------------------
  // SEARCH
  // -----------------------------

  const handleSearch = (e) => {
    e.preventDefault();

    if (page !== 1) {
      setPage(1);
    } else {
      fetchProducts();
    }
  };

  // -----------------------------
  // RESET FORM
  // -----------------------------

  const resetProductForm = () => {
    setName("");
    setDescription("");
    setSku("");
    setBarcode("");
    setPrice("");
    setQuantity("");
    setMinimumStock(5);
    setNewCategoryId("");
    setEditingProduct(null);
  };

  // -----------------------------
  // ADD PRODUCT
  // -----------------------------

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      setError("Only admin can add products");
      return;
    }

    if (
      !name ||
      !sku ||
      price === "" ||
      quantity === "" ||
      !newCategoryId
    ) {
      setError(
        "Name, SKU, price, quantity and category are required"
      );
      setMessage("");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/products/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
            sku,
            barcode,
            price: Number(price),
            quantity: Number(quantity),
            minimum_stock: Number(minimumStock),
            image_url: "",
            category_id: Number(newCategoryId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            data.detail ||
            "Failed to create product"
        );
        setMessage("");
        return;
      }

      setMessage("Product created successfully");
      setError("");

      resetProductForm();
      setShowAddForm(false);

      if (page !== 1) {
        setPage(1);
      } else {
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to backend");
    }
  };

  // -----------------------------
  // EDIT PRODUCT
  // -----------------------------

  const handleEditProduct = (product) => {
    if (!isAdmin) {
      setError("Only admin can edit products");
      return;
    }

    setEditingProduct(product);

    setName(product.name || "");
    setDescription(product.description || "");
    setSku(product.sku || "");
    setBarcode(product.barcode || "");
    setPrice(product.price ?? "");
    setQuantity(product.quantity ?? "");
    setMinimumStock(product.minimum_stock ?? 5);
    setNewCategoryId(product.category_id ?? "");

    setShowAddForm(true);

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // -----------------------------
  // UPDATE PRODUCT
  // -----------------------------

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      setError("Only admin can update products");
      return;
    }

    if (!editingProduct) {
      return;
    }

    if (
      !name ||
      !sku ||
      price === "" ||
      quantity === "" ||
      !newCategoryId
    ) {
      setError(
        "Name, SKU, price, quantity and category are required"
      );
      setMessage("");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
            sku,
            barcode,
            price: Number(price),
            quantity: Number(quantity),
            minimum_stock: Number(minimumStock),
            image_url: editingProduct.image_url || "",
            category_id: Number(newCategoryId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            data.detail ||
            "Failed to update product"
        );
        setMessage("");
        return;
      }

      setMessage("Product updated successfully");
      setError("");

      resetProductForm();
      setShowAddForm(false);

      fetchProducts();
    } catch (error) {
      console.error(error);

      setError("Unable to update product");
      setMessage("");
    }
  };

  // -----------------------------
  // CANCEL FORM
  // -----------------------------

  const handleCancelForm = () => {
    resetProductForm();

    setShowAddForm(false);
    setError("");
  };

  // -----------------------------
  // DELETE PRODUCT
  // -----------------------------

  const handleDeleteProduct = async (productId) => {
    if (!isAdmin) {
      setError("Only admin can delete products");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete Product ID ${productId}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/products/${productId}`,
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
            "Failed to delete product"
        );

        setMessage("");
        return;
      }

      setMessage("Product deleted successfully");
      setError("");

      fetchProducts();
    } catch (error) {
      console.error(error);

      setError("Unable to connect to backend");
    }
  };

  // -----------------------------
  // UPLOAD IMAGE
  // -----------------------------

  const handleImageUpload = async (
    productId,
    file
  ) => {
    if (!isAdmin) {
      setError("Only admin can upload product images");
      return;
    }

    if (!file) {
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/products/${productId}/image`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            data.detail ||
            "Failed to upload image"
        );

        setMessage("");
        return;
      }

      setMessage(
        "Product image uploaded successfully"
      );

      setError("");

      fetchProducts();
    } catch (error) {
      console.error(error);

      setError("Unable to upload image");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="products-page">
      {/* HEADER */}

      <div className="products-header">
        <div>
          <h1>Products</h1>

          <p>Manage your inventory products</p>

          {user && (
            <p>
              Logged in as:{" "}
              <strong>{user.username}</strong>{" "}
              ({user.role})
            </p>
          )}
        </div>

        <div className="products-header-buttons">
          {isAdmin && (
            <button
              className="add-product-button"
              onClick={() => {
                if (showAddForm) {
                  handleCancelForm();
                } else {
                  resetProductForm();
                  setShowAddForm(true);
                }
              }}
            >
              {showAddForm
                ? "Close Form"
                : "+ Add Product"}
            </button>
          )}

          <button
            className="back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* ADD / EDIT FORM */}

      {isAdmin && showAddForm && (
        <form
          className="add-product-form"
          onSubmit={
            editingProduct
              ? handleUpdateProduct
              : handleAddProduct
          }
        >
          <h2>
            {editingProduct
              ? `Edit Product ID ${editingProduct.id}`
              : "Add Product"}
          </h2>

          <div className="product-form-grid">
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="SKU"
              value={sku}
              onChange={(e) =>
                setSku(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Barcode"
              value={barcode}
              onChange={(e) =>
                setBarcode(e.target.value)
              }
            />

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
            />

            <input
              type="number"
              min="0"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
            />

            <input
              type="number"
              min="0"
              placeholder="Minimum Stock"
              value={minimumStock}
              onChange={(e) =>
                setMinimumStock(e.target.value)
              }
            />

            <input
              type="number"
              min="1"
              placeholder="Category ID"
              value={newCategoryId}
              onChange={(e) =>
                setNewCategoryId(e.target.value)
              }
            />
          </div>

          <div className="product-form-actions">
            <button
              type="submit"
              className="save-product-button"
            >
              {editingProduct
                ? "Update Product"
                : "Create Product"}
            </button>

            <button
              type="button"
              className="cancel-edit-button"
              onClick={handleCancelForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* SUCCESS */}

      {message && (
        <p className="products-success">
          {message}
        </p>
      )}

      {/* ERROR */}

      {error && (
        <p className="products-error">
          {typeof error === "string"
            ? error
            : "Something went wrong"}
        </p>
      )}

      {/* SEARCH */}

      <form
        className="product-search"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Category ID"
          value={categoryId}
          onChange={(e) =>
            setCategoryId(e.target.value)
          }
        />

        <button type="submit">
          Search
        </button>
      </form>

      <p>
        Total Products:{" "}
        <strong>{total}</strong>
      </p>

      {/* PRODUCT TABLE */}

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Min Stock</th>
              <th>Category</th>

              {isAdmin && (
                <th>Upload Image</th>
              )}

              {isAdmin && (
                <th>Action</th>
              )}
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    isAdmin ? "11" : "9"
                  }
                >
                  No products found
                </td>
              </tr>
            ) : (
              products.map(
                (product, index) => (
                  <tr key={product.id}>
                    <td>
                      {(page - 1) *
                        limit +
                        index +
                        1}
                    </td>

                    <td>
                      {product.image_url ? (
                        <img
                          src={
                            product.image_url.startsWith(
                              "http"
                            )
                              ? product.image_url
                              : `${API_BASE_URL}${product.image_url}`
                          }
                          alt={product.name}
                          className="product-image"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>

                    <td>{product.id}</td>

                    <td>{product.name}</td>

                    <td>{product.sku}</td>

                    <td>
                      ₹{product.price}
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

                    {/* ADMIN ONLY IMAGE UPLOAD */}

                    {isAdmin && (
                      <td>
                        <input
                          className="image-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(
                              product.id,
                              e.target.files[0]
                            )
                          }
                        />
                      </td>
                    )}

                    {/* ADMIN ONLY EDIT + DELETE */}

                    {isAdmin && (
                      <td>
                        <div className="product-actions">
                          <button
                            type="button"
                            className="edit-product-button"
                            onClick={() =>
                              handleEditProduct(
                                product
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-product-button"
                            onClick={() =>
                              handleDeleteProduct(
                                product.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() =>
            setPage(
              (prev) => prev - 1
            )
          }
        >
          Previous
        </button>

        <span>
          Page {page} of{" "}
          {totalPages || 1}
        </span>

        <button
          disabled={
            page >= totalPages ||
            totalPages === 0
          }
          onClick={() =>
            setPage(
              (prev) => prev + 1
            )
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Products;
