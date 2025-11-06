import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const SelectRolePage = () => {
  const navigate = useNavigate();

  const handleSelect = async (role) => {
    await AuthService.setRole(role);

    // Update localStorage user role
    const user = JSON.parse(localStorage.getItem("user"));
    user.role = role;
    localStorage.setItem("user", JSON.stringify(user));

    navigate(`/${role}/dashboard`);
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Select Your Role</h2>
      <button onClick={() => handleSelect("farmer")}>Farmer</button>
      <button onClick={() => handleSelect("buyer")}>Buyer</button>
      <button onClick={() => handleSelect("both")}>Both</button>
    </div>
  );
};

export default SelectRolePage;
