import { useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import FilterBar from "@/components/filter-bar"
import { useApi } from "@/hooks/use-api"
import { useTitle } from "@/hooks/use-title"
import { api } from "@/lib/api"
import { formatDate, hueVars } from "@/lib/utils"

export default function Blog() {
  useTitle("blog")
  const state = useApi((signal) => api.getWritings(signal))
  const [params, setParams] = useSearchParams()
  const tag = params.get("tag")

  const writings = useMemo(
    () => [...(state.data?.results ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.data],
  )
  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const w of writings) for (const t of w.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t)
  }, [writings])
  const shown = tag ? writings.filter((w) => w.tags.some((t) => t.toLowerCase() === tag)) : writings

  return (
    <div className="space-y-8">
      <FilterBar
        options={tags}
        value={tags.find((t) => t.toLowerCase() === tag) ?? null}
        onChange={(t) => setParams(t ? { tag: t.toLowerCase() } : {}, { replace: true })}
      />

      {state.status === "error" ? (
        <p className="text-sm text-muted-foreground">couldn't load writings.</p>
      ) : (
        <ul className="divide-y">
          {state.status === "loading"
            ? Array.from({ length: 6 }, (_, i) => (
                <li key={i} className="py-4">
                  <div className="h-5 w-3/4 animate-pulse bg-muted" />
                </li>
              ))
            : shown.map((w) => (
                <li key={w.id}>
                  <Link to={`/blog/${w.slug}`} className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="shrink-0 text-sm text-muted-foreground tabular-nums">{formatDate(w.createdAt)}</span>
                    <span className="font-medium transition-colors group-hover:text-primary-700">{w.title}</span>
                    <span className="flex gap-2 text-xs sm:ml-auto sm:shrink-0">
                      {w.tags.map((t) => (
                        <span key={t} className="hue" style={hueVars(t)}>
                          {t.toLowerCase()}
                        </span>
                      ))}
                    </span>
                  </Link>
                </li>
              ))}
        </ul>
      )}
    </div>
  )
}
