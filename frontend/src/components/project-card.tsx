import type { RepositoryObject } from "@/lib/types"
import { useTheme } from "@/lib/theme"
import { cn, hueVars } from "@/lib/utils"

export function ProjectCardSkeleton() {
  return (
    <div className="animate-pulse border p-4">
      <div className="aspect-[2/1] bg-muted" />
      <div className="mt-4 h-4 w-1/3 bg-muted" />
      <div className="mt-3 h-3 w-2/3 bg-muted" />
    </div>
  )
}

export default function ProjectCard({ repo }: { repo: RepositoryObject }) {
  const { dark } = useTheme()
  const cover = (dark ? repo.cover_dark_url : repo.cover_light_url) ?? repo.cover_dark_url ?? repo.cover_light_url
  const languages = Object.entries(repo.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name)

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col border p-4 transition-colors hover:border-primary-700/60 hover:bg-primary-700/[0.03]"
    >
      <div className="aspect-[2/1] overflow-hidden bg-muted">
        {cover && (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        )}
      </div>
      <h3 className="mt-4 font-semibold transition-colors group-hover:text-primary-700">
        {repo.name} <span className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">↗</span>
      </h3>
      {repo.description && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{repo.description}</p>}
      <div className="mt-auto flex flex-wrap items-center gap-x-2 pt-4 text-xs">
        {languages.map((lang, i) => (
          <span key={lang} className="flex items-center gap-2">
            {i > 0 && <span className="text-border">·</span>}
            <span className="hue" style={hueVars(lang)}>
              {lang.toLowerCase()}
            </span>
          </span>
        ))}
        {repo.stargazers_count > 0 && (
          <span className={cn("text-muted-foreground", languages.length > 0 && "ml-2")}>★ {repo.stargazers_count}</span>
        )}
      </div>
    </a>
  )
}
