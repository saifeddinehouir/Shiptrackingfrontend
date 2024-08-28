import React from 'react';
import { useLocation } from 'react-router-dom';

const VesselDetails = () => {
  const location = useLocation();
  const vessel = location.state?.vessel;

  if (!vessel) {
    return <div>No data available</div>;
  }

  return (
    <div className="vessel-details">
      <h1>{vessel.name}</h1>
      <div>
        <h2>Position</h2>
        <p>Latitude: {vessel.latitude}</p>
        <p>Longitude: {vessel.longitude}</p>
      </div>
      <div>
        <h2>Information</h2>
        <p>{vessel.info}</p>
      </div>
    </div>
  );
};

export default VesselDetails;
