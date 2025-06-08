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
        const Icon = icons[icon as keyof typeof icons] as React.ComponentType<any>
        return { default: Icon }
    })

    return (
        <Suspense fallback={<div style={{ width: 0, height: 0 }} />}>
            <LazyIcon size={size} stroke={stroke} className={className} />
        </Suspense>
    )
}