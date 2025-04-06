'use client'

import { useEffect, useState } from 'react'

export default function SyrupBubble() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(true)
      setTimeout(() => setShow(false), 1500)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return show ? (
    <div className="absolute inset-0 bg-[#ffd1f1bb] z-30 backdrop-blur-sm transition-opacity duration-300">
      <h2 className="text-white text-4xl font-bold text-center mt-60">🫧</h2>
    </div>
  ) : null
}
