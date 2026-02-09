import React from 'react';
import VesselMap from '../components/Map/Map';
import { Ship, Activity } from 'lucide-react';
import NavSidebar from '../components/Navigation/NavSidebar';
import Sidebar from '../components/Sidebar/Sidebar';
import SearchBar from '../components/Sidebar/SearchBar';
import FiltersPanel from '../components/Sidebar/FiltersPanel';
import { useVessels } from '../hooks/useVessels';

const MapPage = () => {
    const [baseLayer, setBaseLayer] = React.useState('street');
    const [showWind, setShowWind] = React.useState(false);

    const {
        vessels,
        allVessels,
        loading,
        filters,
        updateFilters,
        resetFilters,
        selectedVessel,
        setSelectedVesselMmsi
    } = useVessels();

    const vesselTypes = Array.from(new Set(allVessels.map(v => v.type)));
    const vesselStatuses = Array.from(new Set(allVessels.map(v => v.status)));

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading Maritime Traffic Data...</p>
            </div>
        );
    }

    return (
        <div className="map-page-container">
            <NavSidebar />

            <VesselMap
                vessels={vessels}
                selectedVesselMmsi={selectedVessel?.mmsi}
                onVesselClick={setSelectedVesselMmsi}
                baseLayer={baseLayer}
                showWind={showWind}
            />

            <Sidebar>
                <SearchBar
                    value={filters.searchTerm}
                    onChange={(val) => updateFilters({ searchTerm: val })}
                />
                <FiltersPanel
                    filters={filters}
                    onFilterChange={updateFilters}
                    onReset={resetFilters}
                    vesselTypes={vesselTypes}
                    vesselStatuses={vesselStatuses}
                    baseLayer={baseLayer}
                    onLayerChange={setBaseLayer}
                    showWind={showWind}
                    onToggleWind={() => setShowWind(!showWind)}
                />
                {selectedVessel && (
                    <div className="selected-vessel-info">
                        <div className="vessel-card">
                            <div className="card-header">
                                <Ship size={14} />
                                <strong>{selectedVessel.name}</strong>
                            </div>
                            <div className="card-body">
                                <div className="info-item">
                                    <Activity size={12} />
                                    <span>{selectedVessel.speed} kn</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Sidebar>
        </div>
    );
};

export default MapPage;
