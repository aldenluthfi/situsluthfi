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
import { cn, isMobile, BREAKPOINTS } from "@/lib/utils";
import { api, isAbortError } from "@/lib/api";

import soloImg from "@/assets/images/solo.webp";
import holeboysImg from "@/assets/images/holeboys.webp";
import medpropImg from "@/assets/images/medprop.webp";
import weirdosImg from "@/assets/images/weirdos.webp";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Autoplay from 'embla-carousel-autoplay';
import { toast } from "sonner";

import CV from "@/components/custom/cv";
import ProjectStack from "@/components/custom/project-stack";

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
    const [contactEmail, setContactEmail] = useState("");
    const [contactMessage, setContactMessage] = useState("");
    const { mode } = useTheme();
    const { isDarkMode } = useTimezoneTheme();

    const isEffectivelyDark = mode === 'dark' || (mode === 'timezone' && isDarkMode);

    const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!contactEmail.trim() || !contactMessage.trim()) {
            toast.error("Please fill in both your email and a message.");
            return;
        }
        toast.success("Thanks! This form is a placeholder — your message wasn't actually sent.");
        setContactEmail("");
        setContactMessage("");
    };

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
                    Hi, I'm <span className="text-primary font-bold">Luthfi</span> — <span />
                    <br />
                    most people call me <span className="text-primary font-bold">Upi</span>.
                </p>
                <SlidingTitle
                    text="Humanitarian Activist · Software Developer · Teaching Assistant · Graphic Designer · Cinephile"
                    direction={1}
                />
                <p
                    className="text-lg tablet:text-2xl text-center">
                    <span className="text-primary font-bold">Computer Science</span> student
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
                                { src: soloImg, alt: "Solo", tooltip: "That's me." },
                                { src: medpropImg, alt: "Media and Propaganda", tooltip: "With the Media & Propaganda team." },
                                { src: weirdosImg, alt: "Just Weirdos", tooltip: "Good company." },
                                { src: holeboysImg, alt: "Hole Boys", tooltip: "The hole boys." },
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

            <div className='w-full max-w-desktop px-6 flex flex-col items-center'>
                <p className="text-lg tablet:text-2xl text-center">
                    I work across a few <span className="text-primary font-bold">disciplines</span>.
                    <br />
                    Depending on what you need, I can be
                </p>
                <CV showTabs autoPlay className='w-full' />
            </div>

            <div className="flex flex-col w-full justify-center items-center space-y-6">
                <p className="text-lg tablet:text-2xl text-center mb-6">
                    My <span className="text-primary font-bold">projects</span>
                    <br />
                    A growing collection of the
                </p>
                <SlidingTitle text="Algorithms · Frameworks · Languages · Experiments · Tech Stacks" direction={-1} />
                <p className="text-lg tablet:text-2xl text-center">
                    I've <span className="text-primary font-bold">built and explored</span>
                    <br />
                    as a developer.
                </p>
            </div>
            <div className="w-full max-w-desktop px-6">
                <ProjectStack repos={data} loading={loading} />
            </div>

            <div className="flex flex-col w-full justify-center items-center space-y-6">
                <p className="text-lg tablet:text-2xl text-center mb-6">
                    <span className="text-primary font-bold">Places I've been</span>.
                    <br />
                    Scenes I've collected of the
                </p>
                <SlidingTitle text="People · Panoramas · Cultures · Oddities" direction={1} />
                <p className="text-lg tablet:text-2xl text-center mt-6">
                    from traveling
                    <br />
                    around the <span className="text-primary font-bold">world</span>.
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

            <div className="flex flex-col w-full justify-center items-center space-y-6">
                <p className="text-lg tablet:text-2xl text-center mb-6">
                    Got something in mind?
                    <br />
                    I'd love to <span className="text-primary font-bold">hear from you</span> —
                </p>
                <SlidingTitle text="Say Hello · Reach Out · Collaborate · Get in Touch" direction={-1} />
                <p className="text-lg tablet:text-2xl text-center mt-6">
                    drop a line below and let's
                    <br />
                    <span className="text-primary font-bold">make something</span> together.
                </p>
            </div>
            <div className="w-full max-w-tablet px-6 pb-12">
                <Card>
                    <CardContent>
                        <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="contact-email" className="text-base font-medium">
                                    Email
                                </label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="placeholder:text-muted-foreground flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="contact-message" className="text-base font-medium">
                                    Message
                                </label>
                                <textarea
                                    id="contact-message"
                                    value={contactMessage}
                                    onChange={(e) => setContactMessage(e.target.value)}
                                    placeholder="What's on your mind?"
                                    rows={10}
                                    className="placeholder:text-muted-foreground flex w-full min-h-60 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-base outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                                />
                            </div>
                            <Button type="submit" className="w-full tablet:w-auto tablet:self-end">
                                Send message
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Home;
