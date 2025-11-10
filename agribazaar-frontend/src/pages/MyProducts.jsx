import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

function MyProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  async function fetchProducts() {
    try {
      // Add search query param if typed
      const queryParam = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
      const productList = await AuthService.getProducts(queryParam);
      setProducts(productList);
    } catch {
      setToast({ type: "error", message: "Failed to load products." });
    }
  }

  const startEditing = (product) => {
    setEditingProduct({ ...product });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveEdit = async () => {
    try {
      // Prepare form data, including only editable fields
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
                  {product.image1 ? <img src={product.image1} alt="" style={{ width: 60, height: 60, objectFit: "cover" }} /> : "No Image"}
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
                  <button onClick={saveEdit} style={{ color: "green", cursor: "pointer", marginRight: 8 }}>
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
                  {product.image1 ? <img src={product.image1} alt="" style={{ width: 60, height: 60, objectFit: "cover" }} /> : "No Image"}
                </td>
                <td>{product.name}</td>
                <td style={{ color: product.quantity > 0 ? "green" : "red" }}>
                  {product.quantity > 0 ? "Active" : "Sold Out"}
                </td>
                <td>₹{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  <button onClick={() => startEditing(product)} style={{ cursor: "pointer", marginRight: 8 }}>
                    Edit
                  </button>
                  <button onClick={() => deleteProduct(product.id)} style={{ cursor: "pointer", color: "red" }}>
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

function startEditing(product) {
  setEditingProduct(product);
}

export default MyProducts;
