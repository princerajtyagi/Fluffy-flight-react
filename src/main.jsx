// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Your big CSS file
import { GameProvider } from './context/GameContext'; // 1. Import the provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameProvider> {/* 2. Wrap your app */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GameProvider> {/* 3. Close the wrapper */}
  </React.StrictMode>
);