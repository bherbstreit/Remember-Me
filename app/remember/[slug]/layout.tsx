import type { ReactNode } from 'react'
import { profiles } from '@/lib/mock-data'

export function generateStaticParams() {
  return profiles.map(profile => ({ slug: profile.slug }))
}

export const dynamicParams = false

export default function RememberProfileLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
