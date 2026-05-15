'use client'

import { useState } from 'react'
import { Search, Camera, Plus } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { ProfileCard } from '@/components/profile-card'
import { MemoryCard } from '@/components/memory-card'
import { InvitationCard } from '@/components/invitation-card'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { currentUser, profiles, pendingInvitations } from '@/lib/mock-data'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function HomePage() {
  const [invitations, setInvitations] = useState(pendingInvitations)

  // Collect all memories from all profiles with profile info
  const allMemories = profiles.flatMap(profile => 
    profile.memories.map(memory => ({
      ...memory,
      profile,
    }))
  ).sort((a, b) => {
    // Simple sort by "x ago" text - in production would use actual timestamps
    const getWeight = (timestamp: string) => {
      if (timestamp.includes('hour')) return parseInt(timestamp) || 1
      if (timestamp.includes('day')) return (parseInt(timestamp) || 1) * 24
      if (timestamp.includes('week')) return (parseInt(timestamp) || 1) * 168
      return 999
    }
    return getWeight(a.timestamp) - getWeight(b.timestamp)
  })

  const handleAcceptInvitation = (id: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== id))
  }

  const handleDeclineInvitation = (id: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== id))
  }

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Mobile Header */}
        <header className="flex items-center justify-between mb-6 md:hidden">
          <Logo size="sm" />
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
          </Link>
        </header>

        {/* Greeting */}
        <section className="mb-6">
          <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
            {getGreeting()}, {currentUser.firstName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your loved ones.
          </p>
        </section>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center gap-2 mb-6 p-3 rounded-2xl bg-card border border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or upload a photo..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Camera className="w-5 h-5" />
          </Button>
        </div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Pending Invitations
            </h2>
            <div className="space-y-3">
              {invitations.map(invitation => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onAccept={handleAcceptInvitation}
                  onDecline={handleDeclineInvitation}
                />
              ))}
            </div>
          </section>
        )}

        {/* Your People */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Your People</h2>
            <Link 
              href="/create"
              className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Profile
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 hide-scrollbar">
            {profiles.map(profile => (
              <ProfileCard 
                key={profile.id} 
                profile={profile} 
                variant="vertical" 
              />
            ))}
          </div>
        </section>

        {/* Recent Memories Feed */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Memories</h2>
          <div className="space-y-4">
            {allMemories.slice(0, 6).map(memory => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                accentColor={memory.profile.accentColor}
                profileName={memory.profile.name}
              />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
