import { Link, NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

const NAV = [
  { to: "/projects", label: "projects" },
  { to: "/writings", label: "writings" },
  { to: "/archive", label: "archive" },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <nav className="mx-auto flex h-12 w-full max-w-[53rem] items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-semibold text-primary-700">
          aldenluthfi
        </Link>
        <div className="flex items-center gap-4 text-sm">
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
        </div>
      </nav>
    </header>
  )
}
