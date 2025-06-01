import SlidingTitle from '../components/custom/sliding-title';
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Pill } from "@/components/ui/kibo-ui/pill";
import {
    IconStar,
    IconGitFork,
    IconScale,
} from "@tabler/icons-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { useTheme } from "@/components/custom/theme-provider";
import type { RepositoryObject } from "@/lib/types";
import autoplay from "embla-carousel-autoplay";

function ProjectImageWithSkeleton({ repo, mode }: { repo: RepositoryObject; mode: string }) {
    const [loaded, setLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const imageUrl = mode !== 'dark' ? repo.cover_dark_url : repo.cover_light_url;
    const fallbackUrl = mode !== 'dark' ? repo.cover_light_url : repo.cover_dark_url;
    const hasImage = imageUrl || fallbackUrl;

    if (!hasImage) return null;

    return (
        <div className="relative w-full aspect-[2/1] mb-4">
            {!loaded && !imageError && (
                <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
            )}
            <img
                src={imageUrl || fallbackUrl}
                alt={`${repo.name} preview`}
                className={`w-full h-full object-cover rounded-md transition-opacity duration-300 ${loaded && !imageError ? "opacity-100" : "opacity-0"
                    }`}
                onLoad={() => setLoaded(true)}
                onError={() => {
                    if (imageUrl && fallbackUrl && !imageError) {
                        setImageError(true);
                        setLoaded(false);
                    } else {
                        setImageError(true);
                    }
                }}
            />
        </div>
    );
}

const Projects: React.FC = () => {
    useEffect(() => {
        document.title = "aldenluth.fi | Projects";
    }, []);

    const [data, setData] = useState<RepositoryObject[]>([]);
    const [loading, setLoading] = useState(true);
    const { mode } = useTheme();

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
                setLoading(false);
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

    return (
        <div className='flex flex-col min-h-screen items-center overflow-clip'>
            <div className="flex flex-col w-full justify-center items-center space-y-6 mt-32 ultrawide:mt-48 mb-16">
                <p className="font-body text-lg tablet:text-2xl ultrawide:text-4xl text-center mb-6">
                    These are my <span className="text-primary font-body-bold">projects</span>
                    <br className="ultrawide:hidden" />
                    Here you can find a growing collection of
                </p>
                <SlidingTitle text="Algorithms · Frameworks · Languages · Experiments · Tech Stacks" />
                <p className="font-body text-lg tablet:text-2xl ultrawide:text-4xl text-center">
                    I explored in my journey as a developer
                    <br className="ultrawide:hidden" />
                    <span className="text-primary font-body-bold">stay tuned</span> for updates!
                </p>
            </div>
            <div className="w-full max-w-4xl px-12 pb-24">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[
                        autoplay()
                    ]}
                >
                    <CarouselPrevious className='ml-4 mr-2 desktop:ml-0' />
                    <CarouselNext className='mr-4 ml-2 desktop:mr-0' />
                    <CarouselContent className='py-4'>
                        {loading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <CarouselItem key={i} className="basis-full">
                                    <Card className="motion-preset-slide-down h-full" style={{ animationDelay: `${i * 100}ms` }}>
                                        <CardHeader>
                                            <Skeleton className="w-full aspect-[2/1] rounded-md mb-4" />
                                            <CardTitle>
                                                <Skeleton className="h-8 w-3/4" />
                                            </CardTitle>
                                            <CardDescription>
                                                <Skeleton className="h-4 w-full mt-2" />
                                                <Skeleton className="h-4 w-2/3 mt-1" />
                                                <div className="flex gap-2 mt-4">
                                                    <Skeleton className="h-6 w-16" />
                                                    <Skeleton className="h-6 w-20" />
                                                    <Skeleton className="h-6 w-18" />
                                                </div>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardFooter>
                                            <div className="flex justify-between items-center w-full">
                                                <div className="flex gap-4">
                                                    <Skeleton className="h-4 w-12" />
                                                    <Skeleton className="h-4 w-12" />
                                                </div>
                                                <Skeleton className="h-4 w-20" />
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </CarouselItem>
                            ))
                            : data.map((repo) => (
                                <CarouselItem key={repo.id} className="basis-full">
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:motion-scale-out-105 motion-scale-in-105 motion-ease-spring-snappy motion-duration-300 block h-full p-6"
                                    >
                                        <Card className="h-full flex flex-col">
                                            <CardHeader>
                                                <ProjectImageWithSkeleton repo={repo} mode={mode} />
                                                <CardTitle className="font-heading text-3xl">
                                                    {repo.name}
                                                </CardTitle>
                                                <CardDescription className="mt-2">
                                                    {repo.description && (
                                                        <p className="text-sm mb-3">{repo.description}</p>
                                                    )}
                                                    {repo.topics && repo.topics.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {repo.topics.map((topic) => (
                                                                <Pill key={topic} className='my-0.5'>
                                                                    {topic}
                                                                </Pill>
                                                            ))}
                                                        </div>
                                                    )}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardFooter className='mt-auto'>
                                                <div className="flex justify-between items-end text-sm text-muted-foreground w-full">
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
                                                    <span className='flex place-items-end'>
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
                                </CarouselItem>
                            ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    );
};

export default Projects;
