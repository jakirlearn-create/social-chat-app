import React, { useState, useRef, useEffect } from 'react';
import './FloatingGamePanel.css';

const GAME_CONFIG = {
  ludo: { name: 'Ludo Quick', icon: '🎲', entryFee: 10, reward: 20 },
  carrom: { name: 'Carrom Lite', icon: '🎯', entryFee: 20, reward: 40 },
  chicken_jump: { name: 'Chicken Jump', icon: '🐔', entryFee: 5, reward: 10 },
  crash: { name: 'Crash Game', icon: '💥', entryFee: 15, reward: 30 },
  spin_wheel: { name: 'Spin Wheel', icon: '🎡', entryFee: 10, reward: 25 },
  number_roll: { name: 'Number Roll', icon: '🎲', entryFee: 8, reward: 16 },
  knife_hit: { name: 'Knife Hit', icon: '🔪', entryFee: 12, reward: 24 },
  fruit_slice: { name: 'Fruit Slice', icon: '🍎', entryFee: 10, reward: 20 },
  memory_match: { name: 'Memory Match', icon: '🧠', entryFee: 5, reward: 10 },
  tic_tac_toe: { name: 'Tic Tac Toe', icon: '⭕', entryFee: 5, reward: 10 },
};

export default function FloatingGamePanel({ onClose }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [userBalance, setUserBalance] = useState(1000); // Mock balance
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 100 });
  const [size, setSize] = useState({ width: 400, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);

  const handleGameClick = (gameKey) => {
    setSelectedGame(gameKey);
    setShowConfirmation(true);
  };

  const handleConfirmEntry = async () => {
    const game = GAME_CONFIG[selectedGame];
    
    if (userBalance < game.entryFee) {
      alert(`Insufficient balance! You need ${game.entryFee} coins but only have ${userBalance} coins.`);
      setShowConfirmation(false);
      return;
    }

    // Deduct coins
    try {
      const response = await fetch('http://localhost:8001/api/deductCoin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user123', // Replace with actual user ID
          amount: game.entryFee,
          game_name: selectedGame
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.new_balance);
        setShowConfirmation(false);
        setGameStarted(true);
      } else {
        alert('Failed to start game. Please try again.');
      }
    } catch (error) {
      console.error('Error deducting coins:', error);
      alert('Connection error. Please check if game server is running on port 8001.');
    }
  };

  const handleCancelEntry = () => {
    setShowConfirmation(false);
    setSelectedGame(null);
  };

  const handleBackToGames = () => {
    setGameStarted(false);
    setSelectedGame(null);
  };

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('panel-header') || e.target.closest('.panel-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart]);

  // Fetch user balance
  useEffect(() => {
    fetch('http://localhost:8001/api/wallet/user123')
      .then(res => res.json())
      .then(data => setUserBalance(data.balance))
      .catch(err => console.error('Failed to load balance:', err));
  }, []);

  return (
    <div
      ref={panelRef}
      className={`floating-game-panel ${isMinimized ? 'minimized' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: isMinimized ? 'auto' : `${size.height}px`
      }}
    >
      <div className="panel-header" onMouseDown={handleMouseDown}>
        <div className="panel-title">
          <span>⚡ Quick Games</span>
          <span className="balance">💰 {userBalance} coins</span>
        </div>
        <div className="panel-controls">
          <button onClick={() => setIsMinimized(!isMinimized)} title="Minimize">
            {isMinimized ? '◻' : '−'}
          </button>
          <button onClick={onClose} title="Close">✕</button>
        </div>
      </div>

      {!isMinimized && (
        <div className="panel-content">
          {!gameStarted ? (
            <div className="games-list">
              {Object.entries(GAME_CONFIG).map(([key, game]) => (
                <div
                  key={key}
                  className="mini-game-card"
                  onClick={() => handleGameClick(key)}
                >
                  <div className="game-icon">{game.icon}</div>
                  <div className="game-info">
                    <div className="game-name">{game.name}</div>
                    <div className="game-fee">{game.entryFee} 💰</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="game-iframe-container">
              <button className="back-btn" onClick={handleBackToGames}>
                ← Back to Games
              </button>
              <iframe
                src={`http://localhost:8001/games/${selectedGame}.html`}
                title={GAME_CONFIG[selectedGame]?.name}
                className="game-iframe"
                frameBorder="0"
              />
            </div>
          )}
        </div>
      )}

      {/* Entry Fee Confirmation Modal */}
      {showConfirmation && selectedGame && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <div className="modal-icon">
              {GAME_CONFIG[selectedGame].icon}
            </div>
            <h3>{GAME_CONFIG[selectedGame].name}</h3>
            <div className="modal-details">
              <div className="detail-row">
                <span>Entry Fee:</span>
                <span className="highlight">{GAME_CONFIG[selectedGame].entryFee} coins</span>
              </div>
              <div className="detail-row">
                <span>Win Reward:</span>
                <span className="success">{GAME_CONFIG[selectedGame].reward} coins</span>
              </div>
              <div className="detail-row">
                <span>Your Balance:</span>
                <span className={userBalance >= GAME_CONFIG[selectedGame].entryFee ? 'success' : 'error'}>
                  {userBalance} coins
                </span>
              </div>
            </div>
            <p className="modal-message">
              {userBalance >= GAME_CONFIG[selectedGame].entryFee 
                ? 'Are you ready to play?' 
                : '⚠️ Insufficient balance!'}
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCancelEntry}>
                Cancel
              </button>
              {userBalance >= GAME_CONFIG[selectedGame].entryFee && (
                <button className="btn-confirm" onClick={handleConfirmEntry}>
                  Start Game
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
