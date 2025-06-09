import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/custom/theme-provider"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ThemeString } from "@/lib/types";
import { isMobile } from "@/lib/utils";


const themes = [
    "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky",
    "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "neutral"
];

export function ThemeSelector() {
    const { theme, setTheme } = useTheme();

    return (
        <ScrollArea className={isMobile ? "h-[286px]" : "h-[291px]"} showScrollbar={false}>
            <div className={`pt-1 ${isMobile ? "" : "pb-2"} flex flex-col gap-2 flex-wrap items-center`}>
                {themes.map((t) => (
                    <Button
                        key={t}
                        onClick={() => setTheme(t as ThemeString)}
                        style={{ background: `var(--color-${t}-500)` }}
                        aria-label={t}
                        variant={theme === t ? "default" : "ghost"}
                        className="rounded-full size-6"
                        size="icon"
                    />
                ))}
            </div>
        </ScrollArea>
    );
}