import React from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const SelectRolePage = () => {
  const navigate = useNavigate();

  const chooseRole = async (role) => {
    try {
      await AuthService.setRole(role);

      // ✅ Navigate to correct dashboard
      if (role === "farmer") {
        navigate("/farmer/dashboard");
      } else if (role === "buyer") {
        navigate("/buyer/dashboard");
      } else {
        navigate("/both/dashboard");
      }

    } catch (err) {
      console.log(err);
      alert("Error saving role. Please login again.");
      navigate("/login");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "5rem", fontFamily: "Segoe UI" }}>
      <h2 style={{ marginBottom: "2rem" }}>Select Your Role</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button
          onClick={() => chooseRole("farmer")}
          style={buttonStyle}
        >
          Farmer
        </button>

        <button
          onClick={() => chooseRole("buyer")}
          style={buttonStyle}
        >
          Buyer
        </button>

        <button
          onClick={() => chooseRole("both")}
          style={buttonStyle}
        >
          Both
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "12px 24px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#388e3c",
  color: "white",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "0.3s",
};

export default SelectRolePage;
