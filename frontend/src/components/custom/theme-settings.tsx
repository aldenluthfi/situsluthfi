import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { useState, useCallback } from "react"
import { ThemeSelector } from "@/components/custom/theme-selector"
import { useTheme } from "@/components/custom/theme-provider"
import { IconSunHigh, IconMoon, IconChevronUp, IconClock } from "@tabler/icons-react"
import { isMobile } from "@/lib/utils";

export function ThemeSettings() {
    const [isOpen, setIsOpen] = useState(false)
    const { mode, setMode, setTheme } = useTheme()

    const cycleThemeMode = useCallback(() => {
        if (mode === "light") {
            setMode("dark")
        } else if (mode === "dark") {
            setMode("timezone")
        } else {
            const currentTimezoneColor = localStorage.getItem('vite-ui-theme-color') || 'yellow';
            setTheme(currentTimezoneColor as any);
            setMode("light");
        }
    }, [mode, setMode, setTheme])

    const handleTriggerClick = useCallback(() => {
        if (isMobile) {
            if (!isOpen) {
                setIsOpen(true)
            } else {
                cycleThemeMode()
            }
        } else {
            cycleThemeMode()
        }
    }, [isMobile, isOpen, setIsOpen, cycleThemeMode])

    const getIcon = () => {
        if (mode === "timezone") {
            return <IconClock className="size-6" stroke={1.5} />
        }
        return mode === "light"
            ? <IconSunHigh className="size-6" stroke={1.5} />
            : <IconMoon className="size-6" stroke={1.5} />
    }

    const getAriaLabel = () => {
        if (mode === "timezone") {
            return "Switch to light mode"
        }
        return mode === "light" ? "Switch to dark mode" : "Switch to timezone mode"
    }

    if (mode === "timezone") {
        return (
            <div className="rounded-md absolute">
                <Button
                    onClick={handleTriggerClick}
                    aria-label={getAriaLabel()}
                    title={getAriaLabel()}
                    variant="ghost"
                    size="icon"
                    className="size-9 text-foreground bg-transparent hover:bg-accent"
                >
                    {getIcon()}
                </Button>
            </div>
        )
    }

    return (
        <Accordion
            type="single"
            value={isOpen ? "settings-toggle" : ""}
            collapsible
            className={`${isOpen ? "bg-accent" : "duration-500"} rounded-md absolute hover:motion-scale-out-105 motion-scale-in-105 motion-ease-spring-snappy motion-duration-300 origin-[50%_7.5%]`}
        >
            <AccordionItem
                value="settings-toggle"
                onMouseEnter={!isMobile ? () => setIsOpen(true) : undefined}
                onMouseLeave={!isMobile ? () => setIsOpen(false) : undefined}
            >
                <AccordionTrigger
                    showIndicator={false}
                    className="size-9 flex items-center justify-center [&[data-state=open]>svg]:rotate-0"
                    onClick={handleTriggerClick}
                    aria-label={getAriaLabel()}
                    title={getAriaLabel()}
                >
                    {getIcon()}
                </AccordionTrigger>
                <AccordionContent className="p-0">
                    <ThemeSelector />
                    <IconChevronUp className={`${isMobile ? "" : "hidden"} mx-auto my-1.5 size-6`} stroke={1.5} onClick={() => setIsOpen(false)} aria-label="Close" />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
};
