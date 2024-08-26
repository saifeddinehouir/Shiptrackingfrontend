// components/SideBar.js
import React from 'react';
import './SideBar.css';

const SideBar = () => {
  return (
    <div className="side-bar">
      <h2>Options</h2>
      <ul>
        <li>Filter by Type</li>
        <li>Filter by Size</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default SideBar;
