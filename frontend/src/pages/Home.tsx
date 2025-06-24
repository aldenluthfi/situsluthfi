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

import soloImg from "@/assets/images/solo.webp";
import holeboysImg from "@/assets/images/holeboys.webp";
import medpropImg from "@/assets/images/medprop.webp";
import weirdosImg from "@/assets/images/weirdos.webp";

import { Skeleton } from "@/components/ui/skeleton";
import Autoplay from 'embla-carousel-autoplay';

import CV from "@/components/custom/cv";

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

            <div className="flex flex-col -space-y-5 border-0">
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
        </div>
    );
};

export default Home;
