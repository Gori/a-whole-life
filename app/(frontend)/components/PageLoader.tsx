'use client'

import { useState, useCallback, useSyncExternalStore } from 'react'
import HeroSection from './HeroSection'

const STORAGE_KEY = 'hasSeenIntro'

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function getSnapshot() {
  return sessionStorage.getItem(STORAGE_KEY) === 'true'
}

function getServerSnapshot() {
  return false
}

interface PageLoaderProps {
  children: React.ReactNode
}

export default function PageLoader({ children }: PageLoaderProps) {
  const hasSeenIntro = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [loaderComplete, setLoaderComplete] = useState(false)

  const handleLoaderComplete = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, 'true')
    setLoaderComplete(true)
  }, [])

  const showLoader = !hasSeenIntro && !loaderComplete

  return (
    <>
      {showLoader && <HeroSection onComplete={handleLoaderComplete} />}
      {children}
    </>
  )
}
