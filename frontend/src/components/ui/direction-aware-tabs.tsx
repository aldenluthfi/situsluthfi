import { type ReactNode, useEffect, useMemo, useState, useRef } from "react"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import useMeasure from "react-use-measure"

import { cn } from "@/lib/utils"
import { Button } from "./button"

type Tab = {
  id: number
  label: string
  content: ReactNode
  icon?: ReactNode
}

interface OgImageSectionProps {
  tabs: Tab[]
  className?: string
  rounded?: string
  onChange?: () => void
  autoPlay?: boolean
  pauseOnInteract?: boolean
}

function DirectionAwareTabs({
  tabs,
  className,
  rounded,
  onChange,
  autoPlay = false,
  pauseOnInteract = true,
}: OgImageSectionProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [ref, bounds] = useMeasure()
  const containerRef = useRef<HTMLDivElement>(null)

  const content = useMemo(() => {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content
    return activeTabContent || null
  }, [activeTab, tabs])

  const label = useMemo(() => {
    const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label
    return activeTabLabel || ""
  }, [activeTab, tabs])

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab && !isAnimating) {
      const newDirection = newTabId > activeTab ? 1 : -1
      setDirection(newDirection)
      setActiveTab(newTabId)
      if (pauseOnInteract && autoPlay) {
        setIsPaused(true)
      }
      onChange ? onChange() : null
    }
  }

  useEffect(() => {
    if (!autoPlay || isAnimating || isPaused) return

    const interval = setInterval(() => {
      const nextTab = (activeTab + 1) % tabs.length
      const newDirection = nextTab > activeTab ? 1 : -1
      setDirection(newDirection)
      setActiveTab(nextTab)
      onChange ? onChange() : null
    }, 2000)

    return () => clearInterval(interval)
  }, [autoPlay, isAnimating, isPaused, activeTab, tabs, onChange])

  useEffect(() => {
    if (!pauseOnInteract || !autoPlay) return

    const handleScroll = () => {
      if (!containerRef.current || !isPaused) return

      const rect = containerRef.current.getBoundingClientRect()
      const notVisible = rect.top > window.innerHeight || rect.bottom < 0

      if (notVisible && isPaused) {
        setIsPaused(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pauseOnInteract, autoPlay, isPaused])

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
    <div ref={containerRef} className=" flex flex-col items-center w-full">
      <div>
        <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}>
          <motion.div
            className="relative h-min text-nowrap w-full mb-8"
            initial={false}
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
                  className="font-body text-lg tablet:text-2xl text-center"
                >
                  {label}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </MotionConfig>
      </div>

      <div
        className={cn(
          "flex gap-2 ultrawide:gap-3 border border-input rounded-lg bg-card p-2",
          className,
          rounded
        )}
      >
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            size="icon"
            style={{ WebkitTapHighlightColor: "transparent" }}
            className={`bg-transparent shadow-none hover:bg-transparent text-foreground ${
              activeTab === tab.id ? "text-primary-700 duration-400" : ""
            }`}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 -z-10 bg-primary-300 shadow-xs text-primary-700 rounded-md"
                transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
              />
            )}
            {tab.icon}
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
