'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#361b14] text-[#ffeadb] px-6 py-20 gap-10 text-center font-mono">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-md">
        🍭 SUGAR:404
      </h1>
      <p className="text-lg md:text-xl max-w-xl text-[#ffd9b7]">
        “Every click brings you closer to the sugar.<br />
        And to the truth you never wanted.”
      </p>

      <Link
        href="/level1"
        className="bg-[#f37777] hover:bg-[#da6464] text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-200 shadow-md"
      >
        Start Floating →
      </Link>

      <footer className="absolute bottom-6 text-sm text-[#a26e5a]">
        Built with 🍬 & Next.js
      </footer>
    </div>
  )
}
