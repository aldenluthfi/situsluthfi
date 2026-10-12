import type { Experience } from "@/content/profile"
import { hueVars } from "@/lib/utils"

export default function Timeline({ items }: { items: Experience[] }) {
  return (
    <ol className="relative ml-1.5 space-y-8 border-l pl-6">
      {items.map((item) => (
        <li key={`${item.role}-${item.org}`} className="relative" style={hueVars(item.org)}>
          <span
            aria-hidden
            className="hue absolute top-1.5 -left-[29px] size-2 rounded-full bg-current ring-4 ring-background"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <p className="hue text-sm">
              {item.role} <span className="text-muted-foreground">—</span> {item.org}
            </p>
            <p className="text-xs text-muted-foreground">{item.period}</p>
          </div>
          <p className="mt-1 leading-relaxed">{item.summary}</p>
        </li>
      ))}
    </ol>
  )
}
