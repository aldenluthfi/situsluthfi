import { Fragment } from "react"
import { cn } from "@/lib/utils"

/** `all / foo / bar` toggle row. `null` selects "all". */
export default function FilterBar({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string | null
  onChange: (value: string | null) => void
}) {
  const items: (string | null)[] = [null, ...options]
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      {items.map((item, i) => (
        <Fragment key={item ?? "all"}>
          {i > 0 && <span className="text-border">/</span>}
          <button
            type="button"
            onClick={() => onChange(item)}
            aria-pressed={value === item}
            className={cn(
              "transition-colors hover:text-foreground",
              value === item ? "text-primary-700" : "text-muted-foreground",
            )}
          >
            {item?.toLowerCase() ?? "all"}
          </button>
        </Fragment>
      ))}
    </div>
  )
}
