import React from 'react';
import './PortInfoPanel.css';
import { getCongestionCategory } from '../../utils/geoUtils';

/**
 * PortInfoPanel component to display detailed metrics for a selected port.
 */
const PortInfoPanel = ({ port, onClose }) => {
    if (!port) return null;

    const { name, metrics } = port;
    const { total, anchored, underway, avgWaitTime, congestionScore } = metrics;
    const category = getCongestionCategory(congestionScore);

    const getScoreColor = (score) => {
        if (score <= 30) return '#4caf50';
        if (score <= 60) return '#ff9800';
        return '#f44336';
    };

    return (
        <div className="port-info-panel">
            <div className="panel-header">
                <h3>{name}</h3>
                <button className="close-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="metrics-grid">
                <div className="metric-box score-box">
                    <span className="label">Congestion Score</span>
                    <div
                        className="score-value"
                        style={{ color: getScoreColor(congestionScore) }}
                    >
                        {congestionScore}
                    </div>
                    <span className="category">{category}</span>
                </div>

                <div className="metric-box">
                    <span className="label">Total Vessels</span>
                    <span className="value">{total}</span>
                </div>

                <div className="metric-box">
                    <span className="label">Avg. Wait Time</span>
                    <span className="value">{avgWaitTime}h</span>
                </div>
            </div>

            <div className="vessel-status-bar">
                <div className="status-label">Vessel Status</div>
                <div className="progress-bar-container">
                    <div
                        className="progress-segment anchored"
                        style={{ width: `${total > 0 ? (anchored / total) * 100 : 0}%` }}
                    >
                        <span className="segment-label">{anchored} Anchored</span>
                    </div>
                    <div
                        className="progress-segment underway"
                        style={{ width: `${total > 0 ? (underway / total) * 100 : 0}%` }}
                    >
                        <span className="segment-label">{underway} Underway</span>
                    </div>
                </div>
            </div>

            <div className="panel-footer">
                <p className="hint">Data updated in real-time based on AIS signals.</p>
            </div>
        </div>
    );
};

export default PortInfoPanel;
