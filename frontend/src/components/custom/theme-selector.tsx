import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/custom/theme-provider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { THEME_COLORS } from "@/lib/types";
import { isMobile } from "@/lib/utils";

export function ThemeSelector() {
    const { theme, setTheme } = useTheme();

    return (
        <ScrollArea className={isMobile ? "h-[286px]" : "h-[291px]"} showScrollbar={false}>
            <div className={`pt-1 ${isMobile ? "" : "pb-2"} flex flex-col gap-2 flex-wrap items-center`}>
                {THEME_COLORS.map((t) => (
                    <Button
                        key={t}
                        onClick={() => setTheme(t)}
                        style={{ background: `var(--color-${t}-500)` }}
                        aria-label={t}
                        variant={theme === t ? "default" : "ghost"}
                        className="rounded-full size-6 p-0"
                        size="icon"
                    />
                ))}
            </div>
        </ScrollArea>
    );
}