import React, { useState, useRef, useEffect } from 'react';
import { Ship, Activity, RotateCcw, Globe, Map as MapIcon, Moon, Wind } from 'lucide-react';

const FiltersPanel = ({
    filters,
    onFilterChange,
    onReset,
    vesselTypes,
    vesselStatuses,
    baseLayer,
    onLayerChange,
    showWind,
    onToggleWind
}) => {
    const [activeFlyout, setActiveFlyout] = useState(null); // 'type' | 'status' | null
    const panelRef = useRef(null);

    // Close flyout on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setActiveFlyout(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleFlyout = (key) => {
        setActiveFlyout(activeFlyout === key ? null : key);
    };

    const handleSelectOption = (key, value) => {
        onFilterChange({ [key]: value });
        setActiveFlyout(null);
    };

    return (
        <div className="filters-panel" ref={panelRef}>
            {/* Map Layers Section (Vertical Icons) */}
            <div className="filter-group layers-group">
                <div className="layer-toggles">
                    <button
                        className={`layer-btn ${baseLayer === 'street' ? 'active' : ''}`}
                        onClick={() => onLayerChange('street')}
                        title="Street View"
                    >
                        <MapIcon size={20} />
                    </button>
                    <button
                        className={`layer-btn ${baseLayer === 'satellite' ? 'active' : ''}`}
                        onClick={() => onLayerChange('satellite')}
                        title="Satellite View"
                    >
                        <Globe size={20} />
                    </button>
                    <button
                        className={`layer-btn ${baseLayer === 'dark' ? 'active' : ''}`}
                        onClick={() => onLayerChange('dark')}
                        title="Dark Mode"
                    >
                        <Moon size={20} />
                    </button>
                    <button
                        className={`layer-btn wind-btn ${showWind ? 'active' : ''}`}
                        onClick={onToggleWind}
                        title="Wind Conditions"
                    >
                        <Wind size={20} />
                    </button>
                </div>
            </div>

            {/* Vessel Type Filter */}
            <div className="filter-group">
                <button
                    className={`filter-btn-icon ${activeFlyout === 'type' ? 'active' : ''}`}
                    onClick={() => toggleFlyout('type')}
                    title="Vessel Type"
                >
                    <Ship size={20} />
                    {filters.type && <div className="filter-indicator" />}
                </button>

                <div className={`filter-flyout ${activeFlyout === 'type' ? 'visible' : ''}`}>
                    <div className="flyout-header">Vessel Types</div>
                    <div className="flyout-options">
                        <button
                            className={`option-btn ${filters.type === '' ? 'selected' : ''}`}
                            onClick={() => handleSelectOption('type', '')}
                        >
                            All Types
                        </button>
                        {vesselTypes.filter(Boolean).map(type => (
                            <button
                                key={type}
                                className={`option-btn ${filters.type === type ? 'selected' : ''}`}
                                onClick={() => handleSelectOption('type', type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Vessel Status Filter */}
            <div className="filter-group">
                <button
                    className={`filter-btn-icon ${activeFlyout === 'status' ? 'active' : ''}`}
                    onClick={() => toggleFlyout('status')}
                    title="Vessel Status"
                >
                    <Activity size={20} />
                    {filters.status && <div className="filter-indicator" />}
                </button>

                <div className={`filter-flyout ${activeFlyout === 'status' ? 'visible' : ''}`}>
                    <div className="flyout-header">Vessel Status</div>
                    <div className="flyout-options">
                        <button
                            className={`option-btn ${filters.status === '' ? 'selected' : ''}`}
                            onClick={() => handleSelectOption('status', '')}
                        >
                            All Statuses
                        </button>
                        {vesselStatuses.filter(Boolean).map(status => (
                            <button
                                key={status}
                                className={`option-btn ${filters.status === status ? 'selected' : ''}`}
                                onClick={() => handleSelectOption('status', status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button className="reset-button-icon" onClick={onReset} title="Reset Filters">
                <RotateCcw size={20} />
            </button>
        </div>
    );
};

export default FiltersPanel;
