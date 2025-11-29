import React, { useState, useEffect, useRef } from 'react';
import searchService from '../services/searchService';
import '../styles/MessengerSearch.css';

/**
 * MessengerSearchBar Component - Search users in messenger to start chat
 */
const MessengerSearchBar = ({ onUserSelect, onSearchChange, placeholder = 'Search to start chat...' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const searchRef = useRef(null);

  // Notify parent when search state changes
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(showResults);
    }
  }, [showResults, onSearchChange]);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      setShowResults(false);
      return;
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchService.searchUsers(query);
        console.log('Search results:', data);
        setResults(data.users || []);
        setShowResults(true);
      } catch (error) {
        console.error('Messenger search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [query]);

  // Click outside to close
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

  const handleUserClick = (user) => {
    if (onUserSelect) {
      onUserSelect(user);
    }
    setQuery('');
    setShowResults(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      handleUserClick(results[0]);
    }
  };

  return (
    <div className="messenger-search-container" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="messenger-search-form">
        <div className="search-input-wrapper">
          <span className="search-prefix-icon">🔍</span>
          <input
            type="text"
            className="messenger-search-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowResults(results.length > 0)}
          />
          {loading && (
            <span className="search-loading-icon">⏳</span>
          )}
        </div>
      </form>

      {showResults && (
        <div className="messenger-results-dropdown">
          {results.length === 0 ? (
            <div className="messenger-no-results">
              <span>No users found</span>
            </div>
          ) : (
            <div className="messenger-results-list">
              {results.map((user) => (
                <div
                  key={user.userId}
                  className="messenger-user-row"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="messenger-user-photo">
                    <img
                      src={user.profilePhoto || `https://via.placeholder.com/40/667eea/ffffff?text=${user.name?.[0] || 'U'}`}
                      alt={user.name}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/40/667eea/ffffff?text=${user.name?.[0] || 'U'}`;
                      }}
                    />
                  </div>
                  <div className="messenger-user-info">
                    <div className="messenger-user-name">{user.name}</div>
                    <div className="messenger-user-id">ID: {user.uid}</div>
                  </div>
                  <div className="messenger-action-icon">💬</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessengerSearchBar;
