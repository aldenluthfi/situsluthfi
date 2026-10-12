import { Link } from "react-router-dom"
import { versions, type Version } from "@/content/versions"
import { useTitle } from "@/hooks/use-title"

function Shot({ version }: { version: Version }) {
  const img = (
    <img
      src={version.shot}
      alt={`${version.id} home page`}
      loading="lazy"
      className="block aspect-[16/10] w-full object-cover object-top grayscale transition-[filter] duration-150 ease-in-out group-hover:grayscale-0"
    />
  )
  const className = "group block border border-primary-700"

  // The current version is this app; archived ones are separate builds, so a full page load.
  return version.href === "/" ? (
    <Link to="/" className={className}>
      {img}
    </Link>
  ) : (
    <a href={version.href} className={className}>
      {img}
    </a>
  )
}

export default function Archive() {
  useTitle("archive")

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-muted-foreground">~/archive</p>
      <h1 className="mt-4 text-3xl font-bold text-primary-700">archive</h1>

      <ol className="mt-12 grid w-full max-w-md gap-8">
        {versions.map((version) => (
          <li key={version.id}>
            <Shot version={version} />
            <div className="mt-1 flex justify-between text-primary-700">
              <span>{version.id}</span>
              <span className="tabular-nums">{version.year}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
