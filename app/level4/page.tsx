'use client'
import CanvasFocusPath from '@/app/components/CanvasFocusPath'

export default function Level4Page() {
  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <h1 className="text-3xl font-bold text-lime-200 mb-2 drop-shadow-xl">
        🧠 Level 4: Mental Drift
      </h1>
      <CanvasFocusPath />
    </div>
  )
}
