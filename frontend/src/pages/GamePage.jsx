import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GamePage.css';

function GamePage() {
  const navigate = useNavigate();
  const [games] = useState([
    {
      id: 1,
      name: 'Spin Wheel',
      icon: '🎰',
      description: 'Spin the wheel and win coins!',
      minBet: 10,
      maxWin: 1000,
      route: '/game/spin-wheel'
    },
    {
      id: 2,
      name: 'Coin Flip',
      icon: '🪙',
      description: 'Heads or Tails? Double your coins!',
      minBet: 5,
      maxWin: 500,
      route: '/game/coin-flip'
    },
    {
      id: 3,
      name: 'Lucky Dice',
      icon: '🎲',
      description: 'Roll the dice and test your luck!',
      minBet: 20,
      maxWin: 2000,
      route: '/game/lucky-dice'
    },
    {
      id: 4,
      name: 'Card Match',
      icon: '🃏',
      description: 'Match the cards and win big!',
      minBet: 15,
      maxWin: 1500,
      route: '/game/card-match'
    },
    {
      id: 5,
      name: 'Treasure Hunt',
      icon: '🏴‍☠️',
      description: 'Find hidden treasures!',
      minBet: 25,
      maxWin: 3000,
      route: '/game/treasure-hunt'
    },
    {
      id: 6,
      name: 'Number Guess',
      icon: '🔢',
      description: 'Guess the number correctly!',
      minBet: 10,
      maxWin: 800,
      route: '/game/number-guess'
    }
  ]);

  return (
    <div className="game-page">
      {/* Header with Back Button */}
      <div className="game-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>🎮 Game Center</h1>
        <div className="wallet-info">
          <span className="coin-icon">🪙</span>
          <span className="balance">2,500</span>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="featured-banner">
        <div className="banner-content">
          <h2>🎉 Welcome to Game Center!</h2>
          <p>Play games and win exciting rewards</p>
        </div>
      </div>

      {/* Games Grid */}
      <div className="games-container">
        <div className="games-grid">
          {games.map(game => (
            <div key={game.id} className="game-card" onClick={() => navigate(game.route)}>
              <div className="game-icon">{game.icon}</div>
              <h3 className="game-name">{game.name}</h3>
              <p className="game-description">{game.description}</p>
              <div className="game-stats">
                <div className="stat">
                  <span className="stat-label">Min Bet:</span>
                  <span className="stat-value">{game.minBet} 🪙</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Max Win:</span>
                  <span className="stat-value">{game.maxWin} 🪙</span>
                </div>
              </div>
              <button className="btn-play">Play Now</button>
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="game-info">
        <div className="info-card">
          <h3>📋 How to Play</h3>
          <ul>
            <li>Choose your favorite game</li>
            <li>Place your bet with coins</li>
            <li>Play and win rewards</li>
            <li>Withdraw your winnings anytime</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>🏆 Leaderboard</h3>
          <p>Coming Soon...</p>
        </div>
      </div>
    </div>
  );
}

export default GamePage;
