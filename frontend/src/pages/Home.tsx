import SlidingTitle from '../components/custom/sliding-title';
import Squiggle from '../components/custom/squiggle';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { useState, useEffect, useRef } from 'react';
import { cn, isMobile, formatDate, BREAKPOINTS } from "@/lib/utils";
import { api, isAbortError } from "@/lib/api";

import soloImg from "@/assets/images/solo.webp";
import holeboysImg from "@/assets/images/holeboys.webp";
import medpropImg from "@/assets/images/medprop.webp";
import weirdosImg from "@/assets/images/weirdos.webp";

import { Skeleton } from "@/components/ui/skeleton";
import Autoplay from 'embla-carousel-autoplay';

import CV from "@/components/custom/cv";

import {
    Card,
    CardHeader,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Pill, PillIcon } from "@/components/ui/kibo-ui/pill";
import { ImageZoom } from "@/components/ui/kibo-ui/image-zoom";
import {
    IconStar,
    IconGitFork,
    IconScale,
    IconCalendar
} from "@tabler/icons-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/animate-ui/components/tooltip";

import WorldMap from '@/components/custom/world-map';
import { Continents, Asia, Europe, Indonesia, Malaysia, Singapore, SouthKorea, Thailand, SaudiArabia, UAE, Belgium, France, Germany, Netherlands, Italy, Switzerland, Spain } from '@/components/maps';

import { useTheme } from "@/components/custom/theme-provider";
import { useTimezoneTheme } from "@/hooks/use-timezone-theme";
import type { RepositoryObject } from "@/lib/types";

const ResponsiveTooltip = ({
    children,
    content
}: {
    children: React.ReactNode,
    content: React.ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        let timeoutId: number | undefined;
        if (isOpen && isMobile) {
            timeoutId = window.setTimeout(() => {
                setIsOpen(false);
            }, 1500);
        }
        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [isOpen]);

    return (
        <Popover open={isOpen}>
            <PopoverTrigger
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                onMouseDown={() => setIsOpen(true)}
                asChild
            >
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-auto text-sm tablet:text-md ultrawide:text-lg" hideWhenDetached>
                {content}
            </PopoverContent>
        </Popover>
    );
};

const ImageWithSkeleton: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="relative w-full">
            {!loaded && (
                <Skeleton className="absolute inset-0 tablet:basis-1/2 desktop:basis-5/12 rounded-xl" />
            )}
            <img
                src={src}
                alt={alt}
                className={cn(
                    "rounded-xl w-full transition-opacity duration-300",
                    !isMobile && "hover:motion-scale-out-105 motion-scale-in-105 motion-ease-spring-bouncier motion-duration-300",
                    loaded ? "opacity-100" : "opacity-0",
                    className
                )}
                onLoad={() => setLoaded(true)}
                draggable={false}
            />
        </div>
    );
};

const Home: React.FC = () => {
    const [data, setData] = useState<RepositoryObject[]>([]);
    const [loading, setLoading] = useState(true);
    const autoplayRef = useRef(Autoplay({
        delay: 7500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: true,
    }));
    const { mode } = useTheme();
    const { isDarkMode } = useTimezoneTheme();

    const isEffectivelyDark = mode === 'dark' || (mode === 'timezone' && isDarkMode);

    useEffect(() => {
        document.title = "aldenluth.fi | Home";

        const images = [soloImg, holeboysImg, medpropImg, weirdosImg];
        const preloadLinks: HTMLLinkElement[] = [];

        images.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
            preloadLinks.push(link);
        });


        return () => {
            preloadLinks.forEach(link => {
                if (document.head.contains(link)) {
                    document.head.removeChild(link);
                }
            });
        };
    }, []);

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const { repositories } = await api.getRepositories();
                setData(repositories ?? []);
                setLoading(false);
            } catch (error) {
                if (!isAbortError(error)) {
                    console.error("Error fetching repositories:", error);
                }
            }
        };

        const handleSync = async () => {
            try {
                await api.syncRepositories();
                fetchRepositories();
            } catch (error) {
                if (!isAbortError(error)) {
                    console.error("Error syncing repositories:", error);
                }
            }
        };

        setLoading(true);
        fetchRepositories();
        handleSync();
    }, []);

    const getImageUrl = (repo: RepositoryObject) => {
        const shouldUseDarkImage = mode === 'timezone' ? isDarkMode : mode === 'dark';
        const imageUrl = shouldUseDarkImage ? repo.cover_dark_url : repo.cover_light_url;
        const fallbackUrl = shouldUseDarkImage ? repo.cover_light_url : repo.cover_dark_url;
        return imageUrl || fallbackUrl;
    };

    const handleImageZoomChange = (isZoomed: boolean) => {
        if (autoplayRef.current) {
            if (isZoomed) {
                autoplayRef.current.stop();
            } else {
                autoplayRef.current.play();
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen items-center overflow-clip gap-24">
            <div className="flex flex-col w-full justify-center items-center space-y-6 mt-44">
                <p className="text-lg tablet:text-2xl text-center">
                    Hello! my name is <span className="text-primary font-bold">Luthfi</span>, <span />
                    <br />
                    but most people call me <span className="text-primary font-bold">Upi</span>, I'm a
                </p>
                <SlidingTitle
                    text="Humanitarian Activist · Creative Overthinker · Teaching Assistant · Snobby Cinephile · Graphic Designer"
                />
                <p
                    className="text-lg tablet:text-2xl text-center">
                    and a <span className="text-primary font-bold">computer science</span> student
                    <br />
                    at Universitas Indonesia
                </p>
            </div>

            <div className="flex flex-col -space-y-0.25 border-0">
                <Squiggle className="w-full fill-primary-100" />

                <Carousel
                    opts={{
                        loop: true,
                        watchFocus: false,
                        direction: "rtl",
                    }}
                    plugins={[
                        Autoplay(
                            {
                                delay: 7500,
                                stopOnInteraction: false,
                                stopOnMouseEnter: true,
                                playOnInit: true,
                            }
                        )
                    ]}
                    className='bg-primary-100 z-10 w-screen'
                    dir='rtl'
                >
                    <CarouselContent className="py-8">
                        {
                            Array(2).fill(0).flatMap(() => ([
                                { src: soloImg, alt: "Solo", tooltip: "This is me, Hi!" },
                                { src: medpropImg, alt: "Media and Propaganda", tooltip: "Media and Propaganda team, loud and clear!" },
                                { src: weirdosImg, alt: "Just Weirdos", tooltip: "Weirdos being weirdos" },
                                { src: holeboysImg, alt: "Hole Boys", tooltip: "Just some boys coming out from a hole on the wall" },
                            ])).map((image, index) => (
                                <CarouselItem key={index + 1} className="ml-8 mr-4 max-w-10/12 tablet:basis-1/2 desktop:basis-5/12">
                                    <ResponsiveTooltip content={<p>{image.tooltip}</p>}>
                                        <div className='overflow-visible'>
                                            <ImageWithSkeleton
                                                src={image.src}
                                                alt={image.alt}
                                            />
                                        </div>
                                    </ResponsiveTooltip>
                                </CarouselItem>
                            ))
                        }
                    </CarouselContent>
                </Carousel>

                <Squiggle className="-scale-y-100 w-full fill-primary-100" />
            </div>

            <div className='max-w-desktop'>
                <p className="text-lg tablet:text-2xl text-center">
                    As you can probably see, I'm a
                    <br />
                    <span className="text-primary font-bold">Jack of all trades</span>, you can have me as
                </p>
                <CV showTabs autoPlay className='pb-24'/>
            </div>

            <div className="flex flex-col w-full justify-center items-center space-y-6">
                <p className="text-lg tablet:text-2xl text-center mb-6">
                    These are my <span className="text-primary font-bold">projects</span>
                    <br />
                    Here you can find a growing collection of
                </p>
                <SlidingTitle text="Algorithms · Frameworks · Languages · Experiments · Tech Stacks" />
                <p className="text-lg tablet:text-2xl text-center">
                    I explored in my journey as a developer
                    <br />
                    <span className="text-primary font-bold">stay tuned</span> for updates!
                </p>
            </div>
            <div className="w-full max-w-desktop pb-24">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                        direction: "rtl",
                    }}
                    plugins={[autoplayRef.current]}
                    dir="rtl"
                    className='w-10/12 mx-auto'
                >
                    <TooltipProvider openDelay={0} closeDelay={500}>
                        <div className="z-10 relative flex justify-center gap-2 mb-3 -mt-3 h-full items-end desktop:hidden">
                            <CarouselPrevious className="relative top-10/12 left-0 translate-y-0 translate-x-0 rotate-180" />
                            <CarouselNext className="relative top-10/12 right-0 translate-y-0 translate-x-0 rotate-180" />
                        </div>
                        <CarouselNext className='hidden desktop:block z-10 -left-12 rotate-180' />
                        <CarouselPrevious className='hidden desktop:block z-10 -right-15 rotate-180' />
                        <CarouselContent>
                            {loading
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <CarouselItem key={i} className="basis-full">
                                        <div className='h-full w-full'>
                                            <Card className="motion-preset-fade h-full flex flex-col" style={{ animationDelay: `${i * 100}ms` }}>
                                                <CardHeader>
                                                    <div dir='ltr'>
                                                        <Skeleton className="w-full rounded-md aspect-[2/1] mb-4 tablet:mb-6" dir='ltr' />
                                                        <CardDescription>
                                                            <div className='min-h-28'>
                                                                <Skeleton className="h-4 w-full mb-2" dir='ltr' />
                                                                <Skeleton className="h-4 w-4/5 mb-2" dir='ltr' />
                                                                <Skeleton className="h-4 w-3/5 mb-3" dir='ltr' />
                                                                <Skeleton className="h-4 w-1/5 mb-3" dir='ltr' />
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 min-h-22" dir='ltr'>
                                                                <Skeleton className="size-10 tablet:h-9 tablet:w-28 rounded-md tablet:rounded-full" dir='ltr' />
                                                                <Skeleton className="size-10 tablet:h-9 tablet:w-32 rounded-md tablet:rounded-full" dir='ltr' />
                                                                <Skeleton className="size-10 tablet:h-9 tablet:w-22 rounded-md tablet:rounded-full" dir='ltr' />
                                                                <Skeleton className="size-10 tablet:h-9 tablet:w-30 rounded-md tablet:rounded-full" dir='ltr' />
                                                            </div>
                                                        </CardDescription>
                                                    </div>
                                                </CardHeader>
                                                <CardFooter className="mt-auto">
                                                    <div className="flex justify-between flex-col tablet:flex-row items-start tablet:items-end w-full gap-1" dir='ltr'>
                                                        <div className="flex desktop:flex-row flex-col-reverse gap-1 desktop:gap-4">
                                                            <div className="flex gap-4">
                                                                <Skeleton className="h-4 w-8" />
                                                                <Skeleton className="h-4 w-8" />
                                                                <Skeleton className="h-4 w-12" />
                                                            </div>
                                                        </div>
                                                        <Skeleton className="h-4 w-20" />
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))
                                : data.map((repo) => (
                                    <CarouselItem key={repo.id} className="basis-full">
                                        <div className='h-full w-full flex flex-col items-stretch'>
                                            <Card className="h-full flex flex-col">
                                                <CardHeader>
                                                    {getImageUrl(repo) && (
                                                        <div className="relative w-full aspect-[2/1] mb-2 desktop:mb-4">
                                                            <ImageZoom onZoomChange={handleImageZoomChange} data-slot="button">
                                                                <img
                                                                    src={getImageUrl(repo)}
                                                                    alt={`${repo.name} preview`}
                                                                    className="w-full h-full object-cover"
                                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                                />
                                                            </ImageZoom>
                                                        </div>
                                                    )}
                                                    <CardDescription>
                                                        <div className='min-h-28'>
                                                            {repo.description && (
                                                                <p className="text-base line-clamp-3 mb-1" dir='ltr'>{repo.description}</p>
                                                            )}
                                                            <a
                                                                href={repo.html_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="underline text-muted-foreground text-left mb-3"
                                                            >
                                                                <p dir='ltr'>View on GitHub</p>
                                                            </a>
                                                        </div>
                                                        {repo.topics && repo.topics.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 min-h-22" dir='ltr'>
                                                                {repo.topics.map((topic) => {
                                                                    const iconName = repo.icon_map?.[topic];
                                                                    return (
                                                                        window.innerWidth < BREAKPOINTS.tablet ?
                                                                            <Tooltip key={topic}>
                                                                                <TooltipTrigger>
                                                                                    <Pill onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className='h-min my-0.5 text-base px-3 py-1.5 max-tablet:rounded-md max-tablet:p-2'>
                                                                                        {iconName ? <PillIcon icon={iconName} className='size-6 tablet:size-4' /> : <></>}
                                                                                        <span className='max-tablet:hidden'>{topic}</span>
                                                                                    </Pill>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    <span className='text-center'>{topic}</span>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                            :
                                                                            <Pill onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} key={topic} className='h-min my-0.5 px-3 py-1.5 text-base max-tablet:rounded-md max-tablet:p-2'>
                                                                                {iconName ? <PillIcon icon={iconName} className='size-6 tablet:size-4' /> : <></>}
                                                                                <span className='max-tablet:hidden'>{topic}</span>
                                                                            </Pill>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardFooter className='mt-auto'>
                                                    <div className="flex justify-between flex-col tablet:flex-row items-start tablet:items-end text-base text-muted-foreground w-full gap-1" dir='ltr'>
                                                        <div className="flex desktop:flex-row flex-col-reverse gap-1 desktop:gap-4">
                                                            {repo.stargazers_count > 0 && (
                                                                <div className="flex items-center gap-1">
                                                                    <IconStar className="size-4" stroke={1.5} />
                                                                    {repo.stargazers_count}
                                                                </div>
                                                            )}
                                                            {repo.forks_count > 0 && (
                                                                <div className="flex items-center gap-1">
                                                                    <IconGitFork className="size-4" stroke={1.5} />
                                                                    {repo.forks_count}
                                                                </div>
                                                            )}
                                                            {repo.license && (
                                                                <div className="flex items-center gap-1">
                                                                    <IconScale className="size-4" stroke={1.5} />
                                                                    {typeof repo.license === 'string' ? repo.license : repo.license.spdx_id || repo.license.key}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className='flex items-center gap-1'>
                                                            <IconCalendar className="tablet:hidden size-4" stroke={1.5} />
                                                            {formatDate(repo.created_at, "short")}
                                                        </span>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                        </CarouselContent>
                    </TooltipProvider>
                </Carousel>
            </div>

            <div className="flex flex-col w-full justify-center items-center space-y-6">
                <p className="text-lg tablet:text-2xl text-center mb-6">
                    This is my silly excuse of a <span className="text-primary font-bold">gallery</span>, <span />
                    <br />
                    here you will find
                </p>
                <SlidingTitle text="People · Panoramas · Cultures · Oddities" />
                <p className="text-lg tablet:text-2xl text-center mt-6">
                    I have <span className="text-primary font-bold">seen</span> in all
                    <br />
                    of my travels around this <span className="text-primary font-bold">blob of dust</span>
                </p>
            </div>
            <div className='flex flex-col -space-y-0.25 justify-center items-center w-full'>
                <Squiggle className="w-full fill-primary-100" />
                <div className='bg-primary-100 w-screen py-[3.6666%] desktop:py-[2vh] flex justify-center items-center z-10'>
                    <WorldMap
                        components={
                            {
                                'World': Continents,
                                'Asia': Asia,
                                'Europe': Europe,
                                'Indonesia': Indonesia,
                                'Malaysia': Malaysia,
                                'Singapore': Singapore,
                                'South Korea': SouthKorea,
                                'Thailand': Thailand,
                                'Saudi Arabia': SaudiArabia,
                                'United Arab Emirates': UAE,
                                'Belgium': Belgium,
                                'France': France,
                                'Germany': Germany,
                                'Italy': Italy,
                                'Netherlands': Netherlands,
                                'Spain': Spain,
                                'Switzerland': Switzerland
                            }
                        }
                        selectables={{
                            'World': ['Asia', 'Europe'],
                            'Asia': ['Saudi Arabia', 'United Arab Emirates', 'Thailand', 'Indonesia', 'Malaysia', 'Singapore', 'South Korea', 'Qatar'],
                            'Europe': ['France', 'Germany', 'Belgium', 'Italy', 'Spain', 'Netherlands', 'Switzerland'],
                            'Indonesia': ['Banten', 'Jakarta Raya', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Bali', 'Nusa Tenggara Timur', 'Lampung', 'Yogyakarta'],
                            'Malaysia': ['Johor', 'Penang', 'Kuala Lumpur', 'Pahang'],
                            'Singapore': ['Central Singapore', 'North East Singapore', 'North West Singapore', 'South East Singapore', 'South West Singapore'],
                            'South Korea': ['Seoul', 'Incheon', 'Jeju'],
                            'Thailand': ['Bangkok', 'Chon Buri'],
                            'Saudi Arabia': ['Ar Riyāḑ', 'Makkah', 'Al Madīnah'],
                            'United Arab Emirates': ['Dubayy'],
                            'Belgium': ['Brussels Capital Region'],
                            'France': ['Île-de-France', 'Alsace'],
                            'Germany': ['Hesse'],
                            'Italy': ['Toscana', 'Veneto', 'Lazio', 'Vatican City Italy'],
                            'Netherlands': ['Noord-Holland'],
                            'Spain': ['Catalonia', 'Andalusia'],
                            'Switzerland': ['Obwalden', 'Bern', 'Genève']
                        }
                        }
                        pathStyles={isEffectivelyDark ? {
                            base: "stroke-muted",
                            hover: "fill-primary",
                            selected: "fill-primary",
                            selectable: "fill-primary-400 stroke-primary-300 pointer-events-auto",
                            nonSelectable: "fill-card"
                        } :
                            {
                                base: "stroke-muted-foreground/50",
                                hover: "fill-primary",
                                selected: "fill-primary",
                                selectable: "fill-primary-400 stroke-primary-600 pointer-events-auto",
                                nonSelectable: "fill-muted"
                            }
                        }
                        strokeWidth={1}
                        maxHeight='83.3333vh'
                        maxWidth={window.innerWidth < BREAKPOINTS.desktop ? '83.3333vw' : '95vw'}
                    />
                </div>
                <Squiggle className="w-full fill-primary-100 -scale-y-100" />
            </div>
        </div>
    );
};

export default Home;
