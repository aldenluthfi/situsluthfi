import { useEffect, useState, useMemo, useId } from 'react';
import drawPath from '@/components/maps/draw-paths';
import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from '@/components/animate-ui/components/tooltip';
import { cn } from '@/lib/utils';

const constants = {
    WIDTH: 500,
    STROKE_WIDTH: 0.5,
};

interface CityColorMap {
    [key: string]: string;
}

interface PathStyles {
    base?: string;
    selectable?: string;
    nonSelectable?: string;
    hover?: string;
    selected?: string;
}

export interface MapProps {
    stateCode: string[];
    selectables?: string[];
    className?: string;
    pathStyles?: PathStyles;
    strokeWidth?: number;
    hints?: boolean;
    onSelect?: (state: string | null, selectedStates?: string[]) => void;
    cityColors?: CityColorMap;
    disableClick?: boolean;
    disableHover?: boolean;
    maxWidth?: string;
    maxHeight?: string;
    zoom?: number;
    panX?: number;
    panY?: number;
    name?: string;
}

const Map = ({
    stateCode,
    selectables = [],
    className,
    pathStyles = {
        base: "fill-muted stroke-muted-foreground",
        selectable: "opacity-100",
        nonSelectable: "opacity-40",
        hover: "fill-primary",
        selected: "fill-primary"
    },
    strokeWidth = constants.STROKE_WIDTH,
    hints,
    onSelect,
    cityColors = {},
    disableClick = false,
    disableHover = false,
    maxWidth = '600px',
    maxHeight = '600px',
    zoom = 1,
    panX = 0,
    panY = 0,
    name,
}: MapProps) => {
    const instanceId = useId().replace(/:/g, '');
    const [selectedStates, setSelectedStates] = useState<string[]>([]);
    const [hoveredState, setHoveredState] = useState<string | null>(null);
    const [baseViewBox, setBaseViewBox] = useState<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 100, height: 100 });
    const [aspectRatio, setAspectRatio] = useState<number>(1);

    useEffect(() => {
        const svg = document.getElementById(`svg2-${instanceId}`) as SVGGraphicsElement | null;
        if (svg) {
            const bbox = svg.getBBox();
            setBaseViewBox({ x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height });
            setAspectRatio(bbox.width / bbox.height);
        }
    }, [instanceId]);

    const viewBox = useMemo(() => {
        const centerX = baseViewBox.x + baseViewBox.width / 2;
        const centerY = baseViewBox.y + baseViewBox.height / 2;

        const scaledWidth = baseViewBox.width / zoom;
        const scaledHeight = baseViewBox.height / zoom;

        const viewX = centerX - scaledWidth / 2 - panX;
        const viewY = centerY - scaledHeight / 2 - panY;

        return `${viewX} ${viewY} ${scaledWidth} ${scaledHeight}`;
    }, [baseViewBox, zoom, panX, panY]);

    const containerStyle = useMemo(() => {
        const maxWidthNum = parseFloat(maxWidth);
        const maxHeightNum = parseFloat(maxHeight);

        let width = maxWidth;
        let height = maxHeight;

        if (aspectRatio > 0 && maxWidthNum && maxHeightNum) {
            const widthFromHeight = maxHeightNum * aspectRatio;
            const heightFromWidth = maxWidthNum / aspectRatio;

            if (widthFromHeight <= maxWidthNum) {
                width = `${widthFromHeight}${maxHeight.replace(/[\d.]/g, '')}`;
                height = maxHeight;
            } else {
                width = maxWidth;
                height = `${heightFromWidth}${maxWidth.replace(/[\d.]/g, '')}`;
            }
        }

        return {
            width,
            height,
            maxWidth,
            maxHeight,
        };
    }, [maxWidth, maxHeight, aspectRatio]);

    const scaledStrokeWidth = useMemo(() => strokeWidth / zoom, [strokeWidth, zoom]);

    const isSelectable = (code: string) => selectables.includes(code);

    const handleMouseEnter = (hoverStateId: string) => {
        if (!isSelectable(hoverStateId) || disableHover) return;
        setHoveredState(hoverStateId);
    };

    const handleMouseLeave = (hoverStateId: string) => {
        if (!isSelectable(hoverStateId) || disableHover) return;
        setHoveredState(null);
    };

    const handleClick = (stateCodeParam: string) => {
        if (disableClick || !isSelectable(stateCodeParam)) return;

        if (selectedStates.includes(stateCodeParam)) {
            const updatedSelectedStates = selectedStates.filter((state) => state !== stateCodeParam);
            setSelectedStates(updatedSelectedStates);
            if (onSelect) {
                onSelect(stateCodeParam, updatedSelectedStates);
            }
        } else {
            setSelectedStates((prevStates) => {
                const updatedStates = [...prevStates, stateCodeParam];
                if (onSelect) {
                    onSelect(stateCodeParam, updatedStates);
                }
                return updatedStates;
            });
        }
    };

    const getPathClassName = (code: string) => {
        const isSelected = selectedStates.includes(code);
        const isHovered = hoveredState === code;
        const selectable = isSelectable(code);

        return cn(
            pathStyles.base,
            selectable ? pathStyles.selectable : pathStyles.nonSelectable,
            isSelected && pathStyles.selected,
            isHovered && !isSelected && pathStyles.hover,
            (disableClick || !selectable) ? 'cursor-default' : 'cursor-pointer'
        );
    };

    return (
        <TooltipProvider>
            <div
                className={cn("map flex items-center justify-center", className)}
                style={containerStyle}
                data-name={name}
            >
                <svg
                    version="1.1"
                    id={`svg2-${instanceId}`}
                    viewBox={viewBox}
                    className="w-full h-full overflow-visible"
                    style={{ strokeWidth: scaledStrokeWidth }}
                >
                    {stateCode?.map((code, index) => (
                        hints ? (
                            isSelectable(code) ? (
                                <Tooltip key={index}>
                                    <TooltipTrigger data-slot="button">
                                        <path
                                            onClick={() => handleClick(code)}
                                            onMouseEnter={() => handleMouseEnter(code)}
                                            onMouseLeave={() => handleMouseLeave(code)}
                                            id={`${code}-${instanceId}`}
                                            d={drawPath[code as keyof typeof drawPath]}
                                            className={getPathClassName(code)}
                                            style={{
                                                fill: cityColors![code] ? cityColors![code] : undefined,
                                            }}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className='max-tablet:text-xs'>
                                            {code.replace(` ${name}`, '')}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <path
                                    key={index}
                                    onClick={() => handleClick(code)}
                                    onMouseEnter={() => handleMouseEnter(code)}
                                    onMouseLeave={() => handleMouseLeave(code)}
                                    id={`${code}-${instanceId}`}
                                    d={drawPath[code as keyof typeof drawPath]}
                                    className={getPathClassName(code)}
                                    style={{
                                        fill: cityColors![code] ? cityColors![code] : undefined,
                                    }}
                                />
                            )
                        ) : (
                            <path
                                key={index}
                                onClick={() => handleClick(code)}
                                onMouseEnter={() => handleMouseEnter(code)}
                                onMouseLeave={() => handleMouseLeave(code)}
                                id={`${code}-${instanceId}`}
                                d={drawPath[code as keyof typeof drawPath]}
                                className={getPathClassName(code)}
                                style={{
                                    fill: cityColors![code] ? cityColors![code] : undefined,
                                }}
                            />
                        )
                    ))}
                </svg>
            </div>
        </TooltipProvider>
    );
};

export default Map;