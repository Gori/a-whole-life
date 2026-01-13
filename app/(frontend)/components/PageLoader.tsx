'use client'

import HeroSection from './HeroSection'
import { useIntro } from './IntroContext'

interface PageLoaderProps {
  children: React.ReactNode
}

export default function PageLoader({ children }: PageLoaderProps) {
  const { hasSeenIntro, markIntroSeen } = useIntro()

  return (
    <>
      {!hasSeenIntro && <HeroSection onComplete={markIntroSeen} />}
      {children}
    </>
  )
}
