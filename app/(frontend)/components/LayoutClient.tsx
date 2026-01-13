'use client'

import { IntroProvider } from './IntroContext'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return <IntroProvider>{children}</IntroProvider>
}
