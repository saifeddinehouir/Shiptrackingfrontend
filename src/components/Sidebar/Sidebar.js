import React from 'react';
import './Sidebar.css';

const Sidebar = ({ children }) => {
    return (
        <div className="sidebar-container">
            <div className="sidebar-content">
                {children}
            </div>
        </div>
    );
};

export default Sidebar;
