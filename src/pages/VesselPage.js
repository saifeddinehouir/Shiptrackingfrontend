// src/pages/VesselsPage.js

import React from 'react';
import ListComponent from '../components/List';

const vessels = [
  { id: 1, name: 'Vessel 1', destination: 'Port A' },
  { id: 2, name: 'Vessel 2', destination: 'Port B' },
  // more vessels...
];

const VesselsPage = () => {
  const renderVessel = (vessel) => (
    <div>
      <strong>{vessel.name}</strong> - {vessel.destination}
    </div>
  );

  return (
    <div>
      <ListComponent 
        items={vessels} 
        renderItem={renderVessel} 
        title="Vessels List" 
      />
    </div>
  );
};

export default VesselsPage;
