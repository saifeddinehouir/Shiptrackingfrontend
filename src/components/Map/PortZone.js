import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { getCongestionCategory } from '../../utils/geoUtils';
import './PortZone.css';

/**
 * PortZone component to visually represent port geofences and congestion levels.
 * Uses imperative Leaflet API because the project does not use MapContainer context.
 */
const PortZone = ({ port, isSelected, onClick, map }) => {
    const { metrics, coords, radius, name } = port;
    const score = metrics.congestionScore;
    const circleRef = useRef(null);

    // Color mapping for congestion
    const getColor = (s) => {
        if (s <= 30) return '#4caf50'; // Normal (Green)
        if (s <= 60) return '#ff9800'; // Busy (Orange)
        return '#f44336';             // Congested (Red)
    };

    const color = getColor(score);
    const category = getCongestionCategory(score);
    const pulseClass = score > 60 ? 'pulse-heavy' : (score > 30 ? 'pulse-light' : '');

    useEffect(() => {
        if (!map) return;

        // Create the circle layer
        const circle = L.circle([coords.lat, coords.lng], {
            radius: radius * 1000,
            color: color,
            fillColor: color,
            fillOpacity: isSelected ? 0.3 : 0.15,
            weight: isSelected ? 3 : 1,
            className: `port-circle ${pulseClass} ${isSelected ? 'selected' : ''}`
        });

        circle.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            onClick(port);
        });

        // Add tooltip
        circle.bindTooltip(`
            <div class="port-tooltip">
                <strong>${name}</strong><br />
                Score: ${score} (${category})
            </div>
        `, {
            direction: 'top',
            offset: [0, -10],
            opacity: 0.95
        });

        circle.addTo(map);
        circleRef.current = circle;

        return () => {
            if (circleRef.current) {
                circleRef.current.remove();
            }
        };
    }, [map, isSelected, color, pulseClass, score, category, coords.lat, coords.lng, radius, name, onClick, port]);

    return null; // This component doesn't render any DOM elements itself
};

export default PortZone;
