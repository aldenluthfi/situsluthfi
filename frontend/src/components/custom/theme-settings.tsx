import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState, useCallback } from "react"
import { ThemeSelector } from "@/components/custom/theme-selector"
import { useTheme } from "@/components/custom/theme-provider"
import { IconSunHigh, IconMoon, IconChevronUp } from "@tabler/icons-react"
import { isMobile } from "@/lib/utils";

export function ThemeSettings() {
    const [isOpen, setIsOpen] = useState(false)
    const { mode, setMode } = useTheme()

    const handleTriggerClick = useCallback(() => {
        if (isMobile) {
            if (!isOpen) {
                setIsOpen(true)
            } else {
                setMode(mode === "light" ? "dark" : "light")
            }
        } else {
            setMode(mode === "light" ? "dark" : "light")
        }
    }, [isMobile, isOpen, setIsOpen, setMode, mode])

    return (
        <Accordion
            type="single"
            value={isOpen ? "settings-toggle" : ""}
            collapsible
            className={`${isOpen ? "bg-accent" : "duration-500"} rounded-md absolute hover:motion-scale-out-105 motion-scale-in-105 motion-ease-spring-snappy motion-duration-300 origin-[50%_5%]`}
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
                    aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
                    title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
                >
                    {mode === "light" ? <IconSunHigh className="size-6" stroke={1.5} /> : <IconMoon className="size-6" stroke={1.5} />}
                </AccordionTrigger>
                <AccordionContent className="p-0">
                    <ThemeSelector />
                    <IconChevronUp className={`${isMobile ? "" : "hidden"} mx-auto my-1.5 size-6`} stroke={1.5} onClick={() => setIsOpen(false)} aria-label="Close" />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
