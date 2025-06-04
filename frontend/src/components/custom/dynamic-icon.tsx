import React, { type ReactElement, Suspense } from "react"

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
        const Icon = (icons as any)[icon]
        return { default: Icon as React.ComponentType<{ size?: number; stroke?: number; className?: string }> }
    })

    return (
        <Suspense fallback={<div style={{ width: size * 4, height: size * 4 }} />}>
            <LazyIcon size={size} stroke={stroke} className={className} />
        </Suspense>
    )
}