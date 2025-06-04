import * as icons from "@tabler/icons-react"
import type { ReactElement } from "react"

interface Props {
    icon: string
    size?: number
    stroke?: number
    className?: string
}

export const DynamicIcon = (props: Props): ReactElement => {
    const { icon, size = 6, stroke = 1.5, className } = props

    const Icon = (icons as any)[icon] as React.ComponentType<any>

    return (
        <Icon size={size} stroke={stroke} className={className} />
    )
}