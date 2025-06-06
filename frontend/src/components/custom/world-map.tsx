import { useState } from 'react';
import Continents from '@/components/maps/continents';
import Asia from '@/components/maps/asia';
import Europe from '@/components/maps/europe';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

type ViewLevel = 'world' | 'continent' | 'country';
type ContinentType = 'Asia' | 'Europe' | 'Africa' | 'Australia and Oceania' | 'Latin America' | 'North America';

const continentComponents = {
    'Asia': Asia,
    'Europe': Europe,
} as const;

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
        countries?: { [continent: string]: string[] };
    };
    onCountrySelect?: (country: string, continent: string) => void;
}

const WorldMap = ({
    className,
    pathStyles,
    strokeWidth,
    selectables,
    onCountrySelect
}: WorldMapProps) => {
    const [currentLevel, setCurrentLevel] = useState<ViewLevel>('world');
    const [selectedContinent, setSelectedContinent] = useState<ContinentType | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    const handleContinentSelect = (continent: string | null) => {
        if (continent && selectables?.continents?.includes(continent as ContinentType)) {
            setSelectedContinent(continent as ContinentType);
            setCurrentLevel('continent');
        }
    };

    const handleCountrySelect = (country: string | null) => {
        if (country && selectedContinent && selectables?.countries?.[selectedContinent]?.includes(country)) {
            setSelectedCountry(country);
            setCurrentLevel('country');
            onCountrySelect?.(country, selectedContinent);
        }
    };

    const goToWorld = () => {
        setCurrentLevel('world');
        setSelectedContinent(null);
        setSelectedCountry(null);
    };

    const goToContinent = (continent: ContinentType) => {
        setSelectedContinent(continent);
        setCurrentLevel('continent');
        setSelectedCountry(null);
    };

    const renderBreadcrumb = () => (
        <Breadcrumb className="mb-4">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink
                        onClick={goToWorld}
                        className="cursor-pointer hover:text-primary"
                    >
                        World
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {selectedContinent && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                onClick={() => goToContinent(selectedContinent)}
                                className="cursor-pointer hover:text-primary"
                            >
                                {selectedContinent}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                )}
                {selectedCountry && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{selectedCountry}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );

    const renderMap = () => {
        switch (currentLevel) {
            case 'world':
                return (
                    <Continents
                        selectables={selectables?.continents}
                        hints
                        pathStyles={pathStyles}
                        strokeWidth={strokeWidth}
                        onSelect={handleContinentSelect}
                    />
                );
            case 'continent':
                if (selectedContinent && selectedContinent in continentComponents) {
                    const ContinentComponent = continentComponents[selectedContinent as keyof typeof continentComponents];
                    return (
                        <ContinentComponent
                            selectables={selectables?.countries?.[selectedContinent] || []}
                            hints
                            pathStyles={pathStyles}
                            strokeWidth={strokeWidth}
                            onSelect={handleCountrySelect}
                        />
                    );
                }
                return (
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
            case 'country':
                return (
                    <div className="flex flex-col items-center justify-center py-8">
                        <h2 className="text-2xl font-bold mb-4">{selectedCountry}</h2>
                        <p className="text-muted-foreground">Country details would go here</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={cn("relative", className)}>
            <div className="space-y-4">
                {renderBreadcrumb()}
                {renderMap()}
            </div>
        </div>
    );
};

export default WorldMap;
