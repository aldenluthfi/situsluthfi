import React, { type ReactElement, Suspense, useMemo } from "react"
import { IconLoader2, IconQuestionMark } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

type IconProps = { stroke?: number; className?: string }

const iconModules = import.meta.glob<React.FC<IconProps>>(
    '../../../node_modules/@tabler/icons-react/dist/esm/icons/*.mjs',
    { import: 'default' }
)

interface Props {
    icon: string
    stroke?: number
    className?: string
}

export const DynamicIcon = ({ icon, stroke = 1.5, className }: Props): ReactElement => {
    const LazyIcon = useMemo(() =>
        React.lazy(async (): Promise<{ default: React.FC<IconProps> }> => {
            const key = `../../../node_modules/@tabler/icons-react/dist/esm/icons/${icon}.mjs`
            const loader = iconModules[key]
            if (!loader) return { default: () => <IconQuestionMark stroke={stroke} className={className} /> }
            const Icon = await loader()
            return { default: Icon }
        }),
        [icon]
    )

    return (
        <Suspense fallback={<IconLoader2 stroke={stroke} className={cn("animate-spin", className)} />}>
            <LazyIcon stroke={stroke} className={className} />
        </Suspense>
    )
}
