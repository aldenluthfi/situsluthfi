import { createContext, useContext, useEffect, useState, useMemo } from "react"

type Theme =
  | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald"
  | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple"
  | "fuchsia" | "pink" | "rose" | "neutral"
type Mode = "dark" | "light" | "system"

type ThemeProviderProps = {
  readonly children: React.ReactNode
  readonly defaultTheme?: Theme
  readonly defaultMode?: Mode
  readonly storageKey?: string
}

type ThemeProviderState = {
  readonly theme: Theme
  readonly mode: Mode
  readonly setTheme: (theme: Theme) => void
  readonly setMode: (mode: Mode) => void
}

const initialState: ThemeProviderState = {
  theme: "yellow",
  mode: "dark",
  setTheme: () => null,
  setMode: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export default function ThemeProvider({
  children,
  defaultTheme = "yellow",
  defaultMode = "dark",
  storageKey = "vite-ui-theme",
  ...props
}: Readonly<ThemeProviderProps>) {

  const themeKey = `${storageKey}-color`
  const modeKey = `${storageKey}-mode`

  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(themeKey) as Theme) || defaultTheme
  )

  const [mode, setModeState] = useState<Mode>(
    () => (localStorage.getItem(modeKey) as Mode) || defaultMode
  )


  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem(themeKey, theme)
  }, [theme, themeKey])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    let appliedMode = mode
    if (mode === "system") {
      appliedMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }
    root.classList.add(appliedMode)
    localStorage.setItem(modeKey, mode)
  }, [mode, modeKey])

  const value: ThemeProviderState = useMemo(() => ({
    theme,
    mode,
    setTheme: (t: Theme) => setThemeState(t),
    setMode: (m: Mode) => setModeState(m),
  }), [theme, mode])

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
