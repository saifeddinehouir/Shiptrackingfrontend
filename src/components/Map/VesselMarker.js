import React from 'react';
import { Marker, Tooltip, Popup } from 'react-leaflet';
import { createVesselIcon } from './VesselIcon';

const VesselMarker = React.memo(({ vessel, isSelected, onClick }) => {
    const icon = createVesselIcon(vessel, isSelected);

    return (
        <Marker
            position={[vessel.latitude, vessel.longitude]}
            icon={icon}
            eventHandlers={{
                click: () => onClick(vessel.mmsi)
            }}
        >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="vessel-tooltip">
                    <strong>{vessel.name}</strong><br />
                    <span>{vessel.type} | {vessel.speed} kn</span>
                </div>
            </Tooltip>
            <Popup>
                <div className="vessel-popup">
                    <h3>{vessel.name}</h3>
                    <hr />
                    <p><strong>MMSI:</strong> {vessel.mmsi}</p>
                    <p><strong>Status:</strong> {vessel.status}</p>
                    <p><strong>Destination:</strong> {vessel.destination}</p>
                    <p><strong>Speed:</strong> {vessel.speed} knots</p>
                    <p><strong>Heading:</strong> {vessel.heading}°</p>
                    <p><strong>Size:</strong> {vessel.length}m x {vessel.width}m</p>
                </div>
            </Popup>
        </Marker>
    );
});

export default VesselMarker;
