import { useEffect, useMemo, useState, type ReactNode } from "react"
import { applyTheme, hueAt, readMode, ThemeContext, writeMode, zonedNow, type Mode } from "@/lib/theme"

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(readMode)
  const [now, setNow] = useState(() => zonedNow())
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"))

  useEffect(() => {
    setDark(applyTheme(mode, now))
  }, [mode, now])

  useEffect(() => {
    // Tick on the minute boundary so the clock and the hue change together.
    let interval: number | undefined
    const tick = () => setNow(zonedNow())
    const timeout = window.setTimeout(() => {
      tick()
      interval = window.setInterval(tick, 60_000)
    }, 60_000 - (Date.now() % 60_000))
    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [])

  const value = useMemo(
    () => ({
      mode,
      setMode: (next: Mode) => {
        writeMode(next)
        setModeState(next)
      },
      hue: hueAt(now),
      dark,
      now,
    }),
    [mode, now, dark],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
