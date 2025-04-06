'use client'
import { useEffect, useRef, useState } from 'react'

const CanvasFocusPath = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [timeLeft, setTimeLeft] = useState(45)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [offTrackFrames, setOffTrackFrames] = useState(0)
  const playerX = useRef(400)
  const keys = useRef<Record<string, boolean>>({})

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    canvas.width = 800
    canvas.height = 500

    const focusPath = { y: 220, height: 60 }
    const playerY = focusPath.y + focusPath.height / 2

    const distractions = Array.from({ length: 15 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 500,
      r: 10 + Math.random() * 8,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
    }))

    let timer = 45
    let timerInterval: NodeJS.Timeout

    const update = () => {
      // Handle player movement
      if (keys.current['ArrowLeft']) playerX.current = Math.max(10, playerX.current - 4)
      if (keys.current['ArrowRight']) playerX.current = Math.min(790, playerX.current + 4)

      // Draw background
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const bg = ctx.createRadialGradient(400, 250, 100, 400, 250, 600)
      bg.addColorStop(0, '#0f0f1f')
      bg.addColorStop(1, '#000000')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw focus path
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      ctx.fillRect(0, focusPath.y, canvas.width, focusPath.height)
      ctx.strokeStyle = '#00ff99'
      ctx.lineWidth = 2
      ctx.setLineDash([10, 10])
      ctx.strokeRect(0, focusPath.y, canvas.width, focusPath.height)
      ctx.setLineDash([])

      // Distractions
      distractions.forEach((d) => {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1

        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = '#ff4081'
        ctx.shadowColor = '#fff'
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Check collision
      for (const d of distractions) {
        const dx = d.x - playerX.current
        const dy = d.y - playerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < d.r + 15) {
          endGame(false)
          return
        }
      }

      // Draw Player
      ctx.beginPath()
      ctx.arc(playerX.current, playerY, 15, 0, Math.PI * 2)
      ctx.fillStyle = '#00e5ff'
      ctx.shadowColor = '#00ffff'
      ctx.shadowBlur = 15
      ctx.fill()
      ctx.shadowBlur = 0

      // Off track logic
      if (playerY < focusPath.y || playerY > focusPath.y + focusPath.height) {
        setOffTrackFrames((prev) => {
          if (prev >= 120) {
            endGame(false)
            return prev
          }
          return prev + 1
        })
      } else {
        setOffTrackFrames(0)
      }

      if (!gameOver) requestAnimationFrame(update)
    }

    const endGame = (won: boolean) => {
      setGameOver(true)
      setGameWon(won)
      clearInterval(timerInterval)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      playerX.current = Math.max(10, Math.min(790, x))
    }

    const handleKeyDown = (e: KeyboardEvent) => (keys.current[e.key] = true)
    const handleKeyUp = (e: KeyboardEvent) => (keys.current[e.key] = false)

    canvas.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    update()

    timerInterval = setInterval(() => {
      timer--
      setTimeLeft(timer)
      if (timer <= 0) endGame(true)
    }, 1000)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      clearInterval(timerInterval)
    }
  }, [gameOver])

  return (
    <div className="relative flex flex-col items-center">
      <canvas ref={canvasRef} className="rounded-xl border-2 border-cyan-500 shadow-xl" />

      <div className="text-lg mt-4 font-mono text-lime-200">
        ⏱ Time Left: <span className="font-bold text-yellow-300">{timeLeft}s</span>
      </div>
      <p className="text-sm text-gray-300 mt-2 font-mono max-w-md text-center">
        🎯 Stay inside the glowing focus path.  
        ⚠️ Avoid bouncing distractions.  
        🧠 Use ←/→ or your mouse to control.
      </p>

      {gameOver && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-black via-gray-900 to-black p-6 rounded-xl border border-white/20 shadow-2xl text-center w-[300px] backdrop-blur-md">
            <h2
              className={`text-2xl font-bold mb-4 ${
                gameWon ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {gameWon ? '✅ Focus Achieved!' : '💥 You Lost Concentration!'}
            </h2>
            <div className="flex flex-col space-y-3">
              <button
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-5 rounded"
                onClick={() => window.location.reload()}
              >
                🔁 Retry
              </button>
              {gameWon && (
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded"
                  onClick={() => window.location.href = '/level5'}
                >
                  🎯 Next Level
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CanvasFocusPath
