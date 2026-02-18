import { useState } from 'react';
import '../styles/pages.css';

const Settings = () => {
    const [theme, setTheme] = useState('light');
    const [notifications, setNotifications] = useState(true);

    return (
        <div className="page settings-page">
            <h2>Settings</h2>
            <p className="page-description">
                Configure your application preferences here.
            </p>

            <div className="settings-section">
                <h3>Appearance</h3>
                <div className="setting-item">
                    <label htmlFor="theme">Theme</label>
                    <select
                        id="theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                    </select>
                </div>
            </div>

            <div className="settings-section">
                <h3>Notifications</h3>
                <div className="setting-item">
                    <label htmlFor="notifications">
                        Enable Notifications
                    </label>
                    <input
                        type="checkbox"
                        id="notifications"
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                    />
                </div>
            </div>

            <div className="settings-section">
                <h3>Environment Information</h3>
                <div className="env-info">
                    <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
                    <p><strong>Base URL:</strong> {import.meta.env.BASE_URL}</p>
                    <p><strong>Production:</strong> {import.meta.env.PROD ? 'Yes' : 'No'}</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
