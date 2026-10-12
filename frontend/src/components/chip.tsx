import { cn } from "@/lib/utils"

export default function Chip({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn("inline-block border border-primary-700/30 px-2 py-0.5 text-xs leading-5 text-primary-700", className)}
    >
      {label}
    </span>
  )
}
