'use client'

import { useState, useMemo } from 'react'
import { Search, Camera, Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { ProfileCard } from '@/components/profile-card'
import { Button } from '@/components/ui/button'
import { profiles } from '@/lib/mock-data'

export default function SearchPage() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return null
    
    const lowercaseQuery = query.toLowerCase()
    return profiles.filter(profile => 
      profile.name.toLowerCase().includes(lowercaseQuery)
    )
  }, [query])

  const bestMatch = results?.[0]
  const suggested = results?.slice(1)

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">
            Discover
          </h1>
          <p className="text-muted-foreground">
            Search for a loved one or create a new memorial.
          </p>
        </header>

        {/* Search Input */}
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-card border border-border mb-6">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
          />
          <Button variant="ghost" size="icon" className="text-muted-foreground flex-shrink-0">
            <Camera className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Results */}
        {results && results.length > 0 && (
          <div className="space-y-6">
            {/* Best Match */}
            {bestMatch && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Best Match
                  </h2>
                </div>
                <ProfileCard profile={bestMatch} variant="horizontal" showBio />
              </section>
            )}

            {/* Suggested */}
            {suggested && suggested.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Similar Names
                </h2>
                <div className="space-y-3">
                  {suggested.map(profile => (
                    <ProfileCard 
                      key={profile.id} 
                      profile={profile} 
                      variant="horizontal" 
                      showBio 
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* No Results */}
        {results && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No memorials found for &quot;{query}&quot;
            </p>
          </div>
        )}

        {/* Create Profile CTA */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Don&apos;t see them listed?
          </h3>
          <p className="text-muted-foreground mb-4">
            Create a new memorial to honor their memory.
          </p>
          <Link href="/create">
            <Button className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Create a New Profile
            </Button>
          </Link>
        </div>

        {/* Browse All */}
        {!query && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Recently Added
            </h2>
            <div className="space-y-3">
              {profiles.map(profile => (
                <ProfileCard 
                  key={profile.id} 
                  profile={profile} 
                  variant="horizontal" 
                  showBio 
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  )
}
