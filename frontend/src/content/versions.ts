import viDark from "@/assets/archive/vI/dark.webp"
import viLight from "@/assets/archive/vI/light.webp"
import viiDark from "@/assets/archive/vII/dark.webp"
import viiLight from "@/assets/archive/vII/light.webp"

export type Version = {
  id: string
  year: number
  /** Where the version is served. Archived builds live outside this app. */
  href: string
  /** Home page in each mode, captured with the yellow accent. */
  shots: { light: string; dark: string }
}

/** Newest first. */
export const versions: Version[] = [
  { id: "vII", year: 2027, href: "/", shots: { light: viiLight, dark: viiDark } },
  { id: "vI", year: 2026, href: "/archive/vI/", shots: { light: viLight, dark: viDark } },
]
