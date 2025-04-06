'use client'
import { useEffect, useRef, useState } from 'react'
import CanvasMirrorMaze from '@/app/components/CanvasMirrorMaze'

export default function Level5Page() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioStarted, setAudioStarted] = useState(false)

  useEffect(() => {
    const startAudio = () => {
      if (!audioRef.current) {
        const audio = new Audio('/sounds/level5.mp3')
        audio.loop = true
        audio.volume = 0.4
        audio.play()
        audioRef.current = audio
        setAudioStarted(true)
      }
    }

    // Try auto start
    startAudio()

    // If blocked, listen for interaction
    const onClick = () => {
      if (!audioStarted) startAudio()
    }
    window.addEventListener('click', onClick)

    return () => {
      audioRef.current?.pause()
      audioRef.current = null
      window.removeEventListener('click', onClick)
    }
  }, [audioStarted])

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/castle.png')" }}
    >
      <h1 className="text-4xl font-extrabold mb-6 text-[#ff66aa] drop-shadow-[2px_2px_0px_rgba(255,255,255,0.6)] text-center">
        🍬 Level 5: Mirror Maze of Madness
      </h1>
      <CanvasMirrorMaze />
    </div>
  )
}
