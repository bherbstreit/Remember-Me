import type { ReactNode, Metadata } from 'react'
import { profiles } from '@/lib/mock-data'

export function generateStaticParams() {
  return profiles.map(profile => ({ slug: profile.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const profile = profiles.find(p => p.slug === slug)

  if (!profile) {
    return {
      title: 'Profile Not Found',
      description: 'This memorial profile could not be found.',
    }
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const profileUrl = `https://bherbstreit.github.io${basePath}/remember/${slug}/`

  return {
    title: `${profile.name} — Remember Me`,
    description: `Celebrate the life of ${profile.name} (${profile.birthYear}–${profile.deathYear}). View their life story, memories, and contribute your own.`,
    openGraph: {
      title: profile.name,
      description: `Join ${profile.contributorCount} people honoring ${profile.name}. Share memories and celebrate their life.`,
      url: profileUrl,
      siteName: 'Remember Me',
      images: [
        {
          url: profile.profilePhoto,
          width: 400,
          height: 400,
          alt: profile.name,
        },
      ],
      type: 'website',
    },
  }
}

export default function RememberProfileLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
