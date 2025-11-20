import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

import FarmerNavbar from "../components/FarmerNavbar";
import EnhancedFooter from "../components/EnhancedFooter";

const CLOUDINARY_ROOT = "https://res.cloudinary.com/dpiogqjk4/";

function MyProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState({ notifications: [], role: "" });

  useEffect(() => {
    async function fetchUserAndProducts() {
      try {
        const profile = await AuthService.getUserProfile();
        setUser(profile);
        fetchProducts();
      } catch {
        setToast({ type: "error", message: "Failed to load user profile." });
      }
    }
    fetchUserAndProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  async function fetchProducts() {
    try {
      const queryParam = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
      const productList = await AuthService.getMyProducts(queryParam);
      setProducts(productList);
    } catch {
      setToast({ type: "error", message: "Failed to load products." });
    }
  }

  const startEditing = (product) => setEditingProduct({ ...product });
  const cancelEditing = () => setEditingProduct(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveEdit = async () => {
    try {
      const updatedProduct = {
        price: editingProduct.price,
        quantity: editingProduct.quantity,
      };
      await AuthService.updateProduct(editingProduct.id, updatedProduct);
      setToast({ type: "success", message: "Product updated successfully!" });
      setEditingProduct(null);
      fetchProducts();
    } catch {
      setToast({ type: "error", message: "Failed to update product." });
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await AuthService.deleteProduct(id);
      setToast({ type: "success", message: "Product deleted!" });
      fetchProducts();
    } catch {
      setToast({ type: "error", message: "Failed to delete product." });
    }
  };

  return (
    <>
      <FarmerNavbar user={user} />
      <div style={{ maxWidth: 960, margin: "2rem auto", padding: "1rem" }}>
        <h1>My Products</h1>
        <div style={{ display: "flex", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search products by name or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 300, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <button
            onClick={() => navigate("/upload-products")}
            style={{
              marginLeft: 15,
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            + Add Product
          </button>
        </div>

        {toast && (
          <div
            style={{
              backgroundColor: toast.type === "error" ? "#fdd" : "#dfd",
              color: toast.type === "error" ? "#900" : "#080",
              padding: "10px 15px",
              borderRadius: 6,
              marginBottom: 15,
              userSelect: "none",
            }}
          >
            {toast.message}
          </div>
        )}

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#fafafa" }}>
              <th>Image</th>
              <th>Name</th>
              <th>Status</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>
                  No products found.
                </td>
              </tr>
            )}

            {products.map((product) =>
              editingProduct && editingProduct.id === product.id ? (
                <tr key={product.id}>
                  <td>
                    {product.image1 ? (
                      <img
                        src={CLOUDINARY_ROOT + product.image1}
                        alt=""
                        style={{ width: 60, height: 60, objectFit: "cover" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td style={{ color: product.quantity > 0 ? "green" : "red" }}>
                    {product.quantity > 0 ? "Active" : "Sold Out"}
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      value={editingProduct.price}
                      onChange={handleInputChange}
                      style={{ width: 100, padding: 5 }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="quantity"
                      value={editingProduct.quantity}
                      onChange={handleInputChange}
                      style={{ width: 100, padding: 5 }}
                    />
                  </td>
                  <td>
                    <button
                      onClick={saveEdit}
                      style={{ color: "green", cursor: "pointer", marginRight: 8 }}
                    >
                      Save
                    </button>
                    <button onClick={cancelEditing} style={{ cursor: "pointer" }}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={product.id}>
                  <td>
                    {product.image1 ? (
                      <img
                        src={CLOUDINARY_ROOT + product.image1}
                        alt=""
                        style={{ width: 60, height: 60, objectFit: "cover" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td style={{ color: product.quantity > 0 ? "green" : "red" }}>
                    {product.quantity > 0 ? "Active" : "Sold Out"}
                  </td>
                  <td>₹{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button
                      onClick={() => startEditing(product)}
                      style={{ cursor: "pointer", marginRight: 8 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      style={{ cursor: "pointer", color: "red" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <EnhancedFooter />
    </>
  );
}

function startEditing(product) {
  setEditingProduct(product);
}

export default MyProducts;
