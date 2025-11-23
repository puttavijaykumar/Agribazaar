import React, { useState } from "react";
import AuthService from "../services/AuthService";

const categories = ["Seeds", "Fertilizers", "Tools", "Equipment", "Irrigation"];

const initialForm = {
  name: "",
  category: categories[0],
  price: "",
  description: "",
  stock: "",
  warranty_period: "",
  fertilizer_type: "",
  images: [null, null, null, null],
};

const AdminProductUploadPage = () => {
  const [form, setForm] = useState(initialForm);
  const [previews, setPreviews] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImage = (index, file) => {
    const newImages = [...form.images];
    newImages[index] = file;
    setForm(f => ({ ...f, images: newImages }));

    // Preview
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
    setMessage(""); setLoading(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("category", form.category);
    data.append("price", form.price);
    data.append("description", form.description);
    data.append("stock", form.stock);
    data.append("warranty_period", form.warranty_period);
    data.append("fertilizer_type", form.fertilizer_type);
    for (let i = 0; i < 4; i++) {
      if (form.images[i]) data.append(`image${i + 1}`, form.images[i]);
    }

    try {
      await AuthService.createAdminProduct(data);
      setMessage("✅ Product uploaded successfully!");
      setForm(initialForm);
      setPreviews([null, null, null, null]);
    } catch (err) {
      setMessage(`❌ Error: ${err?.response?.data?.detail || err.message}`);
    }
    setLoading(false);
  };

  // Layout
  return (
    <div style={{ maxWidth: 600, margin: "3rem auto", background: "#fafafa", padding: "2rem", borderRadius: "10px", boxShadow: "0 2px 16px #0002" }}>
      <h2 style={{ textAlign: "center", color: "#2d6a4f", marginBottom: 30 }}>Upload Admin Product</h2>
      {message && <p style={{ textAlign: "center", color: message.startsWith("✅") ? "#2d6a4f" : "#c32c2c" }}>{message}</p>}
      <form onSubmit={submit} encType="multipart/form-data">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <input name="name" value={form.name} onChange={handleInput} required placeholder="Product Name" style={{ flex: 1 }} />
            <select name="category" value={form.category} onChange={handleInput} style={{ flex: 1 }}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <input name="price" type="number" value={form.price} onChange={handleInput} required placeholder="Price (₹)" min="0" style={{ flex: 1 }} />
            <input name="stock" type="number" value={form.stock} onChange={handleInput} required placeholder="Stock Qty" min="0" style={{ flex: 1 }} />
          </div>
          <textarea name="description" value={form.description} onChange={handleInput} required placeholder="Description" style={{ width: "100%", minHeight: 75 }} />
          {/* Conditionals for category-specific fields */}
          {["Tools", "Equipment"].includes(form.category) && (
            <input name="warranty_period" value={form.warranty_period} onChange={handleInput} placeholder="Warranty period (e.g., 1 year)" style={{ width: "100%" }} />
          )}
          {form.category === "Fertilizers" && (
            <input name="fertilizer_type" value={form.fertilizer_type} onChange={handleInput} placeholder="Fertilizer type" style={{ width: "100%" }} />
          )}
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>Images (up to 4)</label>
            <div style={{ display: "flex", gap: 10 }}>
              {[0,1,2,3].map(idx => (
                <div key={idx} style={{ textAlign: "center" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImage(idx, e.target.files[0])}
                    style={{ display: "block", marginBottom: 6 }}
                  />
                  {previews[idx] && (
                    <img
                      src={previews[idx]}
                      alt={`Preview ${idx+1}`}
                      style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #ddd" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ padding: "10px 24px", background: "#388e3c", color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "1rem", marginTop: 16 }}>
            {loading ? "Uploading..." : "Upload Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductUploadPage;
