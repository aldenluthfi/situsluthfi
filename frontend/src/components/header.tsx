import { useEffect, useState } from "react"
import { IconSearch } from "@tabler/icons-react"
import { Link, NavLink } from "react-router-dom"
import SearchDialog from "@/components/search-dialog"
import { cn } from "@/lib/utils"

const NAV = [
  { to: "/projects", label: "projects" },
  { to: "/writings", label: "writings" },
  { to: "/archive", label: "archive" },
]

const MAC = typeof navigator !== "undefined" && /mac|iphone|ipad/i.test(navigator.userAgent)

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(input|textarea|select)$/i.test(e.target.tagName))
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <nav className="mx-auto flex h-12 w-full max-w-[53rem] items-center justify-between px-4 sm:px-6">
        <Link to="/" className="text-sm font-semibold text-primary-700 sm:text-base">
          aldenluthfi
        </Link>
        {/* Phones get a search icon and tighter gaps so the row fits at 375px. */}
        <div className="flex items-center gap-3 text-sm sm:gap-4">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn("transition-colors hover:text-foreground", isActive ? "text-primary-700" : "text-muted-foreground")
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="search"
            aria-keyshortcuts={MAC ? "Meta+K /" : "Control+K /"}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconSearch className="size-4 sm:hidden" stroke={1.5} />
            <span className="hidden sm:inline">search</span>
            <kbd className="hidden border px-1 text-xs leading-4 sm:inline">{MAC ? "⌘K" : "ctrl K"}</kbd>
          </button>
        </div>
      </nav>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
