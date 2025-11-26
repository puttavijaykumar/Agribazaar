import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const categories = ["Seeds", "Fertilizers", "Tools", "Equipment", "Irrigation"];

const offerOptions = [
  { value: 'none', label: '❌ Not an Offer' },
  { value: 'flash_deal', label: '⚡ Flash Deal' },
  { value: 'seasonal', label: '🌿 Seasonal Offer' },
  { value: 'limited_stock', label: '📦 Limited Stock' },
  { value: 'trending', label: '🔥 Trending Now' },
];

const initialForm = {
  name: "",
  category: categories[0],
  price: "",
  description: "",
  stock: "",
  warranty_period: "",
  fertilizer_type: "",
  is_featured: false,
  discount_percent: 0,
  farmer_name: "",
  farmer_location: "",
  offer_category: "none",  // NEW FIELD
  images: [null, null, null, null],
};

const AdminProductUploadPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [previews, setPreviews] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImage = (index, file) => {
    const newImages = [...form.images];
    newImages[index] = file;
    setForm(f => ({ ...f, images: newImages }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(p => {
          const np = [...p];
          np[index] = reader.result;
          return np;
        });
      };
      reader.readAsDataURL(file);
    } else {
      setPreviews(p => {
        const np = [...p];
        np[index] = null;
        return np;
      });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("category", form.category);
    data.append("price", form.price);
    data.append("description", form.description);
    data.append("stock", form.stock);
    data.append("warranty_period", form.warranty_period);
    data.append("fertilizer_type", form.fertilizer_type);
    data.append("is_featured", form.is_featured);
    data.append("discount_percent", form.discount_percent);
    data.append("farmer_name", form.farmer_name);
    data.append("farmer_location", form.farmer_location);
    data.append("offer_category", form.offer_category);  // NEW
    
    for (let i = 0; i < 4; i++) {
      if (form.images[i]) data.append(`image${i + 1}`, form.images[i]);
    }

    try {
      await AuthService.createAdminProduct(data);
      setMessage("✅ Product uploaded successfully!");
      setForm(initialForm);
      setPreviews([null, null, null, null]);
      // Optional: Redirect after 2 seconds
      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (err) {
      setMessage(`❌ Error: ${err?.response?.data?.detail || err.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* View All Products Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "white", margin: 0 }}>Add New Product</h1>
          <button
            onClick={() => navigate("/admin/products")}
            style={{
              background: "linear-gradient(135deg,#81c784 0%,#388e3c 100%)",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "10px 22px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "1rem",
              boxShadow: "0 2px 10px #c3e6cb77",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
          >
            📋 View All Products
          </button>
        </div>

        {/* Subtitle */}
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.9)", marginBottom: "2rem", textAlign: "center" }}>
          Fill in the details below to upload a new product to the catalog
        </p>

        {/* Main Card */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          padding: "2.5rem",
          animation: "slideIn 0.5s ease-out"
        }}>
          {/* Message Alert */}
          {message && (
            <div style={{
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              backgroundColor: message.startsWith("✅") ? "#d4edda" : "#f8d7da",
              color: message.startsWith("✅") ? "#155724" : "#721c24",
              border: `1px solid ${message.startsWith("✅") ? "#c3e6cb" : "#f5c6cb"}`,
              fontSize: "0.95rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              {message}
            </div>
          )}

          <form onSubmit={submit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              {/* Row 1: Name & Category */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#333", marginBottom: 6 }}>
                    Product Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleInput}
                    required
                    placeholder="Enter product name"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "0.95rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#333", marginBottom: 6 }}>
                    Category *
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInput}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "0.95rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      outline: "none",
                      cursor: "pointer"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                  >
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 2: Price & Stock */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#333", marginBottom: 6 }}>
                    Price (₹) *
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleInput}
                    required
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "0.95rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#333", marginBottom: 6 }}>
                    Stock Quantity *
                  </label>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleInput}
                    required
                    placeholder="0"
                    min="0"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "0.95rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#333", marginBottom: 6 }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInput}
                  required
                  placeholder="Provide detailed product description..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    fontSize: "0.95rem",
                    minHeight: 100,
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontFamily: "inherit",
                    transition: "all 0.3s",
                    boxSizing: "border-box",
                    outline: "none",
                    resize: "vertical"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              {/* Farmer Details Section */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: "1rem", 
                backgroundColor: "#f0f4ff", 
                padding: "1.2rem", 
                borderRadius: "8px",
                border: "2px solid #e8eaf6"
              }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#333", marginBottom: 6 }}>
                    👨‍🌾 Farmer Name
                  </label>
                  <input
                    name="farmer_name"
                    value={form.farmer_name}
                    onChange={handleInput}
                    placeholder="e.g., Rajesh Kumar"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "0.95rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#333", marginBottom: 6 }}>
                    📍 Location
                  </label>
                  <input
                    name="farmer_location"
                    value={form.farmer_location}
                    onChange={handleInput}
                    placeholder="e.g., Himachal Pradesh"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "0.95rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                  />
                </div>
              </div>

              {/* Offer Category & Top Offers Section - NEW */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: "1rem"
              }}>
                {/* Offer Category Dropdown */}
                <div style={{ 
                  backgroundColor: "#e8f5e9", 
                  padding: "1.2rem", 
                  borderRadius: "8px",
                  border: "2px solid #c8e6c9"
                }}>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#333", marginBottom: 6 }}>
                    🎯 Offer Type (Optional)
                  </label>
                  <select
                    name="offer_category"
                    value={form.offer_category}
                    onChange={handleInput}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "0.95rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      outline: "none",
                      cursor: "pointer",
                      backgroundColor: form.offer_category === "none" ? "#f0f0f0" : "#fff"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#4caf50"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                  >
                    {offerOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p style={{ fontSize: "0.8rem", color: "#666", margin: "8px 0 0 0" }}>
                    Select to show in Top Offers section
                  </p>
                </div>

                {/* Top Offers Section */}
                <div style={{ 
                  backgroundColor: "#fff3cd", 
                  padding: "1.2rem", 
                  borderRadius: "8px", 
                  border: "2px solid #ffc107"
                }}>
                  <h4 style={{ margin: "0 0 1rem 0", color: "#856404", fontSize: "0.95rem" }}>⭐ Top Offers Config</h4>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    {/* Discount Input */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#333", marginBottom: 4 }}>
                        Discount %
                      </label>
                      <input
                        name="discount_percent"
                        type="number"
                        value={form.discount_percent}
                        onChange={handleInput}
                        placeholder="0"
                        min="0"
                        max="100"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          fontSize: "0.9rem",
                          border: "2px solid #e0e0e0",
                          borderRadius: "6px",
                          fontFamily: "inherit",
                          transition: "all 0.3s",
                          boxSizing: "border-box",
                          outline: "none"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#ffc107"}
                        onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                      />
                    </div>

                    {/* Featured Checkbox */}
                    <label style={{ display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none" }}>
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={form.is_featured}
                        onChange={handleInput}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                          marginRight: "8px",
                          accentColor: "#ffc107"
                        }}
                      />
                      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#333" }}>Mark as Featured</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Category-Specific Fields */}
              {["Tools", "Equipment"].includes(form.category) && (
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#333", marginBottom: 6 }}>
                    ⏱️ Warranty Period
                  </label>
                  <input
                    name="warranty_period"
                    value={form.warranty_period}
                    onChange={handleInput}
                    placeholder="e.g., 1 year"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "0.95rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                  />
                </div>
              )}

              {form.category === "Fertilizers" && (
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#333", marginBottom: 6 }}>
                    🧪 Fertilizer Type
                  </label>
                  <input
                    name="fertilizer_type"
                    value={form.fertilizer_type}
                    onChange={handleInput}
                    placeholder="e.g., Organic, NPK Blend"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "0.95rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                  />
                </div>
              )}

              {/* Images Section */}
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#333", marginBottom: 12 }}>
                  📸 Product Images (up to 4)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                  {[0, 1, 2, 3].map(idx => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        border: "2px dashed #667eea",
                        borderRadius: "10px",
                        padding: "1rem",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        backgroundColor: previews[idx] ? "transparent" : "#f8f9ff",
                        hover: { borderColor: "#764ba2" }
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "#764ba2"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "#667eea"}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImage(idx, e.target.files[0])}
                        style={{ display: "none" }}
                        id={`image-${idx}`}
                      />
                      <label htmlFor={`image-${idx}`} style={{ cursor: "pointer", display: "block", height: "100%" }}>
                        {previews[idx] ? (
                          <img
                            src={previews[idx]}
                            alt={`Preview ${idx + 1}`}
                            style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }}
                          />
                        ) : (
                          <div style={{ padding: "1.5rem 0" }}>
                            <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>📸</div>
                            <div style={{ fontSize: "0.85rem", color: "#667eea", fontWeight: 500 }}>
                              Click to upload
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "12px 32px",
                  background: loading ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  marginTop: "1rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                  opacity: loading ? 0.7 : 1,
                  width: "100%"
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                }}
              >
                {loading ? "⏳ Uploading..." : "✨ Upload Product"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminProductUploadPage;
