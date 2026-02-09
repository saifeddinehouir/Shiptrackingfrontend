import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Card, Descriptions, Button, Space, Tag, Divider, Breadcrumb } from 'antd';
import { Ship, ArrowLeft, Navigation, Clock, MapPin, Radio } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './VesselPage.css';

const VesselPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vessel } = location.state || {};

  if (!vessel) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>No vessel data available</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const createIcon = (rotation) => {
    return L.divIcon({
      html: `
        <svg width="32" height="32" viewBox="0 0 24 24" style="transform: rotate(${rotation}deg); transform-origin: 50% 50%;">
          <path d="M12 2 L2 22 L12 18 L22 22 Z" fill="#2563eb" stroke="white" stroke-width="2"/>
        </svg>
      `,
      iconSize: [32, 32],
      className: 'vessel-marker-icon',
    });
  };

  return (
    <div className="vessel-detail-page">
      <header className="detail-header">
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Breadcrumb
            items={[
              { title: 'Dashboard', onClick: () => navigate('/') },
              { title: 'Vessels', onClick: () => navigate('/vessels') },
              { title: vessel.ship_name || 'Vessel Detail' }
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
                <h1>{vessel.ship_name || 'Unknown Vessel'}</h1>
                <Tag color="processing" icon={<Radio size={12} />}>LIVE</Tag>
              </Space>
            </div>
          </div>
        </Space>
      </header>

      <div className="detail-grid">
        <Card className="map-card" bordered={false}>
          <div className="vessel-detail-map-wrapper">
            <MapContainer
              center={[vessel.latitude, vessel.longitude]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
              />
              <Marker
                position={[vessel.latitude, vessel.longitude]}
                icon={createIcon(vessel.heading)}
              />
            </MapContainer>
          </div>
          <div className="map-footer">
            <Space split={<Divider type="vertical" />}>
              <span><MapPin size={14} /> {vessel.latitude.toFixed(4)}, {vessel.longitude.toFixed(4)}</span>
              <span><Navigation size={14} /> {vessel.heading}° Course</span>
            </Space>
          </div>
        </Card>

        <Card className="info-card" bordered={false} title="Identity & Telemetry">
          <Descriptions column={1} bordered size="small" className="vessel-descriptions">
            <Descriptions.Item label={<Space><Radio size={14} /> MMSI</Space>}>
              <code>{vessel.mmsi}</code>
            </Descriptions.Item>
            <Descriptions.Item label={<Space><Ship size={14} /> Name</Space>}>
              {vessel.ship_name}
            </Descriptions.Item>
            <Descriptions.Item label={<Space><Navigation size={14} /> Heading</Space>}>
              {vessel.heading}°
            </Descriptions.Item>
            <Descriptions.Item label={<Space><Clock size={14} /> Last Update</Space>}>
              {vessel.timeUtc}
            </Descriptions.Item>
            <Descriptions.Item label="Position">
              <Tag color="cyan">LAT: {vessel.latitude}</Tag>
              <Tag color="cyan">LON: {vessel.longitude}</Tag>
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">Operations</Divider>
          <div className="operations-stats">
            <div className="stat-item">
              <span className="stat-label">Reported Speed</span>
              <span className="stat-value">{vessel.speed || '0.0'} kn</span>
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
