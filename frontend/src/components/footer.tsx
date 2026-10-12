import { useEffect, useState } from "react"
import { TIMEZONE_LABEL, useTheme, type Mode } from "@/lib/theme"
import { cn } from "@/lib/utils"

const MODES: Mode[] = ["auto", "light", "dark"]

/** True while the page is taller than the viewport. */
function useScrollable() {
  const [scrollable, setScrollable] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const check = () => setScrollable(root.scrollHeight > root.clientHeight + 1)
    const observer = new ResizeObserver(check)
    observer.observe(document.body)
    window.addEventListener("resize", check)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", check)
    }
  }, [])
  return scrollable
}

export default function Footer() {
  const { mode, setMode, now } = useTheme()
  const time = now.toTimeString().slice(0, 5)
  const scrollable = useScrollable()

  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto flex w-full max-w-[53rem] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 text-xs text-muted-foreground sm:px-6">
        <p>
          {time} {TIMEZONE_LABEL}
        </p>
        <div className="flex items-center gap-2" role="group" aria-label="color mode">
          {MODES.map((m, i) => (
            <span key={m} className="flex items-center gap-2">
              {i > 0 && <span className="text-border">/</span>}
              <button
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={cn("transition-colors hover:text-foreground", mode === m && "text-primary-700")}
              >
                {m}
              </button>
            </span>
          ))}
        </div>
        {/* Hidden (space kept, so the mode toggle stays centered) when there's nothing to scroll. */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={cn("transition-colors hover:text-foreground", !scrollable && "invisible")}
          aria-hidden={!scrollable}
          tabIndex={scrollable ? undefined : -1}
        >
          top ↑
        </button>
      </div>
    </footer>
  )
}
