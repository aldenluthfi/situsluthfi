import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Markdown from "@/components/markdown"
import { useTitle } from "@/hooks/use-title"
import { api, isAbortError } from "@/lib/api"
import { outline } from "@/lib/outline"
import type { WritingDetail } from "@/lib/types"
import { cn, formatDate, hueVars } from "@/lib/utils"

type Heading = ReturnType<typeof outline>[number]

function useActiveHeading(headings: Heading[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => !!el)
    if (elements.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: "-64px 0px -70% 0px" },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  return active
}

function Toc({ headings, active }: { headings: Heading[]; active: string | null }) {
  return (
    <ul className="space-y-2 border-l text-sm">
      {headings.map((h) => (
        <li key={h.id} className={cn("-ml-px border-l", h.depth > 1 ? "pl-7" : "pl-4", active === h.id ? "border-primary-700" : "border-transparent")}>
          <a
            href={`#${h.id}`}
            className={cn("block transition-colors hover:text-foreground", active === h.id ? "text-primary-700" : "text-muted-foreground")}
          >
            {h.text.toLowerCase()}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function Post() {
  const { slug = "" } = useParams()
  const [writing, setWriting] = useState<WritingDetail | null>(null)
  const [failed, setFailed] = useState(false)
  useTitle(writing?.title)

  useEffect(() => {
    const controller = new AbortController()
    setWriting(null)
    setFailed(false)
    const load = () => api.getWriting(slug, controller.signal).then(setWriting)
    // Show the cached copy right away, then ask the backend to re-pull from
    // Notion and swap in the fresh version (same flow as vI).
    load()
      .catch((error) => {
        if (!isAbortError(error)) setFailed(true)
      })
      .then(() => api.syncWriting(slug, controller.signal))
      .then(load)
      .catch(() => {})
    return () => controller.abort()
  }, [slug])

  const headings = useMemo(() => (writing ? outline(writing.content) : []), [writing])
  const active = useActiveHeading(headings)

  if (failed && !writing) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <span className="text-primary-700">$</span> cat {slug}.md
        </p>
        <p>cat: {slug}.md: no such file</p>
        <Link to="/blog" className="text-sm text-primary-700">← back to blog</Link>
      </div>
    )
  }

  if (!writing) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-24 bg-muted" />
        <div className="h-9 w-3/4 bg-muted" />
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-4 bg-muted" style={{ width: `${70 + ((i * 37) % 30)}%` }} />
        ))}
      </div>
    )
  }

  return (
    <article className="relative">
      {headings.length > 1 && (
        <aside className="absolute top-0 left-full ml-12 hidden h-full w-52 min-[1360px]:block">
          <div className="sticky top-20">
            <p className="mb-4 text-xs tracking-widest text-muted-foreground uppercase">on this page</p>
            <Toc headings={headings} active={active} />
          </div>
        </aside>
      )}

      <header className="space-y-3">
        <p className="flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
          <span className="tabular-nums">{formatDate(writing.createdAt)}</span>
          {writing.tags.map((t) => (
            <Link key={t} to={`/blog?tag=${t.toLowerCase()}`} className="hue text-xs" style={hueVars(t)}>
              #{t.toLowerCase()}
            </Link>
          ))}
        </p>
        <h1 className="text-3xl leading-tight font-bold tracking-tight">{writing.title}</h1>
      </header>

      {headings.length > 1 && (
        <details className="mt-8 border px-4 py-3 text-sm min-[1360px]:hidden">
          <summary className="cursor-pointer text-muted-foreground">on this page</summary>
          <div className="mt-4">
            <Toc headings={headings} active={active} />
          </div>
        </details>
      )}

      <div className="mt-8">
        <Markdown content={writing.content} />
      </div>

      <footer className="mt-16 flex justify-between border-t pt-6 text-sm text-muted-foreground">
        <Link to="/blog" className="transition-colors hover:text-primary-700">← all writings</Link>
        <span>updated {formatDate(writing.lastUpdated)}</span>
      </footer>
    </article>
  )
}
