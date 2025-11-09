import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

import React, { useState, useEffect } from "react";

function FarmerDashboard() {
  const [user, setUser] = useState({
    username: "FarmerUser",
    email: "farmer@example.com",
    address: "",
    role: "both", // example roles: farmer, buyer, both
    notifications: [],
    products: [],
    salesData: {}
  });
  const [addressInput, setAddressInput] = useState("");

  // Example: Fetch user profile, products, notifications, sales on mount
  useEffect(() => {
    // TODO: Fetch from backend API and update states
    setUser((prev) => ({ ...prev, address: prev.address || "Enter your address" }));
  }, []);

  const handleAddressUpdate = () => {
    // TODO: Call backend to save address
    setUser((prev) => ({ ...prev, address: addressInput }));
  };

  const handleRemoveProduct = (productId) => {
    // TODO: Call backend to remove product
    setUser((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
  };

  return (
    <div>
      {/* Top Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#2d8e4a", color: "#fff" }}>
        <div>AgriBazaar - Farmer Dashboard</div>
        {user.role === "both" && (
          <button onClick={() => window.location.href = "/buyer/dashboard"} style={{ background: "white", color: "#2d8e4a", borderRadius: "4px", padding: "0.5rem" }}>
            Switch to Buyer Dashboard
          </button>
        )}
      </nav>

      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <aside style={{ width: "220px", background: "#e0f2d7", padding: "1rem" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><a href="/farmer/dashboard" style={{ fontWeight: "bold" }}>Product Management</a></li>
            <li><a href="/farmer/orders">Orders</a></li>
            <li><a href="/profile">Profile Settings</a></li>
          </ul>
        </aside>

        {/* Main Content */}
        <main style={{ flexGrow: 1, padding: "1rem" }}>
          {/* User Profile */}
          <section style={{ marginBottom: "2rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
            <h2>Profile</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Address:</strong></p>
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter your address"
              style={{ width: "100%", maxWidth: "400px", padding: "0.5rem" }}
            />
            <button onClick={handleAddressUpdate} style={{ marginTop: "0.5rem", background: "#2d8e4a", color: "white", borderRadius: "4px", padding: "0.5rem 1rem" }}>
              Update Address
            </button>
          </section>

          {/* Crop Products Management */}
          <section style={{ marginBottom: "2rem" }}>
            <h2>My Products</h2>
            <button style={{ background: "#2d8e4a", color: "white", borderRadius: "4px", padding: "0.5rem 1rem", marginBottom: "1rem" }}>
              + Add New Product
            </button>
            <ul>
              {user.products.length === 0 ? (
                <li>No products listed yet.</li>
              ) : (
                user.products.map((product) => (
                  <li key={product.id} style={{ marginBottom: "0.5rem" }}>
                    <strong>{product.name}</strong> - Price: ₹{product.price}
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      style={{ marginLeft: "1rem", background: "#c64a4a", color: "#fff", borderRadius: "4px", padding: "0.3rem 0.6rem" }}
                    >
                      Remove
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>

          {/* Notifications */}
          <section style={{ marginBottom: "2rem" }}>
            <h2>Notifications</h2>
            {user.notifications.length === 0 ? (
              <p>No new notifications.</p>
            ) : (
              <ul>
                {user.notifications.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            )}
          </section>

          {/* Sales Analytics */}
          <section>
            <h2>Sales Analytics</h2>
            {/* Placeholder for charts */}
            <p>Total Sales: ₹{user.salesData.totalSales || 0}</p>
            <p>Recent Activity: {user.salesData.recentActivity || "No activity"}</p>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "1rem", background: "#2d8e4a", color: "#fff", marginTop: "2rem" }}>
        &copy; 2025 AgriBazaar. All rights reserved.
      </footer>
    </div>
  );
}

export default FarmerDashboard;
