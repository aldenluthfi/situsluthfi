import { Prompt } from "@/components/section"
import { versions, type Version } from "@/content/versions"
import { useTitle } from "@/hooks/use-title"
import { cn } from "@/lib/utils"

// Loose collage: alternating tilt, slight overlap, straightens on hover.
const TILT = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1"]

function Collage({ shots }: { shots: Version["shots"] }) {
  return (
    <div className="grid grid-cols-2 gap-3 py-2 sm:gap-0 sm:px-4">
      {shots.map((shot, i) => (
        <a
          key={shot.src}
          href={shot.src}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "relative block border bg-card p-1.5 shadow-lg shadow-black/20 transition duration-300 hover:z-10 hover:scale-[1.04] hover:rotate-0",
            TILT[i % TILT.length],
            i % 2 === 1 && "sm:-ml-4 sm:mt-6",
            i >= 2 && "sm:-mt-6",
          )}
        >
          <img src={shot.src} alt={`vI ${shot.caption}`} loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
        </a>
      ))}
    </div>
  )
}

function Entry({ version }: { version: Version }) {
  return (
    <section id={version.id} className="scroll-mt-20 space-y-6">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h2 className="text-2xl font-bold text-primary-700">{version.id}</h2>
        <span className="text-muted-foreground">{version.year}</span>
        <span className="flex gap-2 text-sm sm:ml-auto">
          {version.href ? (
            // Full page load: archived versions are separate apps served beside this one.
            <a
              href={version.href}
              className="border border-primary-700/50 px-3 py-1 text-primary-700 transition-colors hover:bg-primary-700/10"
            >
              open ↗
            </a>
          ) : (
            <span className="px-3 py-1 text-muted-foreground">current</span>
          )}
          <a
            href={version.source}
            target="_blank"
            rel="noreferrer"
            className="border px-3 py-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            source
          </a>
        </span>
      </div>

      {version.shots.length > 0 && <Collage shots={version.shots} />}
    </section>
  )
}

export default function Archive() {
  useTitle("archive")

  return (
    <div className="space-y-16">
      <Prompt>ls ~/archive</Prompt>
      {versions.map((version) => (
        <Entry key={version.id} version={version} />
      ))}
    </div>
  )
}
