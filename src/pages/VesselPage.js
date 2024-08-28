import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { formatDate } from 'date-fns'; // Import the format function

import 'leaflet/dist/leaflet.css';
import './VesselPage.css'; // Add your CSS styling here

const VesselPage = () => {
  const location = useLocation();
  const { vessel } = location.state || {};

  if (!vessel) {
    return <div>No vessel data available</div>;
  }

  // Create a custom icon for the marker
  const createIcon = (rotation) => {
    return L.divIcon({
      html: `
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="transform: rotate(${rotation}deg); transform-origin: 50% 50%;">
          <path d="M12 2 L2 22 L12 18 L22 22 Z" fill="blue"/>
        </svg>
      `,
      iconSize: [24, 24],
      className: 'vessel-icon',
    });
  };

  return (
    <div className="vessel-page">
      <div className="map-container">
        <MapContainer
          center={[vessel.latitude, vessel.longitude]}
          zoom={12}
          style={{ height: '300px', width: '400px' }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png"
          />
          <Marker
            position={[vessel.latitude, vessel.longitude]}
            icon={createIcon(vessel.heading)}
          />
        </MapContainer>
      </div>
      <div className="info-table">
        <div className="table-container">
          <table>
            <tbody>
              <tr>
                <th>MMSI</th>
                <td>{vessel.mmsi}</td>
              </tr>
              <tr>
                <th>Ship Name</th>
                <td>{vessel.ship_name}</td>
              </tr>
              <tr>
                <th>Latitude</th>
                <td>{vessel.latitude}</td>
              </tr>
              <tr>
                <th>Longitude</th>
                <td>{vessel.longitude}</td>
              </tr>
              <tr>
                <th>Heading</th>
                <td>{vessel.heading}</td>
              </tr>
              <tr>
                <th>Time (UTC)</th>
                <td>{vessel.timeUtc}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default VesselPage;
