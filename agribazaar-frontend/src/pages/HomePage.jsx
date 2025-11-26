import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import TopOffersSection from "../components/TopOffersSection"; // LINE 4
import HomeNavbar from "../components/HomeNavbar";  // IMPORT THE NEW NAVBAR
import AgricultureNewsSection from "../components/AgricultureNewsSection";


const user = JSON.parse(localStorage.getItem("user"));

const colors = {
  primaryGreen: "#388e3c",
  secondaryGreen: "#81c784",
  earthBrown: "#795548",
  harvestYellow: "#f4f3ebff",
  skyBlue: "#aed581",
  lightBg: "#f1f8e9",
  contrastText: "#263238",
};

const navbarStyle = {
  backgroundColor: colors.primaryGreen,
  color: "white",
  padding: "clamp(0.8rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
};

const buttonStyle = {
  backgroundColor: colors.secondaryGreen,
  color: colors.contrastText,
  borderRadius: "20px",
  padding: "clamp(0.4rem, 1.5vw, 0.6rem) clamp(0.8rem, 2vw, 1.2rem)",
  margin: "0 clamp(0.2rem, 0.5vw, 0.5rem)",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
  fontWeight: "600",
  border: "none",
  whiteSpace: "nowrap",
};

const mainCategoryBoxes = [
  { label: "Seeds", emoji: "🌱" },
  { label: "Fertilizers", emoji: "🌾" },
  { label: "Tools", emoji: "🛠️" },
  { label: "Equipment", emoji: "🚜" },
  { label: "Irrigation", emoji: "💧" },
];

const mainCategoryBoxStyle = (index) => ({
  background: "linear-gradient(105deg, #aee571 85%, #d9e7c5 100%)",
  boxShadow: "0 4px 12px rgba(56,142,60,0.07)",
  borderRadius: "28px",
  height: "70px",
  minWidth: "180px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "1.35rem",
  color: "#388e3c",
  transition: "transform 0.2s",
  cursor: "pointer",
  flexShrink: 0,
  marginLeft: "2rem",
  marginRight: "2rem",
});

const mainCategoryContainerStyle = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "24px",
  padding: "36px 0",
  marginBottom: "16px",
  overflowX: "auto",
  overflowY: "hidden",
  background: "#e5f8dd",
  scrollBehavior: "smooth",
  WebkitOverflowScrolling: "touch",
};

const newsSectionStyle = {
  width: "100%",
  background: "#c1f5bbff",
  color: "#263238",
  padding: "18px 2rem",
  fontSize: "1rem",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "60px",
  fontWeight: 500,
  letterSpacing: "0.5px",
  overflowX: "auto",
  overflowY: "hidden",
  scrollBehavior: "smooth",
  WebkitOverflowScrolling: "touch",
};

const categoryContainerStyle = {
  display: "flex",
  gap: "20px",
  margin: "20px 0",
  justifyContent: "flex-start",
  overflowX: "auto",
  overflowY: "hidden",
  scrollBehavior: "smooth",
  WebkitOverflowScrolling: "touch",
};

const categoryImageStyle = {
  width: "200px",
  height: "200px",
  borderRadius: "16px",
  objectFit: "cover",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  transition: "transform 0.3s ease",
  flexShrink: 0,
  marginLeft: "2rem",
  marginRight: "2rem",
};

const productCategories = [
  {
    name: "Spices",
    img: "https://res.cloudinary.com/dpiogqjk4/image/upload/v1761934252/spices_cloudinary_mswpm9.jpg",
  },
  {
    name: "Oilseeds",
    img: "https://res.cloudinary.com/dpiogqjk4/image/upload/v1761934307/oilseeds_cloudinary_ffa2hf.jpg",
  },
  {
    name: "Dry Fruits",
    img: "https://res.cloudinary.com/dpiogqjk4/image/upload/v1761934341/dryfuits_cloudinary_kqb6rl.jpg",
  },
  {
    name: "Organic Products",
    img: "https://res.cloudinary.com/dpiogqjk4/image/upload/v1761934621/organic_clodinary_wimhhp.jpg",
  },
  {
    name: "Farm Animals",
    img: "https://res.cloudinary.com/dpiogqjk4/image/upload/v1761934182/farm_animals_i4xgid.jpg",
  },
];

const livePricesStyle = {
  backgroundColor: colors.harvestYellow,
  color: colors.primaryGreen,
  padding: "1rem 2rem",
  display: "flex",
  gap: "2rem",
  overflowX: "auto",
  overflowY: "hidden",
  fontWeight: "600",
  borderRadius: "12px",
  margin: "1rem 2rem",
  scrollBehavior: "smooth",
  WebkitOverflowScrolling: "touch",
  paddingRight: "3rem",
};

const footerStyle = {
  background: `linear-gradient(135deg, #0d3822 0%, #1b5e20 25%, #2d6a4f 50%, #1b5e20 75%, #0d3822 100%)`,
  color: "white",
  padding: "4rem 3rem",
  marginTop: "2rem",
  position: "relative",
  overflow: "hidden",
};

const footerBackgroundBlob = {
  position: "absolute",
  borderRadius: "50%",
  opacity: "0.08",
  pointerEvents: "none",
};

const blob1Style = {
  ...footerBackgroundBlob,
  width: "400px",
  height: "400px",
  background: "#81c784",
  top: "-100px",
  right: "-100px",
};

const blob2Style = {
  ...footerBackgroundBlob,
  width: "300px",
  height: "300px",
  background: "#aed581",
  bottom: "-80px",
  left: "-80px",
};

const footerContentStyle = {
  display: "flex",
  justifyContent: "flex-start",
  flexWrap: "nowrap",
  maxWidth: "100%",
  margin: "0 auto",
  position: "relative",
  zIndex: 2,
  gap: "2rem",
  overflowX: "auto",
  overflowY: "hidden",
  paddingLeft: "2rem",
  paddingRight: "3rem",
  scrollBehavior: "smooth",
  WebkitOverflowScrolling: "touch",
};

const footerColumnStyle = {
  margin: "1rem",
  minWidth: "150px",
  padding: "1.5rem",
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s ease",
  backdropFilter: "blur(10px)",
  flexShrink: 0,
};

const footerColumnHoverStyle = {
  ...footerColumnStyle,
  background: "rgba(255, 255, 255, 0.1)",
  transform: "translateY(-5px)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  flexShrink: 0,
};

const footerColumnTitleStyle = {
  fontSize: "1.1rem",
  fontWeight: "700",
  color: "#aed581",
  marginBottom: "1rem",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const footerLinkStyle = {
  fontSize: "0.95rem",
  color: "#e8f5e9",
  textDecoration: "none",
  transition: "all 0.3s ease",
  cursor: "pointer",
  fontWeight: "500",
  padding: "0.5rem 0",
  display: "block",
};

const dividerStyle = {
  height: "1px",
  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
  margin: "2rem 0",
  position: "relative",
  zIndex: 2,
};

const bottomTextStyle = {
  textAlign: "center",
  fontSize: "0.9rem",
  color: "#b3e5fc",
  marginTop: "1.5rem",
  fontWeight: "500",
  position: "relative",
  zIndex: 2,
};

const EnhancedFooter = () => {
  const [hovered, setHovered] = React.useState(null);

  const footerColumns = [
    {
      title: "Get to Know Us",
      links: ["About Agribazaar", "Careers", "Press Releases", "Agri Science"],
    },
    {
      title: "Connect with Us",
      links: ["LinkedIn", "X", "Instagram"],
    },
    {
      title: "Make Money with Us",
      links: [
        "Sell on Agribazaar",
        "Become a Supplier",
        "Farm Partnerships",
        "Advertise Your Products",
      ],
    },
    {
      title: "Let Us Help You",
      links: [
        "Your Account",
        "Returns Centre",
        "100% Purchase Protection",
        "Help",
      ],
    },
  ];

  return (
    <footer style={footerStyle}>
      <div style={blob1Style}></div>
      <div style={blob2Style}></div>

      <div style={footerContentStyle}>
        {footerColumns.map((column, idx) => (
          <div
            key={idx}
            style={hovered === idx ? footerColumnHoverStyle : footerColumnStyle}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            <h4 style={footerColumnTitleStyle}>{column.title}</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {column.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <a
                    href="#"
                    style={footerLinkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#aed581";
                      e.target.style.paddingLeft = "0.5rem";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#e8f5e9";
                      e.target.style.paddingLeft = "0";
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={dividerStyle}></div>

      <div style={bottomTextStyle}>
        © 2024 AgriBazaar. All rights reserved. | Connecting Farmers & Buyers Across India
      </div>
    </footer>
  );
};

const HomePage = () => {
  const [hoverCategory, setHoverCategory] = React.useState(null);
  const navigate = useNavigate();

  // Get the user (if logged in) for HomeNavbar
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  // <-- Insert news state and useEffect here -->
  const [newsItems, setNewsItems] = React.useState([]);

  React.useEffect(() => {
    AuthService.fetchAgriNews()
      .then((articles) => {
        setNewsItems(
          articles.map((article, i) => (
            <span key={article.url || i} style={{ flexShrink: 0, whiteSpace: "nowrap" }}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#226d32", fontWeight: 700, fontSize: "1rem", textDecoration: "none" }}
              >
                {article.title}
              </a>
              <span style={{ color: "#666", fontWeight: 400, marginLeft: 8, fontSize: 14 }}>
                {article.source} | {new Date(article.publishedAt).toLocaleDateString()}
              </span>
            </span>
          ))
        );
      })
      .catch(() => setNewsItems([<span key="fail" style={{color: "red"}}>Could not load news.</span>]));
  }, []);

  const handleCategoryClick = (category) => {
    const routes = {
      Seeds: "/seeds",
      Fertilizers: "/fertilizers",
      Tools: "/tools",
      Equipment: "/equipment",
      Irrigation: "/irrigation",
    };
    if (routes[category]) {
      navigate(routes[category]);
    }
  };


  return (
    <div
      style={{
        backgroundColor: colors.lightBg,
        minHeight: "100vh",
        color: colors.contrastText,
      }}
    >
      <HomeNavbar user={user} /> 
      
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
         Shop By Category
      </h2>

      <section style={mainCategoryContainerStyle}>
        {mainCategoryBoxes.map((item, idx) => (
          <div
            key={idx}
            style={mainCategoryBoxStyle(idx)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => handleCategoryClick(item.label)}
            tabIndex={0}
            role="button"
            aria-label={`Go to ${item.label} category`}
            onKeyDown={(e) => { if (e.key === "Enter") handleCategoryClick(item.label); }}
          >
            <span style={{ fontSize: "1.9rem", marginRight: 12 }}>{item.emoji}</span>
            <span>{item.label}</span>
          </div>
        ))}
        <div style={{ minWidth: "2rem", flexShrink: 0 }}></div>
      </section>


      {/* ---------- SECTION 2: AGRICULTURE NEWS ---------- */}
      {/* <h2
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
         Agriculture News & Updates
      </h2> */}

      <AgricultureNewsSection newsItems={newsItems} newsSectionStyle={newsSectionStyle} />

      {/* ---------- SECTION 3: TOP OFFERS ---------- */}
      <TopOffersSection colors={colors} />

      {/* ---------- SECTION 4: PRODUCT CATEGORIES ---------- */}
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
         Shop Crops, Livestock & More
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

      {/* ---------- SECTION 5: LIVE MARKET PRICES ---------- */}
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
         Live Market Prices
      </h2>
      <section style={livePricesStyle}>
        <span style={{ flexShrink: 0, whiteSpace: "nowrap" }}>Potato (Kangra) ₹1700 - ₹2600</span>
        <span style={{ flexShrink: 0, whiteSpace: "nowrap" }}>Banana (Palampur) ₹4300 - ₹4400</span>
        <span style={{ flexShrink: 0, whiteSpace: "nowrap" }}>Bottle gourd (Palampur) ₹3500 - ₹5000</span>
      </section>

      {/* ---------- FOOTER ---------- */}
      <EnhancedFooter />

      <style>{`
        /* Hide scrollbar but keep scrolling */
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

export default HomePage;