import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) throw new Error("User not logged in");
        const ordersData = await AuthService.fetchOrderSummary(user.id);
        setOrders(ordersData);
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              Order #{order.id} - Status: {order.status} - Total: ₹{order.total}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
