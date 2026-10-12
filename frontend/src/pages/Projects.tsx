import { useMemo, useState } from "react"
import FilterBar from "@/components/filter-bar"
import ProjectCard, { ProjectCardSkeleton } from "@/components/project-card"
import { profile } from "@/content/profile"
import { useApi } from "@/hooks/use-api"
import { useTitle } from "@/hooks/use-title"
import { api } from "@/lib/api"
import { primaryLanguage } from "@/lib/utils"

export default function Projects() {
  useTitle("projects")
  const state = useApi((signal) => api.getRepositories(signal))
  const [language, setLanguage] = useState<string | null>(null)

  const repos = useMemo(
    () =>
      [...(state.data?.repositories ?? [])].sort(
        (a, b) => b.stargazers_count - a.stargazers_count || b.updated_at.localeCompare(a.updated_at),
      ),
    [state.data],
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

      {state.status === "error" ? (
        <p className="text-sm text-muted-foreground">couldn't load projects.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {state.status === "loading"
            ? Array.from({ length: 4 }, (_, i) => <ProjectCardSkeleton key={i} />)
            : shown.map((repo) => <ProjectCard key={repo.id} repo={repo} />)}
        </div>
      )}
    </div>
  )
}
