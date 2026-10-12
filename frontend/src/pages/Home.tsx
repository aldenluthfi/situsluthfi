import { useState } from "react"
import { Link } from "react-router-dom"
import Chip from "@/components/chip"
import Heatmap from "@/components/heatmap"
import Section from "@/components/section"
import Timeline from "@/components/timeline"
import TldrDialog from "@/components/tldr-dialog"
import { experience, profile } from "@/content/profile"
import { useApi } from "@/hooks/use-api"
import { useTitle } from "@/hooks/use-title"
import { api } from "@/lib/api"
import { TIMEZONE_LABEL, useTheme } from "@/lib/theme"
import { THEME_COLORS } from "@/lib/types"
import { cn, formatDate } from "@/lib/utils"

function Fetch() {
  const { hue, dark, now } = useTheme()
  const rows: [string, string][] = [
    ["study", profile.study],
    ["role", `${profile.current.label} @ ${profile.current.at}`],
    ["based", profile.location],
    ["time", `${now.toTimeString().slice(0, 5)} ${TIMEZONE_LABEL}`],
    ["theme", `${hue} · ${dark ? "dark" : "light"}`],
  ]

  return (
    <div className="w-full shrink-0 border p-5 text-sm md:w-80">
      <p>
        <span className="text-primary-700">{profile.handle}</span>
        <span className="text-muted-foreground">@</span>
        <span className="text-primary-700">aldenluth.fi</span>
      </p>
      <p className="text-border" aria-hidden>
        {"─".repeat(24)}
      </p>
      <dl className="mt-1 space-y-1">
        {rows.map(([key, value]) => (
          <div key={key} className="grid grid-cols-[3.5rem_1fr] gap-2">
            <dt className="text-primary-700">{key}</dt>
            <dd className="text-muted-foreground">{value}</dd>
          </div>
        ))}
      </dl>
      <div
        className="mt-4 flex gap-[3px]"
        title="the accent walks through these 17 hues every 12 hours, on jakarta time"
      >
        {THEME_COLORS.map((color) => (
          <span
            key={color}
            className={cn("h-3 flex-1", color === hue && "outline outline-offset-2 outline-foreground/60")}
            style={{ background: `var(--color-${color}-${dark ? 400 : 500})` }}
          />
        ))}
      </div>
    </div>
  )
}

function RecentWritings() {
  const writings = useApi((signal) => api.getWritings(signal))

  if (writings.status === "error") return <p className="text-sm text-muted-foreground">couldn't load writings.</p>

  return (
    <div>
      <ul className="divide-y">
        {writings.status === "loading"
          ? Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="py-3">
                <div className="h-5 w-2/3 animate-pulse bg-muted" />
              </li>
            ))
          : writings.data.results.slice(0, 3).map((w) => (
              <li key={w.id}>
                <Link to={`/blog/${w.slug}`} className="group flex gap-4 py-3">
                  <span className="shrink-0 text-sm text-muted-foreground tabular-nums">{formatDate(w.createdAt)}</span>
                  <span className="transition-colors group-hover:text-primary-700">{w.title}</span>
                </Link>
              </li>
            ))}
      </ul>
      <Link to="/blog" className="mt-4 inline-block text-sm text-muted-foreground transition-colors hover:text-primary-700">
        all writings →
      </Link>
    </div>
  )
}

export default function Home() {
  useTitle()
  const [tldrOpen, setTldrOpen] = useState(false)
  const repos = useApi((signal) => api.getRepositories(signal))

  return (
    <div className="space-y-20">
      <section className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-5">
          <div>
            <p className="text-sm text-muted-foreground">~ whoami</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              {profile.name} <span className="text-base font-normal text-muted-foreground">aka {profile.alias}</span>
            </h1>
          </div>
          <p className="leading-relaxed text-muted-foreground">{profile.roles.join(" · ")}</p>
          <p>
            <span className="text-primary-700">▸</span> currently{" "}
            <span className="font-semibold text-primary-700">{profile.current.label}</span> at {profile.current.at}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.stack.map((tech) => (
              <Chip key={tech} label={tech} />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {profile.socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary-700 hover:decoration-primary-700"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex gap-2 text-sm">
            <button
              type="button"
              onClick={() => setTldrOpen(true)}
              className="border border-primary-700/50 px-3 py-1 text-primary-700 transition-colors hover:bg-primary-700/10"
            >
              tl;dr
            </button>
            <a
              href={`mailto:${profile.email}`}
              className="border px-3 py-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              {profile.email}
            </a>
          </div>
        </div>
        <Fetch />
      </section>

      <Heatmap />

      <Section command="cat experience.log">
        <Timeline items={experience} />
      </Section>

      <Section command="ls -t ~/writings | head -3">
        <RecentWritings />
      </Section>

      <TldrDialog open={tldrOpen} onClose={() => setTldrOpen(false)} repos={repos.data?.repositories} />
    </div>
  )
}
