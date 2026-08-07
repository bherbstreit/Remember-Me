'use client'

import { useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Map, List, MapPin } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { profiles } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

// Mock contributors data
const contributors = [
  { id: '1', name: 'Shandon Coffman', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', location: 'Phoenix, AZ', lat: 33.45, lng: -112.07 },
  { id: '2', name: 'Cindy Hanes', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop', location: 'Los Angeles, CA', lat: 34.05, lng: -118.25 },
  { id: '3', name: 'Pastor Michael Torres', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', location: 'Denver, CO', lat: 39.74, lng: -104.99 },
  { id: '4', name: 'Maria Santos', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop', location: 'Austin, TX', lat: 30.27, lng: -97.74 },
  { id: '5', name: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', location: 'Seattle, WA', lat: 47.61, lng: -122.33 },
  { id: '6', name: 'Emily Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', location: 'San Francisco, CA', lat: 37.77, lng: -122.42 },
]

export default function ConnectPage() {
  const params = useParams()
  const slug = params.slug as string
  const profile = profiles.find(p => p.slug === slug)
  
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list')

  if (!profile) {
    notFound()
  }

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/remember/${slug}`}
            className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-serif font-semibold text-foreground">
              Connect with Others
            </h1>
            <p className="text-sm text-muted-foreground">
              See who has been touched by {profile.name.split(' ')[0]}&apos;s life
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
            className="rounded-xl"
          >
            <Map className="w-4 h-4 mr-2" />
            Map View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-xl"
          >
            <List className="w-4 h-4 mr-2" />
            List View
          </Button>
        </div>

        {viewMode === 'map' ? (
          <MapView contributors={contributors} accentColor={profile.accentColor} />
        ) : (
          <ListView contributors={contributors} />
        )}
      </div>
    </AppShell>
  )
}

function MapView({ contributors, accentColor }: { contributors: typeof contributors[0][]; accentColor: string }) {
  return (
    <div className="relative h-[400px] rounded-2xl bg-muted overflow-hidden">
      {/* Simple US map visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Simple map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
          
          {/* Contributors as pins */}
          {contributors.map((contributor, i) => {
            // Convert lat/lng to rough percentage positions for US
            const left = ((contributor.lng + 125) / 60) * 100
            const top = ((50 - contributor.lat) / 25) * 100
            
            return (
              <div
                key={contributor.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ 
                  left: `${Math.max(10, Math.min(90, left))}%`, 
                  top: `${Math.max(10, Math.min(90, top))}%` 
                }}
              >
                <img
                  src={contributor.avatar}
                  alt={contributor.name}
                  className="w-10 h-10 rounded-full ring-2 ring-background shadow-lg cursor-pointer hover:scale-110 transition-transform"
                  style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-card rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  {contributor.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ListView({ contributors }: { contributors: typeof contributors[0][] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {contributors.map(contributor => (
        <div
          key={contributor.id}
          className="flex flex-col items-center p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors cursor-pointer"
        >
          <img
            src={contributor.avatar}
            alt={contributor.name}
            className="w-16 h-16 rounded-full object-cover mb-3"
          />
          <h3 className="font-medium text-foreground text-center text-sm">
            {contributor.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{contributor.location}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
