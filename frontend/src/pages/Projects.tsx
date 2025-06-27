import SlidingTitle from '../components/custom/sliding-title';
import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { useTheme } from "@/components/custom/theme-provider";
import { useTimezoneTheme } from "@/hooks/use-timezone-theme";
import type { RepositoryObject } from "@/lib/types";
import autoplay from "embla-carousel-autoplay";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/animate-ui/components/tooltip";

const Projects: React.FC = () => {
    useEffect(() => {
        document.title = "aldenluth.fi | Projects";
    }, []);

    const [data, setData] = useState<RepositoryObject[]>([]);
    const [loading, setLoading] = useState(true);
    const autoplayRef = useRef(autoplay({
        delay: 7500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: true,
    }));
    const { mode } = useTheme();
    const { isDarkMode } = useTimezoneTheme();

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const response = await fetch('/api/github/repositories');
                const resData = await response.json();
                const repositories = resData.repositories || [];

                setData(repositories);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching repositories:", error);
            }
        };

        const handleSync = async () => {
            try {
                await fetch(`/api/github/repositories/sync`);
                fetchRepositories();
            } catch (error) {
                console.error("Error syncing repositories:", error);
            }
        };

        setLoading(true);
        fetchRepositories();
        handleSync();
    }, []);

    const getImageUrl = (repo: RepositoryObject) => {
        const shouldUseDarkImage = mode === 'timezone' ? !isDarkMode : mode !== 'dark';
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
        <div className='flex flex-col min-h-screen items-center overflow-clip gap-24'>
            <div className="flex flex-col w-full justify-center items-center space-y-6 mt-44">
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
                        <div className="z-10 relative flex justify-center gap-2 mb-[8.3333%] -mt-[8.3333%] h-full items-end desktop:hidden">
                            <CarouselPrevious className="relative top-10/12 left-0 translate-y-0 translate-x-0 rotate-180" />
                            <CarouselNext className="relative top-10/12 right-0 translate-y-0 translate-x-0  rotate-180" />
                        </div>
                        <CarouselNext className='hidden desktop:block z-10 -left-12 rotate-180'/>
                        <CarouselPrevious className='hidden desktop:block z-10 -right-15 rotate-180'/>
                        <CarouselContent>
                            {loading
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <CarouselItem key={i} className="basis-full">
                                        <div className='h-full w-full'>
                                            <Card className="motion-preset-fade h-full flex flex-col" style={{ animationDelay: `${i * 100}ms` }}>
                                                <CardHeader>
                                                    <div dir='ltr'>
                                                        <Skeleton className="w-full aspect-[2/1] rounded-md mb-4 tablet:mb-6" dir='ltr' />
                                                        <CardDescription>
                                                            <Skeleton className="h-4 w-full mb-2" dir='ltr' />
                                                            <Skeleton className="h-4 w-4/5 mb-2" dir='ltr' />
                                                            <Skeleton className="h-4 w-3/5 mb-3" dir='ltr' />
                                                            <div className="flex flex-wrap gap-2" dir='ltr'>
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
                                        <div className='h-full w-full'>
                                            <a
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block h-full"
                                            >
                                                <Card className="h-full flex flex-col">
                                                    <CardHeader>
                                                        {getImageUrl(repo) && (
                                                            <div className="relative w-full aspect-[2/1] mb-2 desktop:mb-4">
                                                                <ImageZoom onZoomChange={handleImageZoomChange}>
                                                                    <img
                                                                        src={getImageUrl(repo)}
                                                                        alt={`${repo.name} preview`}
                                                                        className="w-full h-full object-cover rounded-md"
                                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                                    />
                                                                </ImageZoom>
                                                            </div>
                                                        )}
                                                        <CardDescription>
                                                            {repo.description && (
                                                                <p className="text-base mb-3" dir='ltr'>{repo.description}</p>
                                                            )}
                                                            {repo.topics && repo.topics.length > 0 && (
                                                                <div className="flex flex-wrap gap-2" dir='ltr'>
                                                                    {repo.topics.map((topic) => {
                                                                        const iconName = repo.icon_map?.[topic];
                                                                        return (
                                                                            window.innerWidth < 768 ?
                                                                                <Tooltip key={topic}>
                                                                                    <TooltipTrigger>
                                                                                        <Pill onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className='my-0.5 text-base px-3 py-1.5 max-tablet:rounded-md max-tablet:p-2'>
                                                                                            {iconName ? <PillIcon icon={iconName} className='size-6 tablet:size-4' /> : <></>}
                                                                                            <span className='max-tablet:hidden'>{topic}</span>
                                                                                        </Pill>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>
                                                                                        <span className='text-center'>{topic}</span>
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                                :
                                                                                <Pill onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} key={topic} className='my-0.5 px-3 py-1.5 text-base max-tablet:rounded-md max-tablet:p-2'>
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
                                                                {new Date(repo.created_at).toLocaleDateString(
                                                                    "en-GB",
                                                                    {
                                                                        year: "numeric",
                                                                        month: "short",
                                                                        day: "numeric",
                                                                    }
                                                                )}
                                                            </span>
                                                        </div>
                                                    </CardFooter>
                                                </Card>
                                            </a>
                                        </div>
                                    </CarouselItem>
                                ))}
                        </CarouselContent>
                    </TooltipProvider>
                </Carousel>
            </div>
        </div>
    );
};

export default Projects;