'use client';
import { useState, useEffect } from 'react';

export default function EndingPage() {
  const [glitched, setGlitched] = useState(false);
  const [walkStarted, setWalkStarted] = useState(false);

  useEffect(() => {
    if (walkStarted) {
      const timeout = setTimeout(() => {
        setGlitched(true);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [walkStarted]);

  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center transition-all duration-700"
      style={{
        background: glitched
          ? 'linear-gradient(to bottom right, #3a3a3a, #1e1e1e)' // grey gradient for glitch
          : '#F9968A', // candy mode
        color: glitched ? '#34D399' : '#4B0082',
      }}
    >
      {!glitched ? (
        <div className="w-full h-full relative flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-wide drop-shadow text-center">
            🍬 The Candy Vault
          </h1>
          <p className="text-xl font-mono mb-10 text-center">
            Zaffy, go claim your sugar bag!
          </p>

          {!walkStarted && (
            <button
              onClick={() => setWalkStarted(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white text-xl font-bold py-3 px-8 rounded-full shadow-lg animate-pulse hover:scale-105 transition-transform z-10"
            >
              🚶 Walk to Sugar Bag
            </button>
          )}

          <div className="relative w-full h-60 mt-10">
            {/* Ground line */}
            <div className="absolute bottom-0 w-full h-1 bg-pink-300" />

            {/* Character walking */}
            <div
              className={`absolute bottom-2 left-0 text-9xl transition-transform duration-[4s] ease-linear ${
                walkStarted ? 'translate-x-[85vw]' : ''
              }`}
            >
              🧍‍♂️
            </div>

            {/* Candy Bag Image */}
            <img
              src="/candy-bag.png"
              alt="Candy Bag"
              className="absolute bottom-2 right-4 w-100 h-100 animate-bounce drop-shadow-[0_0_30px_rgba(255,192,203,0.8)]"
            />
          </div>
        </div>
      ) : (
        <div className="font-mono animate-fadeIn flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-6xl md:text-7xl font-black mb-4 tracking-widest animate-glitch">
            💥 ERROR 418
          </h1>

          {/* Teapot + dripping tea */}
          <div className="relative flex flex-col items-center mb-8">
            <div className="text-[8rem] animate-pulse">🫖</div>
            <div className="absolute top-[4.5rem] animate-drip text-2xl text-green-400">💧</div>
            <div className="absolute top-[5rem] left-1 animate-drip-slow text-xl text-green-400">💧</div>
            <div className="absolute top-[5.5rem] right-1 animate-drip-fast text-xl text-green-400">💧</div>
          </div>

          <p className="text-2xl md:text-3xl italic text-green-400 max-w-2xl px-4">
            The vault’s empty, sugar. Welcome to adulthood. <span className="ml-2">🙂</span>
          </p>
        </div>
      )}
    </div>
  );
}
