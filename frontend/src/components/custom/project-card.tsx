import {
    Card,
    CardHeader,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Pill, PillIcon } from "@/components/ui/kibo-ui/pill";
import { Skeleton } from "@/components/ui/skeleton";
import {
    IconStar,
    IconGitFork,
    IconScale,
    IconCalendar,
} from "@tabler/icons-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/animate-ui/components/tooltip";

import { formatDate, BREAKPOINTS } from "@/lib/utils";
import { useTheme } from "@/components/custom/theme-provider";
import { useTimezoneTheme } from "@/hooks/use-timezone-theme";
import type { RepositoryObject } from "@/lib/types";

export const getRepoImageUrl = (
    repo: RepositoryObject,
    shouldUseDarkImage: boolean,
) => {
    const imageUrl = shouldUseDarkImage ? repo.cover_dark_url : repo.cover_light_url;
    const fallbackUrl = shouldUseDarkImage ? repo.cover_light_url : repo.cover_dark_url;
    return imageUrl || fallbackUrl;
};

export const ProjectCardSkeleton: React.FC = () => (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <div dir="ltr">
                <Skeleton className="w-full rounded-md aspect-[2/1] mb-4 tablet:mb-6" dir="ltr" />
                <CardDescription>
                    <div className="min-h-28">
                        <Skeleton className="h-4 w-full mb-2" dir="ltr" />
                        <Skeleton className="h-4 w-4/5 mb-2" dir="ltr" />
                        <Skeleton className="h-4 w-3/5 mb-3" dir="ltr" />
                        <Skeleton className="h-4 w-1/5 mb-3" dir="ltr" />
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-22" dir="ltr">
                        <Skeleton className="size-10 tablet:h-9 tablet:w-28 rounded-md tablet:rounded-full" dir="ltr" />
                        <Skeleton className="size-10 tablet:h-9 tablet:w-32 rounded-md tablet:rounded-full" dir="ltr" />
                        <Skeleton className="size-10 tablet:h-9 tablet:w-22 rounded-md tablet:rounded-full" dir="ltr" />
                        <Skeleton className="size-10 tablet:h-9 tablet:w-30 rounded-md tablet:rounded-full" dir="ltr" />
                    </div>
                </CardDescription>
            </div>
        </CardHeader>
        <CardFooter className="mt-auto">
            <div className="flex justify-between flex-col tablet:flex-row items-start tablet:items-end w-full gap-1" dir="ltr">
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
);

const ProjectCard: React.FC<{
    repo: RepositoryObject;
}> = ({ repo }) => {
    const { mode } = useTheme();
    const { isDarkMode } = useTimezoneTheme();

    const shouldUseDarkImage = mode === "timezone" ? isDarkMode : mode === "dark";
    const imageUrl = getRepoImageUrl(repo, shouldUseDarkImage);

    return (
        <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader>
                {imageUrl && (
                    <div className="relative w-full aspect-[2/1] mb-2 desktop:mb-4 overflow-hidden rounded-md">
                        <img
                            src={imageUrl}
                            alt={`${repo.name} preview`}
                            className="w-full h-full object-cover pointer-events-none select-none"
                            draggable={false}
                        />
                    </div>
                )}
                <CardDescription>
                    <div className="min-h-28">
                        {repo.description && (
                            <p className="text-base line-clamp-3 mb-1 break-words" dir="ltr">{repo.description}</p>
                        )}
                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-muted-foreground text-left mb-3"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p dir="ltr">View on GitHub</p>
                        </a>
                    </div>
                    {repo.topics && repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 min-h-22" dir="ltr">
                            {repo.topics.map((topic) => {
                                const iconName = repo.icon_map?.[topic];
                                return (
                                    window.innerWidth < BREAKPOINTS.tablet ?
                                        <Tooltip key={topic}>
                                            <TooltipTrigger>
                                                <Pill onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="h-min my-0.5 text-base px-3 py-1.5 max-tablet:rounded-md max-tablet:p-2">
                                                    {iconName ? <PillIcon icon={iconName} className="size-6 tablet:size-4" /> : <></>}
                                                    <span className="max-tablet:hidden">{topic}</span>
                                                </Pill>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span className="text-center">{topic}</span>
                                            </TooltipContent>
                                        </Tooltip>
                                        :
                                        <Pill onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} key={topic} className="h-min my-0.5 px-3 py-1.5 text-base max-tablet:rounded-md max-tablet:p-2">
                                            {iconName ? <PillIcon icon={iconName} className="size-6 tablet:size-4" /> : <></>}
                                            <span className="max-tablet:hidden">{topic}</span>
                                        </Pill>
                                );
                            })}
                        </div>
                    )}
                </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
                <div className="flex justify-between flex-col tablet:flex-row items-start tablet:items-end text-base text-muted-foreground w-full gap-1" dir="ltr">
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
                                {typeof repo.license === "string" ? repo.license : repo.license.spdx_id || repo.license.key}
                            </div>
                        )}
                    </div>
                    <span className="flex items-center gap-1">
                        <IconCalendar className="tablet:hidden size-4" stroke={1.5} />
                        {formatDate(repo.created_at, "short")}
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
};

export default ProjectCard;
