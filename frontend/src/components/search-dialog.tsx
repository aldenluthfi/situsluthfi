import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import FilterBar from "@/components/filter-bar"
import { api, isAbortError, type SearchKind } from "@/lib/api"
import type { SearchResult } from "@/lib/types"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 5
/** Dialog filter label → `/search?filter=` value. */
const SCOPES: Record<string, SearchKind> = { writings: "writings", projects: "repos" }

/** Elasticsearch fragments wrap hits in <mark>; render those as elements, everything else as text. */
export function Marked({ text }: { text: string }) {
  return text.split(/<\/?mark>/).map((part, i) =>
    i % 2 ? (
      <mark key={i} className="bg-primary-700/15 text-primary-700">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

type Hit = { key: string; kind: "writing" | "repository"; title: string; snippet: string | null; go: () => void }

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const navigate = useNavigate()

  const [query, setQuery] = useState("")
  const [scope, setScope] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [results, setResults] = useState<SearchResult[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      input.current?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      setStatus("idle")
      return
    }
    const controller = new AbortController()
    setStatus("loading")
    const timer = setTimeout(() => {
      api
        .search(q, scope ? [SCOPES[scope]] : [], page, PAGE_SIZE, controller.signal)
        .then((data) => {
          setResults((previous) => (page === 1 ? data.results : [...previous, ...data.results]))
          setTotalPages(data.totalPages)
          setStatus("ready")
        })
        .catch((error) => {
          if (!isAbortError(error)) setStatus("error")
        })
    }, page === 1 ? 200 : 0)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, scope, page])

  const restart = (next: { query?: string; scope?: string | null }) => {
    if (next.query !== undefined) setQuery(next.query)
    if (next.scope !== undefined) setScope(next.scope)
    setPage(1)
    setSelected(0)
  }

  const close = () => {
    onClose()
    restart({ query: "" })
  }

  const hits: Hit[] = results.map((r) => {
    const kind = r._type
    const h = r.highlight ?? {}
    const snippet = [...(h.content ?? []), ...(h.description ?? []), ...(h.readme ?? [])].join(" … ")
    return {
      key: `${kind}-${r.id}`,
      kind,
      title: h.title?.[0] ?? h.name?.[0] ?? r.title ?? r.name ?? "",
      snippet: snippet || null,
      go: () => {
        close()
        if (kind === "writing") navigate(`/writings/${r.slug}`)
        else if (r.html_url) window.open(r.html_url, "_blank", "noreferrer")
      },
    }
  })
  const more = status === "ready" && page < totalPages
  const count = hits.length + (more ? 1 : 0)

  const activate = (index: number) => {
    if (index < hits.length) hits[index].go()
    else if (more) setPage((p) => p + 1)
  }

  useEffect(() => {
    list.current?.querySelector(`[data-index="${selected}"]`)?.scrollIntoView({ block: "nearest" })
  }, [selected])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (count === 0) return
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      const step = e.key === "ArrowDown" ? 1 : -1
      setSelected((s) => (s + step + count) % count)
    } else if (e.key === "Enter") {
      e.preventDefault()
      activate(selected)
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(e) => e.target === e.currentTarget && close()}
      aria-label="search"
      className="mx-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] border bg-card p-0 text-card-foreground backdrop:bg-background/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 border-b px-4 py-3 text-sm">
        <span className="shrink-0 text-muted-foreground">
          <span className="text-primary-700">$</span> grep -ri
        </span>
        <input
          ref={input}
          value={query}
          onChange={(e) => restart({ query: e.target.value })}
          onKeyDown={onKeyDown}
          placeholder="anything"
          aria-label="search query"
          aria-controls="search-results"
          aria-activedescendant={count > 0 ? `search-hit-${selected}` : undefined}
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60"
        />
      </div>
      <div className="flex items-center justify-between gap-4 border-b px-4 py-2">
        <FilterBar
          options={Object.keys(SCOPES)}
          value={scope}
          onChange={(s) => restart({ scope: s })}
        />
        <kbd className="hidden text-xs text-muted-foreground sm:block">esc</kbd>
      </div>

      <div className="max-h-[55vh] overflow-y-auto text-sm" aria-live="polite">
        {status === "idle" && <p className="px-4 py-6 text-muted-foreground">search writings and projects.</p>}
        {status === "loading" && hits.length === 0 && <p className="animate-pulse px-4 py-6 text-muted-foreground">searching…</p>}
        {status === "error" && <p className="px-4 py-6 text-muted-foreground">couldn't search right now.</p>}
        {status === "ready" && hits.length === 0 && <p className="px-4 py-6 text-muted-foreground">no matches.</p>}
        {hits.length > 0 && (
          <ul ref={list} id="search-results" role="listbox" aria-label="results" className="divide-y">
            {hits.map((hit, i) => (
              <li
                key={hit.key}
                id={`search-hit-${i}`}
                data-index={i}
                role="option"
                aria-selected={selected === i}
                onMouseMove={() => setSelected(i)}
                onClick={() => activate(i)}
                className={cn("cursor-pointer space-y-1 px-4 py-3", selected === i && "bg-primary-700/[0.06]")}
              >
                <p className="flex items-baseline gap-3">
                  <span className="w-16 shrink-0 text-xs text-muted-foreground">{hit.kind === "writing" ? "writing" : "project"}</span>
                  <span className={cn("min-w-0 font-medium", selected === i && "text-primary-700")}>
                    <Marked text={hit.title} />
                    {hit.kind === "repository" && <span className="text-muted-foreground"> ↗</span>}
                  </span>
                </p>
                {hit.snippet && (
                  <p className="line-clamp-2 pl-19 text-xs leading-relaxed text-muted-foreground">
                    <Marked text={hit.snippet} />
                  </p>
                )}
              </li>
            ))}
            {more && (
              <li
                id={`search-hit-${hits.length}`}
                data-index={hits.length}
                role="option"
                aria-selected={selected === hits.length}
                onMouseMove={() => setSelected(hits.length)}
                onClick={() => activate(hits.length)}
                className={cn(
                  "cursor-pointer px-4 py-3 text-muted-foreground",
                  selected === hits.length && "bg-primary-700/[0.06] text-primary-700",
                )}
              >
                more…
              </li>
            )}
          </ul>
        )}
      </div>
    </dialog>
  )
}
