import rawProjects from './projects.json'

export type ProjectCategory =
  | 'Branding'
  | 'Web Design'
  | 'Development'
  | 'Campaigns'
  | 'Packaging'
  | 'Digital Experiences'

export interface Project {
  title: string
  slug: string
  categories: ProjectCategory[]
  thumbnail: string
  heroImage: string
  galleryImages: string[]
  shortDescription: string
  challenge: string
  approach: string
  result: string
  services: string[]
  technologies: string[]
  featured: boolean
  externalLink?: string
  behanceLink?: string
  /** Explicit toggle for the "View on Behance" button — independent of
   *  whether behanceLink happens to be filled in, so a project can have a
   *  link on file without it being shown. */
  showBehance: boolean
}

export const projects: Project[] = rawProjects as Project[]

export const categories: ProjectCategory[] = [
  'Branding',
  'Web Design',
  'Development',
  'Campaigns',
  'Packaging',
  'Digital Experiences'
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}

export function getAdjacentProject(slug: string, direction: 1 | -1): Project {
  const idx = projects.findIndex((p) => p.slug === slug)
  const nextIdx = (idx + direction + projects.length) % projects.length
  return projects[nextIdx]
}
