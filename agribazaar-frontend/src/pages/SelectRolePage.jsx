import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const SelectRolePage = () => {
  const navigate = useNavigate();

  const chooseRole = async (role) => {
    try {
      await AuthService.setRole(role);
      navigate(`/${role}/dashboard`)
    } catch (err) {
      console.log(err);
      alert("Error saving role. Please login again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h2>Select Your Role</h2>
      <button onClick={() => chooseRole("farmer")}>Farmer</button>
      <button onClick={() => chooseRole("buyer")}>Buyer</button>
      <button onClick={() => chooseRole("both")}>Both</button>
    </div>
  );
};

export default SelectRolePage;
