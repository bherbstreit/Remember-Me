'use client'

import { useState, useCallback } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Users, 
  Globe, 
  Lock, 
  Sparkles, 
  Send,
  Image as ImageIcon,
  Share2,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { MemoryCard } from '@/components/memory-card'
import { EventCard } from '@/components/event-card'
import { MediaUpload } from '@/components/media-upload'
import { MediaGrid } from '@/components/media-player'
import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { useMemoryContext } from '@/lib/memory-context'
import { getFontClass, getMotifIcon, currentUser, MediaItem, Profile } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type TabId = 'life-story' | 'community' | 'gallery' | 'events'

const tabs: { id: TabId; label: string }[] = [
  { id: 'life-story', label: 'Life Story' },
  { id: 'community', label: 'Community' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'events', label: 'Events' },
]

export default function RememberProfilePage() {
  const params = useParams()
  const slug = params.slug as string
  const { getProfile, addMemory, isGeneratingStory, setIsGeneratingStory, updateLifeStory, streamingStory, setStreamingStory } = useMemoryContext()
  const profile = getProfile(slug)
  
  const [activeTab, setActiveTab] = useState<TabId>('life-story')
  const [memoryText, setMemoryText] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoReferences, setPhotoReferences] = useState<{ url: string; context: string; author: string }[]>([])
  const [pendingMemoryId, setPendingMemoryId] = useState<string | null>(null)
  const [lifeStoryUpdated, setLifeStoryUpdated] = useState(false)

  if (!profile) {
    notFound()
  }

  const handleMediaAdd = (media: MediaItem) => {
    setSelectedMedia(prev => [...prev, media])
  }

  const handleMediaRemove = (mediaId: string) => {
    setSelectedMedia(prev => prev.filter(m => m.id !== mediaId))
  }

  const generateLifeStoryWithMemories = useCallback(async (currentProfile: Profile) => {
    setIsGeneratingStory(true)
    setStreamingStory('')
    setPhotoReferences([])
    setLifeStoryUpdated(false)
    
    try {
      const response = await fetch('/api/generate-life-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personName: currentProfile.name,
          memories: currentProfile.memories.map(m => ({
            authorName: m.authorName,
            text: m.text,
            photo: m.photo,
            media: m.media,
          })),
          motifs: currentProfile.motifs,
          existingStory: currentProfile.lifeStory,
        }),
      })

      // Extract photo references from response header
      const photoRefsHeader = response.headers.get('X-Photo-References')
      if (photoRefsHeader) {
        try {
          const refs = JSON.parse(photoRefsHeader)
          setPhotoReferences(refs)
        } catch (e) {
          console.error('Failed to parse photo references:', e)
        }
      }

      if (!response.ok) throw new Error('Failed to generate story')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      const decoder = new TextDecoder()
      let fullStory = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullStory += chunk
        setStreamingStory(fullStory)
      }

      // Update the final story in context
      updateLifeStory(currentProfile.id, fullStory)
      setLifeStoryUpdated(true)

      toast({
        title: 'Life Story updated',
        description: 'Your new memory was added and the Life Story is refreshed.',
        action: (
          <ToastAction asChild>
            <button
              type="button"
              className="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium text-primary ring-offset-background transition-colors hover:bg-secondary"
              onClick={() => {
                setActiveTab('life-story')
                setLifeStoryUpdated(false)
                setPendingMemoryId(null)
              }}
            >
              View Life Story
            </button>
          </ToastAction>
        ),
      })
    } catch (error) {
      console.error('Error generating life story:', error)
    } finally {
      setIsGeneratingStory(false)
      setStreamingStory('')
    }
  }, [setIsGeneratingStory, setStreamingStory, updateLifeStory])
  
  const generateLifeStory = useCallback((currentProfile: Profile) => {
    generateLifeStoryWithMemories(currentProfile)
  }, [generateLifeStoryWithMemories])

  const handleSubmitMemory = async () => {
    if (!memoryText.trim() && selectedMedia.length === 0) return

    setIsSubmitting(true)

    // Store the values before clearing
    const submittedText = memoryText
    const submittedMedia = [...selectedMedia]

    // Clear form
    setMemoryText('')
    setSelectedMedia([])
    setIsSubmitting(false)

    const newMemory = {
      authorName: currentUser.name,
      text: submittedText,
      photo: submittedMedia.find(m => m.type === 'photo')?.url,
      media: submittedMedia.length > 0 ? submittedMedia : undefined,
    }

    const newMemoryId = addMemory(profile.id, {
      ...newMemory,
      authorAvatar: currentUser.avatar,
      timestamp: 'Just now',
    })
    setPendingMemoryId(newMemoryId)
    setLifeStoryUpdated(false)

    const updatedMemories = [newMemory, ...profile.memories.map(m => ({
      authorName: m.authorName,
      text: m.text,
      photo: m.photo,
      media: m.media,
    }))]

    // Trigger AI regeneration with updated memories in the background
    generateLifeStoryWithMemories({
      ...profile,
      memories: updatedMemories as typeof profile.memories,
    })
  }

  const accentColor = profile.accentColor
  const handleViewLifeStory = useCallback(() => {
    setActiveTab('life-story')
    setLifeStoryUpdated(false)
    setPendingMemoryId(null)
  }, [])

  return (
    <AppShell>
      <div 
        className="min-h-screen"
        style={{ 
          '--profile-accent': accentColor,
          '--profile-accent-glow': `${accentColor}40`,
        } as React.CSSProperties}
      >
        {/* Hero Section */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-48 md:h-64 relative overflow-hidden">
            <img
              src={profile.coverPhoto}
              alt=""
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0"
              style={{ 
                background: `linear-gradient(to top, ${accentColor}50, transparent 50%)` 
              }}
            />
            
            {/* Back button */}
            <Link
              href="/"
              className="absolute top-4 left-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            {/* Share button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          
          {/* Profile Info */}
          <div className="container mx-auto px-4 max-w-2xl -mt-16 relative z-10">
            <div className="flex items-end gap-4 mb-4">
              <img
                src={profile.profilePhoto}
                alt={profile.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover ring-4 ring-background shadow-xl"
              />
              
              <div className="flex-1 pb-2">
                <h1 
                  className={cn(
                    'text-2xl md:text-4xl font-bold',
                    getFontClass(profile.nameFont)
                  )}
                  style={{ color: accentColor }}
                >
                  {profile.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {profile.birthYear} — {profile.deathYear}
                </p>
              </div>
            </div>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-sm text-muted-foreground">
                Organized by <span className="text-foreground font-medium">{profile.organizerName}</span> ({profile.organizerRelationship})
              </span>
              
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-sm">
                <Users className="w-3.5 h-3.5" />
                <span>{profile.contributorCount} contributors</span>
              </div>
              
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-sm">
                {profile.privacy === 'public' ? (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span>Public</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Private</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Motifs decoration */}
            <div className="flex items-center gap-2 mb-6">
              {profile.motifs.map(motif => (
                <span 
                  key={motif}
                  className="text-lg opacity-60"
                  title={motif}
                >
                  {getMotifIcon(motif)}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="sticky top-0 md:top-16 z-30 bg-background border-b border-border">
          <div className="container mx-auto px-4 max-w-2xl">
            <nav className="flex overflow-x-auto hide-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors relative',
                    activeTab === tab.id
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.label}
                  {tab.id === 'life-story' && isGeneratingStory && (
                    <Loader2 className="w-3 h-3 ml-1 inline animate-spin" />
                  )}
                  {activeTab === tab.id && (
                    <span 
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          {activeTab === 'life-story' && (
            <LifeStoryTab 
              profile={profile} 
              accentColor={accentColor}
              isGenerating={isGeneratingStory}
              streamingStory={streamingStory}
              photoReferences={photoReferences}
              onRegenerate={() => generateLifeStory(profile)}
            />
          )}
          
          {activeTab === 'community' && (
            <CommunityTab 
              profile={profile} 
              accentColor={accentColor}
              memoryText={memoryText}
              setMemoryText={setMemoryText}
              selectedMedia={selectedMedia}
              onMediaAdd={handleMediaAdd}
              onMediaRemove={handleMediaRemove}
              onSubmit={handleSubmitMemory}
              isSubmitting={isSubmitting}
              pendingMemoryId={pendingMemoryId}
              storyUpdated={lifeStoryUpdated}
              onViewLifeStory={handleViewLifeStory}
            />
          )}
          
          {activeTab === 'gallery' && (
            <GalleryTab profile={profile} />
          )}
          
          {activeTab === 'events' && (
            <EventsTab profile={profile} accentColor={accentColor} />
          )}
        </div>
      </div>
    </AppShell>
  )
}

interface PhotoReference {
  url: string
  context: string
  author: string
}

function LifeStoryTab({ 
  profile, 
  accentColor,
  isGenerating,
  streamingStory,
  photoReferences,
  onRegenerate
}: { 
  profile: Profile
  accentColor: string
  isGenerating: boolean
  streamingStory: string
  photoReferences: PhotoReference[]
  onRegenerate: () => void
}) {
  const displayStory = isGenerating && streamingStory ? streamingStory : profile.lifeStory

  // Parse story and extract photo references for inline display
  const renderStoryWithPhotos = (story: string) => {
    const elements: React.ReactNode[] = []
    const photoRefRegex = /\[PHOTO_REF_(\d+)\]/g
    
    // Split story by paragraphs first
    const paragraphs = story.split('\n\n')
    
    paragraphs.forEach((paragraph, pIndex) => {
      // Check if this paragraph contains photo references
      const photoMatches = [...paragraph.matchAll(photoRefRegex)]
      
      if (photoMatches.length === 0) {
        // No photos, render as normal paragraph
        elements.push(
          <p key={`p-${pIndex}`} className={cn(
            'text-foreground leading-relaxed mb-4',
            isGenerating && pIndex === paragraphs.length - 1 && 'animate-pulse'
          )}>
            {paragraph}
          </p>
        )
      } else {
        // Has photos - render paragraph with photos on the side or inline
        const cleanedText = paragraph.replace(photoRefRegex, '').trim()
        const photoIndices = photoMatches.map(m => parseInt(m[1]))
        const photos = photoIndices
          .filter(idx => idx < photoReferences.length)
          .map(idx => photoReferences[idx])
        
        if (photos.length > 0) {
          elements.push(
            <div key={`p-${pIndex}`} className="mb-6">
              <p className={cn(
                'text-foreground leading-relaxed mb-3',
                isGenerating && pIndex === paragraphs.length - 1 && 'animate-pulse'
              )}>
                {cleanedText}
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                {photos.map((photo, photoIdx) => (
                  <div 
                    key={`photo-${pIndex}-${photoIdx}`}
                    className="flex-shrink-0 w-48 md:w-64"
                  >
                    <div className="rounded-xl overflow-hidden ring-2 ring-border shadow-lg">
                      <img 
                        src={photo.url} 
                        alt={photo.context}
                        className="w-full aspect-[4/3] object-cover"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      Shared by {photo.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        } else {
          elements.push(
            <p key={`p-${pIndex}`} className={cn(
              'text-foreground leading-relaxed mb-4',
              isGenerating && pIndex === paragraphs.length - 1 && 'animate-pulse'
            )}>
              {cleanedText}
            </p>
          )
        }
      }
    })
    
    return elements
  }

  // Get all photos from memories for fallback display
  const allPhotos = profile.memories.flatMap(m => {
    const photos: PhotoReference[] = []
    if (m.photo) {
      photos.push({ url: m.photo, context: m.text, author: m.authorName })
    }
    if (m.media) {
      m.media.filter(media => media.type === 'photo').forEach(media => {
        photos.push({ url: media.url, context: media.caption || m.text, author: m.authorName })
      })
    }
    return photos
  })

  // Use API-provided references if available, otherwise use all photos from memories
  const activePhotoRefs = photoReferences.length > 0 ? photoReferences : allPhotos

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: accentColor }} />
          ) : (
            <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
          )}
          <span className="text-sm text-muted-foreground">
            {isGenerating ? 'Updating story from new memories...' : 'AI-generated from community-shared memories'}
          </span>
        </div>
        
        {!isGenerating && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Regenerate
          </Button>
        )}
      </div>
      
      <article className="prose prose-invert max-w-none">
        {photoReferences.length > 0 || displayStory.includes('[PHOTO_REF_') 
          ? renderStoryWithPhotos(displayStory)
          : displayStory.split('\n\n').map((paragraph, i) => (
              <p key={i} className={cn(
                'text-foreground leading-relaxed mb-4',
                isGenerating && i === displayStory.split('\n\n').length - 1 && 'animate-pulse'
              )}>
                {paragraph}
              </p>
            ))
        }
      </article>

      {/* Media Gallery Section - shows all photos if not embedded inline */}
      {allPhotos.length > 0 && !displayStory.includes('[PHOTO_REF_') && (
        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Photos shared by the community
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allPhotos.slice(0, 6).map((photo, idx) => (
              <div 
                key={idx}
                className="group relative aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer hover:ring-2 transition-all"
                style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
              >
                <img src={photo.url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="absolute bottom-2 left-2 right-2 text-xs text-white line-clamp-2">
                    {photo.context}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Media Section (videos, voice recordings, music) */}
      {profile.memories.some(m => m.media?.some(media => media.type !== 'photo')) && (
        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Other media shared by the community
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {profile.memories
              .flatMap(m => m.media || [])
              .filter(media => media.type !== 'photo')
              .slice(0, 6)
              .map(media => (
                <div 
                  key={media.id}
                  className="aspect-square rounded-xl overflow-hidden bg-muted flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <span className="text-3xl">{media.type === 'music' ? '🎵' : media.type === 'video' ? '🎬' : '🎙️'}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CommunityTab({ 
  profile, 
  accentColor, 
  memoryText, 
  setMemoryText,
  selectedMedia,
  onMediaAdd,
  onMediaRemove,
  onSubmit,
  isSubmitting,
  pendingMemoryId,
  storyUpdated,
  onViewLifeStory,
}: { 
  profile: Profile
  accentColor: string
  memoryText: string
  setMemoryText: (text: string) => void
  selectedMedia: MediaItem[]
  onMediaAdd: (media: MediaItem) => void
  onMediaRemove: (mediaId: string) => void
  onSubmit: () => void
  isSubmitting: boolean
  pendingMemoryId: string | null
  storyUpdated: boolean
  onViewLifeStory: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Share Memory Input */}
      <div className="p-4 rounded-2xl bg-card border border-border">
        <textarea
          value={memoryText}
          onChange={(e) => setMemoryText(e.target.value)}
          placeholder={`Share a memory of ${profile.name.split(' ')[0]}...`}
          className="w-full h-24 bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none"
        />
        
        {/* Media Upload */}
        <div className="pt-3 border-t border-border">
          <MediaUpload
            onMediaAdd={onMediaAdd}
            onMediaRemove={onMediaRemove}
            selectedMedia={selectedMedia}
            accentColor={accentColor}
          />
        </div>
        
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Add photos, videos, voice recordings, or music
          </p>
          <Button
            className="rounded-xl"
            style={{ backgroundColor: accentColor }}
            disabled={(!memoryText.trim() && selectedMedia.length === 0) || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Share Memory
          </Button>
        </div>
      </div>
      
      {/* Memory Feed */}
      <div className="space-y-4">
        {profile.memories.map(memory => (
          <div key={memory.id}>
            <MemoryCard
              memory={memory}
              accentColor={accentColor}
            />
            {memory.id === pendingMemoryId && storyUpdated && (
              <div className="mt-4 rounded-2xl border border-border bg-secondary/10 p-4 text-sm text-foreground">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Life Story updated</p>
                    <p className="text-muted-foreground">Your community memory was added and the Life Story has been refreshed in the background.</p>
                  </div>
                  <Button onClick={onViewLifeStory} variant="secondary" className="rounded-xl">
                    View Life Story
                  </Button>
                </div>
              </div>
            )}
            {memory.media && memory.media.length > 0 && (
              <div className="mt-2 ml-14">
                <MediaGrid media={memory.media} accentColor={accentColor} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function GalleryTab({ profile }: { profile: Profile }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {profile.galleryPhotos.map((photo, i) => (
        <div 
          key={i}
          className="aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img
            src={photo}
            alt={`Photo ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}

function EventsTab({ profile, accentColor }: { profile: Profile; accentColor: string }) {
  return (
    <div className="space-y-4">
      {profile.events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No upcoming events</p>
        </div>
      ) : (
        profile.events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            accentColor={accentColor}
          />
        ))
      )}
    </div>
  )
}
