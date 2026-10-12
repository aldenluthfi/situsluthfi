import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import FilterBar from "@/components/filter-bar"
import { useTitle } from "@/hooks/use-title"
import { api, isAbortError } from "@/lib/api"
import type { WritingObject } from "@/lib/types"
import { formatDate } from "@/lib/utils"

export default function Writings() {
  useTitle("writings")
  const [results, setResults] = useState<WritingObject[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const load = () => api.getWritings(controller.signal).then((page) => setResults(page.results))
    // Show what the database has now, then have the backend re-pull from Notion
    // (adding new writings, dropping ones tagged Unpublished) and refresh the list.
    load().catch((error) => {
      if (!isAbortError(error)) setFailed(true)
    })
    api.syncWritings(controller.signal).then(load).catch(() => {})
    return () => controller.abort()
  }, [])
  const [params, setParams] = useSearchParams()
  const tag = params.get("tag")

  const writings = useMemo(
    () => [...(results ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [results],
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

      {failed && !results ? (
        <p className="text-sm text-muted-foreground">couldn't load writings.</p>
      ) : (
        <ul className="divide-y">
          {!results
            ? Array.from({ length: 6 }, (_, i) => (
                <li key={i} className="py-4">
                  <div className="h-5 w-3/4 animate-pulse bg-muted" />
                </li>
              ))
            : shown.map((w) => (
                <li key={w.id}>
                  <Link to={`/writings/${w.slug}`} className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="shrink-0 text-sm text-muted-foreground tabular-nums">{formatDate(w.createdAt)}</span>
                    <span className="font-medium transition-colors group-hover:text-primary-700">{w.title}</span>
                    <span className="flex gap-2 text-xs sm:ml-auto sm:shrink-0">
                      {w.tags.map((t) => (
                        <span key={t} className="text-muted-foreground">
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
