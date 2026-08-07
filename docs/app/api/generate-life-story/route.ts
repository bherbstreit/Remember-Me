import { GoogleGenerativeAI } from '@google/generative-ai'

interface MediaData {
  id: string
  type: string
  url: string
  caption?: string
}

interface MemoryData {
  authorName: string
  text: string
  photo?: string
  media?: MediaData[]
}

export async function POST(req: Request) {
  const { personName, memories, motifs, existingStory } = await req.json()

  // Get API key from environment
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  // Collect all photos with context
  const photoReferences: { url: string; context: string; author: string }[] = []

  // Format memories for the prompt
  const memoriesText = memories.map((m: MemoryData, index: number) => {
    let memoryEntry = `- ${m.authorName} shared: "${m.text}"`

    // Track photos from legacy photo field
    if (m.photo) {
      photoReferences.push({
        url: m.photo,
        context: m.text,
        author: m.authorName
      })
      memoryEntry += ` [PHOTO_REF_${photoReferences.length - 1}]`
    }

    // Track photos from media array
    if (m.media && m.media.length > 0) {
      m.media.forEach((media: MediaData) => {
        if (media.type === 'photo') {
          photoReferences.push({
            url: media.url,
            context: media.caption || m.text,
            author: m.authorName
          })
          memoryEntry += ` [PHOTO_REF_${photoReferences.length - 1}]`
        } else {
          memoryEntry += ` [${media.type.toUpperCase()}${media.caption ? `: ${media.caption}` : ''}]`
        }
      })
    }

    return memoryEntry
  }).join('\n')

  // Format motifs
  const motifsText = motifs.length > 0
    ? `Their interests and themes: ${motifs.join(', ')}.`
    : ''

  const systemPrompt = `You are a compassionate biographer creating a memorial life story. Your role is to weave together community-shared memories into a cohesive, warm, and respectful narrative about the deceased.

Guidelines:
- Write in third person
- Use a warm, respectful, and celebratory tone
- Incorporate specific details from memories to make the story personal
- When a memory includes [PHOTO_REF_X], include that exact marker in your narrative where the photo would contextually fit, like: "Those summer days were full of joy [PHOTO_REF_0], captured in the laughter of family gatherings."
- Reference video, voice recordings, and music naturally (e.g., "as heard in voice recordings from loved ones")
- Include the person's interests and themes naturally
- Create 3-5 paragraphs that flow naturally
- Honor both the joyful moments and the depth of the person's character
- Make the story feel alive with specific anecdotes and personality traits
- Keep [PHOTO_REF_X] markers on their own line for easy parsing`

  const userPrompt = `Create an updated life story for ${personName}.

${motifsText}

Community-shared memories:
${memoriesText}

${existingStory ? `Previous life story (for reference and continuity):\n${existingStory}` : ''}

Write a beautiful, cohesive narrative biography that incorporates these memories. Include [PHOTO_REF_X] markers where photos contextually belong in the narrative. The story should celebrate who ${personName} was and the impact they had on others.`

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

    const result = await model.generateContentStream([
      { text: systemPrompt },
      { text: userPrompt }
    ])

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text()
            if (chunkText) {
              controller.enqueue(new TextEncoder().encode(chunkText))
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      }
    })

    // Create response with photo references in header
    const headers = new Headers()
    headers.set('Content-Type', 'text/plain; charset=utf-8')
    headers.set('X-Photo-References', JSON.stringify(photoReferences))

    return new Response(stream, { headers })
  } catch (error) {
    console.error('AI generation error:', error)

    // Return a fallback response with a message
    const fallbackStory = `${personName} touched the lives of many. Their story is being written by those who loved them most.

${memories.length > 0 ? `${memories.length === 1 ? 'One memory has' : `${memories.length} memories have`} been shared by family and friends, each adding a beautiful chapter to the tapestry of their life.` : 'Memories shared by loved ones will appear here, weaving together the story of a life well lived.'}

${motifsText ? `Known for their love of ${motifs.join(', ').toLowerCase()}, ${personName.split(' ')[0]} leaves behind a legacy of warmth and connection.` : ''}

To enable AI-generated stories, please configure a valid Gemini API key in your environment variables and ensure your Google AI account is active.`

    return new Response(fallbackStory, {
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}
