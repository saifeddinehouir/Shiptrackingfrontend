import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'; // Add your CSS styling here

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      try {
        const response = await fetch(`http://localhost:5000/vessel/${encodeURIComponent(trimmedQuery)}`);
        if (response.ok) {
          const data = await response.json();
          navigate(`/vessel/${trimmedQuery}`, { state: { vessel: data } });
        } else {
          alert('Vessel not found');
        }
      } catch (error) {
        console.error('Error fetching vessel data:', error);
        alert('Error fetching vessel data');
      }
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by Name or MMSI "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;
