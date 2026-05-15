import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter, Playfair_Display, Dancing_Script, EB_Garamond } from 'next/font/google'
import { MemoryProvider } from '@/lib/memory-context'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair',
  display: 'swap',
})

const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-dancing',
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-eb-garamond',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Remember Me. — Digital Memorial Platform',
  description: 'A modern, collaborative digital memorial platform to honor and remember loved ones.',
  openGraph: {
    title: 'Remember Me.',
    description: 'A modern, collaborative digital memorial platform to honor and remember loved ones.',
    url: 'https://bherbstreit.github.io/Remember-Me/',
    siteName: 'Remember Me',
    images: [
      {
        url: 'https://bherbstreit.github.io/Remember-Me/logo-white-hand.svg',
        width: 200,
        height: 200,
        alt: 'Remember Me Logo',
      },
    ],
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#111111',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${playfair.variable} ${dancing.variable} ${ebGaramond.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        <MemoryProvider>
          {children}
          <Toaster />
        </MemoryProvider>
      </body>
    </html>
  )
}
