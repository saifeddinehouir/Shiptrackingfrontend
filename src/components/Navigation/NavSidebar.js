import { Link, useLocation } from 'react-router-dom';
import {
    Ship,
    Anchor,
    Box,
    ShieldCheck,
    Building2,
    Settings,
    Bell,
    Map
} from 'lucide-react';
import './NavSidebar.css';
import logo from '../ressources/logo.png';

const NavSidebar = () => {
    const location = useLocation();

    const navItems = [
        { icon: <Map size={24} />, label: 'Map', id: 'map', path: '/' },
        { icon: <Ship size={24} />, label: 'Vessels', id: 'vessels', path: '/vessels' },
        { icon: <Anchor size={24} />, label: 'Ports', id: 'ports', path: '/ports' },
        { icon: <Box size={24} />, label: 'Containers', id: 'containers', path: '/containers' },
        { icon: <ShieldCheck size={24} />, label: 'Compliance', id: 'compliance', path: '/compliance' },
        { icon: <Building2 size={24} />, label: 'Companies', id: 'companies', path: '/companies' },
    ];

    const bottomItems = [
        { icon: <Bell size={24} />, label: 'Notifications', id: 'notifications', path: '/notifications' },
        { icon: <Settings size={24} />, label: 'Settings', id: 'settings', path: '/settings' },
    ];

    return (
        <aside className="nav-sidebar">
            <Link to="/" className="nav-logo">
                <div className="logo-circle">
                    <img src={logo} alt="Project Logo" className="nav-logo-img" />
                </div>
            </Link>

            <nav className="nav-menu">
                {navItems.map(item => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        title={item.label}
                    >
                        {item.icon}
                        <span className="nav-tooltip">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="nav-footer">
                {bottomItems.map(item => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        title={item.label}
                    >
                        {item.icon}
                        <span className="nav-tooltip">{item.label}</span>
                    </Link>
                ))}
            </div>
        </aside>
    );
};

export default NavSidebar;
