import { useEffect, useRef } from "react"
import { profile, tldr } from "@/content/profile"
import type { RepositoryObject } from "@/lib/types"
import { primaryLanguage } from "@/lib/utils"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      {children}
    </div>
  )
}

export default function TldrDialog({
  open,
  onClose,
  repos,
}: {
  open: boolean
  onClose: () => void
  repos: RepositoryObject[] | undefined
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const latest = repos && [...repos].sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]
  const notable = repos && [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 2)

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto w-[min(32rem,calc(100vw-2rem))] border bg-card p-0 text-card-foreground backdrop:bg-background/70 backdrop:backdrop-blur-sm"
    >
      <div className="space-y-1 border-b p-5">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary-700">$</span> whoami
        </p>
        <p className="text-lg font-semibold">{profile.name}</p>
        <p className="text-sm text-muted-foreground">
          {profile.study} · {profile.current.label} @ {profile.current.at}
        </p>
      </div>
      <div className="space-y-4 p-5 text-sm">
        {latest && (
          <Row label="latest push">
            <p className="line-clamp-2">
              <span className="text-primary-700">▸</span>{" "}
              <a href={latest.html_url} target="_blank" rel="noreferrer" className="hover:text-primary-700">
                {latest.name}
              </a>{" "}
              <span className="text-muted-foreground">
                ({primaryLanguage(latest.languages)?.toLowerCase()}) {latest.description && `— ${latest.description}`}
              </span>
            </p>
          </Row>
        )}
        {notable && notable.length > 0 && (
          <Row label="notable">
            {notable.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-baseline justify-between gap-4 hover:text-primary-700"
              >
                <span className="truncate">
                  {repo.name} <span className="text-muted-foreground">{repo.description}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">★ {repo.stargazers_count}</span>
              </a>
            ))}
          </Row>
        )}
        {tldr.learning && (
          <Row label="learning">
            <p>{tldr.learning}</p>
          </Row>
        )}
        {tldr.reading && (
          <Row label="reading">
            <p>{tldr.reading}</p>
          </Row>
        )}
      </div>
      <div className="flex gap-2 border-t p-5 text-sm">
        <a href={`mailto:${profile.email}`} className="border px-3 py-1 text-muted-foreground transition-colors hover:border-primary-700 hover:text-primary-700">
          email
        </a>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="ml-auto border px-3 py-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          close
        </button>
      </div>
    </dialog>
  )
}
