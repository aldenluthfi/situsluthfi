import type { CSSProperties } from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { THEME_COLORS } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** ISO calendar date, e.g. 2026-10-12. */
export function formatDate(date: string) {
  return new Date(date).toISOString().slice(0, 10)
}

/** Month + year, e.g. jul 2025. */
export function formatMonth(date: string) {
  return new Date(date)
    .toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    .toLowerCase()
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
}

/** Stable per-label hue for the `hue` utility (tags, languages, timeline dots). */
export function hueVars(label: string): CSSProperties {
  let hash = 0
  for (const char of label.toLowerCase()) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  const hue = THEME_COLORS[hash % THEME_COLORS.length]
  return {
    "--hue-light": `var(--color-${hue}-700)`,
    "--hue-dark": `var(--color-${hue}-300)`,
  } as CSSProperties
}

export function primaryLanguage(languages: Record<string, number>) {
  return Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0]
}
