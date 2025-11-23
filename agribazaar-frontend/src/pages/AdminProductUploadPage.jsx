import React, { useState } from "react";
import AuthService from "../services/AuthService";

const categories = ["Seeds", "Fertilizers", "Tools", "Equipment", "Irrigation"];

const AdminProductUploadPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: categories[0],
    price: "",
    description: "",
    stock: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleFileChange = (e) => {
    setFormData({...formData, images: e.target.files});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("stock", formData.stock);
    for(let i=0; i<formData.images.length; i++) {
      data.append("image" + (i+1), formData.images[i]);
    }
    try {
      await AuthService.createAdminProduct(data);
      setMessage("Product uploaded successfully!");
      setFormData({
        name: "", category: categories[0], price: "", description: "", stock: "", images: [],
      });
    } catch (err) {
      setMessage(`Error: ${err.response?.data || err.message}`);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Upload Admin Product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" required />
        <select name="category" value={formData.category} onChange={handleInputChange}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" required />
        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" required />
        <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Stock Qty" required />
        <input type="file" name="images" multiple onChange={handleFileChange} accept="image/*" />
        <button type="submit" disabled={loading}>{loading ? "Uploading..." : "Upload Product"}</button>
      </form>
    </div>
  );
};

export default AdminProductUploadPage;
