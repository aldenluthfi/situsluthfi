import viHome from "@/assets/archive/vI/home.webp"
import viiHome from "@/assets/archive/vII/home.webp"

export type Version = {
  id: string
  year: number
  /** Where the version is served. Archived builds live outside this app. */
  href: string
  shot: string
}

/** Newest first. */
export const versions: Version[] = [
  { id: "vII", year: 2027, href: "/", shot: viiHome },
  { id: "vI", year: 2026, href: "/archive/vI/", shot: viHome },
]
