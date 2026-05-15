import type { MediaItem } from './mock-data'

export interface LifeStoryFallbackPayload {
  personName: string
  memories: Array<{
    authorName: string
    text: string
    photo?: string
    media?: MediaItem[]
  }>
  motifs: string[]
  existingStory?: string
}

export function generateLocalLifeStory({ personName, memories, motifs, existingStory }: LifeStoryFallbackPayload) {
  const memoryHighlights = memories.slice(0, 3).map((memory, index) => {
    const title = index === 0 ? 'First' : index === 1 ? 'Next' : 'Then'
    return `${title}, ${memory.authorName} remembered: “${memory.text}”`
  }).join(' ')

  const motifText = motifs.length > 0
    ? `They were remembered for ${motifs.slice(0, 3).join(', ')}.`
    : 'Their loved ones shared many memories of their life and legacy.'

  const existingStoryText = existingStory
    ? ` Previous notes about ${personName} are preserved for context.`
    : ''

  return `In remembrance of ${personName}, the community honors a life woven together from shared memories. ${memoryHighlights} ${motifText}${existingStoryText}`
}
