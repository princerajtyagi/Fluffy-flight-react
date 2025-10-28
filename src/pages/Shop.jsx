// src/pages/Shop.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For the footer buttons
import { useGame } from '../context/GameContext'; // Your "Game Brain"

// The list of birds, from your original shop.html
const BIRDS = [
  { id: 1, name: 'Classic',  emoji: '🐦', price: 0 },
  { id: 2, name: 'Crimson',  emoji: '🐦‍⬛', price: 100 },
  { id: 3, name: 'Sunny',    emoji: '🐤', price: 200 },
  { id: 4, name: 'Dove',     emoji: '🕊️', price: 300 },
  { id: 5, name: 'Flare',    emoji: '🦜', price: 400 },
  { id: 6, name: 'Aero',     emoji: '🦤', price: 500 },
  { id: 7, name: 'Nebula',   emoji: '🦅', price: 600 },
  { id: 8, name: 'Royal',    emoji: '🐦‍🔥', price: 700 },
];

function Shop() {
  // Get all the state and functions from your global context
  const { coins, unlocked, selected, unlockBird, selectBird } = useGame();
  
  // Hook for navigation (e.g., "Back" button)
  const navigate = useNavigate();

  // Local state for the "Not enough coins!" popup
  const [popupMessage, setPopupMessage] = useState(null);

  // This effect will hide the popup after 1.6 seconds
  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => {
        setPopupMessage(null);
      }, 1600); // 1.6 seconds, just like your original script
      
      // Cleanup function to prevent errors if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [popupMessage]); // This runs every time popupMessage changes

  // Helper function to show the popup
  const triggerPopup = (message) => {
    setPopupMessage(message);
  };

  // This one function handles all logic for clicking a card
  const handleCardClick = (bird) => {
    if (unlocked.includes(bird.id)) {
      // If it's already unlocked, just select it
      selectBird(bird.id);
    } else {
      // Otherwise, try to buy it
      const success = unlockBird(bird); // This function is in your context!
      
      if (success) {
        // If the purchase worked, select it
        selectBird(bird.id);
        triggerPopup(`Unlocked ${bird.name}!`);
      } else {
        // If it failed (not enough coins), show popup
        triggerPopup('Not enough coins!');
      }
    }
  };

  return (
    <>
      {/* We don't need clouds here, App.jsx is handling it */}

      {/* Topbar */}
      <div className="topbar" role="banner">
        <div className="brand">
          <div className="logo" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true">
              <circle cx="32" cy="24" r="18" fill="#2e95ff" />
              <polygon points="40,26 50,22 44,34" fill="#ffb200" />
            </svg>
          </div>
          <div>
            <div className="brand-name">FLUFFY FLIGHT</div>
            <div className="meta">Game Store</div>
          </div>
        </div>

        <div className="top-actions">
          <div className="coins" id="coinsBox" aria-live="polite" title="Total coins">
            {/* The coin image from your original file */}
            <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%23ffd200'/></svg>" alt="coin" />
            <div>
              <div style={{ fontSize: '11px', opacity: .85 }}>COINS</div>
              {/* This is now connected to your global state! */}
              <div id="coinCount" style={{ fontFamily: 'var(--font-game)', fontSize: '14px' }}>
                {coins}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main wrapper */}
      <div className="wrap" role="main">
        <h1>Bird Shop</h1>
        <div className="subtitle">Pick a bird, unlock new skins with coins, and take it into the skies!</div>

        {/* This is the React way to do your 'render()' function */}
        <div className="grid" id="grid">
          {BIRDS.map((bird) => {
            // Check the state for each bird
            const isUnlocked = unlocked.includes(bird.id);
            const isSelected = selected === bird.id;
            const canAfford = coins >= bird.price;

            // Determine what the button should look like
            let btnText = 'Locked';
            let btnClass = 'locked';
            if (isUnlocked) {
              btnText = isSelected ? 'Selected' : 'Use';
              btnClass = isSelected ? 'selected' : 'use';
            } else if (canAfford) {
              btnText = 'Unlock';
              btnClass = 'unlock';
            }
            
            return (
              <div
                key={bird.id}
                className={`card ${isSelected ? 'selected' : ''}`}
                tabIndex="0"
                role="button"
                aria-pressed={isSelected}
                onClick={() => handleCardClick(bird)}
              >
                <div className="preview" aria-hidden="true">
                  <div className="bird-emoji">{bird.emoji}</div>
                </div>
                <h3>{bird.name}</h3>
                <div className="price">{bird.price === 0 ? 'Free' : bird.price + ' coins'}</div>
                <div style={{ height: '8px' }}></div>
                <button 
                  className={`btn ${btnClass}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents click from bubbling to the card
                    handleCardClick(bird);
                  }}
                >
                  {btnText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer buttons now use navigate() */}
        <div className="footer">
          <button 
            className="action secondary" 
            onClick={() => navigate('/')} // Goes to Home
          >
            ← Back to Home
          </button>
          <button 
            className="action primary" 
            onClick={() => navigate('/levels')} // Goes to Level Select
          >
            Continue →
          </button>
        </div>
      </div>

      {/* Popup: This will only render if popupMessage is not null */}
      {popupMessage && (
        <div className="popup show" id="popup">
          {popupMessage}
        </div>
      )}
    </>
  );
}

export default Shop;