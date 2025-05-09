import { DynamicIcon } from "lucide-react/dynamic"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState, useCallback } from "react"
import { ThemeSelector } from "@/components/custom/theme-selector"
import { useTheme } from "@/components/custom/theme-provider"

export function ThemeSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const { mode, setMode } = useTheme()
  const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches

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
      className={`${isOpen ? "bg-accent" : "duration-500"} rounded-md absolute`}
    >
      <AccordionItem
        value="settings-toggle"
        onMouseEnter={!isMobile ? () => setIsOpen(true) : undefined}
        onMouseLeave={() => setIsOpen(false)}
        onBlur={isMobile ? () => setIsOpen(false) : undefined}
      >
        <AccordionTrigger
          showIndicator={false}
          className="size-9 m-1.5 flex items-center justify-center [&[data-state=open]>svg]:rotate-0"
          onClick={handleTriggerClick}
        >
          <DynamicIcon name={mode === "light" ? "sun" : "moon"} />
        </AccordionTrigger>
        <AccordionContent className="p-0">
          <ThemeSelector />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
