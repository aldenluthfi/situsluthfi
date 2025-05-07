import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/custom/theme-provider"
import { ScrollArea } from "@/components/ui/scroll-area"

const themes = [
  "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky",
  "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "neutral"
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <ScrollArea className="h-[283px]" showScrollbar={false}>
      <div className="pt-1 pb-3 flex flex-col gap-3 flex-wrap items-center">
        {themes.map((t) => (
          <Button
            key={t}
            onClick={() => setTheme(t as any)}
            style={{ background: `var(--color-${t}-500)` }}
            aria-label={t}
            variant={theme === t ? "default" : "ghost"}
            className="rounded-full size-7"
            size="icon"
          />
        ))}
      </div>
    </ScrollArea>
  );
}