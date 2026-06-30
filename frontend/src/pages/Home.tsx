import SlidingTitle from '../components/custom/sliding-title';
import Squiggle from '../components/custom/squiggle';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { useState, useEffect } from 'react';
import { cn, isMobile } from "@/lib/utils";
import { api, isAbortError } from "@/lib/api";

import soloImg from "@/assets/images/solo.webp";
import holeboysImg from "@/assets/images/holeboys.webp";
import medpropImg from "@/assets/images/medprop.webp";
import weirdosImg from "@/assets/images/weirdos.webp";

import { Skeleton } from "@/components/ui/skeleton";
import Autoplay from 'embla-carousel-autoplay';

import CV from "@/components/custom/cv";
import ProjectStack from "@/components/custom/project-stack";

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

    return (
        <div className="flex flex-col min-h-screen items-center overflow-clip gap-24">
            <div className="flex flex-col w-full justify-center items-center space-y-6 mt-44">
                <p className="text-lg tablet:text-2xl text-center">
                    Hello! my name is <span className="text-primary font-bold">Luthfi</span>, <span />
                    <br />
                    but most people call me <span className="text-primary font-bold">Upi</span>, I'm a
                </p>
                <SlidingTitle
                    text="Humanitarian Activist · Software Developer · Teaching Assistant · Graphic Designer · Cinephile"
                    direction={1}
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

            <div className="flex flex-col w-full justify-center items-center space-y-6">
                <p className="text-lg tablet:text-2xl text-center mb-6">
                    These are my <span className="text-primary font-bold">projects</span>
                    <br />
                    here you can find a growing collection of
                </p>
                <SlidingTitle text="Algorithms · Frameworks · Languages · Experiments · Tech Stacks" direction={-1} />
                <p className="text-lg tablet:text-2xl text-center">
                    I explored in my journey as a developer,
                    <br />
                    <span className="text-primary font-bold">stay tuned</span> for updates!
                </p>
            </div>
            <div className="flex flex-col -space-y-0.25 border-0 w-full">
                <Squiggle className="w-full fill-primary-100" />
                <div className="bg-primary-100 w-screen z-10 flex justify-center py-8">
                    <div className="w-full max-w-desktop px-6">
                        <ProjectStack repos={data} loading={loading} />
                    </div>
                </div>
                <Squiggle className="-scale-y-100 w-full fill-primary-100" />
            </div>

            <div className='w-full max-w-desktop px-6 flex flex-col items-center pb-12'>
                <p className="text-lg tablet:text-2xl text-center">
                    As you can probably see, I'm a
                    <br />
                    <span className="text-primary font-bold">Jack of all trades</span>, you can have me as
                </p>
                <CV showTabs autoPlay className='w-full' />
            </div>
        </div>
    );
};

export default Home;
