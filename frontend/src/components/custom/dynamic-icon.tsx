import { useState, useEffect, type ReactElement } from "react"

interface Props {
    icon: string
    size?: number
    stroke?: number
    className?: string
}

export const DynamicIcon = (props: Props): ReactElement => {
    const { icon, size = 6, stroke = 1.5, className } = props
    const [IconComponent, setIconComponent] = useState<React.ComponentType<any> | null>(null)

    useEffect(() => {
        const loadIcon = async () => {
            try {
                const iconModule = await import(`@tabler/icons-react`)
                const Icon = (iconModule as any)[icon]
                if (Icon) {
                    setIconComponent(() => Icon)
                } else {
                    console.warn(`Icon "${icon}" not found in @tabler/icons-react`)
                }
            } catch (error) {
                console.error(`Failed to load icon "${icon}":`, error)
            }
        }

        loadIcon()
    }, [icon])

    if (!IconComponent) {
        return <div style={{ width: size, height: size }} className={className} />
    }

    return (
        <IconComponent size={size} stroke={stroke} className={className} />
    )
}