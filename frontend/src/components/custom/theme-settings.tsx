import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useState, useCallback, useEffect } from "react"
import { ThemeSelector } from "@/components/custom/theme-selector"
import { useTheme } from "@/components/custom/theme-provider"
import { IconSunHigh, IconMoon, IconChevronUp, IconClock } from "@tabler/icons-react"
import { isMobile } from "@/lib/utils";
import { useTimezoneTheme } from "@/hooks/use-timezone-theme"

export function ThemeSettings() {
    const [isOpen, setIsOpen] = useState(false)
    const [isTimezonePopoverOpen, setIsTimezonePopoverOpen] = useState(false)
    const [mobilePopoverShown, setMobilePopoverShown] = useState(false)
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
            const currentTimezoneColor = localStorage.getItem('vite-ui-theme-color') || 'yellow';
            setTheme(currentTimezoneColor as any);
            setMode("light");
        }
    }, [mode, setMode, setTheme])

    const handleTriggerClick = useCallback(() => {
        if (isMobile) {
            if (mode === "timezone") {
                if (!mobilePopoverShown) {
                    setIsTimezonePopoverOpen(true)
                    setMobilePopoverShown(true)
                } else {
                    cycleThemeMode()
                    setMobilePopoverShown(false)
                }
            } else if (!isOpen) {
                setIsOpen(true)
            } else {
                cycleThemeMode()
            }
        } else {
            cycleThemeMode()
        }
    }, [isMobile, isOpen, setIsOpen, cycleThemeMode, mode, mobilePopoverShown])

    useEffect(() => {
        let timeoutId: number | undefined;
        let intervalId: number | undefined;

        if (isTimezonePopoverOpen && isMobile) {
            timeoutId = window.setTimeout(() => {
                setIsTimezonePopoverOpen(false);
                setMobilePopoverShown(false);
            }, 2500);
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

    const AnalogClock = ({ time }: { time: string }) => {
        const [hours, minutes] = time.split(':').map(Number);

        const hour12 = hours % 12;

        const minuteAngle = (minutes * 6) - 90;
        const hourAngle = (hour12 * 30) + (minutes * 0.5) - 90;

        const colors = [
            '#06b6d4',
            '#0ea5e9',
            '#3b82f6',
            '#6366f1',
            '#8b5cf6',
            '#a855f7',
            '#d946ef',
            '#ec4899',
            '#f43f5e',
            '#ef4444',
            '#f97316',
            '#f59e0b',
            '#eab308',
            '#84cc16',
            '#22c55e',
            '#10b981',
            '#14b8a6',
        ];

        const colorNames = [
            "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia",
            "pink", "rose", "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal"
        ];

        const activeColorIndex = colorNames.indexOf(currentColor);

        return (
            <svg width="240" height="240" viewBox="0 0 240 240" className="mb-2">
                {colors.map((color, i) => {
                    const startAngle = (i * 360 / 17) - 90;
                    const endAngle = ((i + 1) * 360 / 17) - 89.5;
                    const isActive = i === activeColorIndex;

                    const radius = isActive ? 117 : 105;
                    const startX = 120 + radius * Math.cos(startAngle * Math.PI / 180);
                    const startY = 120 + radius * Math.sin(startAngle * Math.PI / 180);
                    const endX = 120 + radius * Math.cos(endAngle * Math.PI / 180);
                    const endY = 120 + radius * Math.sin(endAngle * Math.PI / 180);

                    const largeArcFlag = 360 / 17 > 180 ? 1 : 0;

                    return (
                        <path
                            key={i}
                            d={`M 120 120 L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                            fill={color}
                        />
                    );
                })}

                <circle cx="120" cy="120" r="78" fill="var(--card)" stroke="currentColor" strokeWidth="3"/>

                {Array.from({ length: 12 }, (_, i) => {
                    const angle = (i * 30) - 90;
                    const x = 120 + 69 * Math.cos(angle * Math.PI / 180);
                    const y = 120 + 69 * Math.sin(angle * Math.PI / 180);
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="3"
                            fill="currentColor"
                        />
                    );
                })}

                <line
                    x1="120"
                    y1="120"
                    x2={120 + 45 * Math.cos(hourAngle * Math.PI / 180)}
                    y2={120 + 45 * Math.sin(hourAngle * Math.PI / 180)}
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                />

                <line
                    x1="120"
                    y1="120"
                    x2={120 + 63 * Math.cos(minuteAngle * Math.PI / 180)}
                    y2={120 + 63 * Math.sin(minuteAngle * Math.PI / 180)}
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                />

            </svg>
        );
    };

    if (mode === "timezone") {
        return (
            <div className="rounded-md absolute">
                <Popover open={isTimezonePopoverOpen}>
                    <PopoverTrigger
                        onMouseEnter={!isMobile ? () => setIsTimezonePopoverOpen(true) : undefined}
                        onMouseLeave={!isMobile ? () => setIsTimezonePopoverOpen(false) : undefined}
                        asChild
                    >
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
                    </PopoverTrigger>
                    <PopoverContent className="w-auto text-sm tablet:text-md ultrawide:text-lg bg-accent text-foreground [&>svg]:fill-accent mx-4" hideWhenDetached arrowClassName="bg-accent fill-accent" data-state={isTimezonePopoverOpen ? "open" : "closed"}>
                        <div className="flex flex-col items-center text-center space-y-1 mb-4">
                            <AnalogClock time={currentTime} />
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
};
