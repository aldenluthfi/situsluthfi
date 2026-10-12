import Inline from "@/components/inline"
import type { ResumeEntry } from "@/lib/resume"

export default function Timeline({ items }: { items: ResumeEntry[] }) {
  return (
    <ol className="relative ml-1.5 space-y-8 border-l pl-6">
      {items.map((item) => (
        <li key={`${item.title}-${item.org}-${item.period}`} className="relative">
          <span
            aria-hidden
            className="absolute top-1.5 -left-[29px] size-2 rounded-full bg-primary-700 ring-4 ring-background"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <p className="text-sm text-primary-700">
              {item.title} <span className="text-muted-foreground">—</span> {item.org}
            </p>
            <p className="text-xs text-muted-foreground">{item.period}</p>
          </div>
          {item.points.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-muted-foreground">
              {item.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="text-primary-700/60">–</span>
                  <span><Inline text={point} /></span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  )
}
