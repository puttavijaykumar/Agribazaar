import { Link, useNavigate } from "react-router-dom";
import React from "react";
import AuthService from "../services/AuthService";

// ... all your color, style, and data definitions remain unchanged ...

const BuyerDashboard = () => {
  const [hoverOffer, setHoverOffer] = React.useState(null);
  const [hoverCategory, setHoverCategory] = React.useState(null);
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: colors.lightBg,
        minHeight: "100vh",
        color: colors.contrastText,
      }}
    >
      {/* ---------- NAVIGATION BAR ---------- */}
      <nav style={navbarStyle}>
        <div>
          <h1 style={{ fontSize: "clamp(1.2rem, 4vw, 1.5rem)", margin: "0" }}>Agribazaar</h1>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: colors.harvestYellow,
              color: colors.primaryGreen,
            }}
            onClick={() => navigate("/farmer/dashboard")}
          >
            Farmer
          </button>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: colors.harvestYellow,
              color: colors.primaryGreen,
            }}
            onClick={() => navigate("/buyer/dashboard")}
          >
            Buyer
          </button>

          {user ? (
            <button
              onClick={AuthService.logout}
              style={{
                ...buttonStyle,
                backgroundColor: "#fff",
                color: "#d32f2f",
                borderRadius: "30px",
                padding: "0.6rem 1.8rem",
                fontWeight: "700",
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: "white",
                  color: colors.primaryGreen,
                  borderRadius: "30px",
                  padding: "0.6rem 1.8rem",
                }}
              >
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* ---------- SECTION 1: SHOP BY CATEGORY ---------- */}
      <h2
        style={{
          fontSize: "clamp(1.3rem, 5vw, 2rem)",
          fontWeight: "800",
          textAlign: "left",
          marginLeft: "2rem",
          marginBottom: "16px",
          color: colors.primaryGreen,
          marginTop: "2rem",
        }}
      >
        🛍️ Shop By Category
      </h2>

      <section style={mainCategoryContainerStyle}>
        {mainCategoryBoxes.map((item, idx) => (
          <div
            key={idx}
            style={mainCategoryBoxStyle(idx)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span style={{ fontSize: "1.9rem", marginRight: 12 }}>{item.emoji}</span>
            <span>{item.label}</span>
          </div>
        ))}
        {/* Empty space for scroll padding */}
        <div style={{ minWidth: "2rem", flexShrink: 0 }}></div>
      </section>

      {/* ---------- SECTION 2: TOP OFFERS ---------- */}
      <h2
        style={{
          fontSize: "clamp(1.3rem, 5vw, 2rem)",
          fontWeight: "800",
          textAlign: "left",
          marginLeft: "2rem",
          marginBottom: "16px",
          color: colors.primaryGreen,
          marginTop: "2rem",
        }}
      >
        🎉 Top Offers
      </h2>
      <section style={offersContainer}>
        {offerProducts.map(({ title, desc, img }, idx) => (
          <div
            key={idx}
            style={{
              ...offerCardStyle,
              transform: hoverOffer === idx ? "scale(1.05)" : "scale(1)",
              boxShadow:
                hoverOffer === idx
                  ? "0 8px 16px rgba(0,0,0,0.2)"
                  : "0 4px 8px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={() => setHoverOffer(idx)}
            onMouseLeave={() => setHoverOffer(null)}
          >
            <img src={img} alt={title} style={offerImgStyle} />
            <h3 style={{ fontSize: "0.95rem", margin: "0.5rem 0 0.3rem" }}>{title}</h3>
            <p style={{ fontSize: "0.85rem", margin: "0", color: "#666" }}>{desc}</p>
          </div>
        ))}
      </section>

      {/* ---------- SECTION 3: PRODUCT CATEGORIES ---------- */}
      <h2
        style={{
          fontSize: "clamp(1.3rem, 5vw, 2rem)",
          fontWeight: "800",
          textAlign: "left",
          marginLeft: "2rem",
          marginBottom: "16px",
          color: colors.primaryGreen,
          marginTop: "2rem",
        }}
      >
        🌾 Shop Crops, Livestock & More
      </h2>
      <section style={categoryContainerStyle}>
        {productCategories.map(({ name, img }, idx) => (
          <div key={idx} style={{ textAlign: "center", flexShrink: 0 }}>
            <img
              src={img}
              alt={name}
              style={{
                ...categoryImageStyle,
                transform: hoverCategory === idx ? "scale(1.05)" : "scale(1)",
                boxShadow:
                  hoverCategory === idx
                    ? "0 8px 16px rgba(0,0,0,0.2)"
                    : "0 4px 10px rgba(0,0,0,0.15)",
              }}
              onMouseEnter={() => setHoverCategory(idx)}
              onMouseLeave={() => setHoverCategory(null)}
            />
            <p
              style={{
                marginTop: "1rem",
                fontWeight: "600",
                fontSize: "clamp(0.85rem, 2vw, 1.15rem)",
                margin: "1rem 0 0 0",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </p>
          </div>
        ))}
        {/* Empty space for scroll padding */}
        <div style={{ minWidth: "2rem", flexShrink: 0 }}></div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <EnhancedFooter />

      <style>{`
        section::-webkit-scrollbar {
          display: none;
        }
        section {
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
};

export default BuyerDashboard;
