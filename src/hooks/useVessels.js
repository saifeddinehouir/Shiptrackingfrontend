import { useState, useEffect, useMemo } from 'react';
import vesselService from '../services/vesselService';
import { io } from 'socket.io-client';

/**
 * Hook to manage vessel data, filtering, and selection.
 */
export const useVessels = () => {
    const [vesselsMap, setVesselsMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        searchTerm: '',
        status: '',
        type: ''
    });
    const [selectedVesselMmsi, setSelectedVesselMmsi] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await vesselService.getVessels();
                const initialMap = {};
                data.forEach(v => { initialMap[v.mmsi] = v; });
                setVesselsMap(initialMap);
            } catch (err) {
                console.error("Initial data load failed:", err);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        const socket = io('http://localhost:5000');
        const updateBuffer = new Map();

        socket.on('connect', () => {
            console.log('CONNECTED to frontend socket.id:', socket.id);
        });

        socket.on('aisData', (data) => {
            const lat = data.Latitude ?? data.latitude;
            const lon = data.Longitude ?? data.longitude;

            if (typeof lat !== 'number' || typeof lon !== 'number') return;

            const newVessel = {
                mmsi: data.MMSI,
                name: data.ShipName || data.Name || `Unknown (${data.MMSI})`,
                latitude: lat,
                longitude: lon,
                heading: data.TrueHeading || data.Cog || 0,
                speed: data.Sog || 0,
                type: data.VesselType || data.vessel_type || 'Unknown',
                status: data.NavigationalStatus || 'Underway',
                timestamp: data.time_utc,
                destination: data.Destination || ''
            };

            updateBuffer.set(newVessel.mmsi, newVessel);
        });

        const flushInterval = setInterval(() => {
            if (updateBuffer.size === 0) return;

            const updates = Array.from(updateBuffer.values());
            updateBuffer.clear();

            setVesselsMap(prevMap => {
                const newMap = { ...prevMap };
                updates.forEach(v => {
                    if (newMap[v.mmsi]) {
                        // Merge update
                        newMap[v.mmsi] = {
                            ...newMap[v.mmsi],
                            ...Object.fromEntries(Object.entries(v).filter(([_, val]) => val !== undefined && val !== 'Unknown' && val !== 0))
                        };
                        newMap[v.mmsi].latitude = v.latitude;
                        newMap[v.mmsi].longitude = v.longitude;
                    } else {
                        newMap[v.mmsi] = v;
                    }
                });
                return newMap;
            });
        }, 3000); // 3-second batching for high volume

        return () => {
            socket.disconnect();
            clearInterval(flushInterval);
        };
    }, []);

    const vessels = useMemo(() => Object.values(vesselsMap), [vesselsMap]);

    const filteredVessels = useMemo(() => {
        return vesselService.filterVessels(vessels, filters);
    }, [vessels, filters]);

    const selectedVessel = useMemo(() => {
        return vesselsMap[selectedVesselMmsi] || null;
    }, [vesselsMap, selectedVesselMmsi]);

    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const resetFilters = () => {
        setFilters({ searchTerm: '', status: '', type: '' });
    };

    return {
        vessels: filteredVessels,
        allVessels: vessels,
        loading,
        filters,
        updateFilters,
        resetFilters,
        selectedVessel,
        setSelectedVesselMmsi
    };
};
