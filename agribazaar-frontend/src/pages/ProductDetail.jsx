import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import HomeNavbar from "../components/HomeNavbar";
import MobileBottomNav from "../components/MobileBottomNav";

const containerStyle = {
  backgroundColor: "#f1f8e9",
  minHeight: "100vh",
  color: "#263238",
};

const pageInnerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "1rem",
  paddingBottom: "4rem", // space for bottom nav
};

const topSectionStyle = {
  display: "flex",
  flexDirection: "row",
  gap: "2rem",
  alignItems: "flex-start",
};

const topSectionMobileStyle = {
  ...topSectionStyle,
  flexDirection: "column",
};

const imageMainStyle = {
  width: "100%",
  maxWidth: "420px",
  borderRadius: "16px",
  objectFit: "cover",
  background: "#fff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const thumbRowStyle = {
  display: "flex",
  gap: "0.5rem",
  marginTop: "0.75rem",
  flexWrap: "wrap",
};

const thumbImgStyle = (active) => ({
  width: "70px",
  height: "70px",
  borderRadius: "10px",
  objectFit: "cover",
  cursor: "pointer",
  border: active ? "2px solid #388e3c" : "1px solid #e0e0e0",
  background: "#fff",
});

const badgeRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  marginBottom: "0.5rem",
};

const badgeStyle = (bg, color = "#1b5e20") => ({
  padding: "0.15rem 0.6rem",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: 700,
  background: bg,
  color,
});

const titleStyle = {
  fontSize: "1.4rem",
  fontWeight: 800,
  marginBottom: "0.25rem",
};

const categoryTextStyle = {
  fontSize: "0.9rem",
  color: "#546e7a",
  marginBottom: "0.8rem",
};

const priceRowStyle = {
  display: "flex",
  alignItems: "baseline",
  gap: "0.75rem",
  marginBottom: "0.5rem",
};

const currentPriceStyle = {
  fontSize: "1.4rem",
  fontWeight: 800,
  color: "#1b5e20",
};

const originalPriceStyle = {
  fontSize: "0.95rem",
  color: "#9e9e9e",
  textDecoration: "line-through",
};

const discountTextStyle = {
  fontSize: "0.9rem",
  fontWeight: 700,
  color: "#c62828",
};

const infoRowStyle = {
  fontSize: "0.9rem",
  marginBottom: "0.3rem",
};

const labelStyle = {
  fontWeight: 700,
};

const actionRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
  marginTop: "1rem",
};

const qtyControlStyle = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: "999px",
  border: "1px solid #c8e6c9",
  overflow: "hidden",
  background: "#fff",
};

const qtyBtnStyle = {
  border: "none",
  background: "transparent",
  padding: "0.4rem 0.7rem",
  cursor: "pointer",
  fontSize: "1rem",
  color: "#388e3c",
};

const qtyValueStyle = {
  padding: "0 0.8rem",
  fontSize: "0.95rem",
  fontWeight: 600,
};

const primaryBtnStyle = {
  border: "none",
  borderRadius: "999px",
  padding: "0.55rem 1.6rem",
  background: "#388e3c",
  color: "#fff",
  fontWeight: 700,
  fontSize: "0.95rem",
  cursor: "pointer",
};

const secondaryBtnStyle = {
  ...primaryBtnStyle,
  background: "#aed581",
  color: "#1b5e20",
};

const sectionCardStyle = {
  marginTop: "1.5rem",
  padding: "1rem",
  background: "#ffffff",
  borderRadius: "14px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const sectionTitleStyle = {
  fontSize: "1.05rem",
  fontWeight: 700,
  marginBottom: "0.5rem",
};

const descriptionStyle = {
  fontSize: "0.95rem",
  lineHeight: 1.4,
  color: "#455a64",
};

const getOfferLabel = (code) => {
  switch (code) {
    case "flash_deal":
      return "Flash Deal";
    case "seasonal":
      return "Seasonal Offer";
    case "limited_stock":
      return "Limited Stock";
    case "trending":
      return "Trending Now";
    default:
      return null;
  }
};

const ProductDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImg, setActiveImg] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // current user for navbar/bottom nav
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // NOTE: prefix with your API base if needed, e.g. "/api/accounts/..."
        const url =
          type === "admin"
            ? `/admin-products/${id}/`
            : `/products/${id}/`;

        const res = await axios.get(url);
        const data = res.data;

        // Collect image URLs from image1..image4
        const imgUrls = [];
        ["image1", "image2", "image3", "image4"].forEach((key) => {
          const val = data[key];
          if (val) {
            imgUrls.push(typeof val === "string" ? val : val.url || "");
          }
        });

        setProduct(data);
        setImages(imgUrls);
        setActiveImg(imgUrls[0] || null);
      } catch (err) {
        console.error(err);
        setError("Unable to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [type, id]);

  if (loading) {
    return (
      <div style={containerStyle}>
        <HomeNavbar user={user} />
        <div style={pageInnerStyle}>Loading product...</div>
        <MobileBottomNav loggedIn={!!user} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={containerStyle}>
        <HomeNavbar user={user} />
        <div style={pageInnerStyle}>
          <p style={{ marginBottom: "1rem", color: "#c62828" }}>
            {error || "Product not found."}
          </p>
          <button
            onClick={() => navigate(-1)}
            style={{
              ...secondaryBtnStyle,
              padding: "0.4rem 1.2rem",
              fontSize: "0.9rem",
            }}
          >
            Go Back
          </button>
        </div>
        <MobileBottomNav loggedIn={!!user} />
      </div>
    );
  }

  const isAdmin = type === "admin";

  // Prices
  const priceNum = Number(product.price || 0);
  let originalPrice = null;
  let discountPrice = priceNum;
  let discountPercent = 0;

  if (isAdmin && product.discount_percent && product.discount_percent > 0) {
    discountPercent = product.discount_percent;
    // original = discounted / (1 - d%)
    const base =
      1 - Number(product.discount_percent) / 100;
    originalPrice = base > 0 ? (priceNum / base).toFixed(2) : null;
  }

  // Offer label
  const offerLabel = isAdmin ? getOfferLabel(product.offer_category) : null;

  // Stock / quantity text
  const stockText = isAdmin
    ? product.stock != null
      ? `${product.stock} kg in stock`
      : "Stock info not available"
    : product.quantity != null
    ? `${product.quantity} units available`
    : "Quantity info not available";

  const validityText =
    !isAdmin && product.validity_days != null
      ? `Listing valid for ${product.validity_days} days`
      : null;

  // Category text
  const categoryText = product.category
    ? `Category: ${product.category}`
    : null;

  // Extra admin-only fields
  const fertilizerInfo =
    isAdmin &&
    product.category === "Fertilizers" &&
    product.fertilizer_type
      ? product.fertilizer_type
      : null;

  const warrantyInfo =
    isAdmin && product.warranty_period
      ? product.warranty_period
      : null;

  const handleAddToCart = () => {
    // Placeholder: hook into your cart API later
    alert("Add to cart will be implemented later.");
  };

  const handleBuyNow = () => {
    // Placeholder: redirect to checkout or cart
    alert("Buy now will be implemented later.");
  };

  // decide layout: simple window width check
  const isMobile = window.innerWidth <= 768;
  const layoutStyle = isMobile ? topSectionMobileStyle : topSectionStyle;

  return (
    <div style={containerStyle}>
      <HomeNavbar user={user} />

      <div style={pageInnerStyle}>
        {/* Top: image + summary */}
        <div style={layoutStyle}>
          {/* Left: Images */}
          <div>
            {activeImg ? (
              <img
                src={activeImg}
                alt={product.name}
                style={imageMainStyle}
              />
            ) : (
              <div
                style={{
                  ...imageMainStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9e9e9e",
                  fontSize: "0.9rem",
                }}
              >
                No image
              </div>
            )}

            {images.length > 1 && (
              <div style={thumbRowStyle}>
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`thumb-${idx}`}
                    style={thumbImgStyle(img === activeImg)}
                    onClick={() => setActiveImg(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div style={{ flex: 1 }}>
            <div style={badgeRowStyle}>
              {isAdmin ? (
                <span style={badgeStyle("#e8f5e9")}>AgriBazaar Catalog</span>
              ) : (
                <span style={badgeStyle("#fff3e0", "#e65100")}>
                  Farmer Listing
                </span>
              )}

              {offerLabel && (
                <span style={badgeStyle("#ffebee", "#c62828")}>
                  {offerLabel}
                </span>
              )}

              {isAdmin && discountPercent > 0 && (
                <span style={badgeStyle("#fff3e0", "#e65100")}>
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <h1 style={titleStyle}>{product.name}</h1>

            {categoryText && (
              <div style={categoryTextStyle}>{categoryText}</div>
            )}

            {/* Price display */}
            <div style={priceRowStyle}>
              <span style={currentPriceStyle}>
                ₹{discountPrice.toFixed(2)}
              </span>
              {originalPrice && (
                <>
                  <span style={originalPriceStyle}>₹{originalPrice}</span>
                  <span style={discountTextStyle}>
                    You save {discountPercent}% 
                  </span>
                </>
              )}
            </div>

            {/* Per-unit info for farmer */}
            {!isAdmin && (
              <div style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                Price shown is per unit (kg / bag / crate as specified by
                farmer).
              </div>
            )}

            <div style={infoRowStyle}>
              <span style={labelStyle}>Availability: </span>
              {stockText}
            </div>

            {validityText && (
              <div style={infoRowStyle}>
                <span style={labelStyle}>Listing: </span>
                {validityText}
              </div>
            )}

            {isAdmin && fertilizerInfo && (
              <div style={infoRowStyle}>
                <span style={labelStyle}>Fertilizer Type: </span>
                {fertilizerInfo}
              </div>
            )}

            {isAdmin && warrantyInfo && (
              <div style={infoRowStyle}>
                <span style={labelStyle}>Warranty Period: </span>
                {warrantyInfo}
              </div>
            )}

            {/* Seller info placeholder */}
            {isAdmin ? (
              <div style={infoRowStyle}>
                <span style={labelStyle}>Pricing: </span>
                Fixed price (no negotiation).
              </div>
            ) : (
              <div style={infoRowStyle}>
                <span style={labelStyle}>Pricing: </span>
                Direct from farmer (negotiation features coming soon).
              </div>
            )}

            {/* Actions */}
            <div style={actionRowStyle}>
              <div style={qtyControlStyle}>
                <button
                  type="button"
                  style={qtyBtnStyle}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span style={qtyValueStyle}>{qty}</span>
                <button
                  type="button"
                  style={qtyBtnStyle}
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                style={primaryBtnStyle}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

              <button
                type="button"
                style={secondaryBtnStyle}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Description / details */}
        <div style={sectionCardStyle}>
          <h2 style={sectionTitleStyle}>Product Details</h2>
          <p style={descriptionStyle}>{product.description}</p>

          {isAdmin && (product.farmer_name || product.farmer_location) && (
            <>
              <h3
                style={{
                  ...sectionTitleStyle,
                  marginTop: "0.75rem",
                  fontSize: "0.95rem",
                }}
              >
                Grown By
              </h3>
              <p style={{ ...descriptionStyle, fontSize: "0.9rem" }}>
                {product.farmer_name && <>{product.farmer_name} </>}
                {product.farmer_location && (
                  <span>• {product.farmer_location}</span>
                )}
              </p>
            </>
          )}

          {!isAdmin && (
            <p
              style={{
                ...descriptionStyle,
                fontSize: "0.9rem",
                marginTop: "0.75rem",
              }}
            >
              This listing was created by a farmer user. Always review quantity,
              quality, and delivery terms directly with the seller before
              placing large orders.
            </p>
          )}
        </div>
      </div>

      <MobileBottomNav loggedIn={!!user} />
    </div>
  );
};

export default ProductDetail;
