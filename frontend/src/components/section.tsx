import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Prompt({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      <span className="text-primary-700">$</span> {children}
    </p>
  )
}

export default function Section({
  command,
  aside,
  children,
}: {
  command: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-normal text-muted-foreground">
          <span className="text-primary-700">$</span> {command}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  )
}
