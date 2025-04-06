'use client'
import { useEffect, useRef } from 'react'

const useBGM = (src: string, volume: number = 0.5) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = volume
    audio.play().catch((e) => {
      console.warn('Auto-play blocked:', e)
    })
    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [src, volume])
}

export default useBGM
