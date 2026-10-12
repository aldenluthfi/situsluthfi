export type WritingObject = {
  id: string
  title: string
  slug: string
  tags: string[]
  createdAt: string
  lastUpdated: string
}

export type WritingDetail = WritingObject & { content: string }

export type RepositoryObject = {
  id: number
  name: string
  description: string | null
  languages: Record<string, number>
  stargazers_count: number
  forks_count: number
  topics: string[]
  created_at: string
  updated_at: string
  html_url: string
  cover_light_url?: string
  cover_dark_url?: string
}

export type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE"

export type ContributionDay = {
  date: string
  contributionCount: number
  contributionLevel: ContributionLevel
}

export type ContributionCalendar = {
  totalContributions: number
  weeks: { contributionDays: ContributionDay[] }[]
}

export const THEME_COLORS = [
  "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal",
  "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose",
] as const

export type ThemeString = (typeof THEME_COLORS)[number]
