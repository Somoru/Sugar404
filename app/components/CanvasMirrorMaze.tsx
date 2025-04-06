'use client';
import { useEffect, useRef, useState } from 'react';

const TILE = 40;
const ROWS = 12;
const COLS = 20;

const CanvasMirrorMaze = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const keys = useRef<Record<string, boolean>>({});
  const player = useRef({ x: 1, y: 1 });

  const maze = useRef<number[][]>([
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,3,1],
    [1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,1,0,1,1],
    [1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,1],
    [1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,2,1],
    [1,0,0,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = COLS * TILE;
    canvas.height = ROWS * TILE;

    const update = () => {
      const p = player.current;
      let moved = false;

      if (keys.current['arrowup'] || keys.current['w']) {
        if (maze.current[p.y - 1][p.x] !== 1) {
          p.y--;
          moved = true;
        }
      } else if (keys.current['arrowdown'] || keys.current['s']) {
        if (maze.current[p.y + 1][p.x] !== 1) {
          p.y++;
          moved = true;
        }
      } else if (keys.current['arrowleft'] || keys.current['a']) {
        if (maze.current[p.y][p.x - 1] !== 1) {
          p.x--;
          moved = true;
        }
      } else if (keys.current['arrowright'] || keys.current['d']) {
        if (maze.current[p.y][p.x + 1] !== 1) {
          p.x++;
          moved = true;
        }
      }

      if (moved) {
        const tile = maze.current[p.y][p.x];
        if (tile === 2) {
          setTimeout(() => {
            alert("🌀 That felt wrong… You're back at the start.");
            player.current = { x: 1, y: 1 };
          }, 100);
        } else if (tile === 3) {
          endGame(true);
          return;
        }
        keys.current = {};
      }

      draw();
      if (!gameOver) requestAnimationFrame(update);
    };

    // Inside draw() function of CanvasMirrorMaze

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const tile = maze.current[row][col];
          const x = col * TILE;
          const y = row * TILE;
    
          if (tile === 1) {
            ctx.fillStyle = '#D2691E'; // Light chocolate
          } else {
            ctx.fillStyle = '#FFF8E7'; // Vanilla cream
          }
    
          ctx.fillRect(x, y, TILE, TILE);
        }
      }
    
      // Draw player – purple candy drop 🍇
      ctx.fillStyle = '#A020F0';
      ctx.beginPath();
      ctx.arc(
        player.current.x * TILE + TILE / 2,
        player.current.y * TILE + TILE / 2,
        TILE / 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    
      // White outline for visibility
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    


    const endGame = (won: boolean) => {
      setGameOver(true);
      setGameWon(won);
    };

    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };

    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    draw();
    update();

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [gameOver]);

  return (
    <div className="relative flex flex-col items-center text-center">
      <canvas ref={canvasRef} className="rounded-lg border-4 border-[#ff66aa] shadow-xl" />

      <p className="text-sm mt-3 px-3 font-candy text-[#6a0dad] bg-white/70 backdrop-blur-sm rounded-xl py-2 max-w-xl leading-relaxed">
        🍬 <strong>Every exit looks sweet...</strong><br />
        ✨ Only one leads to the <span className="text-yellow-500 font-bold">Sugar Castle</span>.<br />
        🌀 The others spin you back to start!
      </p>

      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl border border-white shadow-2xl text-center w-[300px]">
            <h2 className={`text-2xl font-bold mb-4 ${gameWon ? 'text-green-600' : 'text-red-500'}`}>
              {gameWon ? '🎉 You escaped the Mirror Maze!' : '💥 Lost in the loop!'}
            </h2>
            <div className="flex flex-col space-y-3">
              <button
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-5 rounded"
                onClick={() => window.location.reload()}
              >
                🔁 Retry
              </button>
              {gameWon && (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded"
                  onClick={() => window.location.href = '/ending'}
                >
                  🍭 Claim Sugar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasMirrorMaze;
