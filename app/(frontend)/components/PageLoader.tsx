'use client'

import { useState, useEffect } from 'react'
import HeroSection from './HeroSection'

interface PageLoaderProps {
  children: React.ReactNode
}

export default function PageLoader({ children }: PageLoaderProps) {
  const [showLoader, setShowLoader] = useState<boolean | null>(null)

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro')
    setShowLoader(!hasSeenIntro)
  }, [])

  const handleLoaderComplete = () => {
    sessionStorage.setItem('hasSeenIntro', 'true')
    setShowLoader(false)
  }

  // Don't render anything until we've checked sessionStorage
  if (showLoader === null) {
    return <>{children}</>
  }

  return (
    <>
      {showLoader && <HeroSection onComplete={handleLoaderComplete} />}
      {children}
    </>
  )
}
