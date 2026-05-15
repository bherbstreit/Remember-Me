'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Memory, MediaItem, Profile, profiles as initialProfiles } from './mock-data'

interface MemoryContextType {
  profiles: Profile[]
  addMemory: (profileId: string, memory: Omit<Memory, 'id' | 'reactions' | 'comments'>) => void
  getProfile: (slug: string) => Profile | undefined
  isGeneratingStory: boolean
  setIsGeneratingStory: (value: boolean) => void
  updateLifeStory: (profileId: string, story: string) => void
  streamingStory: string
  setStreamingStory: (story: string) => void
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined)

export function MemoryProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)
  const [isGeneratingStory, setIsGeneratingStory] = useState(false)
  const [streamingStory, setStreamingStory] = useState('')

  const addMemory = useCallback((profileId: string, memoryData: Omit<Memory, 'id' | 'reactions' | 'comments'>) => {
    const newMemory: Memory = {
      ...memoryData,
      id: `mem-${Date.now()}`,
      reactions: { heart: 0, candle: 0, hug: 0 },
      comments: 0,
    }

    setProfiles(prev => prev.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          memories: [newMemory, ...profile.memories],
        }
      }
      return profile
    }))

    return newMemory.id
  }, [])

  const getProfile = useCallback((slug: string) => {
    return profiles.find(p => p.slug === slug)
  }, [profiles])

  const updateLifeStory = useCallback((profileId: string, story: string) => {
    setProfiles(prev => prev.map(profile => {
      if (profile.id === profileId) {
        return { ...profile, lifeStory: story }
      }
      return profile
    }))
  }, [])

  return (
    <MemoryContext.Provider
      value={{
        profiles,
        addMemory,
        getProfile,
        isGeneratingStory,
        setIsGeneratingStory,
        updateLifeStory,
        streamingStory,
        setStreamingStory,
      }}
    >
      {children}
    </MemoryContext.Provider>
  )
}

export function useMemoryContext() {
  const context = useContext(MemoryContext)
  if (context === undefined) {
    throw new Error('useMemoryContext must be used within a MemoryProvider')
  }
  return context
}
