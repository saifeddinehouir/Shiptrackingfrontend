import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

const MapComponent = () => {
  const [vessels, setVessels] = useState([]);

  useEffect(() => {
    const fetchVessels = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/vessel'); // Replace with your backend endpoint
        const data = await response.json();
        setVessels(data);
      } catch (error) {
        console.error('Error fetching vessels:', error);
      }
    };

    fetchVessels();
  }, []);

  const createArrowIcon = useCallback((rotation) => {
    return L.divIcon({
      html: `
        <svg width="16" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="transform: rotate(${rotation}deg); transform-origin: 50% 50%;">
          <path d="M12 2 L2 22 L12 18 L22 22 Z" fill="rgba(0, 0, 255, 0.5)"/>
        </svg>
      `,
      iconSize: [24, 24],
      className: 'vessel-icon',
    });
  });
  
  
  
  return (
    <div className='map-container'>
      <MapContainer
        center={[45, -0.19]}
        zoom={2}
        minZoom={2}
        maxZoom={13}
        style={{ height: '100vh', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png"
          
        />
        {vessels.map(vessel => (
          <Marker
            key={vessel.mmsi}
            position={[vessel.latitude, vessel.longitude]}
            icon={createArrowIcon(vessel.heading)} // Assuming vessel.direction holds the bearing in degrees
          >
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
