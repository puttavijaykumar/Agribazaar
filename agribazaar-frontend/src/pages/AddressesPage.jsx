import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null); // object or null
  const [formData, setFormData] = useState({
    line1: "",
    line2: "",
    city: "",
    district: "",
    state: "",
    postal_code: "",
    is_default: false,
  });
  const [message, setMessage] = useState("");
  const [profileAddress, setProfileAddress] = useState(null);

  useEffect(() => {
    async function fetchAllAddresses() {
      setLoading(true);
      setMessage("");
      try {
        // 1. Fetch user profile for main address fields
        const profile = await AuthService.getUserProfile();
        const profAddr = (
          profile.home_name || profile.street || profile.village ||
          profile.mandal || profile.district || profile.state || profile.pincode
        ) ? {
          id: "profile-addr",
          line1: profile.home_name,
          line2: profile.street,
          city: profile.village,
          district: profile.district,
          state: profile.state,
          postal_code: profile.pincode,
          is_default: true
        } : null;
        setProfileAddress(profAddr);

        // 2. Fetch any separate addresses (array) if backend supports them
        let sepAddresses = [];
        try {
          sepAddresses = await AuthService.fetchAddresses();
        } catch {}

        setAddresses(sepAddresses);
      } catch {
        setMessage("Failed to fetch addresses");
        setProfileAddress(null);
        setAddresses([]);
      }
      setLoading(false);
    }

    fetchAllAddresses();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const startEdit = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingAddress(null);
    setFormData({
      line1: "",
      line2: "",
      city: "",
      district: "",
      state: "",
      postal_code: "",
      is_default: false,
    });
  };

  const handleSave = () => {
    if (editingAddress) {
      // Update existing extra address (not profile address)
      AuthService.updateAddress(editingAddress.id, formData)
        .then(updated => {
          setAddresses(addrs => addrs.map(a => a.id === updated.id ? updated : a));
          cancelEdit();
          setMessage("Address updated");
        })
        .catch(() => setMessage("Failed to update address"));
    } else {
      // Create new extra address
      AuthService.createAddress(formData)
        .then(created => {
          setAddresses(addrs => [...addrs, created]);
          cancelEdit();
          setMessage("Address added");
        })
        .catch(() => setMessage("Failed to add address"));
    }
  };

  const handleDelete = (id) => {
    AuthService.deleteAddress(id)
      .then(() => {
        setAddresses(addrs => addrs.filter(a => a.id !== id));
        setMessage("Address deleted");
      })
      .catch(() => setMessage("Failed to delete address"));
  };

  if (loading) return <div>Loading addresses...</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>Manage Addresses</h2>
      {message && <div style={{ marginBottom: "1rem", color: "green" }}>{message}</div>}

      {/* Show the profile address at the top (only display, no delete/edit from here) */}
      {profileAddress && (
        <div style={{ marginBottom: "1rem", border: "2px solid #1b5e20", padding: "1rem", borderRadius: "8px", background: "#f9fdfb" }}>
          <div>
            <strong>Default Address (Profile)</strong>
          </div>
          <div>{profileAddress.line1} {profileAddress.line2}</div>
          <div>{profileAddress.city}, {profileAddress.district}</div>
          <div>{profileAddress.state} - {profileAddress.postal_code}</div>
          <div style={{fontSize: "0.9em", color: "#197278"}}>To update, go to your Profile page</div>
        </div>
      )}

      {addresses.length === 0 ? <p>No additional addresses saved.</p> : (
        <ul>
          {addresses.map(addr => (
            <li key={addr.id} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
              <div>
                <strong>{addr.is_default ? "Default Address" : ""}</strong>
              </div>
              <div>{addr.line1} {addr.line2}</div>
              <div>{addr.city}, {addr.district}</div>
              <div>{addr.state} - {addr.postal_code}</div>
              <button onClick={() => startEdit(addr)} style={{ marginRight: "1rem" }}>Edit</button>
              <button onClick={() => handleDelete(addr.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <hr />
      <h3>{editingAddress ? "Edit Address" : "Add New Address"}</h3>
      <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
        <input placeholder="Line 1" value={formData.line1} onChange={e => handleChange("line1", e.target.value)} required /><br/>
        <input placeholder="Line 2" value={formData.line2} onChange={e => handleChange("line2", e.target.value)} /><br/>
        <input placeholder="City" value={formData.city} onChange={e => handleChange("city", e.target.value)} required /><br/>
        <input placeholder="District" value={formData.district} onChange={e => handleChange("district", e.target.value)} required /><br/>
        <input placeholder="State" value={formData.state} onChange={e => handleChange("state", e.target.value)} required /><br/>
        <input placeholder="Postal Code" value={formData.postal_code} onChange={e => handleChange("postal_code", e.target.value)} required /><br/>
        <label>
          <input type="checkbox" checked={formData.is_default} onChange={e => handleChange("is_default", e.target.checked)} />
          Default Address
        </label><br/>
        <button type="submit">{editingAddress ? "Update" : "Add"}</button>
        {editingAddress && <button type="button" onClick={cancelEdit} style={{ marginLeft: "1rem" }}>Cancel</button>}
      </form>
    </div>
  );
};

export default AddressesPage;
