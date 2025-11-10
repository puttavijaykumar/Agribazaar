import React from "react";
import { useNavigate } from "react-router-dom";

function FarmerNavbar({ user }) {
  const navigate = useNavigate();

  const goToProfileSettings = () => {
    navigate("/profile");
  };

  const goToNotifications = () => {
    alert("Showing Notifications...");
  };

  const goToBuyerDashboard = () => {
    navigate("/buyer/dashboard");
  };

  return (
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
      <div>
        <h1 style={{ margin: 0, fontSize: "clamp(1rem, 4vw, 1.5rem)", fontWeight: "800" }}>
          AgriBazaar
        </h1>
        <p style={{ margin: "0.2rem 0 0 0", fontSize: "clamp(0.7rem, 2vw, 0.85rem)", opacity: 0.9 }}>
          Farmer Dashboard
        </p>
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
          Profile
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
          Notifications ({user.notifications.length})
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
  );
}

export default FarmerNavbar;
