// src/context/GameContext.jsx
import React, { createContext, useState, useContext } from 'react';

// --- All your localStorage helpers from shop.html & easy.html ---
const LS = {
  getCoins: () => parseInt(localStorage.getItem('coins') || '0', 10),
  setCoins: (v) => localStorage.setItem('coins', String(v)),
  addCoins: (n) => LS.setCoins(LS.getCoins() + n),
  getUnlocked: () => {
    try {
      return JSON.parse(localStorage.getItem('unlockedBirds')) || [1];
    } catch (e) {
      return [1];
    }
  },
  setUnlocked: (arr) => localStorage.setItem('unlockedBirds', JSON.stringify(arr)),
  getSelected: () => parseInt(localStorage.getItem('selectedBird') || '1', 10),
  setSelected: (id) => localStorage.setItem('selectedBird', String(id)),

  // Get/Set Best Score
  getBest: (difficulty) => {
    return parseInt(localStorage.getItem(`highScore_${difficulty}`) || '0', 10);
  },
  setBest: (difficulty, v) => {
    const best = LS.getBest(difficulty);
    if (v > best) {
      localStorage.setItem(`highScore_${difficulty}`, String(v));
    }
  }
};

// Ensure bird 1 is unlocked by default
if (!localStorage.getItem('unlockedBirds')) {
  LS.setUnlocked([1]);
}
// --- End of LS helpers ---

const GameContext = createContext();

export function GameProvider({ children }) {
  const [coins, setCoins] = useState(LS.getCoins());
  const [unlocked, setUnlocked] = useState(LS.getUnlocked());
  const [selected, setSelected] = useState(LS.getSelected());

  const addCoins = (amount) => {
    const newTotal = coins + amount;
    setCoins(newTotal);
    LS.setCoins(newTotal);
  };

  const unlockBird = (bird) => {
    if (coins >= bird.price) {
      const newCoins = coins - bird.price;
      const newUnlocked = [...unlocked, bird.id];
      setCoins(newCoins);
      setUnlocked(newUnlocked);
      LS.setCoins(newCoins);
      LS.setUnlocked(newUnlocked);
      return true; // Purchase successful
    }
    return false; // Not enough coins
  };

  const selectBird = (id) => {
    setSelected(id);
    LS.setSelected(id);
  };

  const value = {
    coins,
    unlocked,
    selected,
    addCoins,
    unlockBird,
    selectBird,
    getBestScore: LS.getBest,
    setBestScore: LS.setBest,
    getSelectedBird: LS.getSelected,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => {
  return useContext(GameContext);
};