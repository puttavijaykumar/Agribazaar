import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    AuthService.fetchNotifications()
      .then(data => setNotifications(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map(n => (
          <div key={n.id}>
            <p>{n.message}</p>
            <small>{new Date(n.created_at).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
};

export default NotificationsPage;
