import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";
const IMAGE_BASE_URL = 'https://res.cloudinary.com/dpiogqjk4/';

const AdminProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await AuthService.fetchAdminProducts();
      setProducts(data);
    } catch (err) {
      setMessage("Error fetching products.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    setDeletingId(id);
    setMessage("");
    try {
      await AuthService.deleteAdminProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setMessage("Product deleted.");
    } catch (err) {
      setMessage("Error deleting product.");
    }
    setDeletingId(null);
  };

  // Helper to get correct image URL (returns null if no image)
  const getImageUrl = (img) => {
    if (!img) return null;
    // If API already sends full "img.url", use that; else construct with base URL
    if (typeof img === "object" && img.url) return img.url;
    if (typeof img === "string" && !img.startsWith("http")) return `${IMAGE_BASE_URL}${img}`;
    return img; // Already full path
  };

  return (
    <div style={{ maxWidth: 1000, margin: "2rem auto", padding: "2rem", background: "#f6fafd", borderRadius: 12, boxShadow: "0 0 10px #0002" }}>
      <h2 style={{ textAlign: "center", color: "#2d6a4f", marginBottom: 24 }}>Admin Uploaded Products</h2>
      {message && <p style={{ color: message.startsWith("Error") ? "crimson" : "#187d21", textAlign: "center" }}>{message}</p>}
      {products.length === 0 ? (
        <p style={{ textAlign: "center" }}>No admin products found.</p>
      ) : (
        <table style={{ width: "100%", background: "white", borderRadius: 10, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#e9f5e1" }}>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Images</th>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Name</th>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Category</th>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Price</th>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Stock</th>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id} style={{ textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: 8 }}>
                  {[prod.image1, prod.image2, prod.image3, prod.image4].filter(Boolean).length === 0 ? (
                    <span style={{ color: "#aaa" }}>No images</span>
                  ) : (
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      {[prod.image1, prod.image2, prod.image3, prod.image4].map((img, idx) => {
                        const url = getImageUrl(img);
                        return url ? (
                          <img
                            key={idx}
                            src={url}
                            alt={`prod-img-${idx}`}
                            style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4, border: "1px solid #ddd" }}
                          />
                        ) : null;
                      })}
                    </div>
                  )}
                </td>
                <td style={{ padding: 8 }}>{prod.name}</td>
                <td style={{ padding: 8 }}>{prod.category}</td>
                <td style={{ padding: 8 }}>₹{prod.price}</td>
                <td style={{ padding: 8 }}>{prod.stock}</td>
                <td style={{ padding: 8 }}>
                  <button
                    style={{
                      background: "#e53935",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                    disabled={deletingId === prod.id}
                    onClick={() => handleDelete(prod.id)}
                  >
                    {deletingId === prod.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProductListPage;
