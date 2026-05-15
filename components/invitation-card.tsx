'use client'

import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Invitation } from '@/lib/mock-data'

interface InvitationCardProps {
  invitation: Invitation
  onAccept?: (id: string) => void
  onDecline?: (id: string) => void
}

export function InvitationCard({ invitation, onAccept, onDecline }: InvitationCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border">
      <img
        src={invitation.profilePhoto}
        alt={invitation.profileName}
        className="w-12 h-12 rounded-full object-cover"
      />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-medium">{invitation.inviterName}</span>
          <span className="text-muted-foreground"> invited you to contribute to </span>
          <span className="font-medium">{invitation.profileName}</span>
          <span className="text-muted-foreground">&apos;s memorial</span>
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
          onClick={() => onAccept?.(invitation.id)}
          aria-label="Accept invitation"
        >
          <Check className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground"
          onClick={() => onDecline?.(invitation.id)}
          aria-label="Decline invitation"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
