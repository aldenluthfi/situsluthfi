import { Link, useLocation } from "react-router-dom"
import { useTitle } from "@/hooks/use-title"

export default function NotFound() {
  useTitle("404")
  const { pathname } = useLocation()

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        <span className="text-primary-700">$</span> cd {pathname}
      </p>
      <p>cd: no such file or directory: {pathname}</p>
      <Link to="/" className="inline-block text-sm text-primary-700 hover:underline">
        $ cd ~
      </Link>
    </div>
  )
}
