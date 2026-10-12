import viHome from "@/assets/archive/vI/home.webp"
import viProjects from "@/assets/archive/vI/home-projects.webp"
import viWriting from "@/assets/archive/vI/writing.webp"
import viWritings from "@/assets/archive/vI/writings.webp"

export type Version = {
  id: string
  year: number
  /** Where the version can be opened; null for the version you're on. */
  href: string | null
  source: string
  shots: { src: string; caption: string }[]
}

export const versions: Version[] = [
  {
    id: "vII",
    year: 2027,
    href: null,
    source: "https://github.com/aldenluthfi/situsluthfi/tree/main/frontend",
    shots: [],
  },
  {
    id: "vI",
    year: 2026,
    href: "/archive/vI/",
    source: "https://github.com/aldenluthfi/situsluthfi/tree/main/archive/v1",
    shots: [
      { src: viHome, caption: "home" },
      { src: viProjects, caption: "projects" },
      { src: viWritings, caption: "writings" },
      { src: viWriting, caption: "writing" },
    ],
  },
]
