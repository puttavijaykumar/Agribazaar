import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EnhancedFooter from "../components/EnhancedFooter";
import AuthService from "../services/AuthService";

function FarmerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    address: "",
    role: "",
    notifications: [],
    salesData: { totalSales: 0, recentActivity: "" },
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressInput, setAddressInput] = useState("");
  const [hoveredDashboard, setHoveredDashboard] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const profile = await AuthService.getUserProfile();
        setUser((prev) => ({
          ...prev,
          ...profile,
        }));
        setAddressInput(profile.address || "");

        const fetchedProducts = await AuthService.getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        alert("Session expired or error fetching data. Please login again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    setAddressInput(user.address || "");
  }, [user.address]);

  const handleAddressUpdate = () => {
    setUser((prev) => ({ ...prev, address: addressInput }));
    alert("Address updated!");
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await AuthService.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch {
      alert("Error removing product.");
    }
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
    borderRadius: "clamp(15px, 3vw, 20px)",
    padding: "clamp(1.5rem, 4vw, 2rem)",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.23, 1, 0.320, 1)",
    boxShadow:
      hoveredDashboard === key
        ? `0 0 40px ${dashboards.find((d) => d.key === key)?.color}66, 0 20px 40px rgba(0, 0, 0, 0.15)`
        : `0 10px 30px rgba(0, 0, 0, 0.1)`,
    transform: hoveredDashboard === key ? "translateY(-15px) scale(1.05)" : "translateY(0) scale(1)",
    position: "relative",
    overflow: "hidden",
    minWidth: "clamp(280px, 85vw, 300px)",
    flexShrink: 0,
  });

  const statCardStyle = (color) => ({
    background: `linear-gradient(135deg, ${color}10 0%, ${color}20 100%)`,
    border: `2px solid ${color}`,
    borderRadius: "clamp(12px, 2vw, 15px)",
    padding: "clamp(1rem, 3vw, 1.5rem)",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
    minWidth: "clamp(150px, 30vw, 200px)",
    flexShrink: 0,
    marginLeft: "1rem",
    marginRight: "1rem",
  });

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "4rem", fontSize: "1.5rem" }}>
        Loading dashboard...
      </div>
    );

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
          padding: "clamp(1rem, 2vw, 1.5rem) clamp(1rem, 3vw, 2rem)",
          background: "linear-gradient(135deg, #1b5e20 0%, #2d8e4a 100%)",
          color: "white",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(0.5rem, 2vw, 1rem)" }}>
          <span style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>🌾</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "clamp(1rem, 4vw, 1.5rem)", fontWeight: "800" }}>
              AgriBazaar
            </h1>
            <p style={{ margin: "0.2rem 0 0 0", fontSize: "clamp(0.7rem, 2vw, 0.85rem)", opacity: 0.9 }}>
              Farmer Dashboard
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "clamp(0.5rem, 1vw, 1rem)", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={goToProfileSettings}
            style={{
              padding: "clamp(0.5rem, 1.5vw, 0.7rem) clamp(0.8rem, 2vw, 1.2rem)",
              borderRadius: "10px",
              border: "2px solid #aed581",
              background: "transparent",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
              whiteSpace: "nowrap",
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
            👤 Profile
          </button>

          <button
            onClick={goToNotifications}
            style={{
              padding: "clamp(0.5rem, 1.5vw, 0.7rem) clamp(0.8rem, 2vw, 1.2rem)",
              borderRadius: "10px",
              border: "2px solid #aed581",
              background: "transparent",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
              whiteSpace: "nowrap",
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
            🔔 ({user.notifications?.length ?? 0})
          </button>

          {user.role === "both" && (
            <button
              onClick={goToBuyerDashboard}
              style={{
                padding: "clamp(0.5rem, 1.5vw, 0.7rem) clamp(0.8rem, 2vw, 1.2rem)",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #aed581 0%, #81c784 100%)",
                color: "#1b5e20",
                fontWeight: "700",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
                whiteSpace: "nowrap",
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
              Buyer
            </button>
          )}
        </div>
      </nav>

      {/* Welcome Section */}
      <div style={{ padding: "clamp(1.5rem, 4vw, 2rem)", textAlign: "center", marginBottom: "1rem" }}>
        <h2
          style={{
            fontSize: "clamp(1.8rem, 6vw, 2.5rem)",
            fontWeight: "800",
            color: "#1b5e20",
            margin: "0 0 0.5rem 0",
          }}
        >
          Welcome back, {user.username}!
        </h2>
        <p style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", color: "#555", margin: 0 }}>
          Manage your agricultural business efficiently
        </p>
      </div>

      {/* Main Dashboard Grid - Horizontal Scroll */}
      <h3 style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "800", color: "#1b5e20", margin: "2rem 0 1rem 2rem" }}>
        Dashboard Modules
      </h3>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          overflowX: "auto",
          overflowY: "hidden",
          padding: "1rem 0",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ width: "2rem", flexShrink: 0 }}></div>
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
                  fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
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
                  fontSize: "clamp(1rem, 3vw, 1.5rem)",
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
                  fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
                  margin: "1rem 0 0 0",
                  fontWeight: "500",
                  lineHeight: "1.5",
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
                  padding: "clamp(0.6rem, 1.5vw, 0.8rem) clamp(1rem, 2vw, 1.5rem)",
                  background: dashboard.color,
                  color: "white",
                  borderRadius: "10px",
                  fontWeight: "700",
                  textAlign: "center",
                  fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
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
        <div style={{ width: "2rem", flexShrink: 0 }}></div>
      </div>

      {/* Quick Stats Section - Horizontal Scroll */}
      <h3 style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "800", color: "#1b5e20", margin: "2rem 0 1rem 2rem" }}>
        Quick Stats
      </h3>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          padding: "1rem 0",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            ...statCardStyle("#81c784"),
            marginLeft: "2rem",
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
          <p style={{ fontSize: "clamp(1.3rem, 4vw, 2rem)", margin: 0, fontWeight: "800", color: "#81c784" }}>
            ₹{user.salesData.totalSales || 0}
          </p>
          <p style={{ fontSize: "clamp(0.7rem, 2vw, 0.9rem)", color: "#555", margin: "0.5rem 0 0 0" }}>
            Total Sales
          </p>
        </div>

        <div
          style={statCardStyle("#64b5f6")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 0 30px #64b5f666";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <p style={{ fontSize: "clamp(1.3rem, 4vw, 2rem)", margin: 0, fontWeight: "800", color: "#64b5f6" }}>
            {products.length ?? 0}
          </p>
          <p style={{ fontSize: "clamp(0.7rem, 2vw, 0.9rem)", color: "#555", margin: "0.5rem 0 0 0" }}>
            Active Products
          </p>
        </div>

        <div
          style={statCardStyle("#ffd54f")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 0 30px #ffd54f66";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <p style={{ fontSize: "clamp(1.3rem, 4vw, 2rem)", margin: 0, fontWeight: "800", color: "#ffd54f" }}>
            {user.notifications.length}
          </p>
          <p style={{ fontSize: "clamp(0.7rem, 2vw, 0.9rem)", color: "#555", margin: "0.5rem 0 0 0" }}>
            New Messages
          </p>
        </div>

        <div
          style={statCardStyle("#ff8a65")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 0 30px #ff8a6566";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <p style={{ fontSize: "clamp(1.3rem, 4vw, 2rem)", margin: 0, fontWeight: "800", color: "#ff8a65" }}>
            
          </p>
          <p style={{ fontSize: "clamp(0.7rem, 2vw, 0.9rem)", color: "#555", margin: "0.5rem 0 0 0" }}>
            {user.salesData.recentActivity || "No data"}
          </p>
        </div>

        <div style={{ width: "2rem", flexShrink: 0 }}></div>
      </div>

      {/* My Products Section */}
      <h3 style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "800", color: "#1b5e20", margin: "2rem 0 1rem 2rem" }}>
         My Products
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", padding: "0 2rem" }}>
        {products.length === 0 ? (
          <p style={{ color: "#888" }}>You have not uploaded any products yet.</p>
        ) : (
          products.map((prod) => (
            <div
              key={prod.id}
              style={{
                border: "2px solid #aed581",
                borderRadius: "10px",
                padding: "1rem",
                textAlign: "left",
                minWidth: "180px",
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: "700", fontSize: "1.15rem", marginBottom: "0.25rem" }}>{prod.name}</div>
              <div style={{ color: "#666" }}>Price: ₹{prod.price}</div>
              <div style={{ color: "#666" }}>QTY: {prod.quantity ?? "N/A"}</div>
              <button
                onClick={() => handleRemoveProduct(prod.id)}
                style={{ color: "#c62828", marginTop: "0.5rem", border: "none", background: "none", cursor: "pointer" }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer Link */}
      <div style={{ textAlign: "center", padding: "clamp(1.5rem, 3vw, 2rem)", marginTop: "2rem" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "clamp(0.6rem, 2vw, 0.8rem) clamp(1.5rem, 3vw, 2rem)",
            borderRadius: "15px",
            background: "linear-gradient(135deg, #1b5e20 0%, #2d8e4a 100%)",
            color: "white",
            fontWeight: "700",
            border: "none",
            cursor: "pointer",
            fontSize: "clamp(0.85rem, 2vw, 1rem)",
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
           Back to Home
        </button>
      </div>

      {/* Footer */}
      <EnhancedFooter />

      {/* Custom Styles */}
      <style>{`
        /* Hide scrollbar but keep scrolling */
        div::-webkit-scrollbar {
          display: none;
        }
        div {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (max-width: 600px) {
          input, button, textarea {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default FarmerDashboard;
