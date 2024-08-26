import React from 'react';
import { Route, Router, Routes } from 'react-router-dom'; // Import Routes and Route components
import MapComponent from './components/MapComponent';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';
import VesselsPage from './pages/VesselPage'; // Import the VesselsPage component
import PortsPage from './pages/PortPage'; // Import the PortsPage component
import './App.css';

function App() {
  return (
    <div className="App">
      
      <div className="main-content">
        
        <div className="content-area">
          
          <Routes> {/* Wrap your components in Routes */}
            <Route path="/" element={<MapComponent/>} /> {/* Default route for the map */}
            <Route path="/vessels" element={<VesselsPage/>} /> {/* Placeholder for Vessels Page */}
            <Route path="/ports" element={<PortsPage/>} /> {/* Placeholder for Ports Page */}
            <Route path="/containers" element={<div>Containers Page</div>} /> {/* Placeholder for Containers Page */}
          </Routes>
          
        </div>
      </div>
    </div>
  );
}

export default App;
