'use client'

import { useEffect, useState, useRef } from 'react'
import './style.css'
import Link from 'next/link'

const COMMANDS = [
  ['a', 'd'],
  ['w', 's'],
  ['j', 'k'],
  ['a', 's', 'd'],
  ['w', 'd', 'j'],
  ['a', 'w', 'j'],
  ['s', 'k'],
  ['a', 'j'],
  ['d', 'w'],
  ['w', 'a', 's'],
]

export default function Level2Page() {
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<'playing' | 'lost' | 'won'>('playing')
  const [currentCommand, setCurrentCommand] = useState<string[]>([])
  const [pressedKeys, setPressedKeys] = useState<string[]>([])
  const [timer, setTimer] = useState(3)
  const [feedback, setFeedback] = useState<'' | 'correct' | 'wrong'>('')
  const [comboCount, setComboCount] = useState(1)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const generateCombo = () => {
    const random = COMMANDS[Math.floor(Math.random() * COMMANDS.length)]
    setCurrentCommand(random)
    setPressedKeys([])
    setTimer(3)
    setComboCount((c) => c + 1)
  }

  useEffect(() => {
    generateCombo()
    const bgAudio = new Audio('/bg-music.mp3')
    bgAudio.loop = true
    bgAudio.volume = 0.3
    bgAudio.play()
    audioRef.current = bgAudio
    return () => bgAudio.pause()
  }, [])

  useEffect(() => {
    if (status !== 'playing') return
    if (timer <= 0) {
      handleNext(false)
      return
    }
    const t = setTimeout(() => setTimer((t) => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timer, status])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (status !== 'playing') return
      if (pressedKeys.includes(key)) return

      if (!currentCommand.includes(key)) {
        handleNext(false)
        return
      }

      const updated = [...pressedKeys, key]
      setPressedKeys(updated)

      const audio = new Audio('/tap.mp3')
      audio.volume = 0.5
      audio.play()

      if (currentCommand.every((k) => updated.includes(k))) {
        handleNext(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pressedKeys, currentCommand, status])

  const handleNext = (isCorrect: boolean) => {
    setFeedback(isCorrect ? 'correct' : 'wrong')

    setTimeout(() => {
      setFeedback('')
      setScore((prev) => {
        const newScore = isCorrect ? prev + 1 : prev - 1
        if (newScore < 0) setStatus('lost')
        if (newScore >= 10) setStatus('won')
        return newScore
      })
      if (status === 'playing') generateCombo()
    }, 600)
  }

  return (
    <div className="candy-gym-bg">
      <div className="status-bar">
        <span>💥 Combos: {comboCount}</span>
        <span>🏆 Score: {score}</span>
        <span className="timer">⏱ {timer}s</span>
      </div>

      <h1 className="title">🍬 Candycore CrossFit</h1>

      <div className={`combo-box ${feedback}`}>
        {currentCommand.map((key, i) => (
          <div
            key={i}
            className={`combo-key ${pressedKeys.includes(key) ? 'pressed' : ''}`}
          >
            {key.toUpperCase()}
          </div>
        ))}
      </div>

      {feedback && (
        <div className={`feedback ${feedback}`}>
          {feedback === 'correct' ? '✅ Correct!' : '❌ Missed it!'}
        </div>
      )}

      {status === 'lost' && (
        <div className="overlay">
          <h2>YOU FAILED 💀</h2>
          <div className="buttons">
            <Link href="/level2"><button>Retry</button></Link>
          </div>
        </div>
      )}

      {status === 'won' && (
        <div className="overlay">
          <h2>LEVEL COMPLETE! 🎉</h2>
          <div className="buttons">
            <Link href="/level3"><button>Next Level →</button></Link>
          </div>
        </div>
      )}
    </div>
  )
}
