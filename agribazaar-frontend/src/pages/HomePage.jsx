import { Link } from "react-router-dom";
import React from "react";

// -------------- THEME & GLOBAL STYLES --------------
const colors = {
  primaryGreen: "#388e3c",
  secondaryGreen: "#81c784",
  earthBrown: "#795548",
  harvestYellow: "#f4f3ebff",
  skyBlue: "#aed581",
  lightBg: "#f1f8e9",
  contrastText: "#263238",
};

// -------------- NAVIGATION BAR --------------
const navbarStyle = {
  backgroundColor: colors.primaryGreen,
  color: "white",
  padding: "1rem 2rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const buttonStyle = {
  backgroundColor: colors.secondaryGreen,
  color: colors.contrastText,
  borderRadius: "20px",
  padding: "0.6rem 1.2rem",
  margin: "0 0.5rem",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

// -------------- FEATURE BAR / PRIMARY CTA ROW --------------
const mainCategoryBoxes = [
  { label: "Seeds", emoji: "🌱" },
  { label: "Fertilizers", emoji: "🌾" },
  { label: "Tools", emoji: "🛠️" },
  { label: "Equipment", emoji: "🚜" },
  { label: "Irrigation", emoji: "💧" },
];
const mainCategoryBoxStyle = {
  background: "linear-gradient(105deg, #aee571 85%, #d9e7c5 100%)",
  boxShadow: "0 4px 12px rgba(56,142,60,0.07)",
  borderRadius: "28px",
  height: "70px",
  minWidth: "180px",
  maxWidth: "210px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "1.35rem",
  margin: "0 12px",
  color: "#388e3c",
  transition: "transform 0.2s",
  cursor: "pointer",
};
const mainCategoryContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "24px",
  padding: "36px 0 32px 0",
  marginBottom: "16px",
  flexWrap: "wrap",
  background: "#e5f8dd",
};

// -------------- NEWS/ANNOUNCEMENT SECTION --------------
const newsSectionStyle = {
  width: "100%",
  background: "#c1f5bbff",
  color: "#263238",
  padding: "18px 0",
  fontSize: "1.1rem",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "60px",
  fontWeight: 500,
  letterSpacing: "0.5px",
};
const newsItems = [
  "🌾 Government sets new MSP for wheat and paddy this season",
  "🚜 AgriBazaar introduces new equipment rental scheme",
  "🛒 Online trading of maize crosses previous month record",
];

// -------------- OFFER CARDS AREA --------------
const offersContainer = {
  display: "flex",
  gap: "1rem",
  overflowX: "auto",
  padding: "1rem 2rem",
  margin: "1rem 0",
};
const offerCardStyle = {
  flex: "1 1 220px",
  maxWidth: "260px",
  minHeight: "230px",
  backgroundColor: colors.lightBg,
  color: colors.contrastText,
  padding: "1rem",
  borderRadius: "12px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  flexShrink: 0,
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "center",
  margin: "0 0.5rem",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};
const offerImgStyle = {
  width: "100%",
  height: "100px",
  objectFit: "cover",
  borderRadius: "10px",
  marginBottom: "10px",
};
const offerProducts = [
  {
    title: "Black Rice - 10% Off",
    desc: "Buy pulses with offer 10%",
    img: "https://res.cloudinary.com/dpiogqjk4/image/upload/v1757018968/lzfkpdpk0unm9dmugb2x.avif",
  },
  {
    title: "Sweet Corn - 15% Off",
    desc: "Get the finest quality red chillies at unbeatable prices!",
    img: "https://res.cloudinary.com/dpiogqjk4/image/upload/v1761923036/maize_cloudinary_vceqyu.jpg",
  },
  {
    title: "Indrayani Rice - 20% Off",
    desc: "Freshness You Can Taste – At Juicy Prices! Limited-time offer – Taste the difference today",
    img: "https://res.cloudinary.com/dpiogqjk4/image/upload/v1757094535/nuh9degi74yky2b7wrua.jpg",
  },
  {
    title: "Kolam Rice - 25% Off",
    desc: "Pure & Wholesome Wheat – Now at Special Prices!",
    img: "https://res.cloudinary.com/dpiogqjk4/image/upload/v1761923196/pulses_cloudinary_rwjwoi.jpg",
  },
  {
    title: "Sugarcane Juice with Honey - 18% Off",
    desc: "Premium Rice at Unbeatable Prices! Limited-time offer – bring home quality",
    img: "https://res.cloudinary.com/dpiogqjk4/image/upload/v1761923328/vegetables_mu0jxc.jpg",
  },
];

// -------------- PRODUCT CATEGORIES (KEY AGRI SEGMENTS) --------------
const categoryContainerStyle = {
  display: "flex",
  gap: "20px",
  margin: "20px 2rem",
  flexWrap: "wrap",
  justifyContent: "space-around",
};
const categoryImageStyle = {
  width: "200px",
  height: "200px",
  borderRadius: "16px",
  objectFit: "cover",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  transition: "transform 0.3s ease",
};
// Crop/Agri Product segments
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

// -------------- MARKET PRICES/INFOBAR --------------
const livePricesStyle = {
  backgroundColor: colors.harvestYellow,
  color: colors.primaryGreen,
  padding: "1rem 2rem",
  display: "flex",
  gap: "2rem",
  overflowX: "auto",
  fontWeight: "600",
  borderRadius: "12px",
  margin: "1rem 2rem",
};

// -------------- FOOTER (SITE LINKS) --------------
const footerStyle = {
  backgroundColor: colors.earthBrown,
  color: "white",
  padding: "2rem 3rem",
  display: "flex",
  justifyContent: "space-around",
  flexWrap: "wrap",
  marginTop: "2rem",
};
const footerColumnStyle = { margin: "1rem", minWidth: "150px" };
const Footer = () => (
  <footer style={footerStyle}>
    <div style={footerColumnStyle}>
      <h4>Get to Know Us</h4>
      <ul>
        <li>About Agribazaar</li>
        <li>Careers</li>
        <li>Press Releases</li>
        <li>Agri Science</li>
      </ul>
    </div>
    <div style={footerColumnStyle}>
      <h4>Connect with Us</h4>
      <ul>
        <li>LinkedIn</li>
        <li>Twitter</li>
        <li>Instagram</li>
      </ul>
    </div>
    <div style={footerColumnStyle}>
      <h4>Make Money with Us</h4>
      <ul>
        <li>Sell on Agribazaar</li>
        <li>Become a Supplier</li>
        <li>Farm Partnerships</li>
        <li>Advertise Your Products</li>
      </ul>
    </div>
    <div style={footerColumnStyle}>
      <h4>Let Us Help You</h4>
      <ul>
        <li>Your Account</li>
        <li>Returns Centre</li>
        <li>100% Purchase Protection</li>
        <li>Help</li>
      </ul>
    </div>
  </footer>
);

// -------------- MAIN HOMEPAGE COMPONENT --------------
const HomePage = () => {
  const [hoverOffer, setHoverOffer] = React.useState(null);
  const [hoverCategory, setHoverCategory] = React.useState(null);

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
          <h1>Agribazaar</h1>
        </div>
        <div>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: colors.harvestYellow,
              color: colors.primaryGreen,
            }}
          >
            Farmer
          </button>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: colors.harvestYellow,
              color: colors.primaryGreen,
            }}
          >
            Buyer
          </button>
          {/* ✅ If user logged in show LOGOUT, else LOGIN */}
          {user ? (
            <button
              onClick={AuthService.logout}
              style={{
                ...buttonStyle,
                backgroundColor: "#ffffff",
                color: "#d32f2f",
                fontWeight: "700",
                borderRadius: "30px",
                padding: "0.6rem 1.8rem",
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

      {/* ---------- FEATURE BAR / SERVICE NAVIGATION ---------- */}
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "800",
          textAlign: "left",
          marginLeft: "2rem",
          marginBottom: "16px",
          color: colors.primaryGreen,
        }}
      >
        Shop By Category
      </h2>

      <section style={mainCategoryContainerStyle}>
        {mainCategoryBoxes.map((item, idx) => (
          <div
            key={idx}
            style={mainCategoryBoxStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.07)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span style={{ fontSize: "1.9rem", marginRight: 12 }}>
              {item.emoji}
            </span>
            {item.label}
          </div>
        ))}
      </section>

      {/* ---------- NEWS / INFO BANNER ---------- */}
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "800",
          textAlign: "left",
          marginLeft: "2rem",
          marginBottom: "16px",
          color: colors.primaryGreen,
        }}
      >
        Agriculture News & Updates
      </h2>
      <section style={newsSectionStyle}>
        {newsItems.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </section>

      {/* ---------- OFFER CARDS / DEALS ---------- */}
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "800",
          textAlign: "left",
          marginLeft: "2rem",
          marginBottom: "16px",
          color: colors.primaryGreen,
        }}
      >
        Top Offers
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
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={() => setHoverOffer(idx)}
            onMouseLeave={() => setHoverOffer(null)}
          >
            <img src={img} alt={title} style={offerImgStyle} />
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </section>

      {/* ---------- PRODUCT CATEGORY GRID ---------- */}
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "800",
          textAlign: "left",
          marginLeft: "2rem",
          marginBottom: "16px",
          color: colors.primaryGreen,
        }}
      >
        Shop Crops, Livestock & More
      </h2>
      <section style={categoryContainerStyle}>
        {productCategories.map(({ name, img }, idx) => (
          <div key={idx} style={{ textAlign: "center" }}>
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
                fontSize: "1.15rem",
              }}
            >
              {name}
            </p>
          </div>
        ))}
      </section>

      {/* ---------- LIVE MARKET PRICES INFOBAR ---------- */}
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "800",
          textAlign: "left",
          marginLeft: "2rem",
          marginBottom: "16px",
          color: colors.primaryGreen,
        }}
      >
        Live Market Prices
      </h2>
      <section style={livePricesStyle}>
        <span>Potato (Kangra) ₹1700 - ₹2600</span>
        <span>Banana (Palampur) ₹4300 - ₹4400</span>
        <span>Bottle gourd (Palampur) ₹3500 - ₹5000</span>
      </section>

      {/* ---------- FOOTER / SUPPORT LINKS ---------- */}
      <Footer />
    </div>
  );
};

export default HomePage;
