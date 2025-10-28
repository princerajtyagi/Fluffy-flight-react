// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For the "Play Now" button

// This is a new component for your FAQ
// We put it in the same file for simplicity
function FaqItem({ question, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="faq-item" role="listitem">
      <button className="faq-q" aria-expanded={isOpen} onClick={toggleOpen}>
        <span>{question}</span>
        <span className="toggle-icon" aria-hidden="true">
          {isOpen ? '–' : '+'}
        </span>
      </button>
      {/* This is conditional rendering! */}
      {isOpen && (
        <div className="faq-a" role="region">
          {children}
        </div>
      )}
    </div>
  );
}

// This is your main Home page component
function Home() {
  // This state replaces your hamburger menu JS
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // This state replaces your getFullYear() JS
  const [currentYear, setCurrentYear] = useState('');

  // This hook replaces your "DOMContentLoaded" or footer script
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []); // The empty [] means this runs only once on mount

  return (
    <>
      {/* Soft animated clouds behind all content */}
      <div className="clouds">
        <div className="cloud c1"></div>
        <div className="cloud c2"></div>
        <div className="cloud c3"></div>
        <div className="cloud c4"></div>
      </div>

      {/* ================= HEADER ================= */}
      <header>
        <div className="home-header">
          <nav className="nav" aria-label="Primary Navigation">
            <div className="brand">
              <div className="logo" aria-hidden="true">
                {/* Inline SVG bird-plane icon */}
                <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop stopColor="#2e95ff" offset="0" />
                      <stop stopColor="#7bd3ff" offset="1" />
                    </linearGradient>
                  </defs>
                  <path d="M6 30c8 2 16-6 26-6 3 0 9 1 12 5 5 6 1 14-6 16-14 4-24-6-32-8 0 0 0-5 0-7z" fill="url(#g1)" />
                  <path d="M46 26l12-5-9 14" fill="#ffb200" />
                  <circle cx="33" cy="26" r="2.6" fill="#16324b" />
                </svg>
              </div>
              <div className="brand-name">FLUFFY FLIGHT</div>
            </div>

            <div className="nav-links" role="menubar">
              <a href="#home" role="menuitem">Home</a>
              <a href="#about" role="menuitem">About</a>
              <a href="#faq" role="menuitem">FAQ</a>
              <a href="#contact" role="menuitem">Contact</a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="hamb"
              id="hamb"
              aria-label="Open Menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // This is the React way
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </nav>

          {/* Mobile panel: Conditionally rendered */}
          {isMobileMenuOpen && (
            <div className="mobile-menu" id="mobileMenu">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#faq">FAQ</a>
              <a href="#contact">Contact</a>
            </div>
          )}
        </div>
      </header>

      {/* ================= HERO ================= */}
      <main id="home" className="container">
        <section className="hero home-hero" aria-label="Hero">
          <div>
            <h1 className="headline">Fly High in Fluffy Flight</h1>
            <p className="subhead">
              Dodge the pipes, ride the breeze, and chase the high score! Fluffy Flight blends retro charm with crisp modern polish — perfect for quick, exciting runs.
            </p>
            {/* This is now a React Router Link */}
            <Link to="/levels" className="cta">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Play Now
            </Link>
          </div>

          {/* Right: decorative animated bird in a glassy card */}
          <div className="hero-card">
            <div className="bird-wrap" aria-hidden="true">
              <svg className="bird" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="120" cy="190" rx="40" ry="10" fill="rgba(0,0,0,.08)" />
                <defs>
                  <linearGradient id="bodyGrad" x1="0" x2="1">
                    <stop offset="0" stopColor="#2e95ff" />
                    <stop offset="1" stopColor="#7bd3ff" />
                  </linearGradient>
                  <linearGradient id="wingGrad" x1="0" x2="1">
                    <stop offset="0" stopColor="#ffd36b" />
                    <stop offset="1" stopColor="#ff9f4d" />
                  </linearGradient>
                </defs>
                <g transform="translate(0,-8)">
                  <circle cx="120" cy="120" r="42" fill="url(#bodyGrad)" />
                  <circle cx="136" cy="112" r="6" fill="#16324b" />
                  <polygon points="183,118 161,126 161,110" fill="#ffb200" />
                  {/* The animation CSS is now in index.css */}
                  <g className="wing">
                    <path d="M100 120c-20 10-24 20-38 32 32 36 62-4 52 8 6-8 16-46-14-40z" fill="url(#wingGrad)" />
                  </g>
                  <path d="M88 93c-40 -12-6 -1-9 18 20-6 28-10" fill="#51A2FF" />
                </g>
              </svg>
              <span className="hint">Tip: Tap “Play Now” to begin!</span>
            </div>
          </div>
        </section>
      </main>

      {/* ================= ABOUT ================= */}
      <section id="about" className="about container" aria-labelledby="aboutTitle">
        <span className="section-title" id="aboutTitle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 17.58A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 4 16.25"></path>
            <path d="M16 16h1a3 3 0 0 0 0-6"></path>
          </svg>
          About the Game
        </span>
        <div className="about-grid">
          <div className="card">
            <h3>Arcade Simplicity</h3>
            <p>One-tap controls with buttery physics. Easy to start, tough to master — perfect for short sessions and high-score hunts.</p>
          </div>
          <div className="card">
            <h3>Charming Aesthetics</h3>
            <p>Retro-inspired pixels meet modern gradients and glassy UI for an elegant, uplifting sky vibe.</p>
          </div>
          <div className="card">
            <h3>Endless Replay</h3>
            <p>Procedural obstacles, dynamic pacing, and smooth animations keep every flight feeling fresh.</p>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="faq container" aria-labelledby="faqTitle">
        <span className="section-title" id="faqTitle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 9a3 3 0 0 1 6 0c0 3-3 3-3 6"></path>
            <line x1="12" y1="17" x2="12" y2="17"></line>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
          Frequently Asked Questions
        </span>

        {/* This is the React way to do the accordion */}
        <div className="accordion" role="list">
          <FaqItem question="How do I play Fluffy Flight?">
            <p>Tap or press to flap and keep your bird in the air. Avoid obstacles and collect points. The longer you survive, the higher your score!</p>
          </FaqItem>
          <FaqItem question="Does it work on mobile?">
            <p>Absolutely! The layout is fully responsive and touch-friendly, so you can play on phones, tablets, or desktops.</p>
          </FaqItem>
          <FaqItem question="Can I mute sounds?">
            <p>Yes. Look for the speaker icon in-game to toggle sound effects and music on/off at any time.</p>
          </FaqItem>
          <FaqItem question="Where does the “Play Now” button go?">
            <p>It links to <code>/levels</code> using React Router. This will load the level selection component without reloading the page.</p>
          </FaqItem>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="contact" aria-labelledby="contactTitle">
        <div className="container footer-grid">
          <div>
            <h3 id="contactTitle" style={{ margin: '0 0 6px 0' }}>Contact</h3>
            <p style={{ margin: '0' }}>Email: hello@fluffyflight.game</p>
            <p style={{ margin: '4px 0 0 0' }}>Support: support@fluffyflight.game</p>
            <div className="socials" aria-label="Social links">
              <a href="#" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83"></path></svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 2C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px 0' }}>Quick Links</h3>
            <p style={{ margin: '0' }}><a href="#home">Home</a></p>
            <p style={{ margin: '6px 0 0 0' }}><a href="#about">About</a></p>
            <p style={{ margin: '6px 0 0 0' }}><a href="#faq">FAQ</a></p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px 0' }}>Newsletter</h3>
            <p style={{ margin: '0 0 10px 0' }}>Get updates on new features & events.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!'); }} aria-label="Newsletter signup">
              <label className="sr-only" htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="Your email" required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,.08)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.05)' }} />
              <button className="cta" type="submit" style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}>Subscribe</button>
            </form>
          </div>
        </div>
        <div className="container" style={{ marginTop: '16px', opacity: '.8', fontSize: '14px' }}>
          © {currentYear} Fluffy Flight. All rights reserved.
        </div>
      </footer>
    </>
  );
}

export default Home;