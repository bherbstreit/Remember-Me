'use client'

import { useState } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Image as ImageIcon, FileText, Send, Upload, X } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { profiles, currentUser } from '@/lib/mock-data'
import { useMemoryContext } from '@/lib/memory-context'
import { generateLocalLifeStory } from '@/lib/fallback-story'
import { cn } from '@/lib/utils'

type Step = 'choose' | 'photo' | 'note' | 'confirm'

interface Message {
  id: string
  type: 'assistant' | 'user' | 'options'
  content: string
  options?: string[]
}

export default function AddMemoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const profile = profiles.find(p => p.slug === slug)
  
  const { addMemory, updateLifeStory, setIsGeneratingStory, setStreamingStory } = useMemoryContext()
  const [step, setStep] = useState<Step>('choose')
  const [photo, setPhoto] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello ${currentUser.firstName}. How would you like to remember ${profile?.name.split(' ')[0]}?`,
    },
    {
      id: '2',
      type: 'options',
      content: '',
      options: ['Share a photo', 'Write a note', 'Both'],
    },
  ])

  if (!profile) {
    notFound()
  }

  const accentColor = profile.accentColor

  const handleOptionSelect = (option: string) => {
    setMessages(prev => [
      ...prev.filter(m => m.type !== 'options'),
      { id: Date.now().toString(), type: 'user', content: option },
    ])

    if (option === 'Share a photo' || option === 'Both') {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { 
            id: (Date.now() + 1).toString(), 
            type: 'assistant', 
            content: 'Beautiful. Upload a photo and add a caption if you&apos;d like.' 
          },
        ])
        setStep('photo')
      }, 500)
    } else if (option === 'Write a note') {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { 
            id: (Date.now() + 1).toString(), 
            type: 'assistant', 
            content: `What would you like to share about ${profile.name.split(' ')[0]}? A favorite memory, something they taught you, or simply how they made you feel.` 
          },
        ])
        setStep('note')
      }, 500)
    }
  }

  const handlePhotoUpload = () => {
    // Simulate photo upload
    setPhoto('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop')
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), type: 'user', content: '[Photo uploaded]' },
      { 
        id: (Date.now() + 1).toString(), 
        type: 'assistant', 
        content: 'Lovely photo. Would you like to add a caption or note to go with it?' 
      },
    ])
    setStep('note')
  }

  const handleSubmit = async () => {
    if (!note.trim() && !photo) return

    const memoryPayload = {
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      timestamp: 'Just now',
      text: note,
      photo: photo || undefined,
      media: undefined,
    }

    addMemory(profile.id, memoryPayload)

    const updatedMemories = [
      {
        authorName: memoryPayload.authorName,
        text: memoryPayload.text,
        photo: memoryPayload.photo,
        media: memoryPayload.media,
      },
      ...profile.memories.map((m) => ({
        authorName: m.authorName,
        text: m.text,
        photo: m.photo,
        media: m.media,
      })),
    ]

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: 'user', content: note || '[Memory shared]' },
      {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Thank you for sharing this memory of ${profile.name.split(' ')[0]}. It has been added to their memorial.`,
      },
    ])
    setStep('confirm')

    setIsGeneratingStory(true)
    setStreamingStory('')

    try {
      const response = await fetch('/api/generate-life-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personName: profile.name,
          memories: updatedMemories,
          motifs: profile.motifs,
          existingStory: profile.lifeStory,
        }),
      })

      let fullStory = ''

      if (response.ok && response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullStory += decoder.decode(value, { stream: true })
        }
      } else {
        fullStory = generateLocalLifeStory({
          personName: profile.name,
          memories: updatedMemories,
          motifs: profile.motifs,
          existingStory: profile.lifeStory,
        })
      }

      updateLifeStory(profile.id, fullStory)
    } catch (error) {
      console.error('Error regenerating life story:', error)
    } finally {
      setIsGeneratingStory(false)
    }
  }

  return (
    <AppShell hideNav>
      <div 
        className="min-h-screen flex flex-col"
        style={{ 
          '--profile-accent': accentColor,
        } as React.CSSProperties}
      >
        {/* Header */}
        <header className="flex items-center gap-4 p-4 border-b border-border">
          <Link
            href={`/remember/${slug}`}
            className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <img
              src={profile.profilePhoto}
              alt={profile.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h1 className="font-medium text-foreground">Add Memory</h1>
              <p className="text-sm text-muted-foreground">{profile.name}</p>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'assistant' && (
                <div className="flex items-start gap-3 max-w-[85%]">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: accentColor }}
                  >
                    <span className="text-white text-sm font-medium">
                      {profile.name[0]}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl rounded-tl-sm bg-card border border-border">
                    <p className="text-foreground">{message.content}</p>
                  </div>
                </div>
              )}
              
              {message.type === 'user' && (
                <div className="flex justify-end">
                  <div 
                    className="p-3 rounded-2xl rounded-tr-sm max-w-[85%]"
                    style={{ backgroundColor: accentColor }}
                  >
                    <p className="text-white">{message.content}</p>
                  </div>
                </div>
              )}
              
              {message.type === 'options' && message.options && (
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {message.options.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option === 'Share a photo' && <ImageIcon className="w-4 h-4 mr-2" />}
                      {option === 'Write a note' && <FileText className="w-4 h-4 mr-2" />}
                      {option}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        {step !== 'confirm' && (
          <div className="p-4 border-t border-border bg-card">
            {step === 'photo' && !photo && (
              <button
                onClick={handlePhotoUpload}
                className="w-full p-8 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center gap-3 text-muted-foreground"
              >
                <Upload className="w-8 h-8" />
                <span>Tap to upload a photo</span>
              </button>
            )}

            {(step === 'note' || (step === 'photo' && photo)) && (
              <div className="space-y-3">
                {photo && (
                  <div className="relative inline-block">
                    <img
                      src={photo}
                      alt="Uploaded"
                      className="h-24 rounded-xl object-cover"
                    />
                    <button
                      onClick={() => setPhoto(null)}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div className="flex items-end gap-2">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write your memory..."
                    className="flex-1 h-20 p-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!note.trim() && !photo}
                    className="rounded-xl h-12"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation */}
        {step === 'confirm' && (
          <div className="p-4 border-t border-border bg-card">
            <Link href={`/remember/${slug}`}>
              <Button className="w-full rounded-xl" style={{ backgroundColor: accentColor }}>
                View Memory
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  )
}
