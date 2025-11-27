import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect  } from "react";
import { Heart, ShoppingCart, Package, Bell, MessageCircle, Trophy, User, Search, LogOut, Settings, MapPin, HelpCircle } from "lucide-react";
import AuthService from "../services/AuthService";
import BuyerNavbar from "../components/BuyerNavbar";
import TopOffersSection from "../components/TopOffersSection"; // LINE 4



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
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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

const NavIcon = ({ icon: Icon, badge, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "relative",
      padding: "0.5rem",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    title={label}
    aria-label={label}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
      e.currentTarget.style.transform = "scale(1.1)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    <Icon size={22} color="white" />
    {badge > 0 && (
      <span
        style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
          backgroundColor: "#ff5252",
          color: "white",
          fontSize: "0.65rem",
          fontWeight: "bold",
          borderRadius: "50%",
          width: "18px",
          height: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "pulse 2s infinite",
        }}
      >
        {badge}
      </span>
    )}
  </button>
);


const BuyerDashboard = () => {
  
  const navigate = useNavigate(); // <-- You need this line!
  // Add your state declarations here
  const [cartCount, setCartCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [orderSummary, setOrderSummary] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [seasonalPicks, setSeasonalPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // User object for BuyerNavbar switch/dashboard logic
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch { return null; }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Navigate to search page with query as URL param
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

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

  
  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) throw new Error("User not logged in");

      const [
        cartData,
        notifData,
        chatData,
        pointsData,
        recentlyViewedData,
        orderSummaryData,
        wishlistData,
        recommendedData,
        topSellersData,
        newArrivalsData,
        seasonalPicksData,
      ] = await Promise.all([
        AuthService.fetchCartCount(user.id),
        AuthService.fetchNotificationCount(user.id),
        AuthService.fetchChatUnreadCount(user.id),
        AuthService.fetchRewardPoints(user.id),
        AuthService.fetchRecentlyViewed(user.id),
        AuthService.fetchOrderSummary(user.id),
        AuthService.fetchWishlist(user.id),
        AuthService.fetchRecommended(user.id),
        AuthService.fetchTopSellers(),
        AuthService.fetchNewArrivals(),
        AuthService.fetchSeasonalPicks(),
      ]);

      setCartCount(cartData.count || 0);
      setNotifCount(notifData.count || 0);
      setChatUnreadCount(chatData.count || 0);
      setPoints(pointsData.points || 0);
      setRecentlyViewed(recentlyViewedData);
      setOrderSummary(orderSummaryData);
      setWishlist(wishlistData);
      setRecommended(recommendedData);
      setTopSellers(topSellersData);
      setNewArrivals(newArrivalsData);
      setSeasonalPicks(seasonalPicksData);

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, [user]);

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

  const offersContainer = {
    display: "flex",
    gap: "1rem",
    overflowX: "auto",
    padding: "1rem 2rem",
    margin: "1rem 0",
    overflowY: "hidden",
    scrollBehavior: "smooth",
    WebkitOverflowScrolling: "touch",
    paddingRight: "3rem",
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
    justifyContent: "flex-start",
    alignItems: "center",
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
      desc: "Freshness You Can Taste – At Juicy Prices!",
      img: "https://res.cloudinary.com/dpiogqjk4/image/upload/v1757094535/nuh9degi74yky2b7wrua.jpg",
    },
    {
      title: "Kolam Rice - 25% Off",
      desc: "Pure & Wholesome Wheat – Now at Special Prices!",
      img: "https://res.cloudinary.com/dpiogqjk4/image/upload/v1761923196/pulses_cloudinary_rwjwoi.jpg",
    },
    {
      title: "Sugarcane Juice - 18% Off",
      desc: "Premium Rice at Unbeatable Prices!",
      img: "https://res.cloudinary.com/dpiogqjk4/image/upload/v1761923328/vegetables_mu0jxc.jpg",
    },
  ];

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

  return (
    <div style={{ backgroundColor: colors.lightBg, minHeight: "100vh", color: colors.contrastText }}>
      {/* Navbar */}
      <BuyerNavbar user={user} cartCount={cartCount} notifCount={notifCount} chatUnreadCount={chatUnreadCount} points={points} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />

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
      {/* Top Offers Section */}
      <TopOffersSection colors={colors} />

      {/* Recently Viewed */}
      <section style={{ padding: "1rem 2rem" }}>
        <h2 style={{ fontWeight: "700", color: colors.primaryGreen, marginBottom: "1rem" }}>Recently Viewed Products</h2>
        {recentlyViewed.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#666" }}>You haven't viewed any products recently.</p>
        ) : (
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem", scrollBehavior: "smooth" }}>
            {recentlyViewed.map(item => (
              <div key={item.id} style={{ minWidth: "220px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", backgroundColor: "white", padding: "0.5rem", flexShrink: 0 }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", marginBottom: "0.5rem" }} />
                <h4 style={{ fontSize: "1rem", margin: "0 0 0.3rem 0" }}>{item.name}</h4>
                <p style={{ fontSize: "0.85rem", color: "#555" }}>{item.description}</p>
                <p style={{ fontWeight: "700", marginTop: "0.5rem" }}>₹{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Wishlist */}
      <section style={{ padding: "1rem 2rem" }}>
        <h2 style={{ fontWeight: "700", color: colors.primaryGreen, marginBottom: "1rem" }}>Your Wishlist</h2>
        {wishlist.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#666" }}>Your wishlist is empty.</p>
        ) : (
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem", scrollBehavior: "smooth" }}>
            {wishlist.map(item => (
              <div key={item.id} style={{ minWidth: "220px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", backgroundColor: "white", padding: "0.5rem", flexShrink: 0 }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", marginBottom: "0.5rem" }} />
                <h4 style={{ fontSize: "1rem", margin: "0 0 0.3rem 0" }}>{item.name}</h4>
                <p style={{ fontWeight: "700", marginTop: "0.5rem" }}>₹{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recommended */}
      <section style={{ padding: "1rem 2rem" }}>
        <h2 style={{ fontWeight: "700", color: colors.primaryGreen, marginBottom: "1rem" }}>Recommended For You</h2>
        {recommended.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#666" }}>No recommendations at this time.</p>
        ) : (
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem", scrollBehavior: "smooth" }}>
            {recommended.map(product => (
              <div key={product.id} style={{ minWidth: "220px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", backgroundColor: "white", padding: "0.5rem", flexShrink: 0 }}>
                <img src={product.image} alt={product.name} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", marginBottom: "0.5rem" }} />
                <h4 style={{ fontSize: "1rem", margin: "0 0 0.3rem 0" }}>{product.name}</h4>
                <p style={{ fontSize: "0.85rem", color: "#555" }}>{product.description}</p>
                <p style={{ fontWeight: "700", marginTop: "0.5rem" }}>₹{product.price}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Top Sellers Section */}
      <section style={{ padding: "1rem 2rem" }}>
        <h2 style={{ fontWeight: "700", color: colors.primaryGreen, marginBottom: "1rem" }}>
          Top Sellers
        </h2>
        {topSellers.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#666" }}>No top sellers found.</p>
        ) : (
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem", scrollBehavior: "smooth" }}>
            {topSellers.map(item => (
              <div key={item.id} style={{ minWidth: "220px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", backgroundColor: "white", padding: "0.5rem", flexShrink: 0 }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", marginBottom: "0.5rem" }} />
                <h4 style={{ fontSize: "1rem", margin: "0 0 0.3rem 0" }}>{item.name}</h4>
                <p style={{ fontWeight: "700", marginTop: "0.5rem" }}>₹{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* New Arrivals Section */}
      <section style={{ padding: "1rem 2rem" }}>
        <h2 style={{ fontWeight: "700", color: colors.primaryGreen, marginBottom: "1rem" }}>
          New Arrivals
        </h2>
        {newArrivals.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#666" }}>No new arrivals at this time.</p>
        ) : (
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem", scrollBehavior: "smooth" }}>
            {newArrivals.map(item => (
              <div key={item.id} style={{ minWidth: "220px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", backgroundColor: "white", padding: "0.5rem", flexShrink: 0 }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", marginBottom: "0.5rem" }} />
                <h4 style={{ fontSize: "1rem", margin: "0 0 0.3rem 0" }}>{item.name}</h4>
                <p style={{ fontWeight: "700", marginTop: "0.5rem" }}>₹{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Seasonal Picks Section */}
      <section style={{ padding: "1rem 2rem" }}>
        <h2 style={{ fontWeight: "700", color: colors.primaryGreen, marginBottom: "1rem" }}>
          Seasonal Picks
        </h2>
        {seasonalPicks.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#666" }}>No seasonal picks available currently.</p>
        ) : (
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem", scrollBehavior: "smooth" }}>
            {seasonalPicks.map(item => (
              <div key={item.id} style={{ minWidth: "220px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", backgroundColor: "white", padding: "0.5rem", flexShrink: 0 }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", marginBottom: "0.5rem" }} />
                <h4 style={{ fontSize: "1rem", margin: "0 0 0.3rem 0" }}>{item.name}</h4>
                <p style={{ fontWeight: "700", marginTop: "0.5rem" }}>₹{item.price}</p>
              </div>
            ))}
          </div>
        )}
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
         Top Offers
      </h2>
      <section style={offersContainer}>
        {offerProducts.map(({ title, desc, img }, idx) => (
          <div
            key={idx}
            style={{
              ...offerCardStyle,
              transform: idx === -1 ? "scale(1.05)" : "scale(1)",
              boxShadow:
                idx === -1 ? "0 8px 16px rgba(0,0,0,0.2)" : "0 4px 8px rgba(0,0,0,0.1)",
            }}
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
              }}
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
        <div style={{ minWidth: "2rem", flexShrink: 0 }}></div>
      </section>

      {/* Footer */}
      <EnhancedFooter />
    </div>
  );
};

export default BuyerDashboard;