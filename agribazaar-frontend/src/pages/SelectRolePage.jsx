import React from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const SelectRolePage = () => {
  const navigate = useNavigate();

  const chooseRole = async (role) => {
    try {
      await AuthService.setRole(role);

      // ✅ Navigate to correct dashboard
      if (role === "farmer") {
        navigate("/farmer/dashboard");
      } else if (role === "buyer") {
        navigate("/buyer/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.log(err);
      alert("Error saving role. Please login again.");
      navigate("/login");
    }
  };

  const roles = [
    {
      key: "farmer",
      title: "Farmer",
      icon: "🌾",
      description: "Manage your crops, sell produce, and connect with buyers"
    },
    {
      key: "buyer",
      title: "Buyer",
      icon: "🛒",
      description: "Browse fresh produce and purchase directly from farmers"
    },
    {
      key: "both",
      title: "Merchant",
      icon: "🤝",
      description: "Both buy and sell agricultural products"
    }
  ];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Welcome to FarmHub</h1>
        <p style={subtitleStyle}>Select your role to get started</p>
      </div>

      <div style={gridStyle}>
        {roles.map((role) => (
          <div key={role.key} style={cardStyle} onClick={() => chooseRole(role.key)}>
            <div style={iconStyle}>{role.icon}</div>
            <h3 style={cardTitleStyle}>{role.title}</h3>
            <p style={cardDescriptionStyle}>{role.description}</p>
            <button style={cardButtonStyle}>
              Continue as {role.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1e5128 0%, #2d8659 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
  fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "3rem",
  marginTop: "2rem"
};

const titleStyle = {
  fontSize: "2.5rem",
  color: "#ffffff",
  marginBottom: "0.5rem",
  fontWeight: "700"
};

const subtitleStyle = {
  fontSize: "1.1rem",
  color: "#d0e8d8",
  fontWeight: "400"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "2rem",
  maxWidth: "1000px",
  width: "100%"
};

const cardStyle = {
  background: "#ffffff",
  borderRadius: "15px",
  padding: "2rem",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  ":hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)"
  }
};

const cardStyleHover = {
  ...cardStyle,
  transform: "translateY(-5px)",
  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)"
};

const iconStyle = {
  fontSize: "3.5rem",
  marginBottom: "1rem"
};

const cardTitleStyle = {
  fontSize: "1.5rem",
  color: "#1e5128",
  marginBottom: "0.8rem",
  fontWeight: "700"
};

const cardDescriptionStyle = {
  fontSize: "0.95rem",
  color: "#666666",
  marginBottom: "1.5rem",
  lineHeight: "1.5",
  flexGrow: 1
};

const cardButtonStyle = {
  padding: "12px 24px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#2d8659",
  color: "white",
  fontWeight: "600",
  fontSize: "0.95rem",
  transition: "0.3s",
  width: "100%"
};

export default SelectRolePage;