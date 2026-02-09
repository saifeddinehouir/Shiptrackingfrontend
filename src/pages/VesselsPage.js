import React from 'react';
import { Table, Input, Button, Tag, Space, Tooltip } from 'antd';
import { Ship, Filter, Activity, MapPin, ExternalLink } from 'lucide-react';
import NavSidebar from '../components/Navigation/NavSidebar';
import { useVessels } from '../hooks/useVessels';
import { Link } from 'react-router-dom';
import './ModulePage.css';

const { Search: AntSearch } = Input;

const VesselsPage = () => {
    const { vessels, loading, filters, updateFilters } = useVessels();

    const columns = [
        {
            title: 'Vessel Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text) => (
                <Space>
                    <Ship size={16} style={{ color: '#2563eb' }} />
                    <span style={{ fontWeight: 600 }}>{text}</span>
                </Space>
            ),
        },
        {
            title: 'MMSI',
            dataIndex: 'mmsi',
            key: 'mmsi',
            render: (text) => <code>{text}</code>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filters: Array.from(new Set(vessels.map(v => v.type))).map(type => ({ text: type, value: type })),
            onFilter: (value, record) => record.type === value,
            render: (type) => <Tag color="blue">{type}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Space>
                    <Activity size={14} style={{ opacity: 0.6 }} />
                    <span>{status}</span>
                </Space>
            ),
        },
        {
            title: 'Speed',
            dataIndex: 'speed',
            key: 'speed',
            sorter: (a, b) => a.speed - b.speed,
            render: (speed) => <strong>{speed} kn</strong>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Locate on Map">
                        <Link to="/" className="action-link">
                            <MapPin size={16} />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Vessel Details">
                        <Link to={`/vessel/${record.mmsi}`} className="action-link">
                            <ExternalLink size={16} />
                        </Link>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="module-page-container">
            <NavSidebar />
            <main className="module-content">
                <header className="module-header">
                    <div className="header-title">
                        <Ship className="header-icon" />
                        <h1>Vessel Fleet</h1>
                    </div>
                    <div className="header-actions">
                        <AntSearch
                            placeholder="Search Name or MMSI..."
                            allowClear
                            onSearch={(value) => updateFilters({ searchTerm: value })}
                            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                            value={filters.searchTerm}
                            style={{ width: 300 }}
                        />
                        <Button icon={<Filter size={16} />}>
                            Advanced Filters
                        </Button>
                    </div>
                </header>

                <section className="data-section">
                    <Table
                        columns={columns}
                        dataSource={vessels}
                        rowKey="mmsi"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} vessels`
                        }}
                    />
                </section>
            </main>
        </div>
    );
};

export default VesselsPage;
