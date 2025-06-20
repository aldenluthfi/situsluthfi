import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useState, useCallback, useEffect } from "react"
import { ThemeSelector } from "@/components/custom/theme-selector"
import { useTheme } from "@/components/custom/theme-provider"
import { IconSunHigh, IconMoon, IconChevronUp, IconClock } from "@tabler/icons-react"
import { useTimezoneTheme } from "@/hooks/use-timezone-theme"
import { isMobile } from "@/lib/utils";

export function ThemeSettings() {
    const [isOpen, setIsOpen] = useState(false)
    const [isTimezonePopoverOpen, setIsTimezonePopoverOpen] = useState(false)
    const [currentTime, setCurrentTime] = useState(() =>
        new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta', hour12: false })
    )
    const { mode, setMode, setTheme } = useTheme()
    const { currentColor } = useTimezoneTheme();

    const cycleThemeMode = useCallback(() => {
        if (mode === "light") {
            setMode("dark")
        } else if (mode === "dark") {
            setMode("timezone")
        } else {
            setTheme(currentColor as any)
            setMode("light")
        }
    }, [mode, setMode, setTheme, currentColor])

    const handleTriggerClick = useCallback(() => {
        if (isMobile) {
            if (mode === "timezone") {
                cycleThemeMode()
            } else if (!isOpen) {
                setIsOpen(true)
            } else {
                cycleThemeMode()
            }
        } else {
            cycleThemeMode()
        }
    }, [isMobile, isOpen, setIsOpen, cycleThemeMode, mode])

    useEffect(() => {
        let timeoutId: number | undefined;
        let intervalId: number | undefined;

        if (isTimezonePopoverOpen && isMobile) {
            timeoutId = window.setTimeout(() => {
                setIsTimezonePopoverOpen(false);
            }, 1500);
        }

        if (isTimezonePopoverOpen) {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta', hour12: false }));

            intervalId = window.setInterval(() => {
                setCurrentTime(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta', hour12: false }));
            }, 1000);
        }

        return () => {
            window.clearTimeout(timeoutId);
            window.clearInterval(intervalId);
        };
    }, [isTimezonePopoverOpen]);

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
                <Popover open={isTimezonePopoverOpen}>
                    <PopoverTrigger
                        onMouseEnter={() => setIsTimezonePopoverOpen(true)}
                        onMouseLeave={() => setIsTimezonePopoverOpen(false)}
                        onMouseDown={() => setIsTimezonePopoverOpen(true)}
                        asChild
                    >
                        <Button
                            onClick={cycleThemeMode}
                            aria-label={getAriaLabel()}
                            title={getAriaLabel()}
                            variant="ghost"
                            size="icon"
                            className="size-9 text-foreground bg-transparent hover:bg-accent"
                        >
                            {getIcon()}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto text-sm tablet:text-md ultrawide:text-lg" hideWhenDetached>
                        <div className="flex flex-col items-center text-center space-y-1">
                            <strong>{currentTime}</strong>
                            in Jakarta
                        </div>
                    </PopoverContent>
                </Popover>
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
}
