'use client'

import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import './style.css'
import Link from 'next/link'

type FallingItem = {
  id: number
  x: number
  y: number
}

export default function Level1Page() {
  const playerXRef = useRef(200)
  const [playerX, setPlayerX] = useState(200)
  const [health, setHealth] = useState(100)
  const [score, setScore] = useState(0)
  const [candies, setCandies] = useState<FallingItem[]>([])
  const [sugars, setSugars] = useState<FallingItem[]>([])
  const [flashRed, setFlashRed] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  const playerSize = 50
  const playerY = typeof window !== 'undefined' ? window.innerHeight * 0.75 : 500
  const speed = 8

  const candyHitSet = useRef<Set<number>>(new Set())
  const sugarHitSet = useRef<Set<number>>(new Set())

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'a') {
        setPlayerX((prev) => {
          const newX = Math.max(0, prev - speed)
          playerXRef.current = newX
          return newX
        })
      }
      if (e.key === 'd') {
        setPlayerX((prev) => {
          const newX = Math.min(window.innerWidth - playerSize, prev + speed)
          playerXRef.current = newX
          return newX
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameOver || won) return

      // Move sugar cubes
      setSugars((prev) =>
        prev
          .map((s) => ({ ...s, y: s.y + 5 }))
          .filter((s) => s.y < window.innerHeight)
      )

      // Move candies
      setCandies((prev) =>
        prev
          .map((c) => ({ ...c, y: c.y + 5 }))
          .filter((c) => c.y < window.innerHeight)
      )
    }, 30)

    return () => clearInterval(interval)
  }, [gameOver, won])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver && !won) {
        setSugars((prev) => [
          ...prev,
          { id: Date.now(), x: Math.random() * (window.innerWidth - 40), y: -40 },
        ])
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [gameOver, won])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver && !won) {
        setCandies((prev) => [
          ...prev,
          { id: Date.now(), x: Math.random() * (window.innerWidth - 40), y: -40 },
        ])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [gameOver, won])

  useEffect(() => {
    if (won) {
      confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } })
    }
  }, [won])

  useEffect(() => {
    const audio = new Audio('/bg-music.mp3')
    audio.loop = true
    audio.volume = 0.5
    audio.play()
    return () => audio.pause()
  }, [])

  // Collision Check
  useEffect(() => {
    if (gameOver || won) return

    const playerX = playerXRef.current
    const playerYFixed = playerY

    // Candy collision
    setCandies((prev) => {
      return prev.filter((candy) => {
        const hit = Math.abs(candy.x - playerX) < 40 && Math.abs(candy.y - playerYFixed) < 40
        if (hit && !candyHitSet.current.has(candy.id)) {
          candyHitSet.current.add(candy.id)
          setScore((s) => {
            const newScore = s + 1
            if (newScore >= 5) setWon(true)
            return newScore
          })
          return false // Remove it
        }
        return true
      })
    })

    // Sugar collision
    setSugars((prev) => {
      return prev.filter((sugar) => {
        const hit = Math.abs(sugar.x - playerX) < 40 && Math.abs(sugar.y - playerYFixed) < 40
        if (hit && !sugarHitSet.current.has(sugar.id)) {
          sugarHitSet.current.add(sugar.id)
          setHealth((h) => {
            const newH = h - 20
            if (newH <= 0) setGameOver(true)
            return newH
          })
          setFlashRed(true)
          setTimeout(() => setFlashRed(false), 150)
          return false
        }
        return true
      })
    })
  }, [candies, sugars, gameOver, won])

  const restart = () => {
    setPlayerX(200)
    playerXRef.current = 200
    setHealth(100)
    setScore(0)
    setSugars([])
    setCandies([])
    candyHitSet.current.clear()
    sugarHitSet.current.clear()
    setGameOver(false)
    setWon(false)
  }

  return (
    <div className={`syrup-bg relative w-full h-screen ${flashRed ? 'flash-red' : ''}`}>
      <div
        className="player"
        style={{
          left: `${playerX}px`,
          top: `${playerY}px`,
        }}
      >
        🍭
      </div>

      {sugars.map((sugar) => (
        <div key={sugar.id} className="sugar-cube" style={{ left: sugar.x, top: sugar.y }} />
      ))}

      {candies.map((candy) => (
        <div key={candy.id} className="candy" style={{ left: candy.x, top: candy.y }} />
      ))}

      <div className="hud">
        <div className="score">Candies: {score} / 5</div>
        <div className="health-bar">
          <div className="health" style={{ width: `${health}%` }} />
        </div>
      </div>

      {(gameOver || won) && (
        <div className="game-overlay">
          <h2>{gameOver ? 'Game Over 💀' : 'Level Complete 🎉'}</h2>
          <button onClick={restart}>Restart</button>
          {won && <Link href="/level2"><button>Next Level →</button></Link>}
        </div>
      )}
    </div>
  )
}
