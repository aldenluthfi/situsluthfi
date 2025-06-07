import { useState, useRef, useCallback } from 'react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import {
    IconZoomIn,
    IconZoomOut,
    IconCurrentLocation,
    IconLock,
    IconArrowsMove
} from '@tabler/icons-react';
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

const ZOOM_STEP = 1.5;
const MIN_ZOOM = 0.9;
const MAX_ZOOM = 8;
const ANIMATION_DURATION = 300;

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
    const [dragLocked, setDragLocked] = useState(false);

    const dragStart = useRef<{ x: number; y: number } | null>(null);
    const panStart = useRef<{ x: number; y: number } | null>(null);

    const zoomRef = useRef(zoom);
    const panRef = useRef(pan);

    zoomRef.current = zoom;
    panRef.current = pan;

    const animateZoom = useCallback((targetZoom: number) => {
        const duration = ANIMATION_DURATION;
        const start = performance.now();
        const initialZoom = zoomRef.current;

        // EaseInOutCubic
        const ease = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

        function step(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = ease(progress);
            const newZoom = initialZoom + (targetZoom - initialZoom) * eased;
            if (Math.abs(newZoom - zoomRef.current) > 0.001) setZoom(newZoom);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else if (zoomRef.current !== targetZoom) {
                setZoom(targetZoom);
            }
        }
        if (zoomRef.current !== targetZoom) requestAnimationFrame(step);
    }, []);

    const animatePan = useCallback((targetX: number, targetY: number) => {
        const duration = ANIMATION_DURATION;
        const start = performance.now();
        const initialPan = { ...panRef.current };

        // EaseInOutCubic
        const ease = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

        function step(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = ease(progress);
            const newX = initialPan.x + (targetX - initialPan.x) * eased;
            const newY = initialPan.y + (targetY - initialPan.y) * eased;
            if (Math.abs(newX - panRef.current.x) > 0.5 || Math.abs(newY - panRef.current.y) > 0.5) {
                setPan({ x: newX, y: newY });
            }
            if (progress < 1) {
                requestAnimationFrame(step);
            } else if (panRef.current.x !== targetX || panRef.current.y !== targetY) {
                setPan({ x: targetX, y: targetY });
            }
        }
        if (panRef.current.x !== targetX || panRef.current.y !== targetY) requestAnimationFrame(step);
    }, []);

    const goBack = useCallback((level: number) => {
        return () => {
            animateZoom(0.001);
            animatePan(0, 0);

            setTimeout(() => {
                const newBreadcrumbs = breadcrumbs.slice(0, level + 1);
                setBreadcrumbs(newBreadcrumbs);
                setCurrentLevel(newBreadcrumbs.length - 1);
                setSelected(newBreadcrumbs[newBreadcrumbs.length - 1]);
                animateZoom(MIN_ZOOM);
            }, ANIMATION_DURATION);
        };
    }, [breadcrumbs, animateZoom, animatePan]);

    const handleSelect = useCallback((child: string | null) => {
        if (currentLevel >= 2) return;
        if (child && selectables?.[selected]?.includes(child)) {
            animateZoom(0.001);
            animatePan(0, 0);

            setTimeout(() => {
                setSelected(child as string);
                setBreadcrumbs((prev) => {
                    if (prev[prev.length - 1] === child) return prev;

                    const next = [...prev, child];
                    setCurrentLevel(next.length - 1);
                    return next;
                });
                animateZoom(MIN_ZOOM);
            }, ANIMATION_DURATION);
        }
    }, [currentLevel, selectables, selected, animateZoom, animatePan]);

    const handleZoomIn = useCallback(() => {
        const target = Math.min(zoomRef.current + ZOOM_STEP, MAX_ZOOM);
        animateZoom(target);
    }, [animateZoom]);

    const handleZoomOut = useCallback(() => {
        const target = Math.max(zoomRef.current - ZOOM_STEP, MIN_ZOOM);
        animateZoom(target);
    }, [animateZoom]);

    const handleRecenter = useCallback(() => {
        animateZoom(MIN_ZOOM);
        animatePan(0, 0);
    }, [animateZoom, animatePan]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (dragLocked) return;
        setDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
        panStart.current = { ...panRef.current };
    }, [dragLocked]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (dragLocked || !dragging || !dragStart.current || !panStart.current) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setPan({
            x: panStart.current.x + (dx / zoomRef.current),
            y: panStart.current.y + (dy / zoomRef.current),
        });
    }, [dragLocked, dragging]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (dragLocked || e.touches.length !== 1) return;
        e.preventDefault();
        setDragging(true);
        dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panStart.current = { ...panRef.current };
    }, [dragLocked]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (dragLocked || !dragging || !dragStart.current || !panStart.current || e.touches.length !== 1) return;
        e.preventDefault();
        const dx = e.touches[0].clientX - dragStart.current.x;
        const dy = e.touches[0].clientY - dragStart.current.y;
        setPan({
            x: panStart.current.x + (dx / zoomRef.current),
            y: panStart.current.y + (dy / zoomRef.current),
        });
    }, [dragLocked, dragging]);

    const endDrag = useCallback(() => {
        setDragging(false);
        dragStart.current = null;
        panStart.current = null;
    }, []);

    const renderBreadcrumb = () => (
        <Breadcrumb className="self-start">
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                    <div key={index} className="flex items-center gap-1.5">
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
                disableClick={currentLevel >= 2}
            />
        );

        return (
            <div
                className="relative flex items-center justify-center h-full w-full select-none"
                style={{ touchAction: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseMove={dragging && !dragLocked ? handleMouseMove : undefined}
                onMouseUp={endDrag}
                onMouseLeave={endDrag}
                onTouchStart={handleTouchStart}
                onTouchMove={dragging && !dragLocked ? handleTouchMove : undefined}
                onTouchEnd={endDrag}
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
                <div className="absolute bottom-3 right-3 flex flex-col gap-3">
                    <Button
                        onClick={() => setDragLocked(l => !l)}
                        variant="default"
                        size="icon"
                        aria-label={dragLocked ? "Unlock dragging" : "Lock dragging"}
                        type="button"
                    >
                        {dragLocked
                            ? <IconLock className='size-6' stroke={1.5} />
                            : <IconArrowsMove className='size-6' stroke={1.5} />
                        }
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
