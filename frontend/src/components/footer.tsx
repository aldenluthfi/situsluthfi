import { TIMEZONE_LABEL, useTheme, type Mode } from "@/lib/theme"
import { cn } from "@/lib/utils"

const MODES: Mode[] = ["auto", "light", "dark"]

export default function Footer() {
  const { mode, setMode, hue, now } = useTheme()
  const time = now.toTimeString().slice(0, 5)

  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto flex w-full max-w-[53rem] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 text-xs text-muted-foreground sm:px-6">
        <p title="the accent hue follows the clock in jakarta">
          {time} {TIMEZONE_LABEL} <span className="text-border">·</span>{" "}
          <span className="text-primary-700">{hue}</span>
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
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="transition-colors hover:text-foreground"
        >
          top ↑
        </button>
      </div>
    </footer>
  )
}
