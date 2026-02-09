import React, { useState } from 'react';
import { Table, Input, Tag, Space, Tooltip, Badge } from 'antd';
import { Anchor, Search, MapPin, Ship } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavSidebar from '../components/Navigation/NavSidebar';
import './ModulePage.css';
import portData from '../data/ports.json';

const { Search: AntSearch } = Input;

const PortsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const columns = [
        {
            title: 'Port Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text) => (
                <Space>
                    <Anchor size={16} style={{ color: '#2563eb' }} />
                    <span style={{ fontWeight: 600 }}>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            filters: Array.from(new Set(portData.map(p => p.country))).map(c => ({ text: c, value: c })),
            onFilter: (value, record) => record.country === value,
        },
        {
            title: 'Active Vessels',
            dataIndex: 'activeVessels',
            key: 'activeVessels',
            sorter: (a, b) => a.activeVessels - b.activeVessels,
            render: (count) => (
                <Space>
                    <Ship size={14} style={{ opacity: 0.6 }} />
                    <strong>{count}</strong>
                </Space>
            ),
        },
        {
            title: 'Capacity',
            dataIndex: 'capacity',
            key: 'capacity',
            render: (capacity) => <Tag color="blue">{capacity}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'Optimal' || status === 'Smooth') color = 'success';
                if (status === 'Congested') color = 'error';
                if (status === 'Maintenance') color = 'warning';
                return <Badge status={color} text={status} />;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Tooltip title="See on Map">
                    <Link to="/" className="action-link">
                        <MapPin size={16} />
                    </Link>
                </Tooltip>
            ),
        },
    ];

    const filteredPorts = portData.filter(port =>
        port.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        port.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="module-page-container">
            <NavSidebar />
            <main className="module-content">
                <header className="module-header">
                    <div className="header-title">
                        <Anchor className="header-icon" />
                        <h1>Global Ports</h1>
                    </div>
                    <div className="header-actions">
                        <AntSearch
                            placeholder="Search Port or Country..."
                            allowClear
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onSearch={(value) => setSearchTerm(value)}
                            style={{ width: 300 }}
                        />
                    </div>
                </header>

                <section className="data-section">
                    <Table
                        columns={columns}
                        dataSource={filteredPorts}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </section>
            </main>
        </div>
    );
};

export default PortsPage;
