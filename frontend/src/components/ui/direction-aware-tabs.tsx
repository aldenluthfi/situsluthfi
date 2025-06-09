import { type ReactNode, useMemo, useState } from "react"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import useMeasure from "react-use-measure"

import { cn } from "@/lib/utils"
import { Button } from "./button"

type Tab = {
  id: number
  label: string
  content: ReactNode
}

interface OgImageSectionProps {
  tabs: Tab[]
  className?: string
  rounded?: string
  onChange?: () => void
}

function DirectionAwareTabs({
  tabs,
  className,
  rounded,
  onChange,
}: OgImageSectionProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [ref, bounds] = useMeasure()

  const content = useMemo(() => {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content
    return activeTabContent || null
  }, [activeTab, tabs])

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab && !isAnimating) {
      const newDirection = newTabId > activeTab ? 1 : -1
      setDirection(newDirection)
      setActiveTab(newTabId)
      onChange ? onChange() : null
    }
  }

  const variants = {
    initial: (direction: number) => ({
      x: 300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
    active: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      x: -300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
  }

  return (
    <div className=" flex flex-col items-center w-full px-10">
      <div
        className={cn(
          "flex max-tablet:grid max-tablet:grid-cols-2 gap-2 border border-input rounded-lg cursor-pointer bg-card p-2 shadow-xs tablet:w-2xl ultrawide:w-3xl",
          className,
          rounded
        )}
      >
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={{ WebkitTapHighlightColor: "transparent" }}
            className={`flex-1 rounded-md shadow-none font-body text-lg ultrawide:text-2xl flex-grow bg-transparent hover:bg-transparent text-foreground ${activeTab === tab.id ? "bg-primary-300 text-primary-700" : ""}`}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 -z-10 bg-primary-300 shadow-xs text-primary-700 rounded-md"
                transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
              />
            )}

            {tab.label}
          </Button>
        ))}
      </div>
      <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}>
        <motion.div
          className="relative mx-auto w-full h-full overflow-hidden"
          initial={false}
          animate={{ height: bounds.height }}
        >
          <div className="p-1" ref={ref}>
            <AnimatePresence
              custom={direction}
              mode="popLayout"
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={activeTab}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                custom={direction}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </MotionConfig>
    </div>
  )
}
export { DirectionAwareTabs }
