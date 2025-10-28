// src/pages/Game.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { createGameInstance } from '../gameLogic'; // 1. Import your new engine

// This component is the "host" for the game
function Game() {
  const canvasRef = useRef(null);
  const gameInstanceRef = useRef(null); // To hold the game engine instance

  // Get data from React Router and Context
  const { difficulty } = useParams();
  const navigate = useNavigate();
  const { addCoins, setBestScore, getBestScore, getSelectedBird } = useGame();

  // React state for the UI
  const [hudScore, setHudScore] = useState(0);
  const [hudCoins, setHudCoins] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalStats, setFinalStats] = useState({ score: 0, best: 0, coins: 0 });

  // This hook adds/removes the 'game-active' class to the <body>
  useEffect(() => {
    document.body.classList.add('game-active');
    // Cleanup function to remove the class when we leave the page
    return () => {
      document.body.classList.remove('game-active');
    };
  }, []); // Empty array means this runs only once on mount/unmount

  // This is the main hook that starts and stops the game
  useEffect(() => {
    const canvas = canvasRef.current;
    
    // --- Callbacks for the engine to talk to React ---
    const onScoreUpdate = (score, coins) => {
      setHudScore(score);
      setHudCoins(coins);
    };

    const onGameOver = (score, coins) => {
      // 1. Save scores and add coins
      setBestScore(difficulty, score);
      addCoins(coins);
      
      // 2. Get the new best score (it might have just been updated)
      const best = getBestScore(difficulty);
      
      // 3. Set the state for the overlay
      setFinalStats({ score, best, coins });
      setIsGameOver(true);
    };

    // --- Config for the game engine ---
    const config = {
      difficulty: difficulty,
      selectedBird: getSelectedBird(),
      onScoreUpdate: onScoreUpdate,
      onGameOver: onGameOver
    };

    // 4. Create and start the game
    const game = createGameInstance(canvas, config);
    game.start();
    gameInstanceRef.current = game; // Save the instance

    // 5. Cleanup function: This runs when the component is unmounted
    return () => {
      game.stop();
    };
    
  }, [difficulty, addCoins, getBestScore, getSelectedBird, setBestScore]); // Re-run if difficulty changes
  
  // --- Button Click Handlers ---
  
  const handleRestart = () => {
    setIsGameOver(false);
    gameInstanceRef.current.reset();
  };

  const handleQuit = () => {
    navigate('/levels'); // Go back to level select
  };

  const handleNext = () => {
    // Logic to go to the next level
    if (difficulty === 'easy') {
      navigate('/game/medium');
    } else if (difficulty === 'medium') {
      navigate('/game/hard');
    } else {
      navigate('/levels'); // If on 'hard', just go back to levels
    }
  };

  // --- Render the UI ---
  return (
    <>
      <canvas id="game" ref={canvasRef}></canvas>

      <div className="hud" aria-live="polite">
        <div className="score" id="score">{hudScore}</div>
        <div className="small" id="coinsHUD">Coins: {hudCoins}</div>
      </div>

      {/* The Game Over overlay, rendered conditionally */}
      {isGameOver && (
        <div className="overlay" id="overlay" role="dialog" aria-modal="true" style={{ display: 'grid' }}>
          <div className="panel">
            <div className="title">Game Over</div>
            <div className="stats">
              <div className="stat">Score: <span id="finalScore">{finalStats.score}</span></div>
              <div className="stat">Best: <span id="bestScore">{finalStats.best}</span></div>
              <div className="stat">+Coins: <span id="coinsGained">{finalStats.coins}</span></div>
            </div>
            <div className="buttons">
              <button className="btn btn-primary" id="btnRestart" onClick={handleRestart}>Restart</button>
              <button className="btn btn-ghost" id="btnQuit" onClick={handleQuit}>Quit</button>
              {/* Only show "Next" if not on the hardest level */}
              {difficulty !== 'hard' && (
                 <button className="btn btn-primary" id="btnNext" onClick={handleNext}>Next</button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="hint">Tap/Click/Space to flap</div>
    </>
  );
}

export default Game;