'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, BookOpen, MessageCircle, User, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { Button } from '@/components/ui/button'
import { currentUser } from '@/lib/mock-data'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Discover', icon: Compass },
  { href: '/modules', label: 'Modules', icon: BookOpen },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
]

export function TopNav() {
  const pathname = usePathname()

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Logo size="md" />
        
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
              1
            </span>
          </Button>
          
          <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
            />
            <span className="text-sm font-medium">{currentUser.firstName}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
