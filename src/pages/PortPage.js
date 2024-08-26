import React, { useState, useEffect } from 'react';

const PortsPage = () => {
    const [ports, setPorts] = useState([]);

    useEffect(() => {
        // Mock data for ports (replace with API call later)
        const mockPorts = [
            { id: 1, name: 'Port 1', location: 'Location 1' },
            { id: 2, name: 'Port 2', location: 'Location 2' },
            // Add more ports as needed
        ];
        setPorts(mockPorts);
    }, []);

    return (
        <div className="list-container">
            <h2>Ports</h2>
            <ul>
                {ports.map(port => (
                    <li key={port.id}>
                        <strong>{port.name}</strong> - {port.location}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PortsPage;
