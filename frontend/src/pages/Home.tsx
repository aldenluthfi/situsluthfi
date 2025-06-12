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

import { DirectionAwareTabs } from "@/components/ui/direction-aware-tabs"

import { useState, useEffect } from 'react';
import { cn, isMobile } from "@/lib/utils";

import { IconSparkles, IconCode, IconHeartHandshake, IconSchool, IconCloudLock, IconDeviceGamepad2, IconPalette } from '@tabler/icons-react';

import soloImg from "../assets/images/solo.webp";
import holeboysImg from "../assets/images/holeboys.webp";
import medpropImg from "../assets/images/medprop.webp";

import { Skeleton } from "@/components/ui/skeleton";

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
            <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
            )}
            <img
            src={src}
            alt={alt}
            className={cn(
                "rounded-xl w-full transition-opacity duration-300",
                isMobile && "hover:motion-scale-out-105 motion-scale-in-105 motion-ease-spring-bouncier motion-duration-300",
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
    useEffect(() => {
        document.title = "aldenluth.fi | Home";

        const images = [soloImg, holeboysImg, medpropImg];
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

    const cv_tabs = [
        {
            id: 0,
            label: "a software developer",
            icon: <IconCode className='size-6' stroke={1.5} />,
            content: (
                <div className='p-8'>
                </div>
            )
        },
        {
            id: 1,
            label: "a game developer",
            icon: <IconDeviceGamepad2 className='size-6' stroke={1.5} />,
            content: (
                <div className='p-8'>
                </div>
            )
        },
        {
            id: 2,
            label: "a cybersecurity analyst",
            icon: <IconCloudLock className='size-6' stroke={1.5} />,
            content: (
                <div className='p-8'>
                </div>
            )
        },
        {
            id: 3,
            label: "a graphic designer",
            icon: <IconPalette className='size-6' stroke={1.5} />,
            content: (
                <div className='p-8'>
                </div>
            )
        },
        {
            id: 4,
            label: "a humanitarian volunteer",
            icon: <IconHeartHandshake className='size-6' stroke={1.5} />,
            content: (
                <div className='p-8'>
                </div>
            )
        },
        {
            id: 5,
            label: "an academic tutor",
            icon: <IconSchool className='size-6' stroke={1.5} />,
            content: (
                <div className='p-8'>
                </div>
            )
        },

        {
            id: 6,
            label: "honestly, anything!",
            icon: <IconSparkles className='size-6' stroke={1.5} />,
            content: (
                <div className='p-8'>
                </div>
            )
        }
    ]

    return (
        <div className="flex flex-col min-h-screen items-center overflow-clip">
            <div className="flex flex-col w-full justify-center items-center space-y-6 my-32 ultrawide:my-48">
                <p className="font-body text-lg tablet:text-2xl text-center">
                    Hello! my name is <span className="text-primary font-body-bold">Luthfi</span>, <span />
                    <br />
                    but most people call me <span className="text-primary font-body-bold">Upi</span>, I'm a
                </p>
                <SlidingTitle
                    text="Humanitarian Activist · Creative Overthinker · Teaching Assistant · Snobby Cinephile · Graphic Designer"
                />
                <p
                    className="font-body text-lg tablet:text-2xl text-center">
                    and a <span className="text-primary font-body-bold">computer science</span> student
                    <br />
                    at Universitas Indonesia
                </p>
            </div>

            <div className="flex flex-col -space-y-5 border-0">
                <Squiggle className="w-full fill-primary-100" />

                <Carousel
                    opts={{
                        loop: true,
                        watchFocus: false,
                    }}
                    className='bg-primary-100 z-10 w-screen'
                >
                    <CarouselContent className="py-8">
                        {
                            Array(2).fill(0).flatMap(() => ([
                                { src: soloImg, alt: "Solo", tooltip: "This is me, Hi!" },
                                { src: holeboysImg, alt: "Hole Boys", tooltip: "Just some boys coming out from a hole on the wall" },
                                { src: medpropImg, alt: "Media and Propaganda", tooltip: "Media and Propaganda team, loud and clear!" },
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

            <div className='max-w-desktop pt-20'>
                <p className="font-body text-lg tablet:text-2xl text-center mt-8">
                    As you can probably see, I'm a
                    <br />
                    <span className="text-primary font-body-bold">Jack of all trades</span>, you can have me as
                </p>
                <DirectionAwareTabs tabs={cv_tabs} autoPlay />
            </div>
        </div>
    );
};

export default Home;
