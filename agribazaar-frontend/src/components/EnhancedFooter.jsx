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
  gap: "clamp(1.5rem, 3vw, 3rem)",
  overflowX: "auto",
  overflowY: "hidden",
  padding: "1rem clamp(1rem, 3vw, 2rem)",
  scrollBehavior: "smooth",
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

const footerColumnStyle = {
  flex: "0 0 auto",
  minWidth: "280px",
  maxWidth: "320px",
  padding: "clamp(1.2rem, 2.5vw, 1.8rem)",
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "clamp(8px, 2vw, 12px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s ease",
  backdropFilter: "blur(10px)",
  margin: "0.5rem 0",
  boxSizing: "border-box",
};

const footerColumnHoverStyle = {
  ...footerColumnStyle,
  background: "rgba(255, 255, 255, 0.1)",
  transform: "translateY(-5px)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
};

const footerColumnTitleStyle = {
  fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
  fontWeight: "700",
  color: "#aed581",
  marginBottom: "clamp(0.8rem, 1.5vw, 1.2rem)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  margin: "0 0 clamp(0.8rem, 1.5vw, 1.2rem) 0",
};

const footerLinkStyle = {
  fontSize: "clamp(0.8rem, 2vw, 1rem)",
  color: "#e8f5e9",
  textDecoration: "none",
  transition: "all 0.3s ease",
  cursor: "pointer",
  fontWeight: "500",
  padding: "clamp(0.4rem, 1vw, 0.6rem) 0",
  display: "block",
  lineHeight: "1.4",
};

const dividerStyle = {
  height: "1px",
  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
  margin: "clamp(2rem, 4vw, 3rem) auto",
  maxWidth: "1400px",
  width: "calc(100% - clamp(2rem, 6vw, 4rem))",
  position: "relative",
  zIndex: 2,
};

const bottomTextStyle = {
  textAlign: "center",
  fontSize: "clamp(0.8rem, 2vw, 1rem)",
  color: "#b3e5fc",
  marginTop: "clamp(1rem, 2vw, 2rem)",
  fontWeight: "500",
  position: "relative",
  zIndex: 2,
  padding: "0 clamp(1rem, 3vw, 2rem)",
  maxWidth: "1400px",
  margin: "clamp(1rem, 2vw, 2rem) auto 0",
};

const EnhancedFooter = () => {
  const [hovered, setHovered] = React.useState(null);

  const footerColumns = [
    {
      title: "GET TO KNOW US",
      links: ["About Agribazaar", "Careers", "Press Release", "Agri Science"],
    },
    {
      title: "CONNECT WITH US",
      links: ["LinkedIn", "X", "Instagram"],
    },
    {
      title: "MAKE MONEY WITH US",
      links: [
        "Sell on Agribazaar",
        "Become a Supplier",
        "Farm Partnerships",
        "Advertise Your Products",
      ],
    },
    {
      title: "LET US HELP YOU",
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

      {/* Main Footer Content - Horizontal Scroll Only */}
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

      {/* Divider */}
      <div style={dividerStyle}></div>

      {/* Copyright */}
      <div style={bottomTextStyle}>
        © 2024 AgriBazaar. All rights reserved. | Connecting Farmers & Buyers Across India
      </div>

      <style>{`
        /* Hide scrollbar but keep scrolling */
        .footer-content::-webkit-scrollbar {
          display: none;
        }
        
        /* For larger screens - distribute evenly without scrolling */
        @media (min-width: 1200px) {
          .footer-content {
            justify-content: space-between !important;
            overflow-x: visible !important;
            flex-wrap: nowrap !important;
          }
          .footer-column {
            flex: 1 !important;
            min-width: auto !important;
            max-width: none !important;
          }
        }

        /* For medium screens - keep horizontal scrolling */
        @media (min-width: 768px) and (max-width: 1199px) {
          .footer-content {
            gap: 2rem !important;
          }
          .footer-column {
            min-width: 250px !important;
          }
        }

        /* For mobile - horizontal scrolling with comfortable touch targets */
        @media (max-width: 767px) {
          .footer-content {
            gap: 1.5rem !important;
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
          }
          .footer-column {
            min-width: 260px !important;
          }
        }

        @media (max-width: 600px) {
          /* Mobile optimizations */
          a, button {
            font-size: 16px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default EnhancedFooter;