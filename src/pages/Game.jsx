import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { createGameInstance } from "../gameLogic";

import { useMutation, useQuery } from "@apollo/client";
import { ADD_SCORE } from "../graphql/mutations";
import { GET_SCORES } from "../graphql/queries";

function Game() {
  const [playerName, setPlayerName] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);

  const { data, loading } = useQuery(GET_SCORES);
  const [addScore] = useMutation(ADD_SCORE, {
    refetchQueries: [{ query: GET_SCORES }],
  });

  const canvasRef = useRef(null);
  const gameInstanceRef = useRef(null);

  const { difficulty } = useParams();
  const navigate = useNavigate();

  // ⭐ FIXED — useGame always returns these
  const { addCoins, setBestScore, getBestScore, getSelectedBird } = useGame();

  const [hudScore, setHudScore] = useState(0);
  const [hudCoins, setHudCoins] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const [finalStats, setFinalStats] = useState({
    score: 0,
    best: 0,
    coins: 0,
  });

  // Save score to MongoDB
  const saveScore = async (score) => {
    const player = playerName.trim() || "Anonymous";

    try {
      await addScore({ variables: { player, score } });
      setScoreSaved(true);
    } catch (err) {
      console.error("Score save failed:", err);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    const onScoreUpdate = (score, coins) => {
      setHudScore(score);
      setHudCoins(coins);
    };

    const onGameOver = (score, coins) => {
      setBestScore(difficulty, score);
      addCoins(coins);

      if (!scoreSaved) saveScore(score);

      const best = getBestScore(difficulty);
      setFinalStats({ score, best, coins });

      setIsGameOver(true);
    };

    const game = createGameInstance(canvas, {
      difficulty,
      selectedBird: getSelectedBird(),
      onScoreUpdate,
      onGameOver,
    });

    game.start();
    gameInstanceRef.current = game;

    return () => game.stop();
  }, [difficulty]); // <-- FIXED dependencies

  const restart = () => {
    setIsGameOver(false);
    setScoreSaved(false);
    gameInstanceRef.current.reset();
  };

  return (
    <>
      <canvas id="game" ref={canvasRef}></canvas>

      {/* HUD */}
      <div className="hud">
        <div className="score">{hudScore}</div>
        <div className="small">Coins: {hudCoins}</div>
      </div>

      {/* GAME OVER POPUP */}
      {isGameOver && (
        <div className="overlay" style={{ display: "grid", placeItems: "center" }}>
          <div className="panel gameover-panel">

            <h2 className="go-title">Game Over</h2>

            <div className="stats-row">
              <div className="stat-box">
                Score<br /><span>{finalStats.score}</span>
              </div>
              <div className="stat-box">
                Best<br /><span>{finalStats.best}</span>
              </div>
              <div className="stat-box">
                +Coins<br /><span>{finalStats.coins}</span>
              </div>
            </div>

            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter Name"
              className="name-input"
            />

            <button
              className="save-btn"
              onClick={() => saveScore(finalStats.score)}
              disabled={scoreSaved}
            >
              {scoreSaved ? "Saved!" : "Save Score"}
            </button>

            <div className="leaderboard">
              <h3>🏆 Top 3</h3>

              {loading ? (
                <p>Loading...</p>
              ) : (
                [...(data?.getScores || [])]
                  .sort((a, b) => b.score - a.score)   // highest first
                  .slice(0, 3)                         // take top 3
                  .map((item, index) => (
                    <div className="lb-item" key={item.id}>
                      <span>
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"} {item.player}
                      </span>
                      <span className="lb-score">{item.score}</span>
                    </div>
                  ))
              )}
            </div>

            {/* BUTTONS */}
            <div className="buttons-row">
              <button className="btn primary" onClick={restart}>Restart</button>
              <button className="btn ghost" onClick={() => navigate("/levels")}>Quit</button>

              {difficulty !== "hard" && (
                <button
                  className="btn primary"
                  onClick={() =>
                    navigate(`/game/${difficulty === "easy" ? "medium" : "hard"}`)
                  }
                >
                  Next
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Game;
