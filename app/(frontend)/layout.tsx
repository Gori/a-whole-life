import Link from 'next/link'
import localFont from 'next/font/local'
import '../globals.css'

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
        <div className="min-h-screen bg-black">
          <header className="fixed top-0 left-0 right-0 z-50">
            <nav className="mx-auto max-w-4xl xl:max-w-5xl px-8 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-lg font-semibold text-white drop-shadow-lg">
                  A Whole Life
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
      </body>
    </html>
  )
}
