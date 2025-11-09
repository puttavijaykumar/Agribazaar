import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EnhancedFooter from "../components/EnhancedFooter"; // Adjust this path accordingly
import AuthService from "../services/AuthService"; // Adjust this path accordingly

// import AuthService from "../services/AuthService";

function FarmerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    address: "",
    role: "",
    notifications: [],
    products: [],
    salesData: {},
  });

  const [addressInput, setAddressInput] = useState("");
  const [hoveredDashboard, setHoveredDashboard] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await AuthService.getUserProfile();
        setUser({
          username: profileData.username,
          email: profileData.email,
          role: profileData.role,
          address: profileData.address || "",
          notifications: profileData.notifications || [],
          products: profileData.products || [],
          salesData: profileData.salesData || {},
        });
        setAddressInput(profileData.address || "");
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Optional: Redirect to login if unauthorized
      }
    };

    fetchProfile();
  }, []);

  const handleAddressUpdate = () => {
    setUser((prev) => ({ ...prev, address: addressInput }));
    alert("Address updated!");
  };

  const handleRemoveProduct = (productId) => {
    setUser((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
  };

  const goToProfileSettings = () => {
    navigate("/profile");
  };

  const goToNotifications = () => {
    alert("Showing Notifications...");
  };

  const goToBuyerDashboard = () => {
    navigate("/buyer/dashboard");
  };

  const dashboards = [
    {
      key: "upload",
      title: "Upload Products",
      color: "#81c784",
      link: "/upload-products",
    },
    {
      key: "messaging",
      title: "Negotiation & Messages",
      color: "#64b5f6",
      link: "/messages",
    },
    {
      key: "products",
      title: "My Products",
      color: "#ffd54f",
      link: "/my-products",
    },
    {
      key: "analytics",
      title: "Sales Analytics",
      color: "#ff8a65",
      link: "/analytics",
    },
  ];

  const dashboardCardStyle = (key) => ({
    background: `linear-gradient(135deg, ${dashboards.find((d) => d.key === key)?.color}20 0%, ${dashboards.find((d) => d.key === key)?.color}40 100%)`,
    border: `3px solid ${dashboards.find((d) => d.key === key)?.color}`,
    borderRadius: "20px",
    padding: "2rem",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.23, 1, 0.320, 1)",
    boxShadow:
      hoveredDashboard === key
        ? `0 0 40px ${dashboards.find((d) => d.key === key)?.color}66, 0 20px 40px rgba(0, 0, 0, 0.15)`
        : `0 10px 30px rgba(0, 0, 0, 0.1)`,
    transform: hoveredDashboard === key ? "translateY(-15px) scale(1.05)" : "translateY(0) scale(1)",
    position: "relative",
    overflow: "hidden",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)",
        paddingBottom: "3rem",
      }}
    >
      {/* Animated Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 20% 50%, rgba(129, 199, 132, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      ></div>

      {/* Top Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 2rem",
          background: "linear-gradient(135deg, #1b5e20 0%, #2d8e4a 100%)",
          color: "white",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "2rem" }}></span>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "800" }}>
              AgriBazaar
            </h1>
            <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", opacity: 0.9 }}>
              Farmer Dashboard
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            onClick={goToProfileSettings}
            style={{
              padding: "0.7rem 1.2rem",
              borderRadius: "10px",
              border: "2px solid #aed581",
              background: "transparent",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#aed581";
              e.target.style.color = "#1b5e20";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "white";
            }}
          >
            👤 Profile Settings
          </button>

          <button
            onClick={goToNotifications}
            style={{
              padding: "0.7rem 1.2rem",
              borderRadius: "10px",
              border: "2px solid #aed581",
              background: "transparent",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#aed581";
              e.target.style.color = "#1b5e20";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "white";
            }}
          >
            🔔 Notifications ({user.notifications.length})
          </button>

          {user.role === "both" && (
            <button
              onClick={goToBuyerDashboard}
              style={{
                padding: "0.7rem 1.2rem",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #aed581 0%, #81c784 100%)",
                color: "#1b5e20",
                fontWeight: "700",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.08)";
                e.target.style.boxShadow = "0 8px 20px rgba(129, 199, 132, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              Switch to Buyer
            </button>
          )}
        </div>
      </nav>

      {/* Welcome Section */}
      <div style={{ padding: "2rem", textAlign: "center", marginBottom: "1rem" }}>
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            color: "#1b5e20",
            margin: "0 0 0.5rem 0",
          }}
        >
          Welcome back, {user.username}!
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#555", margin: 0 }}>
          Manage your agricultural business efficiently
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          padding: "2rem",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {dashboards.map((dashboard) => (
          <div
            key={dashboard.key}
            style={dashboardCardStyle(dashboard.key)}
            onMouseEnter={() => setHoveredDashboard(dashboard.key)}
            onMouseLeave={() => setHoveredDashboard(null)}
            onClick={() => navigate(dashboard.link)}
          >
            {/* Glow Effect */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `radial-gradient(circle at center, ${dashboard.color}20 0%, transparent 70%)`,
                pointerEvents: "none",
                opacity: hoveredDashboard === dashboard.key ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            ></div>

            {/* Content */}
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontSize: "3.5rem",
                  marginBottom: "1rem",
                  filter: hoveredDashboard === dashboard.key ? "scale(1.15)" : "scale(1)",
                  transition: "filter 0.3s ease",
                  display: "inline-block",
                }}
              >
                {dashboard.icon}
              </div>

              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: "#1b5e20",
                  margin: "0.5rem 0",
                }}
              >
                {dashboard.title}
              </h3>

              <div
                style={{
                  height: "3px",
                  width: "60px",
                  background: dashboard.color,
                  margin: "1rem 0",
                  borderRadius: "2px",
                  transform: hoveredDashboard === dashboard.key ? "scaleX(1.5)" : "scaleX(1)",
                  transformOrigin: "center",
                  transition: "transform 0.3s ease",
                }}
              ></div>

              <p
                style={{
                  color: "#555",
                  fontSize: "0.95rem",
                  margin: "1rem 0 0 0",
                  fontWeight: "500",
                }}
              >
                {dashboard.key === "upload" && "Add and list your agricultural products"}
                {dashboard.key === "messaging" && "Communicate with buyers and negotiate prices"}
                {dashboard.key === "products" && "Manage your listed products and inventory"}
                {dashboard.key === "analytics" && "Track sales performance and market trends"}
              </p>

              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "0.8rem 1.5rem",
                  background: dashboard.color,
                  color: "white",
                  borderRadius: "10px",
                  fontWeight: "700",
                  textAlign: "center",
                  transform: hoveredDashboard === dashboard.key ? "translateX(5px)" : "translateX(0)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                }}
              >
                Access →
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          padding: "2rem",
          maxWidth: "1400px",
          margin: "2rem auto",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #81c78410 0%, #81c78420 100%)",
            border: "2px solid #81c784",
            borderRadius: "15px",
            padding: "1.5rem",
            textAlign: "center",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 0 30px #81c78466";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <p style={{ fontSize: "2rem", margin: 0, fontWeight: "800", color: "#81c784" }}>
            ₹{user.salesData.totalSales || 0}
          </p>
          <p style={{ fontSize: "0.9rem", color: "#555", margin: "0.5rem 0 0 0" }}>
            Total Sales
          </p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #64b5f610 0%, #64b5f620 100%)",
            border: "2px solid #64b5f6",
            borderRadius: "15px",
            padding: "1.5rem",
            textAlign: "center",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 0 30px #64b5f666";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <p style={{ fontSize: "2rem", margin: 0, fontWeight: "800", color: "#64b5f6" }}>
            {user.products?.length ?? 0}
          </p>
          <p style={{ fontSize: "0.9rem", color: "#555", margin: "0.5rem 0 0 0" }}>
            Active Products
          </p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #ffd54f10 0%, #ffd54f20 100%)",
            border: "2px solid #ffd54f",
            borderRadius: "15px",
            padding: "1.5rem",
            textAlign: "center",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 0 30px #ffd54f66";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <p style={{ fontSize: "2rem", margin: 0, fontWeight: "800", color: "#ffd54f" }}>
            {user.notifications?.length ?? 0}
          </p>
          <p style={{ fontSize: "0.9rem", color: "#555", margin: "0.5rem 0 0 0" }}>
            New Messages
          </p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #ff8a6510 0%, #ff8a6520 100%)",
            border: "2px solid #ff8a65",
            borderRadius: "15px",
            padding: "1.5rem",
            textAlign: "center",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 0 30px #ff8a6566";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <p style={{ fontSize: "2rem", margin: 0, fontWeight: "800", color: "#ff8a65" }}>
            📈
          </p>
          <p style={{ fontSize: "0.9rem", color: "#555", margin: "0.5rem 0 0 0" }}>
            {user.salesData?.recentActivity ?? ""}
          </p>
        </div>
      </div>

      {/* Footer Link */}
      <div style={{ textAlign: "center", padding: "2rem", marginTop: "2rem" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.8rem 2rem",
            borderRadius: "15px",
            background: "linear-gradient(135deg, #1b5e20 0%, #2d8e4a 100%)",
            color: "white",
            fontWeight: "700",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "all 0.3s ease",
            boxShadow: "0 5px 15px rgba(27, 94, 32, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 10px 25px rgba(27, 94, 32, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 5px 15px rgba(27, 94, 32, 0.3)";
          }}
        >
          🏠 Back to Home
        </button>
      </div>

      {/* Footer */}
      <EnhancedFooter />
    </div>
  );
}

export default FarmerDashboard;
