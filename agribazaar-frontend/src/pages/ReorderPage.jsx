import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const ReorderPage = () => {
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPastOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) throw new Error("User not logged in");
        const ordersData = await AuthService.fetchOrderSummary(user.id);
        setPastOrders(ordersData);
      } catch (err) {
        console.error("Error loading past orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPastOrders();
  }, []);

  const handleReorder = (orderId) => {
    console.log(`Reorder clicked for order ID: ${orderId}`);
    // Implement reorder logic maybe add items to cart or direct order again
  };

  if (loading) return <div>Loading past orders...</div>;

  return (
    <div>
      <h2>Reorder</h2>
      {pastOrders.length === 0 ? (
        <p>No past orders available to reorder.</p>
      ) : (
        <ul>
          {pastOrders.map(order => (
            <li key={order.id}>
              Order #{order.id} - Total: ₹{order.total} 
              <button onClick={() => handleReorder(order.id)} style={{ marginLeft: "1rem" }}>
                Reorder
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReorderPage;
