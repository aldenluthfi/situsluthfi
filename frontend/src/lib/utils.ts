import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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


export function primaryLanguage(languages: Record<string, number>) {
  return Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0]
}
