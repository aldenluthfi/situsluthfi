import { Link } from "react-router-dom"
import { versions, type Version } from "@/content/versions"
import { useTitle } from "@/hooks/use-title"
import { useTheme } from "@/lib/theme"

function Shot({ version }: { version: Version }) {
  const { dark } = useTheme()
  const img = (
    <img
      src={dark ? version.shots.dark : version.shots.light}
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
    <ol className="mx-auto grid w-full max-w-md gap-8">
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
  )
}
