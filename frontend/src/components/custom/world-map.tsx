import { useState, useRef } from 'react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { IconZoomIn, IconZoomOut, IconCurrentLocation } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface WorldMapProps {
    className?: string;
    pathStyles?: {
        base?: string;
        selectable?: string;
        nonSelectable?: string;
        hover?: string;
        selected?: string;
    };
    strokeWidth?: number;
    selectables?: {
        [parent: string]: string[];
    };
    components: { [key: string]: React.ComponentType<any> };
    maxWidth?: string;
    maxHeight?: string;
}

const ZOOM_STEP = 1;
const MIN_ZOOM = 0.9;
const MAX_ZOOM = 8;

const WorldMap = ({
    className,
    pathStyles,
    strokeWidth,
    selectables,
    components,
    maxWidth,
    maxHeight,
}: WorldMapProps) => {
    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [selected, setSelected] = useState<string>('World');
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['World']);

    const [zoom, setZoom] = useState(MIN_ZOOM);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);

    const dragStart = useRef<{ x: number; y: number } | null>(null);
    const panStart = useRef<{ x: number; y: number } | null>(null);

    const goBack = (level: number) => {
        return () => {
            const newBreadcrumbs = breadcrumbs.slice(0, level + 1);
            setBreadcrumbs(newBreadcrumbs);
            setCurrentLevel(level);
            setSelected(newBreadcrumbs[newBreadcrumbs.length - 1]);
            handleRecenter();
        };
    }

    const handleSelect = (child: string | null) => {
        if (child && selectables?.[selected]?.includes(child)) {
            setSelected(child as string);
            setCurrentLevel(1);
            setBreadcrumbs((prev) => [...prev, child]);
            handleRecenter();
        }
    };

    const handleZoomIn = () => setZoom(z => Math.min(z + ZOOM_STEP, MAX_ZOOM));
    const handleZoomOut = () => setZoom(z => Math.max(z - ZOOM_STEP, MIN_ZOOM));
    const handleRecenter = () => {
        setZoom(MIN_ZOOM);
        setPan({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
        panStart.current = { ...pan };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragging || !dragStart.current || !panStart.current) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setPan({
            x: panStart.current.x + dx,
            y: panStart.current.y + dy,
        });
    };

    const handleMouseUp = () => {
        setDragging(false);
        dragStart.current = null;
        panStart.current = null;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length !== 1) return;
        setDragging(true);
        dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panStart.current = { ...pan };
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!dragging || !dragStart.current || !panStart.current || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - dragStart.current.x;
        const dy = e.touches[0].clientY - dragStart.current.y;
        setPan({
            x: panStart.current.x + dx,
            y: panStart.current.y + dy,
        });
    };

    const handleTouchEnd = () => {
        setDragging(false);
        dragStart.current = null;
        panStart.current = null;
    };

    const renderBreadcrumb = () => (
        <Breadcrumb className="self-start">
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                    <div className="flex items-center gap-1.5">
                        {index > 0 && <BreadcrumbSeparator className='text-primary' />}
                        <BreadcrumbItem>
                            {index === currentLevel ? (
                                <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink
                                    onClick={goBack(index)}
                                    className="cursor-pointer text-primary hover:text-primary-800"
                                >
                                    {breadcrumb}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );

    const renderMap = () => {
        const SelectedComponent = components[selected as string];

        let mapContent = (
            <SelectedComponent
                selectables={selectables?.[selected as string] || []}
                hints
                pathStyles={pathStyles}
                strokeWidth={strokeWidth}
                onSelect={handleSelect}
                maxWidth={maxWidth}
                maxHeight={maxHeight}
                zoom={zoom}
                panX={pan.x}
                panY={pan.y}
            />
        );

        return (
            <div
                className="relative flex items-center justify-center h-full w-full select-none"
                style={{ touchAction: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseMove={dragging ? handleMouseMove : undefined}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={dragging ? handleTouchMove : undefined}
                onTouchEnd={handleTouchEnd}
            >
                {mapContent}
                <div className="absolute top-3 right-3 flex flex-col gap-3">
                    <Button
                        onClick={handleZoomIn}
                        variant="default"
                        size="icon"
                        aria-label="Zoom in"
                        type="button"
                    >
                        <IconZoomIn className='size-6' stroke={1.5} />
                    </Button>
                    <Button
                        onClick={handleZoomOut}
                        variant="default"
                        size="icon"
                        aria-label="Zoom out"
                        type="button"
                    >
                        <IconZoomOut className='size-6' stroke={1.5} />
                    </Button>
                    <Button
                        onClick={handleRecenter}
                        variant="default"
                        size="icon"
                        aria-label="Recenter"
                        type="button"
                    >
                        <IconCurrentLocation className='size-6' stroke={1.5} />
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div
            className={cn("relative flex flex-col items-center border border-primary rounded-xl bg-background", className)}
            style={{
                width: maxWidth || '100%',
                height: maxHeight || '100%',
                maxWidth: maxWidth || '100%',
                maxHeight: maxHeight || '100%',
            }}
        >
            <div className='py-3 px-4 w-full border-b'>
                {renderBreadcrumb()}
            </div>
            <div className="flex items-center justify-center h-full w-full rounded-b-xl overflow-hidden bg-background">
                {renderMap()}
            </div>
        </div>
    );
};

export default WorldMap;
