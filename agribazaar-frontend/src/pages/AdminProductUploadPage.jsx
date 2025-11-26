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
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      setPreview({
        ...preview,
        [name]: files[0] ? URL.createObjectURL(files[0]) : undefined,
      });
    } else {
      setFormData({ ...formData, [name]: value });
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
          ...formData,
          name: "",
          price: "",
          description: "",
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

  const FormGroup = ({ label, required = false, children }) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ 
        display: "block", 
        marginBottom: 8, 
        fontSize: 14, 
        fontWeight: 600,
        color: "#333",
        letterSpacing: 0.3
      }}>
        {label} {required && <span style={{ color: "#e74c3c" }}>*</span>}
      </label>
      {children}
    </div>
  );

  const InputField = ({ type = "text", ...props }) => (
    <input
      type={type}
      style={{
        width: "100%",
        padding: "12px 14px",
        border: "1.5px solid #e0e0e0",
        borderRadius: 6,
        fontSize: 14,
        transition: "all 0.3s ease",
        boxSizing: "border-box",
        fontFamily: "inherit",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#227c38";
        e.target.style.boxShadow = "0 0 0 3px rgba(34, 124, 56, 0.1)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#e0e0e0";
        e.target.style.boxShadow = "none";
      }}
      {...props}
    />
  );

  const SelectField = (props) => (
    <select
      style={{
        width: "100%",
        padding: "12px 14px",
        border: "1.5px solid #e0e0e0",
        borderRadius: 6,
        fontSize: 14,
        transition: "all 0.3s ease",
        boxSizing: "border-box",
        fontFamily: "inherit",
        backgroundColor: "#fff",
        cursor: "pointer",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#227c38";
        e.target.style.boxShadow = "0 0 0 3px rgba(34, 124, 56, 0.1)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#e0e0e0";
        e.target.style.boxShadow = "none";
      }}
      {...props}
    />
  );

  const TextAreaField = (props) => (
    <textarea
      style={{
        width: "100%",
        padding: "12px 14px",
        border: "1.5px solid #e0e0e0",
        borderRadius: 6,
        fontSize: 14,
        fontFamily: "inherit",
        minHeight: 100,
        resize: "vertical",
        transition: "all 0.3s ease",
        boxSizing: "border-box",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#227c38";
        e.target.style.boxShadow = "0 0 0 3px rgba(34, 124, 56, 0.1)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#e0e0e0";
        e.target.style.boxShadow = "none";
      }}
      {...props}
    />
  );

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
          backdropFilter: "blur(10px)"
        }}>
          <div component="form" onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Basic Information */}
            <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "2px solid #f0f0f0" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#227c38", marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 }}>
                Basic Information
              </h2>
              <FormGroup label="Product Name" required>
                <InputField name="name" value={formData.name} onChange={handleChange} required placeholder="Enter product name" />
              </FormGroup>

              <FormGroup label="Price (₹)" required>
                <InputField type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange} required placeholder="0.00" />
              </FormGroup>

              <FormGroup label="Description" required>
                <TextAreaField name="description" value={formData.description} onChange={handleChange} required placeholder="Enter detailed product description" />
              </FormGroup>
            </div>

            {/* Category & Offer */}
            <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "2px solid #f0f0f0" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#227c38", marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 }}>
                Category & Offers
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <FormGroup label="Category">
                  <SelectField name="category" value={formData.category} onChange={handleChange}>
                    {CATEGORY_CHOICES.map(cat => <option value={cat} key={cat}>{cat}</option>)}
                  </SelectField>
                </FormGroup>

                <FormGroup label="Offer Type">
                  <SelectField name="offer_category" value={formData.offer_category} onChange={handleChange}>
                    {OFFER_CHOICES.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
                  </SelectField>
                </FormGroup>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <FormGroup label="Discount %">
                  <InputField type="number" name="discount_percent" min="0" max="100" value={formData.discount_percent} onChange={handleChange} placeholder="0" />
                </FormGroup>

                <FormGroup label="Stock">
                  <InputField type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} placeholder="0" />
                </FormGroup>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, padding: "12px 14px", background: "#f0f8f4", borderRadius: 6, border: "1px solid #d4edda" }}>
                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} style={{ cursor: "pointer", width: 18, height: 18 }} />
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
              <FormGroup label="Farmer Name">
                <InputField name="farmer_name" value={formData.farmer_name} onChange={handleChange} placeholder="Enter farmer name" />
              </FormGroup>

              <FormGroup label="Farmer Location">
                <InputField name="farmer_location" value={formData.farmer_location} onChange={handleChange} placeholder="Enter location" />
              </FormGroup>
            </div>

            {/* Additional Details */}
            <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "2px solid #f0f0f0" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#227c38", marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 }}>
                Additional Details
              </h2>
              <FormGroup label="Warranty Period">
                <InputField name="warranty_period" value={formData.warranty_period} onChange={handleChange} placeholder="e.g., 1 year, 6 months" />
              </FormGroup>

              <FormGroup label="Fertilizer Type">
                <InputField name="fertilizer_type" value={formData.fertilizer_type} onChange={handleChange} placeholder="e.g., Organic, NPK" />
              </FormGroup>
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#227c38", marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 }}>
                Product Images
              </h2>
              {[1, 2, 3, 4].map((num) => (
                <FormGroup key={`image${num}`} label={`Image ${num}`}>
                  <div style={{ 
                    display: "flex", 
                    gap: 12, 
                    alignItems: "flex-start"
                  }}>
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
                </FormGroup>
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
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = "#227c38";
                  e.target.style.boxShadow = "0 4px 12px rgba(34, 124, 56, 0.3)";
                  e.target.style.transform = "translateY(0)";
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