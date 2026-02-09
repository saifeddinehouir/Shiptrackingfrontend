import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import MapPage from './pages/MapPage';
import VesselPage from './pages/VesselPage';
import VesselsPage from './pages/VesselsPage';
import PortsPage from './pages/PortPage';
import ContainersPage from './pages/ContainersPage';
import CompliancePage from './pages/CompliancePage';
import CompaniesPage from './pages/CompaniesPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

const App = () => {
  const [isDark, setIsDark] = React.useState(document.body.classList.contains('theme-dark'));

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('theme-dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const primaryColor = '#3b82f6'; // Bright blue for primary actions

  const customTheme = {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: primaryColor,
      borderRadius: 8,
      fontFamily: "'Inter', sans-serif",
      colorBgContainer: isDark ? '#1e293b' : '#ffffff',
      colorBgLayout: isDark ? '#0f172a' : '#f8fafc',
      colorTextBase: isDark ? '#f1f5f9' : '#1e293b',
      colorBorderSecondary: isDark ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0',
    },
    components: {
      Table: {
        headerBg: isDark ? '#161e2e' : '#f8fafc',
        headerColor: isDark ? '#94a3b8' : '#64748b',
        headerBorderRadius: 8,
        rowHoverBg: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f1f5f9',
        cellPaddingBlock: 12,
        cellPaddingInline: 24,
      },
      Button: {
        fontWeight: 600,
        controlHeight: 38,
      },
      Tag: {
        borderRadiusSM: 4,
      },
    },
  };

  return (
    <ConfigProvider theme={customTheme}>
      <div className="App">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/vessels" element={<VesselsPage />} />
          <Route path="/vessel/:mmsi" element={<VesselPage />} />
          <Route path="/ports" element={<PortsPage />} />
          <Route path="/containers" element={<ContainersPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </ConfigProvider>
  );
}

export default App;
