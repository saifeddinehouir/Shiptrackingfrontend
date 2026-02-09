import React from 'react';
import { Table, Card, Row, Col, Statistic, Tag, Badge, Button } from 'antd';
import {
    SafetyCertificateOutlined,
    DownloadOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined
} from '@ant-design/icons';
import NavSidebar from '../components/Navigation/NavSidebar';
import './ModulePage.css';

const CompliancePage = () => {
    const stats = [
        { label: 'Fleet Health', value: '98.2', suffix: '%', icon: <CheckCircleOutlined style={{ color: '#22c55e' }} />, trend: 0.4, trendType: 'up' },
        { label: 'Active Alerts', value: '3', suffix: '', icon: <WarningOutlined style={{ color: '#ef4444' }} />, trend: 2, trendType: 'down' },
        { label: 'Pending Audits', value: '12', suffix: '', icon: <ClockCircleOutlined style={{ color: '#3b82f6' }} />, trend: 'Due soon', trendType: 'neutral' },
        { label: 'Certificates', value: '1,450', suffix: '', icon: <FileTextOutlined style={{ color: '#64748b' }} />, trend: 'Valid', trendType: 'neutral' },
    ];

    const incidents = [
        { key: '1', id: 'INC-8821', vessel: 'Maersk Eindhoven', type: 'Speed Violation', date: '2026-02-08', severity: 'Medium', status: 'Under Review' },
        { key: '2', id: 'INC-8819', vessel: 'MSC Gülsün', type: 'Zone Incursion', date: '2026-02-07', severity: 'High', status: 'Action Required' },
        { key: '3', id: 'INC-8815', vessel: 'Ever Given', type: 'Draft Discrepancy', date: '2026-02-05', severity: 'Low', status: 'Resolved' },
    ];

    const columns = [
        {
            title: 'Incident ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
        },
        {
            title: 'Vessel',
            dataIndex: 'vessel',
            key: 'vessel',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Severity',
            dataIndex: 'severity',
            key: 'severity',
            render: (severity) => {
                let color = 'green';
                if (severity === 'High') color = 'red';
                if (severity === 'Medium') color = 'orange';
                return <Tag color={color}>{severity.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let badgeStatus = 'processing';
                if (status === 'Resolved') badgeStatus = 'success';
                if (status === 'Action Required') badgeStatus = 'error';
                return <Badge status={badgeStatus} text={status} />;
            },
        },
    ];

    return (
        <div className="module-page-container">
            <NavSidebar />
            <main className="module-content">
                <header className="module-header">
                    <div className="header-title">
                        <SafetyCertificateOutlined style={{ fontSize: '32px', color: '#2563eb', marginRight: '16px' }} />
                        <h1>Compliance & Safety</h1>
                    </div>
                    <div className="header-actions">
                        <Button icon={<DownloadOutlined />} type="primary" ghost>
                            Export Security Report
                        </Button>
                    </div>
                </header>

                <Row gutter={[24, 24]} className="stats-row">
                    {stats.map((stat, i) => (
                        <Col xs={24} sm={12} lg={6} key={i}>
                            <Card bordered={false} className="stat-card-antd">
                                <Statistic
                                    title={<span style={{ color: '#94a3b8' }}>{stat.label}</span>}
                                    value={stat.value}
                                    suffix={stat.suffix}
                                    prefix={stat.icon}
                                    valueStyle={{ color: '#f8fafc', fontWeight: 700 }}
                                />
                                <div style={{ marginTop: '8px', fontSize: '12px' }}>
                                    {stat.trendType === 'up' && <span style={{ color: '#22c55e' }}><ArrowUpOutlined /> {stat.trend}</span>}
                                    {stat.trendType === 'down' && <span style={{ color: '#ef4444' }}><ArrowDownOutlined /> {stat.trend}</span>}
                                    {stat.trendType === 'neutral' && <span style={{ color: '#64748b' }}>{stat.trend}</span>}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <section className="data-section" style={{ marginTop: '32px' }}>
                    <div className="section-header">
                        <h2 style={{ color: '#f8fafc', marginBottom: '20px' }}>Recent Compliance Incidents</h2>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={incidents}
                        pagination={false}
                        bordered={false}
                    />
                </section>
            </main>
        </div>
    );
};

export default CompliancePage;
