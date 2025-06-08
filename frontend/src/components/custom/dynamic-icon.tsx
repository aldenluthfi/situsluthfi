import React, { type ReactElement, Suspense } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface Props {
    icon: string
    size?: number
    stroke?: number
    className?: string
}

export const DynamicIcon = (props: Props): ReactElement => {
    const { icon, size = 6, stroke = 1.5, className } = props

    const LazyIcon = React.lazy(async () => {
        const icons = await import('@tabler/icons-react')
        const Icon = icons[icon as keyof typeof icons] as React.ComponentType<any>
        return { default: Icon }
    })

    return (
        <Suspense fallback={<IconLoader2 size={size} stroke={stroke} className={cn("animate-spin", className)} />}>
            <LazyIcon size={size} stroke={stroke} className={className} />
        </Suspense>
    )
}