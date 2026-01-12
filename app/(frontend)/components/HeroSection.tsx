'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

const TunnelShader = dynamic(() => import('./TunnelShader'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
})

interface HeroSectionProps {
  onComplete: () => void
}

export default function HeroSection({ onComplete }: HeroSectionProps) {
  const [isExiting, setIsExiting] = useState(false)
  const [shaderReady, setShaderReady] = useState(false)

  const handleShaderReady = useCallback(() => {
    setShaderReady(true)
  }, [])

  useEffect(() => {
    if (shaderReady) {
      // Show the effect for 2 seconds then exit
      const timer = setTimeout(() => {
        setIsExiting(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [shaderReady])

  useEffect(() => {
    if (isExiting) {
      // Call onComplete after animation finishes
      const timer = setTimeout(() => {
        onComplete()
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [isExiting, onComplete])

  return (
    <section
      className={`fixed inset-0 w-screen h-screen flex items-center justify-center overflow-hidden z-50 transition-all duration-1000 ease-in-out ${
        isExiting ? 'opacity-0 scale-150' : 'opacity-100 scale-100'
      }`}
    >
      <TunnelShader onReady={handleShaderReady} />
      <h1
        className={`relative z-10 text-white select-none text-center transition-all duration-500 ${
          shaderReady && !isExiting ? 'opacity-100 scale-100' : ''
        } ${isExiting ? 'opacity-0 scale-110' : ''} ${!shaderReady ? 'opacity-0 scale-95' : ''}`}
        style={{
          fontSize: 'clamp(2rem, 9.5vw, 10rem)',
          fontFamily: 'var(--font-helvetica), system-ui, sans-serif',
          fontWeight: 950,
          fontStretch: 'expanded',
          letterSpacing: '0.05em',
          transform: 'scaleX(1.18)',
          textShadow: '0 0 80px rgba(255,255,255,0.4)',
        }}
      >
        AMANDA AASA
      </h1>
    </section>
  )
}
