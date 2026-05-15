'use client'

import { Heart, Flame, HandHeart, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Memory } from '@/lib/mock-data'

interface MemoryCardProps {
  memory: Memory
  accentColor: string
  profileName?: string
}

export function MemoryCard({ memory, accentColor, profileName }: MemoryCardProps) {
  return (
    <article className="p-4 rounded-2xl bg-card border border-border">
      {/* Author header */}
      <div className="flex items-center gap-3">
        <img
          src={memory.authorAvatar}
          alt={memory.authorName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground truncate">
              {memory.authorName}
            </span>
            {profileName && (
              <>
                <span className="text-muted-foreground">remembered</span>
                <span 
                  className="font-medium truncate"
                  style={{ color: accentColor }}
                >
                  {profileName}
                </span>
              </>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{memory.timestamp}</span>
        </div>
      </div>

      {/* Memory content */}
      <div className="mt-3">
        <p className="text-foreground leading-relaxed">{memory.text}</p>
        
        {memory.photo && (
          <div className="mt-3 rounded-xl overflow-hidden">
            <img
              src={memory.photo}
              alt="Memory photo"
              className="w-full h-auto max-h-80 object-cover"
            />
          </div>
        )}
      </div>

      {/* Reactions */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
        <ReactionButton
          icon={Heart}
          count={memory.reactions.heart}
          label="Love"
          accentColor={accentColor}
        />
        <ReactionButton
          icon={Flame}
          count={memory.reactions.candle}
          label="Light candle"
          accentColor={accentColor}
          isCandle
        />
        <ReactionButton
          icon={HandHeart}
          count={memory.reactions.hug}
          label="Send hug"
          accentColor={accentColor}
        />
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
          <MessageCircle className="w-4 h-4" />
          <span>{memory.comments}</span>
        </button>
      </div>
    </article>
  )
}

interface ReactionButtonProps {
  icon: React.ElementType
  count: number
  label: string
  accentColor: string
  isCandle?: boolean
}

function ReactionButton({ icon: Icon, count, label, accentColor, isCandle }: ReactionButtonProps) {
  return (
    <button
      className={cn(
        'flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group',
        isCandle && 'candle-glow'
      )}
      style={{ 
        '--profile-accent': accentColor,
        '--profile-accent-glow': `${accentColor}40`,
      } as React.CSSProperties }
      aria-label={label}
    >
      <Icon 
        className={cn(
          'w-4 h-4 transition-colors',
          'group-hover:text-[var(--profile-accent)]'
        )}
      />
      <span>{count}</span>
    </button>
  )
}
