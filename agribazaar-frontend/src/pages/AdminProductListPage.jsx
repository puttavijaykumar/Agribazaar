import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = 'https://res.cloudinary.com/dpiogqjk4/';

const AdminProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterOfferType, setFilterOfferType] = useState("");
  const navigate = useNavigate();

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      let url = `${process.env.REACT_APP_API_URL}/admin-products/`;
      
      // Add query filters if selected
      const params = new URLSearchParams();
      if (filterCategory) params.append('category', filterCategory);
      if (filterOfferType) params.append('offer_category', filterOfferType);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const data = await AuthService.fetchAdminProducts();
      setProducts(data);
    } catch (err) {
      setMessage("Error fetching products.");
    }
  };

  // Refetch when filters change
  useEffect(() => {
    fetchProducts();
  }, [filterCategory, filterOfferType]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    setDeletingId(id);
    setMessage("");
    try {
      await AuthService.deleteAdminProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setMessage("✅ Product deleted successfully.");
    } catch (err) {
      setMessage("❌ Error deleting product.");
    }
    setDeletingId(null);
  };

  // Helper to get correct image URL
  const getImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === "object" && img.url) return img.url;
    if (typeof img === "string" && !img.startsWith("http")) return `${IMAGE_BASE_URL}${img}`;
    return img;
  };

  // Get offer type badge with emoji
  const getOfferBadge = (offerCategory) => {
    const badges = {
      'flash_deal': { emoji: '⚡', label: 'Flash Deal', color: '#ff6b6b' },
      'seasonal': { emoji: '🌿', label: 'Seasonal', color: '#51cf66' },
      'limited_stock': { emoji: '📦', label: 'Limited', color: '#ffa94d' },
      'trending': { emoji: '🔥', label: 'Trending', color: '#ff922b' },
      'none': { emoji: '—', label: 'Regular', color: '#adb5bd' },
    };
    
    const badge = badges[offerCategory] || badges['none'];
    return (
      <span style={{
        background: badge.color,
        color: 'white',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
        whiteSpace: 'nowrap'
      }}>
        {badge.emoji} {badge.label}
      </span>
    );
  };

  // Get featured badge
  const getFeaturedBadge = (isFeatured) => {
    if (!isFeatured) return null;
    return (
      <span style={{
        background: '#4c6ef5',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '600',
        marginLeft: '4px'
      }}>
        ⭐ Featured
      </span>
    );
  };

  const categories = ["Seeds", "Fertilizers", "Tools", "Equipment", "Irrigation"];
  const offerTypes = [
    { value: 'none', label: '❌ Not an Offer' },
    { value: 'flash_deal', label: '⚡ Flash Deal' },
    { value: 'seasonal', label: '🌿 Seasonal' },
    { value: 'limited_stock', label: '📦 Limited Stock' },
    { value: 'trending', label: '🔥 Trending' },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "2rem auto", padding: "2rem", background: "#f6fafd", borderRadius: 12, boxShadow: "0 0 10px #0002" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ color: "#2d6a4f", margin: 0 }}>Admin Uploaded Products</h2>
        <button
          onClick={() => navigate("/admin/product-upload")}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "0.95rem"
          }}
        >
          ➕ Add New Product
        </button>
      </div>

      {message && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "1rem",
          backgroundColor: message.startsWith("✅") ? "#d4edda" : "#f8d7da",
          color: message.startsWith("✅") ? "#155724" : "#721c24",
          textAlign: "center",
          fontWeight: "500"
        }}>
          {message}
        </div>
      )}

      {/* Filters Section */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        marginBottom: "2rem",
        background: "white",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 4px #0001"
      }}>
        <div>
          <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "6px", color: "#333" }}>
            Filter by Category
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              fontSize: "0.95rem",
              cursor: "pointer"
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "6px", color: "#333" }}>
            Filter by Offer Type
          </label>
          <select
            value={filterOfferType}
            onChange={(e) => setFilterOfferType(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              fontSize: "0.95rem",
              cursor: "pointer"
            }}
          >
            <option value="">All Types</option>
            {offerTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <div style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          textAlign: "center",
          color: "#666"
        }}>
          No products found.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", background: "white", borderRadius: 10, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#e9f5e1" }}>
                <th style={{ padding: 12, borderBottom: "2px solid #ddd", textAlign: "left" }}>Images</th>
                <th style={{ padding: 12, borderBottom: "2px solid #ddd", textAlign: "left" }}>Name</th>
                <th style={{ padding: 12, borderBottom: "2px solid #ddd", textAlign: "left" }}>Category</th>
                <th style={{ padding: 12, borderBottom: "2px solid #ddd", textAlign: "center" }}>Offer Type</th>
                <th style={{ padding: 12, borderBottom: "2px solid #ddd", textAlign: "center" }}>Discount</th>
                <th style={{ padding: 12, borderBottom: "2px solid #ddd", textAlign: "right" }}>Price</th>
                <th style={{ padding: 12, borderBottom: "2px solid #ddd", textAlign: "center" }}>Stock</th>
                <th style={{ padding: 12, borderBottom: "2px solid #ddd", textAlign: "center" }}>Farmer</th>
                <th style={{ padding: 12, borderBottom: "2px solid #ddd", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod.id} style={{ borderBottom: "1px solid #f0f0f0", transition: "background 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
                  
                  {/* Images */}
                  <td style={{ padding: 10 }}>
                    {[prod.image1, prod.image2, prod.image3, prod.image4].filter(Boolean).length === 0 ? (
                      <span style={{ color: "#aaa", fontSize: "0.9rem" }}>No images</span>
                    ) : (
                      <div style={{ display: "flex", gap: 4 }}>
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

                  {/* Name */}
                  <td style={{ padding: 10, fontWeight: "500" }}>
                    {prod.name}
                    {prod.is_featured && getFeaturedBadge(prod.is_featured)}
                  </td>

                  {/* Category */}
                  <td style={{ padding: 10, fontSize: "0.9rem", color: "#666" }}>
                    {prod.category}
                  </td>

                  {/* Offer Type - NEW */}
                  <td style={{ padding: 10, textAlign: "center" }}>
                    {getOfferBadge(prod.offer_category)}
                  </td>

                  {/* Discount - NEW */}
                  <td style={{ padding: 10, textAlign: "center", fontWeight: "600", color: "#ff6b6b" }}>
                    {prod.discount_percent > 0 ? `-${prod.discount_percent}%` : '—'}
                  </td>

                  {/* Price */}
                  <td style={{ padding: 10, textAlign: "right", fontWeight: "600" }}>
                    ₹{parseFloat(prod.price).toFixed(2)}
                  </td>

                  {/* Stock */}
                  <td style={{ 
                    padding: 10, 
                    textAlign: "center",
                    color: prod.stock < 10 ? '#ff6b6b' : '#2d6a4f',
                    fontWeight: prod.stock < 10 ? '600' : 'normal'
                  }}>
                    {prod.stock} {prod.stock < 10 && '⚠️'}
                  </td>

                  {/* Farmer - NEW */}
                  <td style={{ padding: 10, textAlign: "center", fontSize: "0.9rem" }}>
                    <div>{prod.farmer_name || '—'}</div>
                    <div style={{ color: "#666", fontSize: "0.85rem" }}>{prod.farmer_location || '—'}</div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: 10, textAlign: "center" }}>
                    <button
                      style={{
                        background: "#e53935",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 14px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        transition: "background 0.2s"
                      }}
                      disabled={deletingId === prod.id}
                      onClick={() => handleDelete(prod.id)}
                      onMouseEnter={(e) => e.target.style.background = "#c62828"}
                      onMouseLeave={(e) => e.target.style.background = "#e53935"}
                    >
                      {deletingId === prod.id ? "🗑️ Deleting..." : "🗑️ Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem", color: "#666" }}>
        Total Products: <strong>{products.length}</strong>
      </p>
    </div>
  );
};

export default AdminProductListPage;
