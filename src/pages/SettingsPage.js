import React, { useState, useEffect } from 'react';
import NavSidebar from '../components/Navigation/NavSidebar';
import { Settings, Sun, Moon, Monitor, Palette, Globe, Bell, Shield } from 'lucide-react';
import './ModulePage.css';

const SettingsPage = () => {
    const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'dark');
    const [units, setUnits] = useState(localStorage.getItem('app-units') || 'metric');

    useEffect(() => {
        document.body.className = `theme-${theme}`;
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('app-units', units);
    }, [units]);

    return (
        <div className="module-page-container">
            <NavSidebar />
            <main className="module-content">
                <header className="module-header">
                    <div className="header-title">
                        <Settings className="header-icon" />
                        <h1>System Settings</h1>
                    </div>
                </header>

                <section className="settings-grid">
                    <div className="settings-card">
                        <div className="settings-header">
                            <Palette size={20} />
                            <h3>Appearance & Theme</h3>
                        </div>
                        <div className="theme-options">
                            <button
                                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                                onClick={() => setTheme('light')}
                            >
                                <Sun size={18} />
                                <span>Light</span>
                            </button>
                            <button
                                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                                onClick={() => setTheme('dark')}
                            >
                                <Moon size={18} />
                                <span>Dark</span>
                            </button>
                            <button
                                className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
                                onClick={() => setTheme('system')}
                            >
                                <Monitor size={18} />
                                <span>System</span>
                            </button>
                        </div>
                    </div>

                    <div className="settings-card">
                        <div className="settings-header">
                            <Globe size={20} />
                            <h3>Units & Localization</h3>
                        </div>
                        <div className="settings-row">
                            <div className="setting-info">
                                <strong>Unit System</strong>
                                <p>Select preferred measurement units (Knots vs Km/h)</p>
                            </div>
                            <select
                                className="settings-input"
                                value={units}
                                onChange={(e) => setUnits(e.target.value)}
                            >
                                <option value="metric">Metric (Knots, Km, Celcius)</option>
                                <option value="imperial">Imperial (Knots, Miles, Fahrenheit)</option>
                            </select>
                        </div>
                    </div>

                    <div className="settings-card">
                        <div className="settings-header">
                            <Bell size={20} />
                            <h3>Notifications</h3>
                        </div>
                        <div className="settings-row">
                            <div className="setting-info">
                                <strong>Speed Alerts</strong>
                                <p>Notify when a vessel exceeds speed limits</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    <div className="settings-card">
                        <div className="settings-header">
                            <Shield size={20} />
                            <h3>Privacy & Security</h3>
                        </div>
                        <div className="settings-row">
                            <div className="setting-info">
                                <strong>Data Sharing</strong>
                                <p>Share anonymized AIS data with partners</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SettingsPage;
