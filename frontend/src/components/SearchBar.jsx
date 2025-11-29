import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import searchService from '../services/searchService';
import SearchResultsList from './SearchResultsList';
import '../styles/SearchBar.css';

/**
 * SearchBar Component - Facebook-style search with real-time suggestions
 */
const SearchBar = ({ placeholder = 'Search users...' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search function
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for 300ms debounce
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchService.searchUsers(query);
        setResults(data.users || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    setDebounceTimer(timer);

    // Cleanup
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search submit (Enter key or search icon click)
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    
    if (query.trim().length < 2) return;
    
    // If there are results, navigate to first result
    if (results.length > 0) {
      navigate(`/profile/${results[0].userId}`);
      setShowResults(false);
      setQuery('');
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(results.length > 0)}
        />
        
        <button 
          type="submit" 
          className="search-icon-btn"
          onClick={handleSearchSubmit}
          disabled={loading || query.trim().length < 2}
        >
          {loading ? (
            <span className="search-spinner">⏳</span>
          ) : (
            <span className="search-icon">🔍</span>
          )}
        </button>
      </form>

      {showResults && (
        <SearchResultsList 
          results={results} 
          query={query}
          onResultClick={(userId) => {
            navigate(`/profile/${userId}`);
            setShowResults(false);
            setQuery('');
          }}
        />
      )}
    </div>
  );
};

export default SearchBar;
