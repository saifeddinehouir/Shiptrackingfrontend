import React, { useState } from 'react';
import { Table, Input, Tag, Space, Tooltip, Button } from 'antd';
import { Building2, ExternalLink, Globe, Users } from 'lucide-react';
import NavSidebar from '../components/Navigation/NavSidebar';
import './ModulePage.css';

const { Search: AntSearch } = Input;

const CompaniesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const companies = [
        { id: '1', name: 'Maersk Line', hq: 'Copenhagen, Denmark', fleetSize: 730, industry: 'Container Shipping', website: 'maersk.com' },
        { id: '2', name: 'MSC', hq: 'Geneva, Switzerland', fleetSize: 600, industry: 'Container Shipping', website: 'msc.com' },
        { id: '3', name: 'CMA CGM', hq: 'Marseille, France', fleetSize: 560, industry: 'Logistics', website: 'cma-cgm.com' },
        { id: '4', name: 'Hapag-Lloyd', hq: 'Hamburg, Germany', fleetSize: 250, industry: 'Shipping', website: 'hapag-lloyd.com' },
        { id: '5', name: 'Ocean Network Express', hq: 'Tokyo, Japan', fleetSize: 220, industry: 'Shipping', website: 'one-line.com' },
    ];

    const columns = [
        {
            title: 'Company Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text) => (
                <Space>
                    <Building2 size={16} style={{ color: '#2563eb' }} />
                    <span style={{ fontWeight: 600 }}>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Headquarters',
            dataIndex: 'hq',
            key: 'hq',
            render: (hq) => (
                <Space>
                    <Globe size={14} style={{ opacity: 0.6 }} />
                    <span>{hq}</span>
                </Space>
            ),
        },
        {
            title: 'Fleet Size',
            dataIndex: 'fleetSize',
            key: 'fleetSize',
            sorter: (a, b) => a.fleetSize - b.fleetSize,
            render: (size) => (
                <Space>
                    <Users size={14} style={{ opacity: 0.6 }} />
                    <span>{size} Vessels</span>
                </Space>
            ),
        },
        {
            title: 'Industry',
            dataIndex: 'industry',
            key: 'industry',
            render: (industry) => <Tag color="blue">{industry}</Tag>,
        },
        {
            title: 'Website',
            dataIndex: 'website',
            key: 'website',
            render: (url) => (
                <a href={`https://${url}`} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>
                    {url}
                </a>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Tooltip title="View Profile">
                    <Button type="text" icon={<ExternalLink size={16} />} />
                </Tooltip>
            ),
        },
    ];

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.hq.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="module-page-container">
            <NavSidebar />
            <main className="module-content">
                <header className="module-header">
                    <div className="header-title">
                        <Building2 className="header-icon" />
                        <h1>Shipping Companies</h1>
                    </div>
                    <div className="header-actions">
                        <AntSearch
                            placeholder="Search companies..."
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
                        dataSource={filteredCompanies}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </section>
            </main>
        </div>
    );
};

export default CompaniesPage;
