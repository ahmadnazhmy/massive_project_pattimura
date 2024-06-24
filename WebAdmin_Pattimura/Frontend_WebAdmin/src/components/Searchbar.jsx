import React, { useState } from 'react';
import searchIcon from '../assets/icons/search_icon.png';

const Searchbar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Ketik untuk mencari..."
        className="search-input"
        value={query}
        onChange={handleInputChange}
      />
      <img src={searchIcon} alt="Search Icon" className="search-icon" />
    </div>
  );
};

export default Searchbar;