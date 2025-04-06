'use client'

import { useEffect, useRef } from 'react'

export default function FloatPlayer({ floatPower }: { floatPower: number }) {
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (playerRef.current) {
      const height = Math.min(80 + floatPower * 2, window.innerHeight - 100)
      playerRef.current.style.bottom = `${height}px`
    }
  }, [floatPower])

  return (
    <div
      ref={playerRef}
      className="absolute left-1/2 -translate-x-1/2 bottom-20 z-10 transition-all duration-200"
    >
      <div className="w-20 h-20 bg-white rounded-md border-4 border-pink-400 shadow-lg flex items-center justify-center text-black font-bold">
        🧍‍♂️
      </div>
    </div>
  )
}
