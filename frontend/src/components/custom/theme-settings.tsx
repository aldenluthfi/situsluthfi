import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState, useCallback, useEffect } from "react"
import { ThemeSelector } from "@/components/custom/theme-selector"
import { useTheme } from "@/components/custom/theme-provider"
import { IconSunHigh, IconMoon, IconChevronUp, IconClock, IconQuestionMark } from "@tabler/icons-react"
import { isMobile } from "@/lib/utils";
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog"

export function ThemeSettings() {
    const [isOpen, setIsOpen] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [currentTime, setCurrentTime] = useState(() => {
        const timezone = import.meta.env.VITE_TIMEZONE || 'Asia/Jakarta';
        return new Date().toLocaleTimeString('en-US', {
            timeZone: timezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    })
    const { mode, setMode, setTheme, theme } = useTheme()

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

    useEffect(() => {
        const updateTime = () => {
            const timezone = import.meta.env.VITE_TIMEZONE || 'Asia/Jakarta';
            setCurrentTime(new Date().toLocaleTimeString('en-US', {
                timeZone: timezone,
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }));
        };

        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, [])

    const AnalogClock = ({ time }: { time: string }) => {
        const timeParts = time.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const seconds = parseInt(timeParts[2]);

        const hour12 = hours % 12;

        const minuteAngle = (minutes * 6) - 90;
        const hourAngle = (hour12 * 30) + (minutes * 0.5) - 90;
        const secondAngle = (seconds * 6) - 90;

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

        const activeColorIndex = colorNames.indexOf(theme);

        return (
            <svg
                viewBox="0 0 320 320"
                className="w-full h-auto max-w-[280px] sm:max-w-[320px] mx-auto"
                style={{ aspectRatio: '1 / 1' }}
            >
                {colors.map((color, i) => {
                    const startAngle = (i * 360 / 17) - 90 + (360 / 34);
                    const endAngle = ((i + 1) * 360 / 17) - 89.5 + (360 / 34);
                    const isActive = i === activeColorIndex;

                    const radius = isActive ? 157 : 145;
                    const startX = 160 + radius * Math.cos(startAngle * Math.PI / 180);
                    const startY = 160 + radius * Math.sin(startAngle * Math.PI / 180);
                    const endX = 160 + radius * Math.cos(endAngle * Math.PI / 180);
                    const endY = 160 + radius * Math.sin(endAngle * Math.PI / 180);

                    const largeArcFlag = 360 / 17 > 180 ? 1 : 0;

                    return (
                        <path
                            key={i}
                            d={`M 160 160 L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                            fill={color}
                        />
                    );
                })}

                <circle cx="160" cy="160" r="115" fill="var(--card)" stroke="currentColor" strokeWidth="3" />

                {Array.from({ length: 12 }, (_, i) => {
                    const angle = (i * 30) - 90;
                    const x = 160 + 102 * Math.cos(angle * Math.PI / 180);
                    const y = 160 + 102 * Math.sin(angle * Math.PI / 180);
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="currentColor"
                        />
                    );
                })}

                <line
                    x1="160"
                    y1="160"
                    x2={160 + 95 * Math.cos(secondAngle * Math.PI / 180)}
                    y2={160 + 95 * Math.sin(secondAngle * Math.PI / 180)}
                    stroke="var(--primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                <line
                    x1="160"
                    y1="160"
                    x2={160 + 65 * Math.cos(hourAngle * Math.PI / 180)}
                    y2={160 + 65 * Math.sin(hourAngle * Math.PI / 180)}
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                />

                <line
                    x1="160"
                    y1="160"
                    x2={160 + 90 * Math.cos(minuteAngle * Math.PI / 180)}
                    y2={160 + 90 * Math.sin(minuteAngle * Math.PI / 180)}
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                />

                <circle cx="160" cy="160" r="4" fill="currentColor" />

            </svg>
        );
    };

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
                    {
                        mode === 'timezone' ?
                            <Dialog open={dialogOpen} onOpenChange={(open) => {
                                setDialogOpen(open);
                                if (!open) setIsOpen(false);
                            }}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="size-9 hover:text-foreground hover:bg-transparent text-foreground"
                                        aria-label="View timezone clock"
                                        title="View timezone clock"
                                    >
                                        <IconQuestionMark className="size-6" stroke={1.5} />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-desktop bg-card  [&>button]:hidden">
                                    <DialogHeader className="text-center text-xl">
                                        <DialogTitle className="mx-auto">My Current Time</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex justify-center py-2 sm:py-4">
                                        <AnalogClock time={currentTime} />
                                    </div>
                                    <DialogDescription className="text-foreground text-center flex flex-col gap-3 text-xl mb-4">
                                        <strong className="font-heading text-3xl tablet:text-4xl desktop:text-5xl">{currentTime}</strong>in Jakarta
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog> :
                            <ThemeSelector />
                    }
                    <IconChevronUp className={`${isMobile ? "" : "hidden"} mx-auto my-1.5 size-6`} stroke={1.5} onClick={() => setIsOpen(false)} aria-label="Close" />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
};