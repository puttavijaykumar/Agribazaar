// EnhancedFooter.jsx
import React from "react";

const footerStyle = {
  background: `linear-gradient(135deg, #0d3822 0%, #1b5e20 25%, #2d6a4f 50%, #1b5e20 75%, #0d3822 100%)`,
  color: "white",
  padding: "clamp(2rem, 5vw, 4rem) 0",
  marginTop: "clamp(1.5rem, 3vw, 2rem)",
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
  width: "clamp(250px, 30vw, 400px)",
  height: "clamp(250px, 30vw, 400px)",
  background: "#81c784",
  top: "clamp(-50px, -10vh, -100px)",
  right: "clamp(-50px, -5vw, -100px)",
};

const blob2Style = {
  ...footerBackgroundBlob,
  width: "clamp(150px, 25vw, 300px)",
  height: "clamp(150px, 25vw, 300px)",
  background: "#aed581",
  bottom: "clamp(20px, 5vh, 50px)",
  left: "clamp(-40px, -5vw, -80px)",
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
  padding: "clamp(1rem, 2vw, 1.5rem)",
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "clamp(8px, 2vw, 12px)",
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
  fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)",
  fontWeight: "700",
  color: "#aed581",
  marginBottom: "clamp(0.6rem, 1vw, 1rem)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  margin: "0 0 clamp(0.6rem, 1vw, 1rem) 0",
};

const footerLinkStyle = {
  fontSize: "clamp(0.75rem, 2vw, 0.95rem)",
  color: "#e8f5e9",
  textDecoration: "none",
  transition: "all 0.3s ease",
  cursor: "pointer",
  fontWeight: "500",
  padding: "clamp(0.3rem, 0.8vw, 0.5rem) 0",
  display: "block",
};

const dividerStyle = {
  height: "1px",
  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
  margin: "clamp(1.5rem, 2vw, 2rem) 0",
  position: "relative",
  zIndex: 2,
};

const bottomTextStyle = {
  textAlign: "center",
  fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
  color: "#b3e5fc",
  marginTop: "clamp(1rem, 1.5vw, 1.5rem)",
  fontWeight: "500",
  position: "relative",
  zIndex: 2,
  padding: "0 clamp(1rem, 3vw, 2rem)",
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
      {/* Background Blobs */}
      <div style={blob1Style}></div>
      <div style={blob2Style}></div>

      {/* Main Footer Content - Horizontal Scroll */}
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
        {/* End spacer for scroll padding */}
        <div style={{ minWidth: "2rem", flexShrink: 0 }}></div>
      </div>

      {/* Divider */}
      <div style={dividerStyle}></div>

      {/* Copyright */}
      <div style={bottomTextStyle}>
        © 2024 AgriBazaar. All rights reserved. | Connecting Farmers & Buyers Across India
      </div>

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
          /* Mobile optimizations */
          a, button {
            font-size: 16px !important;
          }
        }

        @media (min-width: 601px) and (max-width: 900px) {
          /* Tablet optimizations */
        }

        @media (min-width: 901px) {
          /* Desktop optimizations */
        }
      `}</style>
    </footer>
  );
};

export default EnhancedFooter;