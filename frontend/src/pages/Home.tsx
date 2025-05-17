import SlidingTitle from '../components/custom/sliding-title';
import Squiggle from '../components/custom/squiggle';
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import Autoscroll from "embla-carousel-auto-scroll"
import { useState, useEffect } from 'react';
import { isMobile } from "@/lib/utils";
import soloImg from "../assets/images/solo.webp";
import holeboysImg from "../assets/images/holeboys.webp";
import weirdosImg from "../assets/images/weirdos.webp";
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
            <PopoverContent className="w-auto text-sm tablet:text-md" hideWhenDetached>
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
                className={`hover:motion-scale-out-105 motion-scale-in-105 motion-ease-spring-bouncier motion-duration-300 rounded-xl w-full transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
                onLoad={() => setLoaded(true)}
                draggable={false}
            />
        </div>
    );
};

const Home: React.FC = () => {
    useEffect(() => {
        document.title = "aldenluth.fi | Home";
    }, []);

    return (
        <div className="flex flex-col min-h-screen items-center overflow-clip">
            <div className="flex flex-col w-full justify-center items-center space-y-6 my-32 ultrawide:my-48">
                <p className="font-body text-lg tablet:text-2xl ultrawide:text-4xl text-center">
                    Hello! my name is <span className="text-primary font-body-bold">Luthfi</span>, <span />
                    <br className="ultrawide:hidden" />
                    but you can call me <span className="text-primary font-body-bold">Upi</span>,
                    I'm a
                </p>
                <SlidingTitle
                    text="Humanitarian Activist · College Student · Teaching Assistant · Graphic Designer"
                />
                <p
                    className="font-body text-lg tablet:text-2xl ultrawide:text-4xl text-center">
                    This site is made <span className="text-primary font-body-bold">as is</span> without <span />
                    <br className="ultrawide:hidden" />
                    warranty of any kind.
                </p>
            </div>

            <div className="flex flex-col -space-y-5">
                <Squiggle className="w-full fill-primary-100 -z-10" />

                <Carousel
                    opts={{
                        loop: true,
                        watchFocus: false,
                    }}
                    plugins={[
                        Autoscroll({
                            direction: "backward",
                            stopOnInteraction: false,
                            stopOnFocusIn: false,
                            stopOnMouseEnter: false,
                            speed: 2,
                            startDelay: 0,
                        }),
                    ]}
                    className='bg-primary-100'
                >
                    <CarouselContent className="py-10">
                        {
                            Array(2).fill(0).flatMap(() => ([
                                { src: soloImg, alt: "Solo", tooltip: "This is me, Hi!" },
                                { src: holeboysImg, alt: "Hole Boys", tooltip: "Just some boys coming out from a hole on the wall" },
                                { src: weirdosImg, alt: "Weirdos", tooltip: "Weirdos being weird" },
                                { src: medpropImg, alt: "Media and Propaganda", tooltip: "Media and Propaganda team, loud and clear!" },
                            ])).map((image, index) => (
                                <CarouselItem key={index + 1} className="max-w-11/12 tablet:basis-1/2">
                                    <ResponsiveTooltip content={<p>{image.tooltip}</p>}>
                                        <div className='px-3 tablet:px-5 overflow-visible'>
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

                <Squiggle className="-scale-y-100 w-full fill-primary-100 -z-10" />
            </div>

            <div className='h-screen'></div>
        </div>
    );
};

export default Home;
