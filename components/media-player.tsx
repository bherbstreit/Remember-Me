'use client'

import { useState, useRef } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  Music,
  Mic
} from 'lucide-react'
import { MediaItem } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface MediaPlayerProps {
  media: MediaItem
  accentColor: string
  compact?: boolean
}

export function MediaPlayer({ media, accentColor, compact = false }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    const mediaElement = media.type === 'video' ? videoRef.current : audioRef.current
    if (!mediaElement) return

    if (isPlaying) {
      mediaElement.pause()
    } else {
      mediaElement.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const mediaElement = media.type === 'video' ? videoRef.current : audioRef.current
    if (!mediaElement) return

    mediaElement.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleTimeUpdate = () => {
    const mediaElement = media.type === 'video' ? videoRef.current : audioRef.current
    if (!mediaElement) return

    const progress = (mediaElement.currentTime / mediaElement.duration) * 100
    setProgress(progress)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setProgress(0)
  }

  if (media.type === 'photo') {
    return (
      <div className={cn(
        'rounded-xl overflow-hidden bg-muted',
        compact ? 'w-full aspect-video' : 'w-full'
      )}>
        <img 
          src={media.url} 
          alt={media.caption || ''} 
          className="w-full h-full object-cover"
        />
        {media.caption && (
          <p className="p-2 text-sm text-muted-foreground bg-card">{media.caption}</p>
        )}
      </div>
    )
  }

  if (media.type === 'video') {
    return (
      <div className={cn(
        'rounded-xl overflow-hidden bg-black relative group',
        compact ? 'w-full aspect-video' : 'w-full'
      )}>
        <video
          ref={videoRef}
          src={media.url}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          playsInline
        />
        
        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/30 rounded-full mb-2 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, backgroundColor: accentColor }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </button>
                
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Center Play Button */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div 
              className="p-4 rounded-full"
              style={{ backgroundColor: `${accentColor}CC` }}
            >
              <Play className="w-8 h-8 text-white" fill="white" />
            </div>
          </button>
        )}
      </div>
    )
  }

  // Audio (voice or music)
  const Icon = media.type === 'music' ? Music : Mic
  
  return (
    <div 
      className={cn(
        'rounded-xl p-4 flex items-center gap-4',
        compact ? 'py-3' : ''
      )}
      style={{ backgroundColor: `${accentColor}15` }}
    >
      <audio
        ref={audioRef}
        src={media.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div 
        className="p-3 rounded-full shrink-0"
        style={{ backgroundColor: `${accentColor}30` }}
      >
        <Icon className="w-5 h-5" style={{ color: accentColor }} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: accentColor }}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          
          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: accentColor }}
            />
          </div>
          
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-muted-foreground"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {media.caption && (
          <p className="text-sm text-muted-foreground truncate">{media.caption}</p>
        )}
        
        <p className="text-xs text-muted-foreground capitalize">
          {media.type === 'music' ? 'Music' : 'Voice Recording'}
        </p>
      </div>
    </div>
  )
}

// Grid display for multiple media items
export function MediaGrid({ 
  media, 
  accentColor 
}: { 
  media: MediaItem[]
  accentColor: string 
}) {
  if (media.length === 0) return null

  if (media.length === 1) {
    return <MediaPlayer media={media[0]} accentColor={accentColor} />
  }

  return (
    <div className={cn(
      'grid gap-2',
      media.length === 2 ? 'grid-cols-2' : 'grid-cols-2',
    )}>
      {media.slice(0, 4).map((item, index) => (
        <MediaPlayer 
          key={item.id} 
          media={item} 
          accentColor={accentColor}
          compact
        />
      ))}
      {media.length > 4 && (
        <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
          <span className="text-muted-foreground font-medium">
            +{media.length - 4} more
          </span>
        </div>
      )}
    </div>
  )
}
