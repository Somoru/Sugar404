'use client'

import { useEffect, useState } from 'react'
import './style.css'
import Link from 'next/link'

type Trap = {
  id: number
  angle: number
  radius: number
}

export default function Level3Page() {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [invert, setInvert] = useState(false)
  const [status, setStatus] = useState<'loading' | 'playing' | 'won' | 'missed' | 'tricked'>('loading')
  const [rotation, setRotation] = useState(0)
  const [traps, setTraps] = useState<Trap[]>([])

  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0

  // Setup on mount
  useEffect(() => {
    setX(centerX)
    setY(centerY + 250)

    const trapData: Trap[] = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      angle: Math.random() * 360,
      radius: 150 + Math.random() * 200,
    }))

    setTraps(trapData)
    setStatus('playing')
  }, [])

  // Rotation animation
  useEffect(() => {
    if (status !== 'playing') return
    const interval = setInterval(() => {
      setRotation((r) => (r + 0.4) % 360)
    }, 16)
    return () => clearInterval(interval)
  }, [status])

  // Invert controls
  useEffect(() => {
    if (status !== 'playing') return
    const interval = setInterval(() => setInvert((prev) => !prev), 3000)
    return () => clearInterval(interval)
  }, [status])

  // Movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing') return
      const step = 12
      const dir = invert ? -1 : 1
      switch (e.key) {
        case 'ArrowLeft': setX((p) => p - step * dir); break
        case 'ArrowRight': setX((p) => p + step * dir); break
        case 'ArrowUp': setY((p) => p - step * dir); break
        case 'ArrowDown': setY((p) => p + step * dir); break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [invert, status])

  // Collision Detection
  useEffect(() => {
    if (status !== 'playing') return

    const dx = x - centerX
    const dy = y - centerY
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 30) {
      setStatus('won')
      return
    }

    for (const trap of traps) {
      const rad = ((trap.angle + rotation) * Math.PI) / 180
      const tx = centerX + trap.radius * Math.cos(rad)
      const ty = centerY + trap.radius * Math.sin(rad)
      const trapDist = Math.sqrt((x - tx) ** 2 + (y - ty) ** 2)
      if (trapDist < 30) {
        setStatus('tricked')
        return
      }
    }

    if (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) {
      setStatus('missed')
    }
  }, [x, y, traps, rotation, status])

  return (
    <div className="spiral-bg">
      {/* Vortex donuts */}
      <div className="vortex-layer" style={{ transform: `rotate(${rotation}deg)` }}>
        {traps.map((trap) => {
          const rad = (trap.angle * Math.PI) / 180
          const tx = centerX + trap.radius * Math.cos(rad)
          const ty = centerY + trap.radius * Math.sin(rad)

          return (
            <div key={trap.id} className="fake-trap" style={{ left: `${tx}px`, top: `${ty}px` }} />
          )
        })}
      </div>

      {/* Player */}
      <div className="player" style={{ left: x, top: y }}>🍩</div>

      {/* Win Zone */}
      <div className="target-ring" />

      {/* Inversion status */}
      <div className="invert-tag">
        {invert ? '⚠️ Controls Inverted' : '✅ Controls Normal'}
      </div>

      {/* Overlay */}
      {status !== 'playing' && (
        <div className="overlay">
          {status === 'won' && (
            <>
              <h2>You Mastered<br />The Spiral 🌪️</h2>
              <Link href="/level4"><button>Next Level →</button></Link>
            </>
          )}
          {status === 'tricked' && (
            <>
              <h2>FAKE SPIRAL!<br />You were tricked 😈</h2>
              <Link href="/level3"><button>Try Again</button></Link>
            </>
          )}
          {status === 'missed' && (
            <>
              <h2>You Fell Into<br />The Syrup Abyss 💀</h2>
              <Link href="/level3"><button>Retry</button></Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
