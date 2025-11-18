import React, { useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import EnhancedFooter from "../components/EnhancedFooter";
import FarmerNavbar from '../components/FarmerNavbar';

function UploadProducts() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    quantity: "",
    validity_days: "30",
  });

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const name = e.target.name;
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => ({ ...prev, [name]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("quantity", formData.quantity);
    data.append("validity_days", formData.validity_days);

    if (images.image1) data.append("image1", images.image1);
    if (images.image2) data.append("image2", images.image2);
    if (images.image3) data.append("image3", images.image3);
    if (images.image4) data.append("image4", images.image4);

    try {
      const res = await AuthService.createProduct(data);
      setSuccess(true);
      setFormData({ name: "", price: "", description: "", quantity: "", validity_days: "30" });
      setImages({ image1: null, image2: null, image3: null, image4: null });
      setImagePreviews({ image1: null, image2: null, image3: null, image4: null });
      setTimeout(() => setSuccess(false), 4000);
      alert(`Product "${res.name}" uploaded successfully!`);
    } catch (error) {
      alert("Failed to upload product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    minWidth: "220px",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "2px solid #e0e0e0",
    fontSize: "1rem",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    backgroundColor: "#fafafa",
  };

  const labelStyle = {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#1b5e20",
    marginBottom: "0.8rem",
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const formGroupStyle = {
    marginBottom: "1.8rem",
    minWidth: "220px",
    maxWidth: "340px",
    flex: "0 0 auto"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)",
        padding: "1.5rem 1rem",
        paddingBottom: "4rem",
      }}
    >
      <FarmerNavbar user={user || {}} />
      {/* Bg deco */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle at 20% 50%, rgba(129, 199, 132, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      ></div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
          maxWidth: "900px",
          margin: "0 auto 2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", minWidth: "200px" }}>
          <span style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}></span>
        </div>
      </div>
      {/* Main Form Container */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          borderRadius: "15px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
          padding: "clamp(1.5rem, 5vw, 3rem)",
          border: "2px solid rgba(129, 199, 132, 0.2)",
          overflow: "hidden"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 6vw, 2.5rem)",
              fontWeight: "800",
              color: "#1b5e20",
              margin: "0 0 0.8rem 0",
            }}
          >
            Upload Your Product
          </h2>
          <p style={{ fontSize: "clamp(0.9rem, 3vw, 1.1rem)", color: "#666", margin: 0 }}>
            Share your agricultural products with buyers across India
          </p>
          <div
            style={{
              height: "4px",
              width: "80px",
              background: "linear-gradient(90deg, #81c784 0%, #aed581 100%)",
              borderRadius: "2px",
              margin: "1rem auto 0",
            }}
          ></div>
        </div>

        {success && (
          <div
            style={{
              background: "linear-gradient(135deg, #e6ffe6 0%, #f0fff0 100%)",
              border: "2px solid #81c784",
              borderRadius: "12px",
              padding: "1rem",
              marginBottom: "1.5rem",
              animation: "slideIn 0.3s ease",
            }}
          >
            <p style={{ margin: 0, color: "#2d8e4a", fontWeight: "600", fontSize: "clamp(0.85rem, 2vw, 1.05rem)" }}>
              Product uploaded successfully!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {/* Horizontally scrolling Product Name & Price Row */}
          <div className="scroll-x-row"
            style={{
              display: "flex",
              gap: "2.5rem",
              overflowX: "auto",
              paddingBottom: "0.75rem"
            }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Organic Wheat"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#81c784";
                  e.target.style.boxShadow = "0 0 0 3px rgba(129, 199, 132, 0.1)";
                  e.target.style.backgroundColor = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                  e.target.style.boxShadow = "none";
                  e.target.style.backgroundColor = "#fafafa";
                }}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Price (₹ per unit)</label>
              <input
                type="number"
                name="price"
                placeholder="e.g., 2500"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#81c784";
                  e.target.style.boxShadow = "0 0 0 3px rgba(129, 199, 132, 0.1)";
                  e.target.style.backgroundColor = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                  e.target.style.boxShadow = "none";
                  e.target.style.backgroundColor = "#fafafa";
                }}
              />
            </div>
          </div>
          {/* Description */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              placeholder="Describe your product quality, origin, farming method, etc."
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              style={{
                ...inputStyle,
                resize: "vertical",
                minWidth: "400px",
                maxWidth: "900px",
                width: "100%",
                fontFamily: "inherit",
                minHeight: "120px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#81c784";
                e.target.style.boxShadow = "0 0 0 3px rgba(129, 199, 132, 0.1)";
                e.target.style.backgroundColor = "white";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
                e.target.style.boxShadow = "none";
                e.target.style.backgroundColor = "#fafafa";
              }}
            />
          </div>
          {/* Horizontally scrolling Quantity & Validity Row */}
          <div className="scroll-x-row"
            style={{
              display: "flex",
              gap: "2.5rem",
              overflowX: "auto",
              paddingBottom: "0.75rem"
            }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Quantity Available</label>
              <input
                type="number"
                name="quantity"
                placeholder="e.g., 500 kg"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#81c784";
                  e.target.style.boxShadow = "0 0 0 3px rgba(129, 199, 132, 0.1)";
                  e.target.style.backgroundColor = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                  e.target.style.boxShadow = "none";
                  e.target.style.backgroundColor = "#fafafa";
                }}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Listing Validity (Days)</label>
              <input
                type="number"
                name="validity_days"
                placeholder="e.g., 30"
                value={formData.validity_days}
                onChange={handleInputChange}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#81c784";
                  e.target.style.boxShadow = "0 0 0 3px rgba(129, 199, 132, 0.1)";
                  e.target.style.backgroundColor = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                  e.target.style.boxShadow = "none";
                  e.target.style.backgroundColor = "#fafafa";
                }}
              />
            </div>
          </div>
          {/* Images Section */}
          <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 style={{
              fontSize: "clamp(1.1rem, 4vw, 1.3rem)",
              fontWeight: "700",
              color: "#1b5e20",
              marginBottom: "1.2rem",
              margin: "0 0 1.2rem 0",
            }}>
              Product Images (Upload up to 4 images)
            </h3>
            <div className="scroll-x-row"
              style={{
                display: "flex",
                gap: "1rem",
                overflowX: "auto",
                paddingBottom: "0.5rem"
              }}>
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={`image${num}`}
                  style={{
                    border: "3px dashed #81c784",
                    borderRadius: "12px",
                    padding: "1rem",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    background: imagePreviews[`image${num}`]
                      ? "linear-gradient(135deg, #e6ffe6 0%, #f0fff0 100%)"
                      : "#fafafa",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "150px",
                    minWidth: "150px",
                    maxWidth: "220px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: "0 0 auto"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2d8e4a";
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(129, 199, 132, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#81c784";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <input
                    type="file"
                    name={`image${num}`}
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                      opacity: 0,
                    }}
                  />
                  {imagePreviews[`image${num}`] ? (
                    <div style={{ position: "relative", width: "100%" }}>
                      <img
                        src={imagePreviews[`image${num}`]}
                        alt={`Preview ${num}`}
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <p style={{ margin: "0.6rem 0 0 0", fontSize: "clamp(0.7rem, 2vw, 0.85rem)", color: "#666", fontWeight: "600" }}>
                        Image selected
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", margin: "0" }}>📸</p>
                      <p style={{ margin: "0.5rem 0 0 0", fontSize: "clamp(0.8rem, 2vw, 0.95rem)", color: "#666", fontWeight: "600" }}>
                        Click to upload
                      </p>
                      <p style={{ margin: "0.2rem 0 0 0", fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)", color: "#999" }}>
                        Image {num}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "1.5rem",
              padding: "clamp(0.8rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2rem)",
              borderRadius: "12px",
              border: "none",
              background: loading
                ? "linear-gradient(135deg, #999 0%, #777 100%)"
                : "linear-gradient(135deg, #81c784 0%, #2d8e4a 100%)",
              color: "white",
              fontWeight: "700",
              fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 10px 30px rgba(129, 199, 132, 0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.8rem",
              minWidth: "200px"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 15px 40px rgba(129, 199, 132, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 30px rgba(129, 199, 132, 0.3)";
              }
            }}
          >
            {loading ? (
              <>
                <span style={{ animation: "spin 1s linear infinite" }}>⚙️</span>
                Uploading...
              </>
            ) : (
              <>
                Upload Product
              </>
            )}
          </button>
        </form>
      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg);}
          to { transform: rotate(360deg);}
        }
        .scroll-x-row {
          scrollbar-width: thin;
        }
        .scroll-x-row::-webkit-scrollbar {
          height: 6px;
          background: #e0f2f1;
        }
        .scroll-x-row::-webkit-scrollbar-thumb {
          background: #81c784;
          border-radius: 4px;
        }
        @media (max-width: 600px) {
          .scroll-x-row { gap: 1rem; }
        }
      `}
      </style>
      <EnhancedFooter />
    </div>
  );
}

export default UploadProducts;
