import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const TrackOrdersPage = () => {
  const [trackingInfo, setTrackingInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) throw new Error("User not logged in");
        // Assume you have API for fetching tracking info separately
        const trackingData = await AuthService.fetchOrderTracking(user.id);
        setTrackingInfo(trackingData);
      } catch (err) {
        console.error("Error loading tracking info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTracking();
  }, []);

  if (loading) return <div>Loading order tracking...</div>;

  return (
    <div>
      <h2>Track My Orders</h2>
      {trackingInfo.length === 0 ? (
        <p>No tracking information available.</p>
      ) : (
        <ul>
          {trackingInfo.map(track => (
            <li key={track.id}>
              Order #{track.order_id} - Status: {track.status} - ETA: {track.estimated_delivery}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrackOrdersPage;
