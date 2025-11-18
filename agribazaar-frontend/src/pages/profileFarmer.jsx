import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import EnhancedFooter from "../components/EnhancedFooter";
import FarmerNavbar from "../components/FarmerNavbar"; // Import FarmerNavbar

function UserProfile() {
  const navigate = useNavigate();

  // For FarmerNavbar
  const [navbarUser, setNavbarUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setNavbarUser(JSON.parse(storedUser));
  }, []);

  const [user, setUser] = useState({
    username: "",
    email: "",
    role: "",
    address: {
      homeName: "",
      street: "",
      village: "",
      mandal: "",
      district: "",
      state: "",
      pincode: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [editAddress, setEditAddress] = useState(false);
  const [addressInput, setAddressInput] = useState({
    homeName: "",
    street: "",
    village: "",
    mandal: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await AuthService.getUserProfile();
        setUser({
          username: profile.username,
          email: profile.email,
          role: profile.role,
          address: {
            homeName: profile.home_name || "",
            street: profile.street || "",
            village: profile.village || "",
            mandal: profile.mandal || "",
            district: profile.district || "",
            state: profile.state || "",
            pincode: profile.pincode || ""
          }
        });
        setAddressInput({
          homeName: profile.home_name || "",
          street: profile.street || "",
          village: profile.village || "",
          mandal: profile.mandal || "",
          district: profile.district || "",
          state: profile.state || "",
          pincode: profile.pincode || ""
        });
      } catch {
        setMessage("Error loading profile. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setAddressInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await AuthService.updateUserProfile({
        home_name: addressInput.homeName,
        street: addressInput.street,
        village: addressInput.village,
        mandal: addressInput.mandal,
        district: addressInput.district,
        state: addressInput.state,
        pincode: addressInput.pincode
      });
      // Refetch the user profile and do the same mapping as above
      const profile = await AuthService.getUserProfile();
      setUser({
        username: profile.username,
        email: profile.email,
        role: profile.role,
        address: {
          homeName: profile.home_name || "",
          street: profile.street || "",
          village: profile.village || "",
          mandal: profile.mandal || "",
          district: profile.district || "",
          state: profile.state || "",
          pincode: profile.pincode || ""
        }
      });
      setEditAddress(false);
      setMessage("Profile updated successfully!");
    } catch {
      setMessage("Error updating profile.");
    }
    setLoading(false);
  };

  const profileRowStyle = {
    padding: "1rem",
    margin: "0.7rem 0",
    border: "1.3px solid #b2dfdb",
    borderRadius: "15px",
    background: "#f9fdfb",
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
  };

  const inputStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "1.1px solid #b2dfdb",
    fontSize: "1rem",
    width: "100%",
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.3rem",
        }}
      >
        Loading user profile...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)",
        paddingBottom: "3rem",
      }}
    >
      {/* Farmer Top Navbar */}
      <FarmerNavbar user={navbarUser || {}} />

      <div
        style={{
          maxWidth: "520px",
          margin: "3rem auto",
          background: "#fff",
          borderRadius: "22px",
          boxShadow: "0 6px 25px rgba(27,94,32,0.08)",
          padding: "clamp(1.7rem,6vw,2.8rem)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#1b5e20",
            fontWeight: "800",
            fontSize: "clamp(1.5rem, 5vw, 2.3rem)",
            marginBottom: "2rem",
          }}
        >
          User Profile
        </h2>
        <div style={profileRowStyle}>
          <strong>Username:</strong>
          <span>{user.username}</span>
        </div>
        <div style={profileRowStyle}>
          <strong>Email:</strong>
          <span>{user.email}</span>
        </div>
        <div style={profileRowStyle}>
          <strong>Role:</strong>
          <span>{user.role}</span>
        </div>
        <div style={{ ...profileRowStyle, gap: "1rem" }}>
          <strong>Address:</strong>
          {editAddress ? (
            <>
              <input
                type="text"
                placeholder="Home Name"
                value={addressInput.homeName}
                style={inputStyle}
                onChange={(e) => handleInputChange("homeName", e.target.value)}
              />
              <input
                type="text"
                placeholder="Street"
                value={addressInput.street}
                style={inputStyle}
                onChange={(e) => handleInputChange("street", e.target.value)}
              />
              <input
                type="text"
                placeholder="Village"
                value={addressInput.village}
                style={inputStyle}
                onChange={(e) => handleInputChange("village", e.target.value)}
              />
              <input
                type="text"
                placeholder="Mandal"
                value={addressInput.mandal}
                style={inputStyle}
                onChange={(e) => handleInputChange("mandal", e.target.value)}
              />
              <input
                type="text"
                placeholder="District"
                value={addressInput.district}
                style={inputStyle}
                onChange={(e) => handleInputChange("district", e.target.value)}
              />
              <input
                type="text"
                placeholder="State"
                value={addressInput.state}
                style={inputStyle}
                onChange={(e) => handleInputChange("state", e.target.value)}
              />
              <input
                type="text"
                placeholder="Pincode"
                value={addressInput.pincode}
                style={inputStyle}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
              />
              <div>
                <button
                  style={{
                    background: "linear-gradient(135deg, #1b5e20 0%, #2d8e4a 100%)",
                    color: "white",
                    fontWeight: "600",
                    padding: "0.6rem 1.3rem",
                    border: "none",
                    borderRadius: "10px",
                    marginTop: "0.4rem",
                    cursor: "pointer",
                  }}
                  onClick={handleSave}
                  disabled={loading}
                >
                  Save
                </button>
                <button
                  style={{
                    marginLeft: "1rem",
                    background: "#bdbdbd",
                    color: "white",
                    fontWeight: "600",
                    padding: "0.6rem 1.3rem",
                    border: "none",
                    borderRadius: "10px",
                    marginTop: "0.4rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setEditAddress(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ whiteSpace: "pre-line", lineHeight: 1.5, color: "#333" }}>
                {`${user.address?.homeName || ""}${user.address?.street ? ", " + user.address.street : ""}
                  ${user.address?.village || ""}${user.address?.mandal ? ", " + user.address.mandal : ""}
                  ${user.address?.district || ""}${user.address?.state ? ", " + user.address.state : ""}
                  ${user.address?.pincode || ""}`}
              </div>
              <button
                style={{
                  background: "transparent",
                  color: "#1b5e20",
                  border: "1px solid #b2dfdb",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  marginTop: "0.5rem",
                  cursor: "pointer",
                  padding: "0.6rem 1.3rem",
                  alignSelf: "flex-start",
                }}
                onClick={() => setEditAddress(true)}
              >
                Edit Address
              </button>
            </>
          )}
        </div>
        <div
          style={{
            textAlign: "center",
            margin: "2rem 0 0 0",
            color: "#197278",
            minHeight: "1.5em",
          }}
        >
          {message}
        </div>
        
      </div>
      <EnhancedFooter />
      <style>{`
        @media (max-width: 600px) {
          input, button {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default UserProfile;
