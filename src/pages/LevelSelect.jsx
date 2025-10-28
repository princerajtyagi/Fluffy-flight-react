// src/pages/LevelSelect.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

function LevelSelect() {
  // In React, we don't need the 'go()' function.
  // We can just wrap the cards in a <Link> component.

  return (
    <>
      {/* We don't need the <div class="sky"> here, App.jsx handles it */}

      {/* Header */}
      <header className="level-header">
        {/* Brand -- THIS MUST BE FIRST */}
        <div className="brand">
            <div className="logo" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true">
                <circle cx="32" cy="24" r="18" fill="#2e95ff" />
                <polygon points="40,26 50,22 44,34" fill="#ffb200" />
            </svg>
            </div>
            <div className="brand-name">FLUFFY FLIGHT</div>
        </div>
        
        {/* Buttons container -- THIS MUST BE SECOND */}
        <div className="nav-buttons">
            <Link className="shop-btn" to="/shop" aria-label="Go to Shop">🛒 Shop</Link>
            <Link className="back-home" to="/" aria-label="Back to Home">← Back to Home</Link>
        </div>
        </header>

      {/* Main content */}
      <main className="container" role="main">
        <section className="hero level-hero">
          <div className="title">
            <h1>Choose Your Level</h1>
            <p className="subtitle">Pick a difficulty and see how high you can soar. Each level has unique obstacles and pacing.</p>
          </div>

          {/* Level cards */}
          <div className="levels" role="list">

            {/* EASY - We wrap the whole article in a <Link> */}
            <Link to="/game/easy" className="level easy" aria-label="Easy Level">
              <div className="glow" aria-hidden="true"></div>
                <div className="icon center" aria-hidden="true">
                  <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
                    <ellipse cx="24" cy="36" rx="14" ry="8" fill="#fff" opacity=".9" />
                    <circle cx="40" cy="22" r="12" fill="#ffd36b" />
                    <path d="M28 28c6-4 14-6 20-4" stroke="#16324b" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <h2>Easy</h2>
                <p className="muted">Relaxed obstacles and slower speed — great for beginners.</p>
                {/* The button is now just for show, the Link handles the click */}
                <span className="start">Play Easy</span>
             </Link>

            {/* MEDIUM - Wrap in a <Link> */}
            <Link to="/game/medium" className="level medium" aria-label="Medium Level">
              <div className="glow" aria-hidden="true"></div>
                <div className="icon center" aria-hidden="true">
                  <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
                    <rect x="6" y="28" width="14" height="26" rx="4" fill="#7b5b2c" />
                    <rect x="28" y="18" width="12" height="36" rx="4" fill="#a35e1a" />
                    <circle cx="46" cy="22" r="8" fill="#ffd36b" />
                  </svg>
                </div>
                <h2>Medium</h2>
                <p className="muted">Increased obstacles and speed — recommended if you know the basics.</p>
                <span className="start">Play Medium</span>
              </Link>

            {/* HARD - Wrap in a <Link> */}
            <Link to="/game/hard" className="level hard" aria-label="Hard Level">
              <div className="glow" aria-hidden="true"></div>
                <div className="icon center" aria-hidden="true">
                  <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
                    <path d="M32 10c-6 6-8 12-6 18 4-2 6-6 10-6 2-6 0-10-4-12z" fill="#ff7a88" />
                    <circle cx="24" cy="36" r="6" fill="#fff" />
                    <circle cx="40" cy="36" r="6" fill="#fff" />
                    <path d="M22 48c4 6 16 6 20 0" stroke="#2a0710" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h2>Hard</h2>
                <p className="muted">Fast, tight gaps, and trick obstacles. Only for the daring.</p>
                <span className="start">Play Hard</span>
              </Link>

          </div>
        </section>
      </main>
    </>
  );
}

export default LevelSelect;