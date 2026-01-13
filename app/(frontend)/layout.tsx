import Link from 'next/link'
import localFont from 'next/font/local'
import '../globals.css'
import { LayoutClient } from './components/LayoutClient'

const helveticaNow = localFont({
  src: [
    {
      path: '../../public/fonts/HelveticaNowVar.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HelveticaNowVarItalic.woff2',
      weight: '100 900',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-helvetica',
})

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={helveticaNow.variable}>
      <body className={`${helveticaNow.className} antialiased`}>
        <LayoutClient>
          <div className="min-h-screen bg-black">
            <header>
              <nav className="mx-auto max-w-4xl xl:max-w-5xl px-8 py-4">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="text-lg text-white tracking-wider"
                    style={{
                      fontWeight: 950,
                      fontStretch: 'expanded',
                      transform: 'scaleX(1.1)',
                      display: 'inline-block',
                    }}
                  >
                    AMANDA AASA
                  </Link>
                  <div className="flex gap-6 text-sm">
                    <Link href="/blog" className="text-white/80 hover:text-white drop-shadow">
                      Archive
                    </Link>
                    <Link href="/about" className="text-white/80 hover:text-white drop-shadow">
                      About
                    </Link>
                  </div>
                </div>
              </nav>
            </header>
            <main>
              {children}
            </main>
          </div>
        </LayoutClient>
      </body>
    </html>
  )
}
