export type FontOption = 'cormorant' | 'playfair' | 'dancing' | 'eb-garamond'

export type Motif = 
  | 'horses' | 'sunflowers' | 'ocean' | 'mountains' | 'music' 
  | 'books' | 'travel' | 'nature' | 'cooking' | 'sports' 
  | 'art' | 'faith' | 'gardens' | 'basketball'

export type MediaType = 'photo' | 'video' | 'voice' | 'music'

export interface MediaItem {
  id: string
  type: MediaType
  url: string
  thumbnail?: string
  duration?: number // in seconds for audio/video
  caption?: string
}

export interface Memory {
  id: string
  authorName: string
  authorAvatar: string
  timestamp: string
  text: string
  photo?: string
  media?: MediaItem[]
  reactions: {
    heart: number
    candle: number
    hug: number
  }
  comments: number
}

export interface Event {
  id: string
  title: string
  date: string
  location: string
  isVirtual: boolean
}

export interface Profile {
  id: string
  slug: string
  name: string
  birthYear: number
  deathYear: number
  coverPhoto: string
  profilePhoto: string
  organizerName: string
  organizerRelationship: string
  contributorCount: number
  privacy: 'public' | 'family-only' | 'private'
  contributionsOpen: boolean
  accentColor: string
  nameFont: FontOption
  motifs: Motif[]
  lifeStory: string
  memories: Memory[]
  events: Event[]
  galleryPhotos: string[]
  isNew?: boolean
}

export interface Invitation {
  id: string
  profileId: string
  profileName: string
  profilePhoto: string
  inviterName: string
  message: string
}

export interface CurrentUser {
  id: string
  name: string
  firstName: string
  avatar: string
  email: string
}

// Current logged-in user
export const currentUser: CurrentUser = {
  id: 'user-1',
  name: 'Sarah Mitchell',
  firstName: 'Sarah',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  email: 'sarah.mitchell@email.com',
}

// Pending invitations
export const pendingInvitations: Invitation[] = [
  {
    id: 'inv-1',
    profileId: 'profile-3',
    profileName: 'Robert James Wilson',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    inviterName: 'Emily Wilson',
    message: 'You have been invited to contribute to Robert James Wilson\'s memorial.',
  },
]

// Profiles data
export const profiles: Profile[] = [
  {
    id: 'profile-1',
    slug: 'deb-marie-coffman',
    name: 'Deb Marie Coffman',
    birthYear: 1956,
    deathYear: 2008,
    coverPhoto: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=400&fit=crop',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    organizerName: 'Shandon Coffman',
    organizerRelationship: 'Daughter',
    contributorCount: 214,
    privacy: 'public',
    contributionsOpen: true,
    accentColor: '#C4789B',
    nameFont: 'cormorant',
    motifs: ['gardens', 'cooking', 'faith'],
    lifeStory: `Deb was known for her big heart and unwavering belief in those around her, always offering kindness and support — even when it came to the family joke about her conviction that microwaves caused cancer. Her generosity of spirit and sense of humor made her a light in the lives of many.

She kept an immaculate garden and believed that feeding people was the highest form of love. Sunday dinners at her table were never optional. The kitchen was always warm, the conversation always lively, and no one ever left hungry — in body or in spirit.

Her roses were the envy of the neighborhood, and she could identify any flower by its bloom. She taught her children that patience was a virtue best learned in the garden, where you plant seeds and trust in what you cannot yet see.

Faith was the foundation of her life. She prayed for everyone she met and believed that every person carried a spark of the divine. Her door was always open, her coffee pot always on, and her heart always ready to listen.`,
    memories: [
      {
        id: 'mem-1',
        authorName: 'Shandon Coffman',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        timestamp: '3 days ago',
        text: 'Horseback riding in the mountains in Aspen, CA. Amazing place to grow up in for a few years!',
        photo: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&h=400&fit=crop',
        reactions: { heart: 31, candle: 8, hug: 6 },
        comments: 3,
      },
      {
        id: 'mem-2',
        authorName: 'Cindy Hanes',
        authorAvatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop',
        timestamp: '1 week ago',
        text: "She once drove four hours to bring me soup when I was sick. Didn't call ahead. Just showed up. That was Deb.",
        reactions: { heart: 44, candle: 12, hug: 19 },
        comments: 7,
      },
      {
        id: 'mem-3',
        authorName: 'Pastor Michael Torres',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        timestamp: '2 weeks ago',
        text: "Deb volunteered at the church kitchen every single Saturday for fifteen years. Rain or shine, she was there at 6 AM with her famous biscuits. She always said the secret ingredient was love, but I'm pretty sure it was also an entire stick of butter.",
        reactions: { heart: 67, candle: 23, hug: 31 },
        comments: 12,
      },
    ],
    events: [
      {
        id: 'evt-1',
        title: 'Annual Garden Memorial Walk',
        date: 'June 8, 2025',
        location: 'Phoenix, AZ',
        isVirtual: false,
      },
      {
        id: 'evt-2',
        title: 'Virtual Candle Lighting',
        date: 'April 6, 2025',
        location: 'Online',
        isVirtual: true,
      },
    ],
    galleryPhotos: [
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518882605630-8996a190b02c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    ],
    isNew: false,
  },
  {
    id: 'profile-2',
    slug: 'marcus-jerome-ellis',
    name: 'Marcus Jerome Ellis',
    birthYear: 1988,
    deathYear: 2023,
    coverPhoto: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    organizerName: 'Darius Ellis',
    organizerRelationship: 'Brother',
    contributorCount: 389,
    privacy: 'public',
    contributionsOpen: true,
    accentColor: '#D4A017',
    nameFont: 'playfair',
    motifs: ['music', 'basketball', 'travel'],
    lifeStory: `Marcus was the kind of person who made every room louder and warmer just by walking in. A self-taught producer, obsessive record collector, and the first to arrive and last to leave any gathering. He had an opinion about everything — your music taste, your sneakers, the best jerk chicken in every city he'd ever visited — and he was usually right.

Music wasn't just a hobby — it was his language. He could hear a song once and tell you who sampled it, when, and why. His studio sessions could last until sunrise, fueled by nothing but passion and way too much coffee. His brother Darius recently found one of his old mixtapes from 2009, with "certified" written on the case in Marcus's handwriting — because he knew it was fire before anyone else did.
[PHOTO_REF_0]

He traveled to 22 countries before he was 30, always came back with a story that nobody fully believed, and always came back with something for everyone. His apartment was a museum of global treasures: masks from Senegal, records from Tokyo, spices from everywhere. He once convinced his entire friend group to take a spontaneous trip to Cartagena with just 48 hours notice — and it became the best week of their lives.
[PHOTO_REF_1]

On the court, he was legendary in his own way. Not the tallest, not the fastest, but somehow always the most memorable. He'd show up to pickup games in dress shoes and still drop 20 points. He played like he lived — fearlessly, joyfully, and with a little too much trash talk.`,
    memories: [
      {
        id: 'mem-4',
        authorName: 'Darius Ellis',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        timestamp: '5 hours ago',
        text: "Found his old mixtape from 2009 in a box today. Track 4 is still the hardest thing I've ever heard. He knew it too — he'd written 'certified' on the case.",
        photo: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=600&h=400&fit=crop',
        reactions: { heart: 88, candle: 41, hug: 33 },
        comments: 14,
      },
      {
        id: 'mem-5',
        authorName: 'Priya Nair',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        timestamp: '2 days ago',
        text: 'He convinced our entire friend group to take a spontaneous trip to Cartagena with 48 hours notice. It was the best week of my life. That was just a Tuesday for Marcus.',
        photo: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=600&h=400&fit=crop',
        reactions: { heart: 102, candle: 29, hug: 57 },
        comments: 21,
      },
      {
        id: 'mem-6',
        authorName: 'TJ Washington',
        authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
        timestamp: '4 days ago',
        text: 'Dude used to show up to pickup games in dress shoes and still drop 20. Rest easy big bro.',
        reactions: { heart: 76, candle: 18, hug: 44 },
        comments: 9,
      },
      {
        id: 'mem-7',
        authorName: 'Angela Thompson',
        authorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
        timestamp: '1 week ago',
        text: "Marcus introduced me to my favorite album of all time. He burned me a CD with 'trust me' written on it in Sharpie. Never told me the artist. Made me figure it out myself. Took me six months. He was right — I love it more because I had to earn it.",
        reactions: { heart: 54, candle: 15, hug: 28 },
        comments: 8,
      },
    ],
    events: [
      {
        id: 'evt-3',
        title: 'Marcus Ellis Memorial Mixtape Night',
        date: 'July 12, 2025',
        location: 'The Owl Bar, Baltimore, MD',
        isVirtual: false,
      },
      {
        id: 'evt-4',
        title: 'Annual 3-on-3 Tournament in His Honor',
        date: 'August 2, 2025',
        location: 'Druid Hill Park, Baltimore, MD',
        isVirtual: false,
      },
    ],
    galleryPhotos: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=400&fit=crop',
    ],
    isNew: true,
  },
]

// Helper function to get font class
export function getFontClass(font: FontOption): string {
  const fontClasses: Record<FontOption, string> = {
    'cormorant': 'font-cormorant',
    'playfair': 'font-playfair',
    'dancing': 'font-dancing',
    'eb-garamond': 'font-eb-garamond',
  }
  return fontClasses[font]
}

// Helper function to get motif icon
export function getMotifIcon(motif: Motif): string {
  const icons: Record<Motif, string> = {
    horses: '🐴',
    sunflowers: '🌻',
    ocean: '🌊',
    mountains: '🏔️',
    music: '🎵',
    books: '📚',
    travel: '✈️',
    nature: '🌿',
    cooking: '🍳',
    sports: '⚽',
    art: '🎨',
    faith: '🙏',
    gardens: '🌸',
    basketball: '🏀',
  }
  return icons[motif]
}

// Grief module lessons
export const griefModules = [
  {
    id: 'grief-1',
    stage: 1,
    title: 'Understanding Denial',
    description: 'Learning to recognize and accept the reality of loss at your own pace.',
    content: 'Denial is often the first response to loss. It helps us pace our grief and slowly absorb the reality of our situation.',
  },
  {
    id: 'grief-2',
    stage: 2,
    title: 'Processing Anger',
    description: 'Exploring the anger that often accompanies grief and finding healthy outlets.',
    content: 'Anger is a natural part of grief. It can be directed at the person who died, at ourselves, or at the world.',
  },
  {
    id: 'grief-3',
    stage: 3,
    title: 'Navigating Bargaining',
    description: 'Understanding the "what ifs" and "if onlys" that come with loss.',
    content: 'Bargaining is our attempt to negotiate our way out of the hurt. We may dwell on what we could have done differently.',
  },
  {
    id: 'grief-4',
    stage: 4,
    title: 'Experiencing Depression',
    description: 'Sitting with sadness and allowing yourself to grieve deeply.',
    content: 'Depression represents the emptiness we feel when we are living in reality and realize the person is gone.',
  },
  {
    id: 'grief-5',
    stage: 5,
    title: 'Finding Acceptance',
    description: 'Learning to live with loss and finding a new normal.',
    content: 'Acceptance does not mean being okay with the loss. It means accepting the reality that our loved one is physically gone.',
  },
]

// Search results for discover page
export const searchResults: Profile[] = profiles

// Font options for profile creation
export const fontOptions: { value: FontOption; label: string; description: string }[] = [
  { value: 'cormorant', label: 'Cormorant Garamond', description: 'Elegant' },
  { value: 'playfair', label: 'Playfair Display', description: 'Bold' },
  { value: 'dancing', label: 'Dancing Script', description: 'Handwritten' },
  { value: 'eb-garamond', label: 'EB Garamond', description: 'Classic' },
]

// Motif options for profile creation
export const motifOptions: { value: Motif; label: string; icon: string }[] = [
  { value: 'horses', label: 'Horses', icon: '🐴' },
  { value: 'sunflowers', label: 'Sunflowers', icon: '🌻' },
  { value: 'ocean', label: 'Ocean', icon: '🌊' },
  { value: 'mountains', label: 'Mountains', icon: '🏔️' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'books', label: 'Books', icon: '📚' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'nature', label: 'Nature', icon: '🌿' },
  { value: 'cooking', label: 'Cooking', icon: '🍳' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'art', label: 'Art', icon: '🎨' },
  { value: 'faith', label: 'Faith', icon: '🙏' },
  { value: 'gardens', label: 'Gardens', icon: '🌸' },
  { value: 'basketball', label: 'Basketball', icon: '🏀' },
]
