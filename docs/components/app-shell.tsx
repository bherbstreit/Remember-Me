'use client'

import { TopNav } from './top-nav'
import { BottomNav } from './bottom-nav'

interface AppShellProps {
  children: React.ReactNode
  hideNav?: boolean
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {!hideNav && <TopNav />}
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
