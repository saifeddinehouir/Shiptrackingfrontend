import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip as LeafletTooltip } from 'react-leaflet';
import { Card, Descriptions, Button, Space, Tag, Divider, Breadcrumb, Slider, Typography } from 'antd';
import { Ship, ArrowLeft, Navigation, Clock, MapPin, Radio, Play, Pause } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './VesselPage.css';
import vesselsData from '../data/vessels.json';
import trajectoriesData from '../data/vessel_trajectories.json';

const { Text } = Typography;

const VesselPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mmsi } = useParams();

  // Try to get vessel from state, otherwise look it up by MMSI
  const [vessel, setVessel] = useState(location.state?.vessel || null);

  // Playback State
  const [pathData, setPathData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Refs for direct manipulation (avoiding re-renders for 60fps animation)
  const markerRef = useRef(null);
  const animationRef = useRef(null);
  const lastFrameTimeRef = useRef(null);

  // Visual state for UI Text (Time/Speed) - Throttled
  const [uiState, setUiState] = useState(null);

  // Load vessel data if not present
  useEffect(() => {
    if (!vessel && mmsi) {
      const foundVessel = vesselsData.find(v => v.mmsi.toString() === mmsi);
      if (foundVessel) {
        setVessel(foundVessel);
      }
    }
  }, [vessel, mmsi]);

  // Load mock path data
  useEffect(() => {
    if (vessel) {
      let mockPath = trajectoriesData[vessel.mmsi];
      if (!mockPath || mockPath.length === 0) {
        mockPath = [{
          lat: vessel.latitude,
          lng: vessel.longitude,
          heading: vessel.heading,
          speed: vessel.speed,
          timestamp: new Date().toISOString()
        }];
      } else {
        mockPath = [...mockPath].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      }

      setPathData(mockPath);
      const lastIndex = mockPath.length - 1;
      setCurrentIndex(lastIndex);

      // Init UI state
      if (lastIndex >= 0) {
        setUiState({
          speed: mockPath[lastIndex].speed,
          timestamp: mockPath[lastIndex].timestamp,
          isDeadReckoning: false
        });
      }
    }
  }, [vessel]);

  // Update marker position manually when slider changes (and not playing)
  useEffect(() => {
    if (!isPlaying && pathData[currentIndex] && markerRef.current) {
      const p = pathData[currentIndex];
      markerRef.current.setLatLng([p.lat, p.lng]);

      // Update UI
      setUiState({
        speed: p.speed,
        timestamp: p.timestamp,
        isDeadReckoning: false
      });
      updateMarkerRotation(p.heading);
    }
  }, [currentIndex, isPlaying, pathData]);

  const updateMarkerRotation = (heading) => {
    if (markerRef.current) {
      const iconElement = markerRef.current.getElement();
      if (iconElement) {
        const svg = iconElement.querySelector('svg');
        if (svg) {
          svg.style.transform = `rotate(${heading}deg)`;
        }
      }
    }
  };

  // Advanced Animation Loop: Dead Reckoning & Interpolation
  useEffect(() => {
    const TIME_COMPRESSION_FACTOR = 1800;

    // Simulation state
    const simState = {
      index: currentIndex,
      startTime: null,
      simTime: null,
      lastUiUpdate: 0
    };

    if (pathData[currentIndex]) {
      simState.simTime = new Date(pathData[currentIndex].timestamp).getTime();
    }

    const animate = (time) => {
      if (!lastFrameTimeRef.current) lastFrameTimeRef.current = time;
      const deltaTime = time - lastFrameTimeRef.current;
      lastFrameTimeRef.current = time;

      if (pathData.length === 0) return;

      const simDelta = deltaTime * TIME_COMPRESSION_FACTOR * playbackSpeed;
      simState.simTime += simDelta;

      let activeIndex = simState.index;

      // Find active segment
      while (
        activeIndex < pathData.length - 1 &&
        simState.simTime >= new Date(pathData[activeIndex + 1].timestamp).getTime()
      ) {
        activeIndex++;
      }

      simState.index = activeIndex;

      // Visual update variables
      let currentLat, currentLng, currentHeading, currentSpeed;
      let isDeadReckoning = false;

      if (activeIndex < pathData.length - 1) {
        // INTERPOLATION
        const start = pathData[activeIndex];
        const end = pathData[activeIndex + 1];
        const t1 = new Date(start.timestamp).getTime();
        const t2 = new Date(end.timestamp).getTime();

        const fraction = (simState.simTime - t1) / (t2 - t1);
        const f = Math.max(0, Math.min(1, fraction));

        currentLat = start.lat + (end.lat - start.lat) * f;
        currentLng = start.lng + (end.lng - start.lng) * f;
        currentHeading = start.heading + (end.heading - start.heading) * f;
        currentSpeed = start.speed;
      } else {
        // EXTRAPOLATION
        isDeadReckoning = true;
        const lastPoint = pathData[pathData.length - 1];
        const tLast = new Date(lastPoint.timestamp).getTime();
        const timeSinceLast = simState.simTime - tLast;

        const speedMps = lastPoint.speed * 0.514444; // knots to m/s
        const distMeters = speedMps * (timeSinceLast / 1000);

        const R = 6371000;
        const headRad = (lastPoint.heading * Math.PI) / 180;
        const latRad = (lastPoint.lat * Math.PI) / 180;

        const deltaLatRad = (distMeters * Math.cos(headRad)) / R;
        const deltaLngRad = (distMeters * Math.sin(headRad)) / (R * Math.cos(latRad));

        currentLat = lastPoint.lat + (deltaLatRad * 180) / Math.PI;
        currentLng = lastPoint.lng + (deltaLngRad * 180) / Math.PI;
        currentHeading = lastPoint.heading;
        currentSpeed = lastPoint.speed;
      }

      // 2. Direct DOM updates (Always 60fps)
      if (markerRef.current) {
        markerRef.current.setLatLng([currentLat, currentLng]);
        updateMarkerRotation(currentHeading);
      }

      // 3. Update Sync States
      // Update global index only if changed (this will update slider position)
      if (simState.index !== currentIndex) {
        setCurrentIndex(simState.index);
      }

      // Throttle UI text updates to avoid React churn (accumulate 'dirty' state)
      if (time - simState.lastUiUpdate > 200) { // Update text every 200ms
        setUiState({
          speed: currentSpeed,
          timestamp: new Date(simState.simTime).toISOString(),
          isDeadReckoning,
          // We do NOT update lat/lng here to avoid re-rendering MapContainer/Marker props
        });
        simState.lastUiUpdate = time;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      lastFrameTimeRef.current = null;
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, pathData, playbackSpeed, currentIndex]);


  if (!vessel) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading vessel data...</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const createIcon = (heading) => {
    return L.divIcon({
      html: `
        <svg width="32" height="32" viewBox="0 0 24 24" style="transform: rotate(${heading}deg); transform-origin: 50% 50%;">
          <path d="M12 2 L2 22 L12 18 L22 22 Z" fill="#2563eb" stroke="white" stroke-width="2"/>
        </svg>
      `,
      iconSize: [32, 32],
      className: 'vessel-marker-icon',
    });
  };

  // Safe accessors
  const currentSpeed = uiState?.speed ?? vessel.speed;
  const currentTime = uiState?.timestamp ?? (pathData[currentIndex]?.timestamp);
  const isDeadReckoning = uiState?.isDeadReckoning;
  const currentHeading = pathData[currentIndex]?.heading ?? vessel.heading; // Start of segment heading

  // Current Position for MAP PROP (Stable)
  // We use the start of the current segment. 
  // The Marker will visually diverge from this due to ref manipulation, which is fine.
  const mapCenterLat = pathData[currentIndex]?.lat ?? vessel.latitude;
  const mapCenterLng = pathData[currentIndex]?.lng ?? vessel.longitude;

  const isLive = currentIndex === pathData.length - 1 && !isPlaying;

  const formatDate = (dateString, includeSeconds = false) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { hour: '2-digit', minute: '2-digit' };
    if (includeSeconds) options.second = '2-digit';
    return date.toLocaleTimeString([], options);
  };

  // Traveled path only updates when index changes
  const traveledPath = pathData.slice(0, currentIndex + 1).map(p => [p.lat, p.lng]);

  return (
    <div className="vessel-detail-page">
      <header className="detail-header">
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Breadcrumb
            items={[
              { title: 'Dashboard', onClick: () => navigate('/') },
              { title: 'Vessels', onClick: () => navigate('/vessels') },
              { title: vessel.ship_name || vessel.name || 'Vessel Detail' }
            ]}
          />
          <div className="header-main">
            <Button
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate(-1)}
              type="text"
              className="back-btn"
            />
            <div className="title-group">
              <Space align="center">
                <Ship size={24} className="vessel-type-icon" />
                <h1>{vessel.ship_name || vessel.name || 'Unknown Vessel'}</h1>
                {isDeadReckoning ? (
                  <Tag color="purple" icon={<Navigation size={12} />}>PREDICTING</Tag>
                ) : isLive ? (
                  <Tag color="processing" icon={<Radio size={12} />}>LIVE</Tag>
                ) : (
                  <Tag color="orange" icon={<Clock size={12} />}>HISTORY MODE</Tag>
                )}
              </Space>
            </div>
          </div>
        </Space>
      </header>

      <div className="detail-grid">
        <Card className="map-card" bordered={false} bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="vessel-detail-map-wrapper" style={{ flex: 1, minHeight: '400px' }}>
            <MapContainer
              key={`${vessel.mmsi}`}
              center={[mapCenterLat, mapCenterLng]}
              zoom={10}
              style={{ height: '100%', width: '100%' }}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
              />

              {pathData.length > 1 && (
                <Polyline
                  positions={pathData.map(p => [p.lat, p.lng])}
                  pathOptions={{ color: '#3b82f6', weight: 2, dashArray: '5, 5', opacity: 0.4 }}
                />
              )}

              {traveledPath.length > 0 && (
                <Polyline
                  positions={traveledPath}
                  pathOptions={{ color: '#2563eb', weight: 4 }}
                />
              )}

              {/* Marker Position is kept STABLE (segment start) to avoid React churn.
                  The visual position is overridden by ref.setLatLng() in the loop. */}
              <Marker
                ref={markerRef}
                position={[mapCenterLat, mapCenterLng]}
                icon={createIcon(currentHeading || 0)}
              >
                <LeafletTooltip direction="top" offset={[0, -20]} permanent>
                  <span>{isLive ? 'Current Position' : formatDate(currentTime, true)}</span>
                </LeafletTooltip>
              </Marker>
            </MapContainer>
          </div>

          {/* Playback Controls */}
          {pathData.length > 1 && (
            <div className="playback-controls" style={{ padding: '16px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Space>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      onClick={() => {
                        if (!isPlaying && currentIndex >= pathData.length - 1) {
                          setCurrentIndex(0);
                        }
                        setIsPlaying(!isPlaying);
                      }}
                    />
                    <Space direction="vertical" size={0} style={{ marginLeft: 8 }}>
                      <Text strong>{formatDate(currentTime, true)}</Text>
                      <Text type="secondary" style={{ fontSize: 10 }}>{new Date(currentTime || Date.now()).toLocaleDateString()}</Text>
                    </Space>
                  </Space>
                  <Space>
                    {isDeadReckoning && <Text type="warning" style={{ fontSize: 12 }}>Est. Pos.</Text>}
                    <Tag color="blue">Speed: {Number(currentSpeed).toFixed(1)} kn</Tag>
                  </Space>
                </Space>
                <Slider
                  min={0}
                  max={pathData.length - 1}
                  value={currentIndex}
                  onChange={(val) => {
                    setCurrentIndex(val);
                    setIsPlaying(false);
                    if (pathData[val]) {
                      setUiState({
                        speed: pathData[val].speed,
                        timestamp: pathData[val].timestamp,
                        isDeadReckoning: false
                      });
                    }
                  }}
                  tooltip={{ formatter: (val) => formatDate(pathData[val]?.timestamp) }}
                  styles={{
                    track: { background: '#2563eb' },
                    handle: { borderColor: '#2563eb' }
                  }}
                />
              </Space>
            </div>
          )}

          <div className="map-footer" style={{ padding: '8px 16px', fontSize: '12px', borderTop: '1px solid #f0f0f0' }}>
            <Space split={<Divider type="vertical" />}>
              <span><MapPin size={14} /> {mapCenterLat?.toFixed(4)}, {mapCenterLng?.toFixed(4)}</span>
              <span><Navigation size={14} /> {pathData[currentIndex]?.heading?.toFixed(0)}° Course</span>
            </Space>
          </div>
        </Card>

        <Card className="info-card" bordered={false} title="Identity & Telemetry">
          <Descriptions column={1} bordered size="small" className="vessel-descriptions">
            <Descriptions.Item label={<Space><Radio size={14} /> MMSI</Space>}>
              <code>{vessel.mmsi}</code>
            </Descriptions.Item>
            <Descriptions.Item label={<Space><Ship size={14} /> Name</Space>}>
              {vessel.ship_name || vessel.name}
            </Descriptions.Item>
            <Descriptions.Item label={<Space><Navigation size={14} /> Heading</Space>}>
              {pathData[currentIndex]?.heading?.toFixed(0)}°
            </Descriptions.Item>
            <Descriptions.Item label={<Space><Clock size={14} /> Time</Space>}>
              {formatDate(currentTime, true)}
            </Descriptions.Item>
            <Descriptions.Item label="Position">
              <Tag color="cyan">LAT: {mapCenterLat?.toFixed(4)}</Tag>
              <Tag color="cyan">LON: {mapCenterLng?.toFixed(4)}</Tag>
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">Operations</Divider>
          <div className="operations-stats">
            <div className="stat-item">
              <span className="stat-label">Speed</span>
              <span className="stat-value">{Number(currentSpeed).toFixed(1)} kn</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">AIS Class</span>
              <span className="stat-value">Class A</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VesselPage;
