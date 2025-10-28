// src/gameLogic.js

/**
 * This file contains all the game engine logic, refactored from easy.html.
 * It's now a function that creates a game "instance" which can be
 * started, stopped, and reset by our React component.
 */

// 1. --- Define Difficulty Settings ---
// We need to define settings for all difficulties, not just 'easy'.
const DIFFICULTY_SETTINGS = {
  easy: {
    G: 0.0009,         // gravity
    FLAP: -0.28,       // flap impulse
    PIPE_SPEED: 0.20,  // px per ms
    PIPE_GAP: 220,     // vertical gap size
    PIPE_INTERVAL: 2400, // ms between pipe pairs
  },
  medium: {
    G: 0.0010,
    FLAP: -0.30,
    PIPE_SPEED: 0.24,
    PIPE_GAP: 180,
    PIPE_INTERVAL: 2000,
  },
  hard: {
    G: 0.0012,
    FLAP: -0.32,
    PIPE_SPEED: 0.28,
    PIPE_GAP: 150,
    PIPE_INTERVAL: 1700,
  }
};

// 2. --- The Main Game Engine Function ---
export function createGameInstance(canvas, config) {
  const ctx = canvas.getContext('2d');
  
  // Get settings from config
  const { difficulty, selectedBird, onGameOver, onScoreUpdate } = config;
  const settings = DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.easy;

  // Constants
  const PIPE_WIDTH = 80;
  const GROUND_H = 80;
  const COIN_R = 14;

  // State
  let DPR = 1;
  let running = false;
  let gameOver = false;
  let started = false;
  let score = 0;
  let coinsCollected = 0;
  let loopId = null;

  const bird = { x: 0, y: 0, vy: 0, r: 18, flapPhase: 0 };
  let pipes = [];
  let coins = [];
  let lastPipeAt = 0;
  const bg = { clouds: [], mountains: [] };

  // --- Core Game Functions ---
  
  function resize() {
    DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(window.innerWidth * DPR);
    canvas.height = Math.floor(window.innerHeight * DPR);
  }

  function reset() {
    score = 0;
    coinsCollected = 0;
    running = true;
    gameOver = false;
    started = false;

    bird.x = canvas.width * 0.3;
    bird.y = canvas.height * 0.45;
    bird.vy = 0;
    bird.r = Math.max(14, Math.min(20, Math.round(canvas.height / 42)));
    pipes = [];
    coins = [];
    lastPipeAt = 0;
    bg.clouds = [];
    bg.mountains = [];

    // Seed parallax
    const cloudCount = Math.max(6, Math.floor(canvas.width / 220));
    for (let i = 0; i < cloudCount; i++) {
      bg.clouds.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.6, scale: 0.6 + Math.random() * 1.2, speed: 0.02 + Math.random() * 0.05 });
    }
    const mCount = Math.max(4, Math.floor(canvas.width / 420));
    for (let i = 0; i < mCount; i++) {
      const baseY = canvas.height - GROUND_H - 20;
      const w = 260 + Math.random() * 220;
      const h = 120 + Math.random() * 120;
      const x = Math.random() * canvas.width;
      bg.mountains.push({ x, w, h, baseY, speed: 0.06 + Math.random() * 0.04, color: `hsl(${200 + Math.random() * 20} 40% ${40 + Math.random() * 10}%)` });
    }
    
    // Report initial score to React
    onScoreUpdate(0, 0);
  }

  function flap() {
    if (!running) return;
    if (!started) started = true;
    bird.vy = settings.FLAP;
  }

  function spawnPipePair() {
    const minTop = 60;
    const maxBottom = canvas.height - GROUND_H - 60;
    const gapY = minTop + Math.random() * (maxBottom - minTop - settings.PIPE_GAP) + settings.PIPE_GAP / 2;
    pipes.push({ x: canvas.width + 20, gapY, passed: false, hue: 110 + Math.random() * 40 });
    coins.push({ x: canvas.width + 20 + PIPE_WIDTH * 0.5, y: gapY, phase: 0 });
  }

  function circleRectCollision(cx, cy, r, rx, ry, rw, rh) {
    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return (dx * dx + dy * dy) < (r * r);
  }

  function triggerGameOver() {
    running = false;
    gameOver = true;
    // Call the React callback!
    onGameOver(score, coinsCollected);
  }

  // --- Drawing Functions ---
  
  function drawBackground(dt) {
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, '#b9e6ff'); g.addColorStop(0.6, '#eaf6ff'); g.addColorStop(1, '#ffffff');
    ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const m of bg.mountains) {
      m.x -= m.speed * dt * DPR;
      if (m.x + m.w < -50) m.x = canvas.width + 100;
      ctx.fillStyle = m.color; ctx.beginPath(); ctx.moveTo(m.x, m.baseY); ctx.lineTo(m.x + m.w / 2, m.baseY - m.h); ctx.lineTo(m.x + m.w, m.baseY); ctx.closePath(); ctx.fill();
    }
    for (const c of bg.clouds) {
      c.x -= c.speed * dt * DPR;
      if (c.x < -220) { c.x = canvas.width + 60; c.y = Math.random() * canvas.height * 0.55; }
      ctx.fillStyle = 'rgba(255,255,255,.9)'; const w = 120 * c.scale, h = 60 * c.scale;
      roundedRect(ctx, c.x, c.y, w, h, 28 * c.scale); ctx.fill();
    }
    ctx.fillStyle = '#9bd27b'; ctx.fillRect(0, canvas.height - GROUND_H, canvas.width, GROUND_H);
    ctx.fillStyle = '#7ac15e'; ctx.fillRect(0, canvas.height - GROUND_H, canvas.width, 14);
  }

  function roundedRect(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }

  function drawPipes(dt) {
    for (const p of pipes) {
      p.x -= settings.PIPE_SPEED * dt * DPR;
      ctx.fillStyle = `hsl(${p.hue} 60% 45%)`;
      const topH = p.gapY - settings.PIPE_GAP / 2;
      roundedRect(ctx, p.x, 0, PIPE_WIDTH, topH, 8); ctx.fill();
      ctx.fillStyle = `hsl(${p.hue} 60% 35%)`; ctx.fillRect(p.x - 6, topH - 18, PIPE_WIDTH + 12, 18);
      ctx.fillStyle = `hsl(${p.hue} 60% 45%)`; const bottomY = p.gapY + settings.PIPE_GAP / 2;
      const bottomH = canvas.height - GROUND_H - bottomY;
      roundedRect(ctx, p.x, bottomY, PIPE_WIDTH, bottomH, 8); ctx.fill();
      ctx.fillStyle = `hsl(${p.hue} 60% 35%)`; ctx.fillRect(p.x - 6, bottomY, PIPE_WIDTH + 12, 18);
      const centerX = p.x + PIPE_WIDTH / 2;
      if (!p.passed && centerX < bird.x - bird.r) { p.passed = true; score += 1; }
    }
    pipes = pipes.filter(p => p.x + PIPE_WIDTH > -100);
  }

  function drawCoins(dt) {
    for (const c of coins) {
      c.x -= settings.PIPE_SPEED * dt * DPR; c.phase += dt * 0.01;
      const spin = (Math.sin(c.phase) * 0.5 + 0.5); const bounce = Math.sin(c.phase * 2) * 4;
      const rx = COIN_R * (0.4 + 0.6 * spin); const ry = COIN_R; const cx = c.x, cy = c.y + bounce;
      const grad = ctx.createRadialGradient(cx - 4, cy - 4, 4, cx, cy, ry + 8);
      grad.addColorStop(0, '#fff3a7'); grad.addColorStop(1, '#ffc400');
      ctx.fillStyle = grad; ellipse(ctx, cx, cy, rx + 6, ry + 6); ctx.fill();
      ctx.fillStyle = '#ffd84d'; ellipse(ctx, cx, cy, rx, ry); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.7)'; ellipse(ctx, cx - 6, cy - 6, rx * 0.25, ry * 0.25); ctx.fill();
    }
    coins = coins.filter(c => c.x > -60);
  }

  function ellipse(c, x, y, rx, ry) {
    c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.closePath();
  }

  function drawBird(t) {
    const { x, y, r } = bird;
    const skins = {
      1: { base: '#4ec8ff', beak: '#ffb200', eye: '#fff', iris: '#063246' },
      2: { base: '#ff4d4d', beak: '#ffcf33', eye: '#fff', iris: '#3b0b0b' },
      3: { base: '#ffd93d', beak: '#ff9f1c', eye: '#fff', iris: '#593a00' },
      4: { base: '#ffffff', beak: '#c8c8c8', eye: '#eaeaea', iris: '#313131' },
      5: { base: '#ff7a3d', beak: '#ffd36b', eye: '#fff', iris: '#3a1300', flame: true },
      6: { base: '#73e2a7', beak: '#0bd3d3', eye: '#fff', iris: '#053a3a', stripe: true },
      7: { base: '#7b6cff', beak: '#ffb3ff', eye: '#fff', iris: '#150a33', stars: true },
      8: { base: '#3aa0ff', beak: '#ffd36b', eye: '#fff', iris: '#0a2540', crown: true },
    };
    const s = skins[selectedBird] || skins[1];
    const tilt = Math.max(-0.5, Math.min(0.5, bird.vy * 2));
    ctx.save(); ctx.translate(x, y); ctx.rotate(tilt);
    const bodyGrad = ctx.createRadialGradient(-4, -6, 6, 0, 0, r + 6);
    bodyGrad.addColorStop(0, lighten(s.base, 0.3)); bodyGrad.addColorStop(1, s.base);
    ctx.fillStyle = bodyGrad; ellipse(ctx, 0, 0, r * 1.05, r); ctx.fill();
    bird.flapPhase += 0.18; const flap = Math.sin(bird.flapPhase) * 6;
    ctx.save(); ctx.translate(-r * 0.2, 2); ctx.rotate((-0.6 + flap * 0.06));
    ctx.fillStyle = lighten(s.base, 0.25); roundedRect(ctx, -r * 0.6, -r * 0.25, r * 1.0, r * 0.5, r * 0.25); ctx.fill(); ctx.restore();
    ctx.fillStyle = s.eye; ellipse(ctx, r * 0.35, -r * 0.2, r * 0.32, r * 0.32); ctx.fill();
    ctx.fillStyle = s.iris; ellipse(ctx, r * 0.44, -r * 0.2, r * 0.12, r * 0.12); ctx.fill();
    ctx.fillStyle = s.beak; ctx.beginPath(); ctx.moveTo(r * 0.9, 0); ctx.lineTo(r * 1.35, -r * 0.15); ctx.lineTo(r * 0.9, r * 0.15); ctx.closePath(); ctx.fill();
    if (s.crown) { ctx.fillStyle = '#ffcf33'; ctx.beginPath(); ctx.moveTo(-r * 0.2, -r * 1.1); ctx.lineTo(0, -r * 1.5); ctx.lineTo(r * 0.2, -r * 1.1); ctx.lineTo(r * 0.4, -r * 1.45); ctx.lineTo(r * 0.6, -r * 1.1); ctx.lineTo(-r * 0.2, -r * 1.1); ctx.closePath(); ctx.fill(); }
    if (s.flame) { const f = Math.sin(performance.now() * 0.02) * 6; const grad = ctx.createLinearGradient(-r * 1.6, 0, -r * 0.6, 0); grad.addColorStop(0, '#ff2e2e'); grad.addColorStop(1, '#ffd36b'); ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(-r * 0.9, 4); ctx.quadraticCurveTo(-r * 1.5, f, -r * 1.2, -4); ctx.quadraticCurveTo(-r * 1.0, 0, -r * 0.9, 4); ctx.closePath(); ctx.fill(); }
    if (s.stripe) { ctx.fillStyle = 'rgba(255,255,255,.6)'; roundedRect(ctx, -r * 0.2, -r * 0.5, r * 0.4, r * 1.0, r * 0.2); ctx.fill(); }
    if (s.stars) { ctx.fillStyle = 'rgba(255,255,255,.75)'; for (let i = 0; i < 6; i++) { const a = i * 1.05 + performance.now() * 0.001; const rx = Math.cos(a) * r * 0.5, ry = Math.sin(a) * r * 0.4; ellipse(ctx, rx, ry, 2, 2); ctx.fill(); } }
    ctx.restore();
  }

  function lighten(hex, amt) {
    const c = parseInt(hex.replace('#', ''), 16);
    const r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255;
    const L = (v) => Math.min(255, Math.round(v + (255 - v) * amt));
    return `rgb(${L(r)} ${L(g)} ${L(b)})`;
  }

  // --- Game Loop ---
  
  let lastTime = performance.now();
  function step(now) {
    const dt = now - lastTime;
    lastTime = now;
    if (running) update(dt);
    render(dt);
    loopId = requestAnimationFrame(step);
  }

  function update(dt) {
    if (started) {
      lastPipeAt += dt;
      if (lastPipeAt >= settings.PIPE_INTERVAL) {
        lastPipeAt = 0;
        spawnPipePair();
      }
    }
    bird.vy += settings.G * dt;
    bird.y += bird.vy * dt * DPR;
    
    // Check pipe collisions
    for (const p of pipes) {
      const topH = p.gapY - settings.PIPE_GAP / 2;
      const bottomY = p.gapY + settings.PIPE_GAP / 2;
      if (circleRectCollision(bird.x, bird.y, bird.r, p.x, 0, PIPE_WIDTH, topH) ||
          circleRectCollision(bird.x, bird.y, bird.r, p.x, bottomY, PIPE_WIDTH, canvas.height - GROUND_H - bottomY)) {
        triggerGameOver(); return;
      }
    }
    
    // Check coin collection
    for (const c of coins) {
      const dx = c.x - bird.x, dy = c.y - bird.y;
      if (dx * dx + dy * dy < (COIN_R + bird.r - 4) ** 2) {
        c.x = -9999; coinsCollected += 1; score += 10;
      }
    }
    
    // Check ground/ceiling
    if (bird.y + bird.r > canvas.height - GROUND_H || bird.y - bird.r < 0) {
      triggerGameOver(); return;
    }
    
    // Send score update to React
    onScoreUpdate(score, coinsCollected);
  }

  function render(dt) {
    drawBackground(dt);
    drawPipes(dt);
    drawCoins(dt);
    drawBird(dt);
  }

  // --- Event Listeners ---
  // We need to add and remove listeners
  
  function handleKey(e) {
    if (e.code === 'Space' || e.key === ' ') { e.preventDefault(); flap(); }
    if (gameOver && (e.code === 'Enter' || e.code === 'Space')) {
      // Don't restart here, let React handle it
    }
  }
  
  function handlePointer(e) {
    e.preventDefault();
    flap();
  }
  
  function addListeners() {
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('keydown', handleKey);
    canvas.addEventListener('pointerdown', handlePointer, { passive: false });
    canvas.addEventListener('touchstart', handlePointer, { passive: false });
    canvas.addEventListener('mousedown', handlePointer);
  }
  
  function removeListeners() {
    window.removeEventListener('resize', resize);
    window.removeEventListener('keydown', handleKey);
    canvas.removeEventListener('pointerdown', handlePointer);
    canvas.removeEventListener('touchstart', handlePointer);
    canvas.removeEventListener('mousedown', handlePointer);
  }

  // --- Public API ---
  // This is what the React component can control
  return {
    start() {
      resize();
      reset();
      addListeners();
      lastTime = performance.now();
      loopId = requestAnimationFrame(step);
    },
    stop() {
      running = false;
      removeListeners();
      if (loopId) {
        cancelAnimationFrame(loopId);
      }
    },
    reset() {
      reset();
    }
  };
}