import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthService.fetchSettings()
      .then(data => setSettings(data))
      .finally(() => setLoading(false));
  }, []);

  const toggleSetting = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const saveSettings = () => {
    AuthService.updateSettings(settings).catch(e => console.error(e));
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div>
      <h2>User Settings</h2>
      <label>
        <input 
          type="checkbox" 
          checked={settings.dark_mode} 
          onChange={() => toggleSetting("dark_mode")} 
        />
        Dark Mode
      </label>
      <label>
        <input 
          type="checkbox" 
          checked={settings.notifications_enabled} 
          onChange={() => toggleSetting("notifications_enabled")} 
        />
        Notifications Enabled
      </label>
      {/* Add other toggle fields similarly */}
      <button onClick={saveSettings}>Save</button>
    </div>
  );
};

export default SettingsPage;
