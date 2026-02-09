import React, { useState } from 'react';
import { Table, Input, Button, Tag, Space, Tooltip, Badge } from 'antd';
import { Box, Plus, Ship, MapPin, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavSidebar from '../components/Navigation/NavSidebar';
import './ModulePage.css';

const { Search: AntSearch } = Input;

const ContainersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const containers = [
        { id: 'MSKU9284752', size: '40ft HC', type: 'Reefer', vessel: 'Maersk Eindhoven', destination: 'Rotterdam', status: 'In Transit' },
        { id: 'CMAU1029384', size: '20ft STD', type: 'Dry', vessel: 'CMA CGM Antoine', destination: 'Singapore', status: 'Loading' },
        { id: 'HLCU7728391', size: '40ft STD', type: 'Dry', vessel: 'Hapag-Lloyd Express', destination: 'Hamburg', status: 'In Transit' },
        { id: 'ONEU5522113', size: '40ft HC', type: 'Open Top', vessel: 'ONE Apus', destination: 'Tokyo', status: 'Arrived' },
        { id: 'MSC8822001', size: '20ft STD', type: 'Flat Rack', vessel: 'MSC Gülsün', destination: 'New York', status: 'In Transit' },
    ];

    const columns = [
        {
            title: 'Container ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id.localeCompare(b.id),
            render: (text) => (
                <Space>
                    <Box size={16} style={{ color: '#2563eb' }} />
                    <span style={{ fontWeight: 600 }}>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Size/Type',
            key: 'sizeType',
            render: (_, record) => (
                <div>
                    <Tag color="blue">{record.size}</Tag>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{record.type}</div>
                </div>
            ),
        },
        {
            title: 'Vessel',
            dataIndex: 'vessel',
            key: 'vessel',
            sorter: (a, b) => a.vessel.localeCompare(b.vessel),
            render: (vessel) => (
                <Space>
                    <Ship size={14} style={{ opacity: 0.6 }} />
                    <span>{vessel}</span>
                </Space>
            ),
        },
        {
            title: 'Destination',
            dataIndex: 'destination',
            key: 'destination',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let badgeStatus = 'processing';
                if (status === 'Arrived') badgeStatus = 'success';
                if (status === 'Loading') badgeStatus = 'warning';
                return <Badge status={badgeStatus} text={status} />;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Space>
                    <Tooltip title="Locate Vessel">
                        <Link to="/" className="action-link">
                            <MapPin size={16} />
                        </Link>
                    </Tooltip>
                    <Button type="text" icon={<MoreVertical size={16} />} />
                </Space>
            ),
        },
    ];

    const filteredContainers = containers.filter(c =>
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.vessel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="module-page-container">
            <NavSidebar />
            <main className="module-content">
                <header className="module-header">
                    <div className="header-title">
                        <Box className="header-icon" />
                        <h1>Container Inventory</h1>
                    </div>
                    <div className="header-actions">
                        <AntSearch
                            placeholder="Search Container ID or Vessel..."
                            allowClear
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onSearch={(value) => setSearchTerm(value)}
                            style={{ width: 300 }}
                        />
                        <Button type="primary" icon={<Plus size={18} />}>
                            Add Container
                        </Button>
                    </div>
                </header>

                <section className="data-section">
                    <Table
                        columns={columns}
                        dataSource={filteredContainers}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </section>
            </main>
        </div>
    );
};

export default ContainersPage;
