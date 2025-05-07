import { DynamicIcon } from "lucide-react/dynamic"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState } from "react"
import { ThemeSelector } from "@/components/custom/theme-selector"
import { useTheme } from "@/components/custom/theme-provider"


export function ThemeSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const { mode, setMode } = useTheme()

  return (
    <Accordion
      type="single"
      value={isOpen ? "settings-toggle" : ""}
      collapsible
      className={`${isOpen ? "bg-accent" : "duration-500"} rounded-md absolute`}
    >
      <AccordionItem
      value="settings-toggle"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      >
      <AccordionTrigger
        showIndicator={false}
        className="size-12 flex items-center justify-center [&[data-state=open]>svg]:rotate-0"
        onClick={() => setMode(mode === "light" ? "dark" : "light")}
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
