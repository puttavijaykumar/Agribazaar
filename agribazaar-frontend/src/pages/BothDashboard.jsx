import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BothDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("farmer");

  const tabStyle = (tab) => ({
    padding: "12px 24px",
    cursor: "pointer",
    backgroundColor: activeTab === tab ? "#388e3c" : "#e8f5e9",
    color: activeTab === tab ? "white" : "#388e3c",
    borderRadius: "8px",
    border: "1px solid #388e3c",
    fontWeight: 600,
    transition: "0.2s",
  });

  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#1b5e20" }}>
        🌾 Both Dashboard (Farmer + Buyer)
      </h2>

      {/* Switch Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button style={tabStyle("farmer")} onClick={() => setActiveTab("farmer")}>Farmer View</button>
        <button style={tabStyle("buyer")} onClick={() => setActiveTab("buyer")}>Buyer View</button>
      </div>

      {/* FARMER PANEL */}
      {activeTab === "farmer" && (
        <div style={panelStyle}>
          <h3>👨‍🌾 Farmer Tools</h3>
          <ul>
            <li>Post crops for selling</li>
            <li>View market rates</li>
            <li>Manage farm product inventory</li>
          </ul>
        </div>
      )}

      {/* BUYER PANEL */}
      {activeTab === "buyer" && (
        <div style={panelStyle}>
          <h3>🛒 Buyer Tools</h3>
          <ul>
            <li>Search crops from farmers</li>
            <li>Place orders</li>
            <li>Track shipments</li>
          </ul>
        </div>
      )}

      {/* Logout Button */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#c62828",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const panelStyle = {
  background: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  maxWidth: "700px",
  margin: "auto",
};

export default BothDashboard;
