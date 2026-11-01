import { useEffect, useMemo, useState } from "react"
import FilterBar from "@/components/filter-bar"
import ProjectCard, { ProjectCardSkeleton } from "@/components/project-card"
import { profile } from "@/content/profile"
import { useTitle } from "@/hooks/use-title"
import { api, isAbortError } from "@/lib/api"
import type { RepositoryObject } from "@/lib/types"
import { primaryLanguage } from "@/lib/utils"

export default function Projects() {
  useTitle("projects")
  const [results, setResults] = useState<RepositoryObject[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [language, setLanguage] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const load = () => api.getRepositories(controller.signal).then((data) => setResults(data.repositories))
    // Same as writings: show what the database has, then have the backend
    // re-pull from GitHub (and re-index search) and refresh the grid.
    load().catch((error) => {
      if (!isAbortError(error)) setFailed(true)
    })
    api.syncRepositories(controller.signal).then(load).catch(() => {})
    return () => controller.abort()
  }, [])

  const repos = useMemo(
    () =>
      [...(results ?? [])].sort(
        (a, b) => b.stargazers_count - a.stargazers_count || b.updated_at.localeCompare(a.updated_at),
      ),
    [results],
  )
  const languages = useMemo(
    () => [...new Set(repos.map((r) => primaryLanguage(r.languages)).filter((l): l is string => !!l))].sort(),
    [repos],
  )
  const shown = language ? repos.filter((r) => primaryLanguage(r.languages) === language) : repos

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <FilterBar options={languages} value={language} onChange={setLanguage} />
        <a
          href={`https://github.com/${profile.handle}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted-foreground transition-colors hover:text-primary-700"
        >
          all repos ↗
        </a>
      </div>

      {failed && !results ? (
        <p className="text-sm text-muted-foreground">couldn't load projects.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {!results
            ? Array.from({ length: 4 }, (_, i) => <ProjectCardSkeleton key={i} />)
            : shown.map((repo) => <ProjectCard key={repo.id} repo={repo} />)}
        </div>
      )}
    </div>
  )
}
