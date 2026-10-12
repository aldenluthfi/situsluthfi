import { createContext, useContext } from "react"
import { THEME_COLORS, type ThemeString } from "@/lib/types"

// Carried over from vI: the accent walks through all 17 hues every 12 hours
// (06:00 → 18:00 and again 18:00 → 06:00), and the page goes dark from 18:00
// to 06:00, both on Jakarta time. Keep in sync with the inline script in
// index.html, which applies the same rule before first paint.

export const TIMEZONE = "Asia/Jakarta"
export const TIMEZONE_LABEL = "WIB"
export const MODE_KEY = "vii-mode"

export type Mode = "auto" | "light" | "dark"

export function zonedNow(date = new Date()) {
  return new Date(date.toLocaleString("en-US", { timeZone: TIMEZONE }))
}

export function hueAt(time: Date): ThemeString {
  const hour = (((time.getHours() - 6) % 12) + 12) % 12
  const index = Math.floor(((hour * 60 + time.getMinutes()) / 720) * THEME_COLORS.length)
  return THEME_COLORS[Math.min(index, THEME_COLORS.length - 1)]
}

export function darkAt(time: Date) {
  return time.getHours() >= 18 || time.getHours() < 6
}

export function readMode(): Mode {
  try {
    const stored = localStorage.getItem(MODE_KEY)
    return stored === "light" || stored === "dark" ? stored : "auto"
  } catch {
    return "auto"
  }
}

export function writeMode(mode: Mode) {
  try {
    if (mode === "auto") localStorage.removeItem(MODE_KEY)
    else localStorage.setItem(MODE_KEY, mode)
  } catch {
    // storage unavailable: the choice just won't persist
  }
}

export function applyTheme(mode: Mode, time: Date) {
  const dark = mode === "auto" ? darkAt(time) : mode === "dark"
  const root = document.documentElement
  root.dataset.theme = hueAt(time)
  root.classList.toggle("dark", dark)
  root.classList.toggle("light", !dark)
  root.style.colorScheme = dark ? "dark" : "light"
  return dark
}

export type ThemeState = {
  mode: Mode
  setMode: (mode: Mode) => void
  hue: ThemeString
  dark: boolean
  now: Date
}

export const ThemeContext = createContext<ThemeState | null>(null)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
