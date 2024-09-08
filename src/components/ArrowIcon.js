import React from 'react';
import L from 'leaflet';

const ArrowIcon = ({ rotation }) => {
  const icon = L.divIcon({
    html: `
      <svg width="16" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="transform: rotate(${rotation}deg); transform-origin: 50% 50%;">
        <path d="M12 2 L2 22 L12 18 L22 22 Z" fill="rgba(0, 0, 255, 0.5)"/>
      </svg>
    `,
    iconSize: [24, 24],
    className: 'vessel-icon',
  });

  return icon;
};

export default ArrowIcon;
