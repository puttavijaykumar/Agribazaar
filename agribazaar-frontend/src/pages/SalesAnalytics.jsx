// src/pages/SalesAnalytics.jsx
import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthServices";
import FarmerNavbar from "../components/FarmerNavbar";
import EnhancedFooter from "../components/EnhancedFooter";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

function SalesAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ notifications: [], role: "" });

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const profile = await AuthService.getUserProfile();
        setUser(profile);
        const data = await AuthService.getSalesAnalytics();
        setAnalytics(data);
      } catch (e) {
        alert("Failed to fetch sales analytics data.");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  if (!analytics) return <div style={{ padding: "2rem", textAlign: "center" }}>No analytics data available.</div>;

  return (
    <>
      <FarmerNavbar user={user} />
      <main style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 10px" }}>
        <h1>Sales Analytics Dashboard</h1>

        <section style={{ marginBottom: "3rem" }}>
          <h2>Total Sales</h2>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
            ₹{analytics.total_sales_amount.toLocaleString()}
          </p>
          <p>{analytics.sales_count} transactions</p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2>Sales Trend Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.by_date}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#f0f0f0" />
              <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section>
          <h2>Sales by Product</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.by_product}>
              <XAxis dataKey="product__name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#f0f0f0" />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </main>
      <EnhancedFooter />
    </>
  );
}

export default SalesAnalytics;
