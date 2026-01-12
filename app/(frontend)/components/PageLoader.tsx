'use client'

import { useState } from 'react'
import HeroSection from './HeroSection'

interface PageLoaderProps {
  children: React.ReactNode
}

export default function PageLoader({ children }: PageLoaderProps) {
  const [showLoader, setShowLoader] = useState(true)

  const handleLoaderComplete = () => {
    setShowLoader(false)
  }

  return (
    <>
      {showLoader && <HeroSection onComplete={handleLoaderComplete} />}
      {children}
    </>
  )
}
