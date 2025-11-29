import React from 'react';
import UserSearchRow from './UserSearchRow';
import '../styles/SearchResultsList.css';

/**
 * SearchResultsList Component - Dropdown results for search
 */
const SearchResultsList = ({ results, query, onResultClick }) => {
  if (!results || results.length === 0) {
    return (
      <div className="search-results-dropdown">
        <div className="no-results">
          <span className="no-results-icon">🔍</span>
          <p>No matching user found</p>
          <span className="no-results-query">Searched for: "{query}"</span>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-dropdown">
      <div className="results-header">
        <span className="results-count">{results.length} result{results.length > 1 ? 's' : ''} found</span>
      </div>
      
      <div className="results-list">
        {results.map((user) => (
          <UserSearchRow 
            key={user.userId} 
            user={user} 
            onClick={() => onResultClick(user.userId)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResultsList;
