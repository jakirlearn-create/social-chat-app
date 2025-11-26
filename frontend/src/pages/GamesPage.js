import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GamesPage.css';

function GamesPage() {
  const navigate = useNavigate();

  const games = [
    {
      id: 1,
      name: 'Tic Tac Toe',
      icon: '⭕❌',
      description: 'Classic game of X and O',
      url: '/games/tictactoe',
      available: true
    },
    {
      id: 2,
      name: 'Rock Paper Scissors',
      icon: '✊✋✌️',
      description: 'Play with friends',
      url: '/games/rps',
      available: true
    },
    {
      id: 3,
      name: 'Chess',
      icon: '♟️',
      description: 'Strategic board game',
      url: '/games/chess',
      available: false
    },
    {
      id: 4,
      name: 'Word Puzzle',
      icon: '🔤',
      description: 'Test your vocabulary',
      url: '/games/word-puzzle',
      available: false
    },
    {
      id: 5,
      name: 'Trivia Quiz',
      icon: '🧠',
      description: 'Answer fun questions',
      url: '/games/trivia',
      available: false
    },
    {
      id: 6,
      name: 'Snake Game',
      icon: '🐍',
      description: 'Classic arcade game',
      url: '/games/snake',
      available: false
    }
  ];

  const handleGameClick = (game) => {
    if (game.available) {
      window.location.href = game.url;
    } else {
      alert('Coming Soon! 🎮');
    }
  };

  return (
    <div className="games-page">
      <div className="games-header">
        <button className="games-back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="games-title">🎮 Games</h1>
      </div>

      <div className="games-grid">
        {games.map((game) => (
          <div
            key={game.id}
            className={`game-card ${!game.available ? 'game-disabled' : ''}`}
            onClick={() => handleGameClick(game)}
          >
            <div className="game-icon">{game.icon}</div>
            <div className="game-info">
              <h3 className="game-name">{game.name}</h3>
              <p className="game-description">{game.description}</p>
              {!game.available && <span className="coming-soon-badge">Coming Soon</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GamesPage;
