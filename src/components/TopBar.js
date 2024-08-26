import React from 'react';
import { Link } from 'react-router-dom';
import './TopBar.css';
import logo from './ressources/logo.png';

const TopBar = () => {
    return (
        <div className="topbar">
            <div className="app-info">
                <Link to="/" style={{ display:'flex', alignItems: 'center',justifyContent: 'space-between', marginLeft: '10px'}}>
                    <img src={logo} alt="App Icon" style={{ width: '35px', height: '35px' }} />
                    <h1 className="app-name">ShipTracking</h1>
                </Link>
            </div>
            <div className="links" style={{textAlign:'center',gap:'20px',textDecoration:'none',fontSize: '16px',color: 'white',fontWeight: 'bold'}} >
                <Link to="/" style={{textDecoration:'none',color:'inherit'}}>Map</Link>
                <Link to="/vessels" style={{textDecoration:'none',color:'inherit'}}>Vessels</Link>
                <Link to="/ports" style={{textDecoration:'none',color:'inherit'}}>Ports</Link>
                <Link to="/containers" style={{textDecoration:'none',color:'inherit'}}>Containers</Link>
                <Link to="/ports" style={{textDecoration:'none',color:'inherit'}}>News</Link>
            </div>
            <div className="search" style={{marginRight:'0'}}>
                <input type="text" placeholder="Search Ship, Port, Container" />
            </div>
            
        </div>
    );
}

export default TopBar;
