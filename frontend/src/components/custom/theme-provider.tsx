import { createContext, useContext, useEffect, useState, useMemo } from "react"
import type { ThemeString, ModeString } from "@/lib/types"


type ThemeProviderProps = {
  readonly children: React.ReactNode
  readonly defaultTheme?: ThemeString
  readonly defaultMode?: ModeString
  readonly storageKey?: string
}

type ThemeProviderState = {
  readonly theme: ThemeString
  readonly mode: ModeString
  readonly setTheme: (theme: ThemeString) => void
  readonly setMode: (mode: ModeString) => void
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

  const [theme, setThemeState] = useState<ThemeString>(
    () => (localStorage.getItem(themeKey) as ThemeString) || defaultTheme
  )

  const [mode, setModeState] = useState<ModeString>(
    () => (localStorage.getItem(modeKey) as ModeString) || defaultMode
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
    setTheme: (t: ThemeString) => setThemeState(t),
    setMode: (m: ModeString) => setModeState(m),
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
