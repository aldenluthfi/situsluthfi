import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Markdown from "@/components/markdown"
import { useTitle } from "@/hooks/use-title"
import { api, isAbortError } from "@/lib/api"
import { outline } from "@/lib/outline"
import type { WritingDetail } from "@/lib/types"
import { cn, formatDate } from "@/lib/utils"

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

type TocNode = { heading: Heading; children: TocNode[] }

function tree(headings: Heading[]): TocNode[] {
  const roots: TocNode[] = []
  const stack: TocNode[] = []
  for (const heading of headings) {
    const node = { heading, children: [] }
    while (stack.length > 0 && stack[stack.length - 1].heading.depth >= heading.depth) stack.pop()
    ;(stack.length > 0 ? stack[stack.length - 1].children : roots).push(node)
    stack.push(node)
  }
  return roots
}

const contains = (node: TocNode, id: string | null): boolean =>
  node.heading.id === id || node.children.some((child) => contains(child, id))

// Literal class names per level so Tailwind sees them.
const LEVEL = [
  { group: "group/l1", reveal: "group-hover/l1:grid-rows-[1fr]", pad: "pl-4" },
  { group: "group/l2", reveal: "group-hover/l2:grid-rows-[1fr]", pad: "pl-7" },
  { group: "group/l3", reveal: "group-hover/l3:grid-rows-[1fr]", pad: "pl-10" },
]

function TocItem({ node, level, active, expanded }: { node: TocNode; level: number; active: string | null; expanded: boolean }) {
  const { heading, children } = node
  const current = active === heading.id
  const open = expanded || contains(node, active)
  const style = LEVEL[Math.min(level, LEVEL.length - 1)]

  return (
    <li className={style.group}>
      <a
        href={`#${heading.id}`}
        data-toc={heading.id}
        className={cn(
          "-ml-px block border-l py-1 transition-colors hover:text-foreground",
          style.pad,
          current ? "border-primary-700 text-primary-700" : "border-transparent text-muted-foreground",
        )}
      >
        {heading.text.toLowerCase()}
      </a>
      {children.length > 0 && (
        <div className={cn("grid transition-[grid-template-rows] duration-200", open ? "grid-rows-[1fr]" : cn("grid-rows-[0fr]", style.reveal))}>
          <ul className="overflow-hidden">
            {children.map((child) => (
              <TocItem key={child.heading.id} node={child} level={level + 1} active={active} expanded={expanded} />
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}

/**
 * Top-level headings only; each level unfolds while hovered or while the
 * reader is inside it. `expanded` shows everything (touch layouts).
 */
function Toc({ headings, active, expanded = false }: { headings: Heading[]; active: string | null; expanded?: boolean }) {
  const nodes = useMemo(() => tree(headings), [headings])
  return (
    <ul className="border-l text-sm">
      {nodes.map((node) => (
        <TocItem key={node.heading.id} node={node} level={0} active={active} expanded={expanded} />
      ))}
    </ul>
  )
}

export default function Writing() {
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
  const sidebar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = sidebar.current
    const item = active && box?.querySelector<HTMLElement>(`[data-toc="${CSS.escape(active)}"]`)
    if (!box || !item) return
    // Wait for the section to unfold before measuring.
    const timer = window.setTimeout(() => {
      const top = item.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop
      if (top < box.scrollTop || top + item.offsetHeight > box.scrollTop + box.clientHeight) {
        box.scrollTo({ top: top - box.clientHeight / 3, behavior: "smooth" })
      }
    }, 220)
    return () => window.clearTimeout(timer)
  }, [active])

  if (failed && !writing) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <span className="text-primary-700">$</span> cat {slug}.md
        </p>
        <p>cat: {slug}.md: no such file</p>
        <Link to="/writings" className="text-sm text-primary-700">← all writings</Link>
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
          <div ref={sidebar} className="no-scrollbar sticky top-20 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <p className="mb-4 text-xs tracking-widest text-muted-foreground uppercase">on this page</p>
            <Toc headings={headings} active={active} />
          </div>
        </aside>
      )}

      <header className="space-y-3">
        <p className="flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
          <span className="tabular-nums">{formatDate(writing.createdAt)}</span>
          {writing.tags.map((t) => (
            <Link key={t} to={`/writings?tag=${t.toLowerCase()}`} className="text-xs transition-colors hover:text-primary-700">
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
            <Toc headings={headings} active={active} expanded />
          </div>
        </details>
      )}

      <div className="mt-8">
        <Markdown content={writing.content} />
      </div>

      <footer className="mt-16 border-t pt-6 text-sm text-muted-foreground">
        <Link to="/writings" className="transition-colors hover:text-primary-700">← all writings</Link>
      </footer>
    </article>
  )
}
