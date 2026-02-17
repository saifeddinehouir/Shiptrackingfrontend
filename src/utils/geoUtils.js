/**
 * Utility functions for geographic calculations.
 */

/**
 * Calculates the Haversine distance between two points on the Earth.
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Checks if a vessel is within a certain radius of a port.
 * @param {Object} vessel - Vessel object with latitude and longitude
 * @param {Object} port - Port object with coords (lat, lng) and radius
 * @returns {boolean}
 */
export const isVesselInZone = (vessel, port) => {
    const distance = getDistance(
        vessel.latitude,
        vessel.longitude,
        port.coords.lat,
        port.coords.lng
    );
    return distance <= port.radius;
};

/**
 * Calculates a congestion score (0-100) for a port.
 * @param {Object} metrics - Port metrics (total, anchored, avgWaitTime)
 * @param {number} capacity - Estimated capacity of the port
 * @returns {number} Congestion score
 */
export const calculateCongestionScore = (metrics, capacity) => {
    const { total, anchored, avgWaitTime } = metrics;

    // Density component (up to 50 points)
    const densityScore = Math.min((total / capacity) * 50, 50);

    // Anchored ratio component (up to 30 points)
    const anchoredRatio = total > 0 ? anchored / total : 0;
    const anchorScore = anchoredRatio * 30;

    // Waiting time component (up to 20 points)
    // Assuming max wait time of 48 hours for full score
    const waitScore = Math.min((avgWaitTime / 48) * 20, 20);

    return Math.round(densityScore + anchorScore + waitScore);
};

/**
 * Categorizes congestion based on score.
 * @param {number} score 
 * @returns {string} Category
 */
export const getCongestionCategory = (score) => {
    if (score <= 30) return 'Normal';
    if (score <= 60) return 'Busy';
    return 'Congested';
};
