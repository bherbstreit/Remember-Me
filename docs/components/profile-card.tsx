'use client'

import Link from 'next/link'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/mock-data'

interface ProfileCardProps {
  profile: Profile
  variant?: 'horizontal' | 'vertical'
  showBio?: boolean
}

export function ProfileCard({ profile, variant = 'vertical', showBio = false }: ProfileCardProps) {
  if (variant === 'horizontal') {
    return (
      <Link
        href={`/remember/${profile.slug}`}
        className="flex items-start gap-4 p-4 rounded-2xl bg-card hover:bg-muted/50 transition-colors border border-border"
      >
        <img
          src={profile.profilePhoto}
          alt={profile.name}
          className="w-16 h-16 rounded-xl object-cover ring-2"
          style={{ '--tw-ring-color': profile.accentColor } as React.CSSProperties}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground truncate">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">
                {profile.birthYear} — {profile.deathYear}
              </p>
            </div>
            {profile.isNew && (
              <span 
                className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: profile.accentColor }}
              >
                New
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>{profile.contributorCount} contributors</span>
          </div>
          {showBio && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {profile.lifeStory.slice(0, 120)}...
            </p>
          )}
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/remember/${profile.slug}`}
      className="group flex-shrink-0 w-[200px] rounded-2xl overflow-hidden bg-card border border-border hover:border-opacity-50 transition-all hover:shadow-lg"
      style={{ 
        borderColor: `${profile.accentColor}40`,
        '--hover-border': profile.accentColor,
      } as React.CSSProperties}
    >
      <div className="relative h-24 overflow-hidden">
        <img
          src={profile.coverPhoto}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div 
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(to top, ${profile.accentColor}30, transparent)` 
          }}
        />
        {profile.isNew && (
          <span 
            className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full text-white"
            style={{ backgroundColor: profile.accentColor }}
          >
            New
          </span>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex items-center gap-2">
          <img
            src={profile.profilePhoto}
            alt={profile.name}
            className="w-10 h-10 rounded-full object-cover ring-2 -mt-7 relative z-10"
            style={{ '--tw-ring-color': profile.accentColor } as React.CSSProperties}
          />
        </div>
        
        <h3 className={cn(
          'mt-2 font-semibold text-foreground truncate text-sm',
          profile.nameFont === 'cormorant' && 'font-cormorant',
          profile.nameFont === 'playfair' && 'font-playfair',
          profile.nameFont === 'dancing' && 'font-dancing',
          profile.nameFont === 'eb-garamond' && 'font-eb-garamond',
        )}>
          {profile.name}
        </h3>
        
        <p className="text-xs text-muted-foreground">
          {profile.birthYear} — {profile.deathYear}
        </p>
        
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>{profile.contributorCount}</span>
        </div>
      </div>
    </Link>
  )
}
