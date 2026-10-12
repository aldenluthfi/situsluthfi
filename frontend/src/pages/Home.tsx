import { useState } from "react"
import solo from "@/assets/solo.webp"
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconMail,
  type Icon,
} from "@tabler/icons-react"
import { Link } from "react-router-dom"
import Chip from "@/components/chip"
import Heatmap from "@/components/heatmap"
import Inline from "@/components/inline"
import Resume from "@/components/resume"
import Section from "@/components/section"
import TldrDialog from "@/components/tldr-dialog"
import { profile } from "@/content/profile"
import { useApi } from "@/hooks/use-api"
import { useTitle } from "@/hooks/use-title"
import { api } from "@/lib/api"
import { formatDate } from "@/lib/utils"

const ICONS: Record<string, Icon> = {
  github: IconBrandGithub,
  linkedin: IconBrandLinkedin,
  instagram: IconBrandInstagram,
  x: IconBrandX,
  email: IconMail,
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
                <Link to={`/writings/${w.slug}`} className="group flex gap-4 py-3">
                  <span className="shrink-0 text-sm text-muted-foreground tabular-nums">{formatDate(w.createdAt)}</span>
                  <span className="transition-colors group-hover:text-primary-700">{w.title}</span>
                </Link>
              </li>
            ))}
      </ul>
      <Link to="/writings" className="mt-4 inline-block text-sm text-muted-foreground transition-colors hover:text-primary-700">
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
      <Section command="whoami">
        {/* Photo column has a fixed width and stretches to the text's height; the
            image takes whatever height is left above the button (basis 0, so it
            never pushes the row taller itself). */}
        <div className="flex flex-col gap-8 md:flex-row md:gap-10">
          <div className="flex shrink-0 flex-col items-start gap-3 md:w-56">
            <img
              src={solo}
              alt={profile.name}
              className="size-40 border object-cover md:h-auto md:min-h-0 md:w-full md:flex-1 md:basis-0"
            />
            <button
              type="button"
              onClick={() => setTldrOpen(true)}
              className="border border-primary-700/50 px-2 py-0.5 text-xs leading-5 text-primary-700 transition-colors hover:bg-primary-700/10"
            >
              tl;dr
            </button>
          </div>
          <div className="min-w-0 flex-1 space-y-5">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {profile.name} <span className="text-base font-normal text-muted-foreground">aka {profile.alias}</span>
              </h1>
            </div>
            <p className="leading-relaxed text-muted-foreground">
              <Inline text={profile.roles} />
            </p>
            <div className="flex flex-wrap gap-1.5">
              {profile.stack.map((tech) => (
                <Chip key={tech} label={tech} />
              ))}
            </div>
            <div className="flex items-center gap-4">
              {[...profile.socials, { label: "email", href: `mailto:${profile.email}` }].map(({ label, href }) => {
                const Icon = ICONS[label]
                return (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    aria-label={label}
                    title={label}
                    className="text-muted-foreground transition-colors hover:text-primary-700"
                  >
                    <Icon className="size-5" stroke={1.5} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </Section>

      <Section command="gh contrib">
        <Heatmap />
      </Section>

      <Section command="ls -t ~/writings | head -3">
        <RecentWritings />
      </Section>

      <Resume />

      <TldrDialog open={tldrOpen} onClose={() => setTldrOpen(false)} repos={repos.data?.repositories} />
    </div>
  )
}
