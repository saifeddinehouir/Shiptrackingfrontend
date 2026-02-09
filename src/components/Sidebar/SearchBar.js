import React from 'react';

import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const SearchBar = ({ value, onChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    // Close if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                if (!value) setIsExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value]);

    return (
        <div className="search-bar-container" ref={containerRef}>
            <div className={`search-input-wrapper ${isExpanded ? 'expanded' : ''}`}>
                <button
                    className="search-toggle-btn"
                    onClick={handleToggle}
                    type="button"
                    title="Search"
                >
                    <Search size={20} />
                </button>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Vessel or MMSI..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={isExpanded ? 'visible' : 'hidden'}
                />
                {isExpanded && value && (
                    <button className="clear-search-btn" onClick={() => onChange('')}>
                        <X size={14} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
