import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CountrySelection.css';

const CountrySelectionPage = () => {
  const navigate = useNavigate();

  const countries = [
    { name: 'Bangladesh', flag: '🇧🇩', code: 'bd' },
    { name: 'Malaysia', flag: '🇲🇾', code: 'my' },
    { name: 'India', flag: '🇮🇳', code: 'in' },
    { name: 'Pakistan', flag: '🇵🇰', code: 'pk' },
    { name: 'Nepal', flag: '🇳🇵', code: 'np' }
  ];

  const handleCountrySelect = (countryCode) => {
    navigate(`/admin/register/form/${countryCode}`);
  };

  return (
    <div className="country-selection-container">
      <div className="country-card">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate('/admin/options')}>
          ← Back
        </button>

        <h1 className="country-title">Select Your Country</h1>
        <p className="country-subtitle">Choose your country to continue registration</p>

        <div className="countries-grid">
          {countries.map((country) => (
            <button
              key={country.code}
              className="country-btn"
              onClick={() => handleCountrySelect(country.code)}
            >
              <div className="country-flag">{country.flag}</div>
              <div className="country-name">{country.name}</div>
            </button>
          ))}
        </div>

        <div className="notice-box">
          <p>💡 Each country has specific registration requirements</p>
        </div>
      </div>
    </div>
  );
};

export default CountrySelectionPage;
