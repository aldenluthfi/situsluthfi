import { useState, useRef } from 'react';

import { Continents, Asia, Europe, Indonesia, Malaysia, Singapore, SouthKorea, Thailand, SaudiArabia, UAE } from '@/components/maps';

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

type ViewLevel = 'world' | 'continent' | 'country';
type ContinentType = 'Asia' | 'Europe' | 'Africa' | 'Australia and Oceania' | 'Latin America' | 'North America';

const continentComponents = {
    'Asia': Asia,
    'Europe': Europe,
} as const;

const countryComponents: { [key: string]: React.ComponentType<any> } = {
    'Indonesia': Indonesia,
    'Malaysia': Malaysia,
    'Singapore': Singapore,
    'South Korea': SouthKorea,
    'Thailand': Thailand,
    'Saudi Arabia': SaudiArabia,
    'United Arab Emirates': UAE,
};

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
        continents?: ContinentType[];
        countries?: {
            [continent: string]: string[];
        } & {
            [country: string]: string[];
        };
    };
    onCountrySelect?: (country: string, continent: string) => void;
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
    onCountrySelect,
    maxWidth,
    maxHeight,
}: WorldMapProps) => {
    const [currentLevel, setCurrentLevel] = useState<ViewLevel>('world');
    const [selectedContinent, setSelectedContinent] = useState<ContinentType | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [zoom, setZoom] = useState(MIN_ZOOM);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const dragStart = useRef<{ x: number; y: number } | null>(null);
    const panStart = useRef<{ x: number; y: number } | null>(null);

    const handleContinentSelect = (continent: string | null) => {
        if (continent && selectables?.continents?.includes(continent as ContinentType)) {
            setSelectedContinent(continent as ContinentType);
            setCurrentLevel('continent');
            handleRecenter();
        }
    };

    const handleCountrySelect = (country: string | null) => {
        if (country && selectedContinent && selectables?.countries?.[selectedContinent]?.includes(country)) {
            setSelectedCountry(country);
            setCurrentLevel('country');
            handleRecenter();
            onCountrySelect?.(country, selectedContinent);
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

    const goToWorld = () => {
        setCurrentLevel('world');
        setSelectedContinent(null);
        setSelectedCountry(null);
        setZoom(MIN_ZOOM);
        setPan({ x: 0, y: 0 });
    };

    const goToContinent = (continent: ContinentType) => {
        setSelectedContinent(continent);
        setCurrentLevel('continent');
        setSelectedCountry(null);
        setZoom(MIN_ZOOM);
        setPan({ x: 0, y: 0 });
    };

    const renderBreadcrumb = () => (
        <Breadcrumb className="self-start">
            <BreadcrumbList>
                { currentLevel === 'world' && (
                    <BreadcrumbItem>
                        <BreadcrumbPage>World</BreadcrumbPage>
                    </BreadcrumbItem>
                )}
                { currentLevel !== 'world' && (
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={goToWorld}
                            className="cursor-pointer text-primary hover:text-primary-800"
                        >
                            World
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                )}
                {selectedContinent && currentLevel !== 'continent' && (
                    <>
                        <BreadcrumbSeparator className='text-primary'/>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                onClick={() => goToContinent(selectedContinent)}
                                className="cursor-pointer text-primary hover:text-primary-800"
                            >
                                {selectedContinent}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                )}
                {selectedContinent && currentLevel === 'continent' && (
                    <>
                        <BreadcrumbSeparator className='text-primary'/>
                        <BreadcrumbItem>
                            <BreadcrumbPage>{selectedContinent}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
                {selectedCountry && (
                    <>
                        <BreadcrumbSeparator className='text-primary'/>
                        <BreadcrumbItem>
                            <BreadcrumbPage>{selectedCountry}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );

    const renderMap = () => {
        let mapContent;

        switch (currentLevel) {
            case 'world':
                mapContent = (
                    <Continents
                        selectables={selectables?.continents}
                        hints
                        pathStyles={pathStyles}
                        strokeWidth={strokeWidth}
                        onSelect={handleContinentSelect}
                        maxWidth={maxWidth}
                        maxHeight={maxHeight}
                        zoom={zoom}
                        panX={pan.x}
                        panY={pan.y}
                    />
                );
                break;
            case 'continent':
                if (selectedContinent && selectedContinent in continentComponents) {
                    const ContinentComponent = continentComponents[selectedContinent as keyof typeof continentComponents];
                    mapContent = (
                        <ContinentComponent
                            selectables={selectables?.countries?.[selectedContinent] || []}
                            hints
                            pathStyles={pathStyles}
                            strokeWidth={strokeWidth}
                            onSelect={handleCountrySelect}
                            maxWidth={maxWidth}
                            maxHeight={maxHeight}
                            zoom={zoom}
                            panX={pan.x}
                            panY={pan.y}
                        />
                    );
                } else {
                    mapContent = (
                        <div className="flex flex-col items-center justify-center py-8">
                            <h2 className="text-xl font-semibold mb-2">{selectedContinent}</h2>
                            <p className="text-muted-foreground">Map for this continent is not yet available</p>
                            <button
                                onClick={goToWorld}
                                className="mt-4 text-primary hover:underline"
                            >
                                Back to World Map
                            </button>
                        </div>
                    );
                }
                break;
            case 'country':
                if (selectedCountry && selectedCountry in countryComponents) {
                    const CountryComponent = countryComponents[selectedCountry];
                    mapContent = (
                        <CountryComponent
                            selectables={selectables?.countries?.[selectedCountry] || []}
                            hints
                            pathStyles={pathStyles}
                            strokeWidth={strokeWidth}
                            maxWidth={maxWidth}
                            maxHeight={maxHeight}
                            zoom={zoom}
                            panX={pan.x}
                            panY={pan.y}
                        />
                    );
                } else {
                    mapContent = (
                        <div className="flex flex-col items-center justify-center py-8">
                            <h2 className="text-2xl font-bold mb-4">{selectedCountry}</h2>
                            <p className="text-muted-foreground">Country details would go here</p>
                        </div>
                    );
                }
                break;
            default:
                mapContent = null;
        }

        const isPanZoomEnabled = currentLevel === 'world' || currentLevel === 'continent' || currentLevel === 'country';

        return (
            <div
                className="relative flex items-center justify-center h-full w-full select-none"
                style={{ touchAction: 'none' }}
                onMouseDown={isPanZoomEnabled ? handleMouseDown : undefined}
                onMouseMove={isPanZoomEnabled && dragging ? handleMouseMove : undefined}
                onMouseUp={isPanZoomEnabled ? handleMouseUp : undefined}
                onMouseLeave={isPanZoomEnabled ? handleMouseUp : undefined}
                onTouchStart={isPanZoomEnabled ? handleTouchStart : undefined}
                onTouchMove={isPanZoomEnabled && dragging ? handleTouchMove : undefined}
                onTouchEnd={isPanZoomEnabled ? handleTouchEnd : undefined}
            >
                {mapContent}
                {isPanZoomEnabled && (
                    <div className="absolute top-3 right-3 flex flex-col gap-3">
                        <Button
                            onClick={handleZoomIn}
                            variant="default"
                            size="icon"
                            aria-label="Zoom in"
                            type="button"
                        >
                            <IconZoomIn className='size-6' stroke={1.5}/>
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
                )}
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
