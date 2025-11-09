import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const SelectRolePage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const chooseRole = async (role) => {
    setLoading(true);
    try {
      await AuthService.setRole(role);

      // Navigate to correct dashboard
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
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      key: "farmer",
      title: "Farmer",
      icon: "🌾",
      description: "Manage your crops, sell produce, and connect with buyers",
      color: "#d4a574",
      gradient: "linear-gradient(135deg, #8b6914 0%, #b8860b 100%)",
      features: ["List Products", "Track Sales", "Analytics"]
    },
    {
      key: "buyer",
      title: "Buyer",
      icon: "🛒",
      description: "Browse fresh produce and purchase directly from farmers",
      color: "#7fb3d5",
      gradient: "linear-gradient(135deg, #1e5a8e 0%, #2d8659 100%)",
      features: ["Browse Catalog", "Track Orders", "Reviews"]
    },
    {
      key: "both",
      title: "Merchant",
      icon: "🤝",
      description: "Both buy and sell agricultural products",
      color: "#9b59b6",
      gradient: "linear-gradient(135deg, #6c2d8e 0%, #8e44ad 100%)",
      features: ["Full Access", "Both Roles", "Premium Features"]
    }
  ];

  return (
    <div style={containerStyle}>
      {/* Animated Background Elements */}
      <div style={bgBlobStyle1}></div>
      <div style={bgBlobStyle2}></div>
      <div style={bgBlobStyle3}></div>

      {/* Header Section */}
      <div style={headerStyle}>
        <div style={logoStyle}>🌿</div>
        <h1 style={titleStyle}>Welcome to AgriBazaar</h1>
        <p style={subtitleStyle}>Choose your role to unlock the full potential of agricultural commerce</p>
      </div>

      {/* Grid of Role Cards */}
      <div style={gridStyle}>
        {roles.map((role) => (
          <div
            key={role.key}
            style={{
              ...cardStyle,
              ...(hoveredCard === role.key ? cardHoverStyle : {}),
              borderLeft: `5px solid ${role.color}`
            }}
            onMouseEnter={() => setHoveredCard(role.key)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => !loading && chooseRole(role.key)}
          >
            {/* Card Badge */}
            <div style={{
              ...badgeStyle,
              background: role.gradient
            }}>
              {role.icon}
            </div>

            {/* Card Content */}
            <h3 style={cardTitleStyle}>{role.title}</h3>
            <p style={cardDescriptionStyle}>{role.description}</p>

            {/* Features List */}
            <div style={featuresListStyle}>
              {role.features.map((feature, idx) => (
                <div key={idx} style={featureItemStyle}>
                  <span style={featureDotStyle}>✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <button
              style={{
                ...cardButtonStyle,
                background: role.gradient,
                opacity: loading && selectedRole !== role.key ? 0.6 : 1,
                transform: hoveredCard === role.key ? "scale(1.05)" : "scale(1)"
              }}
              onMouseEnter={(e) => {
                if (hoveredCard === role.key && !loading) {
                  e.target.style.filter = "brightness(1.1)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.filter = "brightness(1)";
              }}
              onClick={() => {
                setSelectedRole(role.key);
                chooseRole(role.key);
              }}
              disabled={loading && selectedRole !== role.key}
            >
              {loading && selectedRole === role.key ? (
                <span>
                  <span style={{ animation: "spin 1s linear infinite" }}>⚙️</span> Setting up...
                </span>
              ) : (
                `Continue as ${role.title}`
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div style={footerStyle}>
        <p style={footerTextStyle}>
          💡 You can change your role anytime from your account settings
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Phones (320px - 480px) */
        @media (max-width: 480px) {
          body {
            overflow-x: hidden;
          }
        }

        /* Small Devices (481px - 600px) */
        @media (max-width: 600px) {
          body {
            overflow-x: hidden;
          }
        }

        /* Tablets & Medium Devices (601px - 900px) */
        @media (min-width: 601px) and (max-width: 900px) {
          /* Smooth transitions for tablet */
        }

        /* Large Screens (901px+) */
        @media (min-width: 901px) {
          /* Optimized for desktop */
        }
      `}</style>
    </div>
  );
};

const containerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f3d1f 0%, #1a5d2e 50%, #2d8659 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "clamp(1rem, 4vw, 2rem)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  position: "relative",
  overflow: "hidden"
};

const bgBlobStyle1 = {
  position: "absolute",
  width: "clamp(200px, 30vw, 400px)",
  height: "clamp(200px, 30vw, 400px)",
  background: "rgba(74, 124, 44, 0.1)",
  borderRadius: "50%",
  top: "clamp(-50px, -10vh, -100px)",
  right: "clamp(-50px, -5vw, -100px)",
  animation: "float 6s ease-in-out infinite"
};

const bgBlobStyle2 = {
  position: "absolute",
  width: "clamp(150px, 25vw, 300px)",
  height: "clamp(150px, 25vw, 300px)",
  background: "rgba(45, 80, 22, 0.15)",
  borderRadius: "50%",
  bottom: "clamp(20px, 5vh, 50px)",
  left: "clamp(-40px, -5vw, -80px)",
  animation: "float 8s ease-in-out infinite 1s"
};

const bgBlobStyle3 = {
  position: "absolute",
  width: "clamp(125px, 20vw, 250px)",
  height: "clamp(125px, 20vw, 250px)",
  background: "rgba(74, 124, 44, 0.08)",
  borderRadius: "50%",
  top: "50%",
  right: "clamp(5%, 10vw, 10%)",
  animation: "float 7s ease-in-out infinite 2s"
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "clamp(2rem, 8vw, 4rem)",
  marginTop: "clamp(0.5rem, 3vw, 1rem)",
  position: "relative",
  zIndex: 10,
  animation: "slideIn 0.8s ease",
  maxWidth: "90%"
};

const logoStyle = {
  fontSize: "clamp(2.5rem, 10vw, 4rem)",
  marginBottom: "clamp(0.5rem, 3vw, 1rem)",
  animation: "float 4s ease-in-out infinite",
  display: "inline-block"
};

const titleStyle = {
  fontSize: "clamp(1.8rem, 8vw, 3.2rem)",
  background: "linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: "clamp(0.5rem, 2vw, 0.8rem)",
  fontWeight: "800",
  letterSpacing: "-1px",
  margin: "0 0 clamp(0.5rem, 2vw, 0.8rem) 0"
};

const subtitleStyle = {
  fontSize: "clamp(0.95rem, 4vw, 1.2rem)",
  color: "#d0e8d8",
  fontWeight: "400",
  maxWidth: "100%",
  margin: "0 auto",
  lineHeight: "1.6",
  padding: "0 clamp(0.5rem, 3vw, 0)"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(clamp(280px, 90vw, 300px), 1fr))",
  gap: "clamp(1.5rem, 4vw, 2.5rem)",
  maxWidth: "1100px",
  width: "100%",
  marginBottom: "clamp(2rem, 5vw, 3rem)",
  position: "relative",
  zIndex: 10,
  padding: "0 clamp(0.5rem, 2vw, 0)"
};

const cardStyle = {
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 252, 248, 0.98) 100%)",
  borderRadius: "clamp(15px, 3vw, 20px)",
  padding: "clamp(1.5rem, 5vw, 2.5rem) clamp(1rem, 4vw, 2rem)",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
  transition: "all 0.4s cubic-bezier(0.23, 1, 0.320, 1)",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(74, 124, 44, 0.1)"
};

const cardHoverStyle = {
  transform: "translateY(clamp(-8px, -2vw, -12px)) scale(1.02)",
  boxShadow: "0 40px 80px rgba(0, 0, 0, 0.25)"
};

const badgeStyle = {
  fontSize: "clamp(2.5rem, 8vw, 4rem)",
  width: "clamp(80px, 15vw, 100px)",
  height: "clamp(80px, 15vw, 100px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "clamp(15px, 3vw, 20px)",
  marginBottom: "clamp(1rem, 3vw, 1.5rem)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  animation: "slideIn 0.6s ease"
};

const cardTitleStyle = {
  fontSize: "clamp(1.3rem, 5vw, 1.8rem)",
  color: "#1a5d2e",
  marginBottom: "clamp(0.5rem, 2vw, 0.8rem)",
  fontWeight: "800",
  letterSpacing: "-0.5px",
  margin: "0 0 clamp(0.5rem, 2vw, 0.8rem) 0"
};

const cardDescriptionStyle = {
  fontSize: "clamp(0.85rem, 3vw, 1rem)",
  color: "#555555",
  marginBottom: "clamp(1rem, 2vw, 1.5rem)",
  lineHeight: "1.6",
  fontWeight: "500"
};

const featuresListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "clamp(0.5rem, 2vw, 0.8rem)",
  width: "100%",
  marginBottom: "clamp(1rem, 2vw, 1.5rem)",
  flexGrow: 1
};

const featureItemStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(0.3rem, 1vw, 0.5rem)",
  fontSize: "clamp(0.8rem, 3vw, 0.95rem)",
  color: "#333",
  fontWeight: "500"
};

const featureDotStyle = {
  fontSize: "clamp(0.9rem, 3vw, 1.2rem)",
  color: "#2d8659",
  fontWeight: "bold"
};

const cardButtonStyle = {
  padding: "clamp(10px, 3vw, 14px) clamp(20px, 5vw, 28px)",
  borderRadius: "clamp(10px, 2vw, 12px)",
  border: "none",
  cursor: "pointer",
  color: "white",
  fontWeight: "700",
  fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
  transition: "all 0.3s ease",
  width: "100%",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(0.3rem, 1vw, 0.5rem)"
};

const footerStyle = {
  position: "relative",
  zIndex: 10,
  marginTop: "clamp(1.5rem, 4vw, 2rem)",
  width: "100%",
  maxWidth: "90%",
  padding: "0 clamp(0.5rem, 2vw, 0)"
};

const footerTextStyle = {
  fontSize: "clamp(0.8rem, 3vw, 0.95rem)",
  color: "#c8e6c8",
  textAlign: "center",
  fontWeight: "500",
  background: "rgba(255, 255, 255, 0.1)",
  padding: "clamp(0.8rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)",
  borderRadius: "clamp(10px, 2vw, 12px)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)"
};

export default SelectRolePage;