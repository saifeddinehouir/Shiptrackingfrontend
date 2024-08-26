// components/MapComponent.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

const MapComponent = () => {
  const [vessels, setVessels] = useState([]);

  useEffect(() => {
    const fetchVessels = async () => {
      // Simulate API call with mock data
      const mockVessels = [
        { mmsi: '123456789', name: 'Vessel 1', latitude: 51.505, longitude: -0.09 },
        { mmsi: '987654321', name: 'Vessel 2', latitude: 52.505, longitude: -1.09 },
      ];
      setVessels(mockVessels);
    };
    fetchVessels();
  }, []);

  return (
    <div className='map-container'>
    <MapContainer center={[51.505, -0.09]} zoom={2} minZoom={2} maxZoom={13} style={{ height: '100vh', width: '100%' }} 
    attributionControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png"
      />
      {vessels.map(vessel => (
        <Marker key={vessel.mmsi} position={[vessel.latitude, vessel.longitude]}>
          <Popup>
            {vessel.name}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
    </div>
    
  );
};

export default MapComponent;
