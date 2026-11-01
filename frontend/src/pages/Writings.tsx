import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import FilterBar from "@/components/filter-bar"
import { Marked } from "@/components/search-dialog"
import { useTitle } from "@/hooks/use-title"
import { api, isAbortError } from "@/lib/api"
import type { WritingObject } from "@/lib/types"
import { cn, formatDate } from "@/lib/utils"

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
  const [query, setQuery] = useState("")
  // slug → best snippet, in relevance order; null while not searching.
  const [matches, setMatches] = useState<Map<string, string> | null>(null)

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setMatches(null)
      return
    }
    const controller = new AbortController()
    const timer = setTimeout(() => {
      api
        .search(q, ["writings"], 1, 50, controller.signal)
        .then((page) =>
          setMatches(new Map(page.results.map((r) => [r.slug ?? "", (r.highlight?.content ?? []).join(" … ")]))),
        )
        .catch(() => {})
    }, 200)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  const writings = useMemo(
    () => [...(results ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [results],
  )
  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const w of writings) for (const t of w.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t)
  }, [writings])
  const tagged = tag ? writings.filter((w) => w.tags.some((t) => t.toLowerCase() === tag)) : writings
  const shown = matches
    ? [...matches.keys()].flatMap((slug) => tagged.filter((w) => w.slug === slug))
    : tagged

  return (
    <div className="space-y-8">
      <label className="flex items-center gap-2 border-b pb-2 text-sm">
        <span className="shrink-0 text-muted-foreground">
          <span className="text-primary-700">$</span> grep -ri
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="inside every writing"
          aria-label="search writings"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60"
        />
      </label>
      <FilterBar
        options={tags}
        value={tags.find((t) => t.toLowerCase() === tag) ?? null}
        onChange={(t) => setParams(t ? { tag: t.toLowerCase() } : {}, { replace: true })}
      />

      {failed && !results ? (
        <p className="text-sm text-muted-foreground">couldn't load writings.</p>
      ) : matches && shown.length === 0 ? (
        <p className="text-sm text-muted-foreground">no writings match.</p>
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
                  <Link
                    to={`/writings/${w.slug}`}
                    className={cn("group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-4", matches?.get(w.slug) && "sm:flex-wrap")}
                  >
                    <span className="shrink-0 text-sm text-muted-foreground tabular-nums">{formatDate(w.createdAt)}</span>
                    <span className="font-medium transition-colors group-hover:text-primary-700">{w.title}</span>
                    <span className="flex gap-2 text-xs sm:ml-auto sm:shrink-0">
                      {w.tags.map((t) => (
                        <span key={t} className="text-muted-foreground">
                          {t.toLowerCase()}
                        </span>
                      ))}
                    </span>
                    {matches?.get(w.slug) && (
                      <span className="line-clamp-2 basis-full text-xs leading-relaxed text-muted-foreground sm:order-last">
                        <Marked text={matches.get(w.slug)!} />
                      </span>
                    )}
                  </Link>
                </li>
              ))}
        </ul>
      )}
    </div>
  )
}
