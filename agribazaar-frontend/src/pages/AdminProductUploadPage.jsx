import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";

const CATEGORY_CHOICES = [
  "Seeds", "Fertilizers", "Tools", "Equipment", "Irrigation", "Top Offers",
];
const OFFER_CHOICES = [
  { value: 'none', label: 'Not an Offer' },
  { value: 'flash_deal', label: 'Flash Deal' },
  { value: 'seasonal', label: 'Seasonal Offer' },
  { value: 'limited_stock', label: 'Limited Stock' },
  { value: 'trending', label: 'Trending Now' },
];

const AdminProductUploadPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "Seeds",
    offer_category: "none",
    discount_percent: 0,
    is_featured: false,
    stock: 0,
    farmer_name: "",
    farmer_location: "",
    warranty_period: "",
    fertilizer_type: "",
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [preview, setPreview] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setPreview(prev => ({
        ...prev,
        [name]: files[0] ? URL.createObjectURL(files[0]) : undefined,
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErr(null);
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== "") fd.append(k, v);
    });

    AuthService.createAdminProduct(fd)
      .then(() => {
        setMsg("Product uploaded successfully!");
        setFormData({
          name: "",
          price: "",
          description: "",
          category: "Seeds",
          offer_category: "none",
          discount_percent: 0,
          is_featured: false,
          stock: 0,
          farmer_name: "",
          farmer_location: "",
          warranty_period: "",
          fertilizer_type: "",
          image1: null, image2: null, image3: null, image4: null,
        });
        setPreview({});
      })
      .catch((error) => {
        setErr("Upload failed: " + (error.response?.data?.detail || error.message));
      })
      .finally(() => setLoading(false));
  };

  const formGroupStyle = {
    marginBottom: 20
  };

  const labelStyle = {
    display: "block", 
    marginBottom: 8, 
    fontSize: 14, 
    fontWeight: 600,
    color: "#333",
    letterSpacing: 0.3
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #e0e0e0",
    borderRadius: 6,
    fontSize: 14,
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: "#fff",
    cursor: "pointer",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: 100,
    resize: "vertical",
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", padding: "40px 20px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ 
              background: "#227c38", 
              padding: 10, 
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Upload size={24} color="#fff" />
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1a1a1a" }}>
              Add Product
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
            Upload and manage agricultural products with detailed information
          </p>
        </div>

        {/* Form Card */}
        <div style={{ 
          background: "#fff", 
          borderRadius: 12, 
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          padding: 32,
        }}>
          <div>
            {/* Basic Information */}
            <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "2px solid #f0f0f0" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#227c38", marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 }}>
                Basic Information
              </h2>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Product Name <span style={{ color: "#e74c3c" }}>*</span></label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Enter product name"
                  required 
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Price (₹) <span style={{ color: "#e74c3c" }}>*</span></label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  placeholder="0.00"
                  required 
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Description <span style={{ color: "#e74c3c" }}>*</span></label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder="Enter detailed product description"
                  required 
                  style={textareaStyle}
                />
              </div>
            </div>

            {/* Category & Offer */}
            <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "2px solid #f0f0f0" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#227c38", marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 }}>
                Category & Offers
              </h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Category</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    style={selectStyle}
                  >
                    {CATEGORY_CHOICES.map(cat => <option value={cat} key={cat}>{cat}</option>)}
                  </select>
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Offer Type</label>
                  <select 
                    name="offer_category" 
                    value={formData.offer_category} 
                    onChange={handleChange}
                    style={selectStyle}
                  >
                    {OFFER_CHOICES.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Discount %</label>
                  <input 
                    type="number" 
                    name="discount_percent" 
                    min="0" 
                    max="100" 
                    value={formData.discount_percent} 
                    onChange={handleChange} 
                    placeholder="0"
                    style={inputStyle}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Stock</label>
                  <input 
                    type="number" 
                    min="0" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleChange} 
                    placeholder="0"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, padding: "12px 14px", background: "#f0f8f4", borderRadius: 6, border: "1px solid #d4edda" }}>
                <input 
                  type="checkbox" 
                  name="is_featured" 
                  checked={formData.is_featured} 
                  onChange={handleChange} 
                  style={{ cursor: "pointer", width: 18, height: 18 }} 
                />
                <label style={{ fontSize: 14, color: "#333", fontWeight: 500, cursor: "pointer", margin: 0 }}>
                  Mark as Featured Product
                </label>
              </div>
            </div>

            {/* Farmer Information */}
            <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "2px solid #f0f0f0" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#227c38", marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 }}>
                Farmer Information
              </h2>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Farmer Name</label>
                <input 
                  type="text" 
                  name="farmer_name" 
                  value={formData.farmer_name} 
                  onChange={handleChange} 
                  placeholder="Enter farmer name"
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Farmer Location</label>
                <input 
                  type="text" 
                  name="farmer_location" 
                  value={formData.farmer_location} 
                  onChange={handleChange} 
                  placeholder="Enter location"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Additional Details */}
            <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "2px solid #f0f0f0" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#227c38", marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 }}>
                Additional Details
              </h2>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Warranty Period</label>
                <input 
                  type="text" 
                  name="warranty_period" 
                  value={formData.warranty_period} 
                  onChange={handleChange} 
                  placeholder="e.g., 1 year, 6 months"
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Fertilizer Type</label>
                <input 
                  type="text" 
                  name="fertilizer_type" 
                  value={formData.fertilizer_type} 
                  onChange={handleChange} 
                  placeholder="e.g., Organic, NPK"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#227c38", marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 }}>
                Product Images
              </h2>
              {[1, 2, 3, 4].map((num) => (
                <div key={`image${num}`} style={formGroupStyle}>
                  <label style={labelStyle}>Image {num}</label>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <input 
                        type="file" 
                        name={`image${num}`} 
                        accept="image/*" 
                        onChange={handleChange}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          border: "2px dashed #227c38",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 14,
                          color: "#666",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    {preview[`image${num}`] && (
                      <div style={{ 
                        borderRadius: 8, 
                        overflow: "hidden", 
                        border: "2px solid #227c38",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }}>
                        <img src={preview[`image${num}`]} alt={`preview${num}`} style={{ width: 80, height: 80, objectFit: "cover" }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button 
              disabled={loading}
              onClick={handleSubmit}
              style={{ 
                width: "100%",
                marginTop: 24, 
                padding: "14px 20px", 
                background: loading ? "#aaa" : "#227c38", 
                color: "#fff", 
                border: 0, 
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(34, 124, 56, 0.3)",
                letterSpacing: 0.5
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = "#1a5a2b";
                  e.target.style.boxShadow = "0 6px 16px rgba(34, 124, 56, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = "#227c38";
                  e.target.style.boxShadow = "0 4px 12px rgba(34, 124, 56, 0.3)";
                }
              }}
            >
              {loading ? "Uploading..." : "Upload Product"}
            </button>
          </div>

          {/* Alert Messages */}
          {msg && (
            <div style={{ 
              display: "flex", 
              gap: 12, 
              alignItems: "center",
              marginTop: 20, 
              padding: 14, 
              background: "#d4edda", 
              color: "#155724", 
              borderRadius: 8,
              border: "1px solid #c3e6cb",
              fontSize: 14
            }}>
              <CheckCircle size={20} />
              {msg}
            </div>
          )}
          
          {err && (
            <div style={{ 
              display: "flex", 
              gap: 12, 
              alignItems: "center",
              marginTop: 20, 
              padding: 14, 
              background: "#f8d7da", 
              color: "#721c24", 
              borderRadius: 8,
              border: "1px solid #f5c6cb",
              fontSize: 14
            }}>
              <AlertCircle size={20} />
              {err}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductUploadPage;