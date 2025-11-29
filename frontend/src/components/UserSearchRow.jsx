import React from 'react';
import '../styles/UserSearchRow.css';

/**
 * UserSearchRow Component - Single user row in search results (Facebook-style)
 */
const UserSearchRow = ({ user, onClick }) => {
  const { profilePhoto, name, username, uid, country } = user;

  // Fallback profile photo
  const defaultPhoto = 'https://via.placeholder.com/48/667eea/ffffff?text=' + (name?.[0] || 'U');

  return (
    <div className="user-search-row" onClick={onClick}>
      <div className="user-photo-wrapper">
        <img 
          src={profilePhoto || defaultPhoto} 
          alt={name} 
          className="user-profile-photo"
          onError={(e) => {
            e.target.src = defaultPhoto;
          }}
        />
        {country && (
          <span className="user-country-flag" title={country}>
            {getCountryFlag(country)}
          </span>
        )}
      </div>

      <div className="user-info">
        <div className="user-name">{name}</div>
        <div className="user-id">ID: {uid || username}</div>
      </div>

      <div className="user-arrow">
        <span>→</span>
      </div>
    </div>
  );
};

// Helper function to get country flag emoji
const getCountryFlag = (country) => {
  const flags = {
    'Bangladesh': '🇧🇩',
    'Malaysia': '🇲🇾',
    'India': '🇮🇳',
    'Pakistan': '🇵🇰',
    'Nepal': '🇳🇵',
    'BD': '🇧🇩',
    'MY': '🇲🇾',
    'IN': '🇮🇳',
    'PK': '🇵🇰',
    'NP': '🇳🇵'
  };
  return flags[country] || '🌍';
};

export default UserSearchRow;
