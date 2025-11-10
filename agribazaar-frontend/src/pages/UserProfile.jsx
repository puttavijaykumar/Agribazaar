import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import EnhancedFooter from "../components/EnhancedFooter";

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    address: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [editAddress, setEditAddress] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await AuthService.getUserProfile();
        setUser(profile);
        setAddressInput(profile.address || "");
      } catch {
        setMessage("Error loading profile. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await AuthService.updateUserProfile({ address: addressInput });
      setUser((prev) => ({ ...prev, address: addressInput }));
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
    flexDirection: "row",
    alignItems: "center",
    fontSize: "clamp(1rem,2vw,1.1rem)",
    justifyContent: "space-between",
    gap: "1rem"
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.3rem"
      }}>
        Loading user profile...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)",
      paddingBottom: "3rem"
    }}>
      <div style={{
        maxWidth: "520px",
        margin: "3rem auto",
        background: "#fff",
        borderRadius: "22px",
        boxShadow: "0 6px 25px rgba(27,94,32,0.08)",
        padding: "clamp(1.7rem,6vw,2.8rem)"
      }}>
        <h2 style={{
          textAlign: "center",
          color: "#1b5e20",
          fontWeight: "800",
          fontSize: "clamp(1.5rem, 5vw, 2.3rem)",
          marginBottom: "2rem"
        }}>
          User Profile
        </h2>
        <div style={profileRowStyle}>
          <div>
            <strong>Username: </strong>
            {user.username}
          </div>
        </div>
        <div style={profileRowStyle}>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
        </div>
        <div style={profileRowStyle}>
          <div>
            <strong>Role:</strong> {user.role}
          </div>
        </div>
        <div style={profileRowStyle}>
          <div style={{ flexGrow: 1 }}>
            <strong>Address:</strong>
            {editAddress ? (
              <input
                type="text"
                value={addressInput}
                style={{
                  marginLeft: "1rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  border: "1.1px solid #b2dfdb",
                  fontSize: "1rem",
                  width: "65%"
                }}
                onChange={e => setAddressInput(e.target.value)}
              />
            ) : (
              <span style={{ marginLeft: "1rem" }}>{user.address || "Not provided"}</span>
            )}
          </div>
          {editAddress ? (
            <button
              style={{
                background: "linear-gradient(135deg, #1b5e20 0%, #2d8e4a 100%)",
                color: "white",
                fontWeight: "600",
                padding: "0.6rem 1.3rem",
                border: "none",
                borderRadius: "10px",
                marginLeft: "10px",
                cursor: "pointer"
              }}
              onClick={handleSave}
              disabled={loading}
            >
              Save
            </button>
          ) : (
            <button
              style={{
                background: "transparent",
                color: "#1b5e20",
                border: "1px solid #b2dfdb",
                borderRadius: "10px",
                fontWeight: "bold",
                marginLeft: "10px",
                cursor: "pointer",
                padding: "0.6rem 1.3rem"
              }}
              onClick={() => setEditAddress(true)}
            >
              Edit
            </button>
          )}
        </div>
        <div style={{ textAlign: "center", margin: "2rem 0 0 0", color: "#197278", minHeight: "1.5em" }}>
          {message}
        </div>
        <div style={{ textAlign: "center", marginTop: "2.7rem" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "0.8rem 2.2rem",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #1b5e20 0%, #2d8e4a 100%)",
              color: "white",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              boxShadow: "0 5px 15px rgba(27, 94, 32, 0.14)"
            }}
          >
            Back to Dashboard
          </button>
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
