import { cn, hueVars } from "@/lib/utils"

export default function Chip({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn("hue inline-block border px-2 py-0.5 text-xs leading-5", className)}
      style={hueVars(label)}
    >
      {label}
    </span>
  )
}
