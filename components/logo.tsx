'use client'

import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
}

export function Logo({ size = 'md', showWordmark = true }: LogoProps) {
  const sizes = {
    sm: { text: 'text-lg' },
    md: { text: 'text-xl' },
    lg: { text: 'text-3xl' },
  }

  const { text } = sizes[size]

  return (
    <Link
      href="/"
      className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${text}`}
    >
      <img
        src="/logo-white-hand.svg"
        alt="Remember Me"
        className="h-[1em] w-auto object-contain"
      />
      {showWordmark && (
        <span className="font-serif font-semibold text-foreground">
          Remember Me.
        </span>
      )}
    </Link>
  )
}
