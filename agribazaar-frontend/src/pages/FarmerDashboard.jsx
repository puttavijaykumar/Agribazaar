import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI", background: "#f1f8e9", minHeight: "100vh" }}>
      <header style={{
        background: "#388e3c",
        padding: "1rem 2rem",
        borderRadius: "12px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem"
      }}>
        <h2>👨‍🌾 Farmer Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{
            background: "#fff",
            color: "#388e3c",
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Logout
        </button>
      </header>

      <h3 style={{ color: "#1b5e20" }}>Welcome, {user?.username} 👋</h3>

      <div style={{
        marginTop: "2rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.5rem"
      }}>
        <div style={card}>🌾 Sell Crops</div>
        <div style={card}>🛠 Buy Tools</div>
        <div style={card}>📈 Market Prices</div>
        <div style={card}>💧 Irrigation Support</div>
      </div>
    </div>
  );
};

const card = {
  background: "white",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  textAlign: "center",
  fontSize: "1.2rem",
  cursor: "pointer"
};

export default FarmerDashboard;
