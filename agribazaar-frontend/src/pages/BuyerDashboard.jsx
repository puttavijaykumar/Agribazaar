import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const colors = {
  primaryGreen: "#2e7d32",
  accent: "#81c784",
  lightBg: "#f1f8e9",
  textDark: "#263238",
};

const sampleProducts = [
  { name: "Organic Wheat", price: 1200, img: "https://images.unsplash.com/photo-1605475127703-d865bdf4e61c" },
  { name: "Rice (Basmati)", price: 1900, img: "https://images.unsplash.com/photo-1598515213971-cdbe51c3aa78" },
  { name: "Groundnut", price: 1450, img: "https://images.unsplash.com/photo-1583132333837-229b1a47b946" },
  { name: "Sugarcane", price: 900, img: "https://images.unsplash.com/photo-1615474597551-dcc0663f90bb" },
];

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(null);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: colors.lightBg, minHeight: "100vh" }}>
      
      {/* NAVBAR */}
      <nav style={{
        background: colors.primaryGreen,
        padding: "1rem 2rem",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <h2 style={{ margin: 0, fontWeight: "700" }}>AgriBazaar - Buyer</h2>
        <button
          onClick={logout}
          style={{
            background: "white",
            color: colors.primaryGreen,
            padding: ".6rem 1rem",
            borderRadius: "8px",
            cursor: "pointer",
            border: "none",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </nav>

      {/* HEADER */}
      <h1 style={{ textAlign: "center", marginTop: 30, color: colors.primaryGreen }}>
        🛒 Buy Fresh Agricultural Products
      </h1>

      {/* PRODUCT GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "20px",
        padding: "30px",
      }}>
        {sampleProducts.map((product, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "12px",
              boxShadow: hover === index 
                ? "0 8px 18px rgba(0,0,0,0.18)" 
                : "0 4px 10px rgba(0,0,0,0.1)",
              transition: "0.3s",
              cursor: "pointer",
              textAlign: "center",
            }}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(null)}
          >
            <img
              src={product.img}
              alt={product.name}
              style={{ width: "100%", height: "150px", borderRadius: "8px", objectFit: "cover" }}
            />
            <h3 style={{ marginTop: 12, marginBottom: 8 }}>{product.name}</h3>
            <p style={{ margin: 0, fontWeight: "600", color: colors.textDark }}>
              ₹{product.price} / Quintal
            </p>
            <button
              style={{
                marginTop: 12,
                padding: ".6rem 1.4rem",
                background: colors.primaryGreen,
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: ".2s",
              }}
              onMouseEnter={(e) => (e.target.style.background = colors.accent)}
              onMouseLeave={(e) => (e.target.style.background = colors.primaryGreen)}
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerDashboard;
