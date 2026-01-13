'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface IntroContextType {
  hasSeenIntro: boolean
  markIntroSeen: () => void
}

const IntroContext = createContext<IntroContextType | null>(null)

export function IntroProvider({ children }: { children: ReactNode }) {
  const [hasSeenIntro, setHasSeenIntro] = useState(false)

  const markIntroSeen = useCallback(() => {
    setHasSeenIntro(true)
  }, [])

  return (
    <IntroContext.Provider value={{ hasSeenIntro, markIntroSeen }}>
      {children}
    </IntroContext.Provider>
  )
}

export function useIntro() {
  const context = useContext(IntroContext)
  if (!context) {
    throw new Error('useIntro must be used within an IntroProvider')
  }
  return context
}
