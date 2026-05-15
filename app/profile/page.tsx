'use client'

import { Settings, LogOut, Heart, Users, Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { currentUser, profiles } from '@/lib/mock-data'

export default function ProfilePage() {
  const userProfiles = profiles // In a real app, filter by user

  const stats = {
    memoriesShared: 12,
    profilesContributed: 3,
    eventsAttended: 2,
  }

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-primary/20"
          />
          <h1 className="text-2xl font-serif font-semibold text-foreground">
            {currentUser.name}
          </h1>
          <p className="text-muted-foreground">{currentUser.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-card border border-border text-center">
            <Heart className="w-5 h-5 mx-auto mb-2 text-secondary" />
            <p className="text-2xl font-semibold text-foreground">{stats.memoriesShared}</p>
            <p className="text-xs text-muted-foreground">Memories</p>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border text-center">
            <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-semibold text-foreground">{stats.profilesContributed}</p>
            <p className="text-xs text-muted-foreground">Profiles</p>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border text-center">
            <Calendar className="w-5 h-5 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-semibold text-foreground">{stats.eventsAttended}</p>
            <p className="text-xs text-muted-foreground">Events</p>
          </div>
        </div>

        {/* Your Memorials */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Memorials</h2>
          <div className="space-y-3">
            {userProfiles.map(profile => (
              <Link
                key={profile.id}
                href={`/remember/${profile.slug}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <img
                  src={profile.profilePhoto}
                  alt={profile.name}
                  className="w-12 h-12 rounded-full object-cover"
                  style={{ boxShadow: `0 0 0 2px ${profile.accentColor}` }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {profile.contributorCount} contributors
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section className="space-y-2">
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Settings</h3>
              <p className="text-sm text-muted-foreground">Account, notifications, privacy</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-destructive/30 transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-destructive">Sign Out</h3>
            </div>
          </button>
        </section>
      </div>
    </AppShell>
  )
}
