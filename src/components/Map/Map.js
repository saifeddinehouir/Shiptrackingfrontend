import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { createVesselIcon, getVesselColor } from './VesselIcon';
import './Map.css';

const VesselMap = React.memo(({ vessels, onVesselClick, selectedVesselMmsi, baseLayer = 'street', showWind = false }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const clusterGroupRef = useRef(null);
    const tileLayersRef = useRef({});
    const windLayerRef = useRef(null);
    const markersRef = useRef(new Map()); // mmsi -> { marker, lastUpdate }
    const selectedMmsiRef = useRef(selectedVesselMmsi);

    // Sync selected vessel ref
    useEffect(() => {
        selectedMmsiRef.current = selectedVesselMmsi;
    }, [selectedVesselMmsi]);

    // 1. Initialize Map (Run once)
    useEffect(() => {
        if (mapRef.current) return;

        let map;
        try {
            map = L.map(mapContainerRef.current, {
                center: [20, 0],
                zoom: 3,
                zoomControl: false,
                attributionControl: false,
                preferCanvas: true
            });
        } catch (err) {
            console.error("Leaflet Map Init Error:", err);
            return;
        }

        const street = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        });

        const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });

        const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        });

        const windLayer = L.tileLayer('https://{s}.tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2', {
            attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
            opacity: 0.85,
            zIndex: 10
        });

        street.addTo(map);

        tileLayersRef.current = {
            street,
            satellite,
            dark
        };
        windLayerRef.current = windLayer;

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        if (!L.markerClusterGroup) {
            console.error("L.markerClusterGroup is not defined.");
            return;
        }

        const clusterGroup = L.markerClusterGroup({
            chunkedLoading: true,
            maxClusterRadius: 30,
            disableClusteringAtZoom: 9,
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            iconCreateFunction: (cluster) => {
                const childMarkers = cluster.getAllChildMarkers();
                const leadMarker = childMarkers[0];
                const leadVessel = leadMarker ? leadMarker.vesselData : { type: 'Unknown', heading: 0 };
                const icon = createVesselIcon(leadVessel, false);
                const html = icon ? icon.options.html : '';

                return L.divIcon({
                    html: `<div class="vessel-cluster-wrapper">${html}</div>`,
                    className: 'vessel-cluster-container',
                    iconSize: [30, 30]
                });
            }
        });

        map.addLayer(clusterGroup);
        mapRef.current = map;
        clusterGroupRef.current = clusterGroup;

        // Optional: Manual zoom listener to update all icons at once (Density Awareness)
        map.on('zoomend', () => {
            const zoom = map.getZoom();
            markersRef.current.forEach(({ marker }) => {
                const vesselData = marker.vesselData;
                const isSelected = vesselData.mmsi === selectedMmsiRef.current;
                marker.setIcon(getAppropriateIcon(vesselData, zoom, isSelected));
            });
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // 1.5 Sync Base Layer
    useEffect(() => {
        if (!mapRef.current || !tileLayersRef.current) return;
        const map = mapRef.current;
        const layers = tileLayersRef.current;

        // Remove all current base layers
        Object.values(layers).forEach(layer => {
            if (map.hasLayer(layer)) map.removeLayer(layer);
        });

        // Add the selected one
        const selected = layers[baseLayer] || layers.street;
        selected.addTo(map);
    }, [baseLayer]);

    // 1.6 Sync Overlays
    useEffect(() => {
        if (!mapRef.current || !windLayerRef.current) return;
        const map = mapRef.current;
        const wind = windLayerRef.current;

        if (showWind) {
            if (!map.hasLayer(wind)) wind.addTo(map);
        } else {
            if (map.hasLayer(wind)) map.removeLayer(wind);
        }
    }, [showWind]);

    // 2. Helper for Zoom-Aware Icons
    const getAppropriateIcon = (vessel, zoom, isSelected) => {
        if (zoom < 6) {
            return L.divIcon({
                html: `<div class="vessel-dot" style="background: ${getVesselColor(vessel.type)};"></div>`,
                className: 'vessel-dot-container',
                iconSize: [8, 8],
                iconAnchor: [4, 4]
            });
        }
        return createVesselIcon(vessel, isSelected);
    };

    // 3. Update Markers Imperatively
    useEffect(() => {
        if (!clusterGroupRef.current || !mapRef.current) return;

        const clusterGroup = clusterGroupRef.current;
        const map = mapRef.current;
        const zoom = map.getZoom();
        const now = Date.now();

        vessels.forEach(vessel => {
            let markerEntry = markersRef.current.get(vessel.mmsi);
            const isSelected = vessel.mmsi === selectedVesselMmsi;

            if (markerEntry) {
                const { marker } = markerEntry;
                // Update Position
                marker.setLatLng([vessel.latitude, vessel.longitude]);
                marker.setIcon(getAppropriateIcon(vessel, zoom, isSelected));
                marker.vesselData = vessel;
                markerEntry.lastUpdate = now;

                // Update Tooltip Content smoothly
                const timeAgo = Math.floor((now - new Date(vessel.timestamp).getTime()) / 1000);
                marker.setTooltipContent(getTooltipContent(vessel, timeAgo));

            } else {
                // New Vessel - Create with fade-in effect via CSS
                const icon = getAppropriateIcon(vessel, zoom, isSelected);
                const marker = L.marker([vessel.latitude, vessel.longitude], {
                    icon,
                    opacity: 0 // Start invisible for fade-in
                });

                marker.vesselData = vessel;
                marker.on('click', () => onVesselClick(vessel.mmsi));
                marker.bindTooltip(getTooltipContent(vessel, 0), {
                    direction: 'top',
                    offset: [0, -10],
                    opacity: 0.95
                });

                clusterGroup.addLayer(marker);
                markersRef.current.set(vessel.mmsi, { marker, lastUpdate: now });

                // Trigger CSS fade-in via timeout or just setOpacity
                setTimeout(() => marker.setOpacity(1), 50);
            }
        });
    }, [vessels, selectedVesselMmsi, onVesselClick]);

    // 4. Inactivity Cleanup Cycle (Run every 1 minute)
    useEffect(() => {
        const cleanupInterval = setInterval(() => {
            const now = Date.now();
            const clusterGroup = clusterGroupRef.current;
            if (!clusterGroup) return;

            markersRef.current.forEach((entry, mmsi) => {
                const age = now - entry.lastUpdate;

                if (age > 600000) { // 10 minutes: Fully remove
                    clusterGroup.removeLayer(entry.marker);
                    markersRef.current.delete(mmsi);
                } else if (age > 300000) { // 5 minutes: Fade out
                    entry.marker.setOpacity(0.4);
                }
            });
        }, 60000);

        return () => clearInterval(cleanupInterval);
    }, []);

    const getTooltipContent = (vessel, timeAgo) => `
        <div class="vessel-tooltip">
            <div class="tooltip-header">${vessel.name}</div>
            <div class="tooltip-row">Destination: <strong>${vessel.destination || 'N/A'}</strong></div>
            <div class="tooltip-footer">Updated ${timeAgo || 0}s ago</div>
        </div>
    `;

    return (
        <div className="main-map-wrapper">
            <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

        </div>
    );
});

export default VesselMap;
