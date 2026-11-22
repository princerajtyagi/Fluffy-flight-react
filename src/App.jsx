// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CloudBackground from './components/CloudBackground'; // 1. Import this

// Import your pages
import Home from './pages/Home';
import LevelSelect from './pages/LevelSelect';
import Shop from './pages/Shop';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';


function App() {
  return (
    <>
      {/*<CloudBackground />  2. Add it here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/levels" element={<LevelSelect />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/game/:difficulty" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </>
  );
}

export default App;