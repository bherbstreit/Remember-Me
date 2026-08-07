'use client'

import { useState, useRef } from 'react'
import { 
  Image as ImageIcon, 
  Video, 
  Mic, 
  Music, 
  X,
  Upload,
  Camera
} from 'lucide-react'
import { MediaItem, MediaType } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface MediaUploadProps {
  onMediaAdd: (media: MediaItem) => void
  onMediaRemove: (mediaId: string) => void
  selectedMedia: MediaItem[]
  accentColor: string
}

const mediaTypes: { type: MediaType; icon: typeof ImageIcon; label: string; accept: string }[] = [
  { type: 'photo', icon: ImageIcon, label: 'Photo', accept: 'image/*' },
  { type: 'video', icon: Video, label: 'Video', accept: 'video/*' },
  { type: 'voice', icon: Mic, label: 'Voice', accept: 'audio/*' },
  { type: 'music', icon: Music, label: 'Music', accept: 'audio/*' },
]

export function MediaUpload({ onMediaAdd, onMediaRemove, selectedMedia, accentColor }: MediaUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentType, setCurrentType] = useState<MediaType>('photo')

  const handleFileSelect = (type: MediaType) => {
    setCurrentType(type)
    const mediaType = mediaTypes.find(m => m.type === type)
    if (fileInputRef.current && mediaType) {
      fileInputRef.current.accept = mediaType.accept
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a local URL for the file
    const url = URL.createObjectURL(file)
    
    const newMedia: MediaItem = {
      id: `media-${Date.now()}`,
      type: currentType,
      url,
      caption: '',
    }

    // For audio/video, we'd normally get duration but for demo purposes we'll skip
    if (currentType === 'video' || currentType === 'voice' || currentType === 'music') {
      newMedia.duration = 0 // Would be set from actual file metadata
    }

    onMediaAdd(newMedia)
    setIsOpen(false)
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Media Type Selector */}
      <div className="flex items-center gap-1">
        {mediaTypes.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => handleFileSelect(type)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title={`Add ${label}`}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Selected Media Preview */}
      {selectedMedia.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedMedia.map(media => (
            <MediaPreview
              key={media.id}
              media={media}
              onRemove={() => onMediaRemove(media.id)}
              accentColor={accentColor}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function MediaPreview({ 
  media, 
  onRemove,
  accentColor 
}: { 
  media: MediaItem
  onRemove: () => void
  accentColor: string
}) {
  const getIcon = () => {
    switch (media.type) {
      case 'video': return Video
      case 'voice': return Mic
      case 'music': return Music
      default: return ImageIcon
    }
  }

  const Icon = getIcon()

  return (
    <div className="relative group">
      {media.type === 'photo' ? (
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
          <img src={media.url} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div 
          className="w-20 h-20 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <Icon className="w-8 h-8" style={{ color: accentColor }} />
        </div>
      )}
      
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" />
      </button>
      
      <span className="absolute bottom-1 left-1 text-[10px] px-1 py-0.5 rounded bg-black/60 text-white capitalize">
        {media.type}
      </span>
    </div>
  )
}
