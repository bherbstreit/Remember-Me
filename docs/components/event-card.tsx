'use client'

import { Calendar, MapPin, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Event } from '@/lib/mock-data'

interface EventCardProps {
  event: Event
  accentColor: string
}

export function EventCard({ event, accentColor }: EventCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border">
      <div className="flex items-start gap-4">
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          {event.isVirtual ? (
            <Video className="w-5 h-5" style={{ color: accentColor }} />
          ) : (
            <Calendar className="w-5 h-5" style={{ color: accentColor }} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{event.title}</h3>
          
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{event.date}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>
        
        <Button
          className="flex-shrink-0 rounded-xl"
          style={{ 
            backgroundColor: accentColor,
            color: '#ffffff',
          }}
        >
          RSVP
        </Button>
      </div>
    </div>
  )
}
