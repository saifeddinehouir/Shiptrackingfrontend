import { useMemo } from 'react';
import ports from '../data/ports.json';
import trajectories from '../data/vessel_trajectories.json';
import { isVesselInZone, calculateCongestionScore } from '../utils/geoUtils';

/**
 * Hook to calculate congestion metrics for all ports.
 * @param {Array} vessels - List of current vessel positions
 * @returns {Array} List of ports with added metrics
 */
export const usePortCongestion = (vessels) => {
    const portMetrics = useMemo(() => {
        if (!vessels || vessels.length === 0) return [];

        return ports.map(port => {
            const vesselsInPort = vessels.filter(v => isVesselInZone(v, port));
            const total = vesselsInPort.length;
            const anchored = vesselsInPort.filter(v =>
                v.speed < 1 || v.status === 'At Anchor' || v.status === 'Moored'
            ).length;

            // Calculate average waiting time
            let totalWaitTime = 0;
            vesselsInPort.forEach(vessel => {
                const trajectory = trajectories[vessel.mmsi.toString()];
                if (trajectory && trajectory.length > 0) {
                    // Find how long they've been in the zone
                    let entryTime = new Date(trajectory[0].timestamp);
                    for (let i = 0; i < trajectory.length; i++) {
                        const pos = trajectory[i];
                        if (isVesselInZone({ latitude: pos.lat, longitude: pos.lng }, port)) {
                            entryTime = new Date(pos.timestamp);
                        } else {
                            // If they were outside, the previous point was the entry (roughly)
                            break;
                        }
                    }
                    const latestTime = new Date(trajectory[0].timestamp);
                    const waitHours = (latestTime - entryTime) / (1000 * 60 * 60);
                    totalWaitTime += Math.max(0, waitHours);
                }
            });

            const avgWaitTime = total > 0 ? totalWaitTime / total : 0;
            const congestionScore = calculateCongestionScore(
                { total, anchored, avgWaitTime },
                port.capacity
            );

            return {
                ...port,
                metrics: {
                    total,
                    anchored,
                    underway: total - anchored,
                    avgWaitTime: avgWaitTime.toFixed(1),
                    congestionScore
                }
            };
        });
    }, [vessels]);

    return portMetrics;
};
