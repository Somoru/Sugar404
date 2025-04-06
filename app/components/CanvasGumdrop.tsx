'use client';
import { useEffect, useRef, useState } from 'react';

type Trap = { x: number; y: number; width: number; height: number };

const CanvasGumdrop = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gravity, setGravity] = useState(1);
  const [showWarning, setShowWarning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 800;
    canvas.height = 500;

    const gumdrop = {
      x: 400,
      y: 250,
      radius: 20,
      vx: 0,
      vy: 0,
      grounded: false,
    };

    const gravityStrength = 0.5;
    const jumpStrength = 12;
    const friction = 0.95;
    let scrollY = 0;
    let stuckCounter = 0;

    let keys: Record<string, boolean> = {};
    let timer = 45;
    let gravityFlipInterval: NodeJS.Timeout;
    let timerInterval: NodeJS.Timeout;

    const stickyTraps: Trap[] = [];
    const sinkholes: Trap[] = [];

    for (let i = 0; i < 20; i++) {
      const y = 500 + i * 300;
      if (i % 3 === 0) {
        stickyTraps.push({ x: Math.random() * 700 + 50, y, width: 120, height: 20 });
      } else if (i % 4 === 0) {
        sinkholes.push({ x: Math.random() * 700 + 50, y, width: 100, height: 40 });
      }
    }

    function circleRectCollision(
      cx: number,
      cy: number,
      radius: number,
      rx: number,
      ry: number,
      rw: number,
      rh: number
    ) {
      const closestX = Math.max(rx, Math.min(cx, rx + rw));
      const closestY = Math.max(ry, Math.min(cy, ry + rh));
      const dx = cx - closestX;
      const dy = cy - closestY;
      return dx * dx + dy * dy < radius * radius;
    }

    const update = () => {
      scrollY += 1.5;

      if (keys['a']) gumdrop.vx -= 0.4;
      if (keys['d']) gumdrop.vx += 0.4;
      if (keys[' '] && gumdrop.grounded) {
        gumdrop.vy = -jumpStrength * gravity;
        gumdrop.grounded = false;
      }

      gumdrop.vy += gravity * gravityStrength;
      gumdrop.vx *= friction;

      gumdrop.x += gumdrop.vx;
      gumdrop.y += gumdrop.vy;

      if (gumdrop.x < gumdrop.radius) gumdrop.x = gumdrop.radius;
      if (gumdrop.x > canvas.width - gumdrop.radius) gumdrop.x = canvas.width - gumdrop.radius;

      if ((gravity === 1 && gumdrop.y > canvas.height - 30) || (gravity === -1 && gumdrop.y < 30)) {
        gumdrop.vy = 0;
        gumdrop.grounded = true;
        gumdrop.y = gravity === 1 ? canvas.height - 30 : 30;
      } else {
        gumdrop.grounded = false;
      }

      let inSticky = false;
      stickyTraps.forEach(trap => {
        const ty = trap.y - scrollY;
        if (circleRectCollision(gumdrop.x, gumdrop.y, gumdrop.radius, trap.x, ty, trap.width, trap.height)) {
          inSticky = true;
          gumdrop.vx *= 0.9;
        }
      });

      if (inSticky) {
        stuckCounter++;
        if (stuckCounter > 180) endGame(false, '🩸 You got stuck in temptation...');
      } else {
        stuckCounter = 0;
      }

      sinkholes.forEach(hole => {
        const hy = hole.y - scrollY;
        if (circleRectCollision(gumdrop.x, gumdrop.y, gumdrop.radius, hole.x, hy, hole.width, hole.height)) {
          endGame(false, '🕳️ You fell into the craving...');
        }
      });

      drawScene();
      if (!gameOver) requestAnimationFrame(update);
    };

    const drawScene = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#ffb6f2');
      gradient.addColorStop(1, '#a678ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(0, -scrollY);

      stickyTraps.forEach(trap => {
        ctx.fillStyle = '#ff66cc';
        ctx.fillRect(trap.x, trap.y, trap.width, trap.height);
        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.fillText('Sticky', trap.x + 10, trap.y + 15);
      });

      sinkholes.forEach(hole => {
        ctx.fillStyle = '#000';
        ctx.fillRect(hole.x, hole.y, hole.width, hole.height);
        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.fillText('Sinkhole', hole.x + 5, hole.y + 20);
      });

      ctx.restore();

      ctx.beginPath();
      ctx.fillStyle = '#cc00cc';
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 10;
      ctx.arc(gumdrop.x, gumdrop.y, gumdrop.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const endGame = (won: boolean, message = '') => {
      setGameOver(true);
      setGameWon(won);
      setShowWarning(false);
      clearInterval(timerInterval);
      clearInterval(gravityFlipInterval);
      if (!won) console.warn(message);
    };

    const down = (e: KeyboardEvent) => (keys[e.key.toLowerCase()] = true);
    const up = (e: KeyboardEvent) => (keys[e.key.toLowerCase()] = false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    drawScene();
    update();

    timerInterval = setInterval(() => {
      timer--;
      setTimeLeft(timer);
      if (timer <= 0) endGame(true);
    }, 1000);

    gravityFlipInterval = setInterval(() => {
      setShowWarning(true);
      setTimeout(() => {
        setGravity(g => -g);
        setShowWarning(false);
      }, 2000);
    }, 7000);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      clearInterval(timerInterval);
      clearInterval(gravityFlipInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="border-4 border-fuchsia-500 rounded-lg shadow-xl" />
      <div className="text-lg mt-3 font-mono">
        ⏱️ Time Left: <span className="font-bold text-yellow-300">{timeLeft}s</span>
      </div>
      {showWarning && (
        <div className="text-red-400 font-bold text-lg mt-2 animate-bounce">
          ⚠️ GRAVITY FLIP IN 2s!
        </div>
      )}
      <div className="text-sm text-pink-100 mt-2 text-center max-w-md font-mono">
        🍬 Zaffy is falling through the Sugar Spiral…  
        <br />Survive the cravings. Escape the sweet trap.
      </div>
      {gameOver && (
        <div className="mt-6 flex flex-col items-center space-y-3">
          <div className={`text-2xl font-bold ${gameWon ? 'text-green-400' : 'text-red-500'}`}>
            {gameWon ? '✅ You resisted the sugar storm!' : '💀 You were consumed...'}
          </div>
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-5 rounded"
            onClick={() => window.location.reload()}
          >
            🔁 Retry
          </button>
          {gameWon && (
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded"
              onClick={() => window.location.href = '/level5'}
            >
              🎯 Level 5: Mirror Maze
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CanvasGumdrop;
