import L from 'leaflet';

/**
 * Utility to create a maritime-style vessel icon.
 * @param {Object} vessel Vessel data
 * @param {Boolean} isSelected Whether the vessel is selected
 * @returns {L.DivIcon} Leaflet DivIcon
 */
export const createVesselIcon = (vessel, isSelected = false) => {
    const color = getVesselColor(vessel.type);
    const scale = isSelected ? 1.4 : 1.0;
    const strokeColor = '#ffffff'; // White outline like MarineTraffic
    const strokeWidth = isSelected ? 2 : 1;
    const heading = vessel.heading || 0;

    return L.divIcon({
        className: 'vessel-marker-container',
        html: `
            <div class="vessel-icon-wrapper" style="transform: rotate(${heading}deg) scale(${scale});">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- MarineTraffic-style sharp arrowhead -->
                    <path d="M12 2L19 21L12 17L5 21L12 2Z" 
                          fill="${color}" 
                          stroke="${strokeColor}" 
                          stroke-width="${strokeWidth}"
                          style="transition: stroke 0.3s ease, stroke-width 0.3s ease" />
                </svg>
            </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

export const getVesselColor = (type) => {
    // Unified semi-transparent blue as requested
    return 'rgba(37, 99, 235, 0.75)';
};
