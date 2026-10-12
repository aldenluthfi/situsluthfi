import { useLayoutEffect, useRef } from "react"
import { api } from "@/lib/api"
import type { ContributionLevel } from "@/lib/types"
import { useApi } from "@/hooks/use-api"
import { cn } from "@/lib/utils"

const LEVEL: Record<ContributionLevel, string> = {
  NONE: "bg-muted",
  FIRST_QUARTILE: "bg-primary-700/25",
  SECOND_QUARTILE: "bg-primary-700/50",
  THIRD_QUARTILE: "bg-primary-700/75",
  FOURTH_QUARTILE: "bg-primary-700",
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

export default function Heatmap() {
  const state = useApi((signal) => api.getContributions(signal))
  const scroller = useRef<HTMLDivElement>(null)

  // On narrow screens the grid scrolls; start at the most recent weeks.
  useLayoutEffect(() => {
    const el = scroller.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [state.status])

  if (state.status === "error") {
    return <p className="border p-5 text-sm text-muted-foreground">couldn't reach github right now.</p>
  }

  const weeks = state.data?.weeks ?? []
  const months = weeks.map((week, i) => {
    const month = Number(week.contributionDays[0]?.date.slice(5, 7)) - 1
    const prev = i > 0 ? Number(weeks[i - 1].contributionDays[0]?.date.slice(5, 7)) - 1 : -1
    // Skip a label squeezed into the first partial column.
    return month !== prev && (i > 0 || week.contributionDays.length > 3) ? MONTHS[month] : null
  })

  return (
    <div className="border p-4 sm:p-6">
      <div ref={scroller} className="overflow-x-auto pb-1">
        <div
          className={cn("grid w-max gap-[3px]", state.status === "loading" && "animate-pulse")}
          style={{ gridTemplateColumns: `repeat(${weeks.length || 53}, 11px)`, gridTemplateRows: "auto repeat(7, 11px)" }}
        >
          {months.map((label, i) =>
            label ? (
              <span key={`m${i}`} className="text-[11px] leading-4 text-muted-foreground" style={{ gridColumn: i + 1, gridRow: 1 }}>
                {label}
              </span>
            ) : null,
          )}
          {state.status === "loading"
            ? Array.from({ length: 53 * 7 }, (_, i) => (
                <span key={i} className="bg-muted" style={{ gridColumn: Math.floor(i / 7) + 1, gridRow: (i % 7) + 2 }} />
              ))
            : weeks.flatMap((week, w) =>
                week.contributionDays.map((day) => (
                  <span
                    key={day.date}
                    title={`${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${day.date}`}
                    className={cn("rounded-[2px]", LEVEL[day.contributionLevel])}
                    style={{ gridColumn: w + 1, gridRow: new Date(day.date).getUTCDay() + 2 }}
                  />
                )),
              )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {state.status === "ready"
            ? `${state.data.totalContributions.toLocaleString("en-US")} contributions in the last year`
            : "counting contributions…"}
        </span>
        <span className="flex items-center gap-1">
          less
          {Object.values(LEVEL).map((cls) => (
            <span key={cls} className={cn("size-[11px] rounded-[2px]", cls)} />
          ))}
          more
        </span>
      </div>
    </div>
  )
}
