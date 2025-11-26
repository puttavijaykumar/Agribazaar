import React, { useState } from "react";
import AuthService from "../services/AuthService";

// Choices matching your new Django model
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErr(null);
    // Prepare FormData for image/file upload
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== "") fd.append(k, v);
    });

    try {
      await AuthService.createAdminProduct(fd);
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
    } catch (error) {
      setErr("Upload failed: " + (error.response?.data?.detail || error.message));
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow:"0 2px 8px #eee" }}>
      <h1>Admin Product Upload</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Price:</label>
        <input type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Category:</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          {CATEGORY_CHOICES.map(cat => <option value={cat} key={cat}>{cat}</option>)}
        </select>

        <label>Offer Category:</label>
        <select name="offer_category" value={formData.offer_category} onChange={handleChange}>
          {OFFER_CHOICES.map(opt=> <option value={opt.value} key={opt.value}>{opt.label}</option>)}
        </select>

        <label>Discount Percent:</label>
        <input type="number" name="discount_percent" min="0" max="100" value={formData.discount_percent} onChange={handleChange} />

        <label>Featured?</label>
        <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} />

        <label>Stock:</label>
        <input type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} />

        <label>Farmer Name:</label>
        <input type="text" name="farmer_name" value={formData.farmer_name} onChange={handleChange} />

        <label>Farmer Location:</label>
        <input type="text" name="farmer_location" value={formData.farmer_location} onChange={handleChange} />

        <label>Warranty Period:</label>
        <input type="text" name="warranty_period" value={formData.warranty_period} onChange={handleChange} />

        <label>Fertilizer Type:</label>
        <input type="text" name="fertilizer_type" value={formData.fertilizer_type} onChange={handleChange} />

        <label>Image 1:</label>
        <input type="file" name="image1" accept="image/*" onChange={handleChange} />
        {preview.image1 && <img src={preview.image1} alt="img1" style={{width:80,marginBottom:8}} />}

        <label>Image 2:</label>
        <input type="file" name="image2" accept="image/*" onChange={handleChange} />
        {preview.image2 && <img src={preview.image2} alt="img2" style={{width:80,marginBottom:8}} />}

        <label>Image 3:</label>
        <input type="file" name="image3" accept="image/*" onChange={handleChange} />
        {preview.image3 && <img src={preview.image3} alt="img3" style={{width:80,marginBottom:8}} />}

        <label>Image 4:</label>
        <input type="file" name="image4" accept="image/*" onChange={handleChange} />
        {preview.image4 && <img src={preview.image4} alt="img4" style={{width:80,marginBottom:8}} />}

        <button disabled={loading} style={{ marginTop:16, padding:"10px 30px", background:"#227c38", color:"#fff", border:0, borderRadius:5 }}>
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>
      {msg && <div style={{ color: "#247a2a", marginTop: 10 }}>{msg}</div>}
      {err && <div style={{ color: "#b02b2b", marginTop: 10 }}>{err}</div>}
    </div>
  );
};

export default AdminProductUploadPage;
