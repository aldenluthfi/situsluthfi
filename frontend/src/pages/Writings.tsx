import SlidingTitle from "@/components/custom/sliding-title";
import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Pill, PillIcon } from "@/components/ui/kibo-ui/pill";
import {
    IconSchool,
    IconCpu,
    IconBrain,
    IconPalette,
    IconMathFunction,
    IconChess,
    IconCode,
    IconYinYang,
    IconDots,
} from "@tabler/icons-react";
import { Link, useSearchParams } from "react-router-dom";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import type { WritingObject } from "@/lib/types";

const tagIconMap: Record<string, React.ElementType> = {
    Education: (props) => <IconSchool className="size-6" stroke={1.5} {...props} />,
    Technology: (props) => <IconCpu className="size-6" stroke={1.5} {...props} />,
    Philosophy: (props) => <IconBrain className="size-6" stroke={1.5} {...props} />,
    "Arts and Culture": (props) => <IconPalette className="size-6" stroke={1.5} {...props} />,
    Politics: (props) => <IconChess className="size-6" stroke={1.5} {...props} />,
    Mathematics: (props) => <IconMathFunction className="size-6" stroke={1.5} {...props} />,
    Devlog: (props) => <IconCode className="size-6" stroke={1.5} {...props} />,
    Poems: (props) => <IconYinYang className="size-6" stroke={1.5} {...props} />,
};

const PAGE_SIZE = 5;

const Writings: React.FC = () => {
    useEffect(() => {
        document.title = "aldenluth.fi | Writings";
    }, []);

    const [data, setData] = useState<WritingObject[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();

    const [page, setPage] = useState(
        Number(searchParams.get("page")) || 1
    );

    const syncAbortController = useRef<AbortController | null>(null);

    useEffect(() => {
        const fetchPage = (pageNum: number) => {
            fetch(`/api/writings/get_page?pagesize=${PAGE_SIZE}&page=${pageNum}`)
                .then((res) => res.json())
                .then((resData) => {
                    setData(resData.results ?? []);
                    setTotalPages(resData.totalPages ?? 1);
                    setLoading(false);
                })
        };

        const handleSync = async () => {
            if (syncAbortController.current) {
                syncAbortController.current.abort("page changed");
            }

            const controller = new AbortController();
            syncAbortController.current = controller;

            try {
                await fetch(`/api/writings/sync/`, { signal: controller.signal });
                fetchPage(page);
            } catch (error: unknown) {
                if ((error instanceof Error && error.name !== "AbortError") || (typeof error === "string" && error !== "page changed")) {
                    console.error("Error syncing writing, ", error);
                }
            }
        };

        setLoading(true);
        fetchPage(page);
        handleSync();
    }, [page]);

    const getPaginationItems = () => {
        const items: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(i);
            }
        } else if (page < 5) {
            items.push(1, 2, 3, 4, 5, "...");
            items.push(totalPages);
        } else if (page > totalPages - 4) {
            items.push(1, "...");

            for (let i = totalPages - 4; i <= totalPages; i++) {
                items.push(i);
            }

        } else {
            items.push(1, "...");
            items.push(page - 1, page, page + 1);
            items.push("...", totalPages);
        }

        return items;
    };

    const setPageParam = (newPage: number) => {
        if (syncAbortController.current) {
            syncAbortController.current.abort();
        }

        if (newPage === 1) {
            searchParams.delete("page");
            setSearchParams(searchParams, { replace: true });
        } else {
            searchParams.set("page", String(newPage));
            setSearchParams(searchParams, { replace: true });
        }

        setPage(newPage);
    };

    return (
        <div className="flex flex-col min-h-screen items-center overflow-clip gap-24">
            <div className="flex flex-col w-full justify-center items-center space-y-6 mt-44">
                <p className="text-lg tablet:text-2xl text-center">
                    Here are some of my <span className="text-primary font-bold">writings</span>,
                    <br/>
                    I usually write about
                </p>
                <SlidingTitle
                    text="Education · Computer Science · Philosophy · Arts and Culture · Politics · Mathematics"
                />
                <p className="text-lg tablet:text-2xl text-center">
                    and other random stuff
                    <br/>
                    My <span className="text-primary font-bold">opinions</span> are often wrong
                </p>
            </div>
            <div className="w-full max-w-desktop flex flex-col gap-6 pb-24 items-center">
                {loading
                    ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <Card
                            className="motion-preset-slide-down w-10/12"
                            style={{ animationDelay: `${i * 100}ms` }}
                            key={i + 1}
                        >
                            <CardHeader>
                                <CardTitle className="flex flex-col gap-2">
                                    <Skeleton className="h-8 desktop:h-10 w-full" />
                                    <Skeleton className="h-8 desktop:hidden w-1/2" />
                                </CardTitle>
                                <CardDescription className="mt-2">
                                    <div className="flex flex-wrap gap-2">
                                        <Skeleton className="h-7 tablet:h-9 w-20 rounded-full" />
                                        <Skeleton className="h-7 tablet:h-9 w-24 rounded-full" />
                                        <Skeleton className="h-7 tablet:h-9 w-16 rounded-full" />
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-40" />
                            </CardContent>
                        </Card>
                    ))
                    : data.map((item) => (
                        <Link
                            key={item.id}
                            to={`/writings/${item.slug}`}
                            className="w-10/12"
                        >
                            <Card key={item.id}>
                                <CardHeader>
                                    <CardTitle className="min-w-0 flex font-heading text-2xl desktop:text-4xl">
                                        <div className=" min-w-0 w-full truncate">
                                            {item.title}
                                        </div>
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        {item.tags && item.tags.length > 0
                                            ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {item.tags.map((tag: string) => {
                                                        const Icon = tagIconMap[tag] || IconDots;
                                                        return (
                                                            <Pill key={tag} className="text-sm tablet:text-base tablet:px-3 tablet:py-1.5">
                                                                <PillIcon icon={Icon} className="size-3 tablet:size-4"/>
                                                                {tag}
                                                            </Pill>
                                                        );
                                                    })}
                                                </div>
                                            )
                                            : ""}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <span className="text-muted-foreground text-sm tablet:text-base">
                                        {(new Date(item.createdAt).toLocaleDateString(
                                            "en-GB",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }
                                        ))}
                                    </span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                <div className="flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        if (page > 1) setPageParam(page - 1);
                                    }}
                                    isActive={false}
                                    aria-disabled={page === 1}
                                    tabIndex={page === 1 ? -1 : 0}
                                />
                            </PaginationItem>
                            {getPaginationItems().map((item, i) =>
                                item === "..." ? (
                                    <PaginationItem key={`ellipsis-${i + 1}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={i + 1}>
                                        <PaginationLink
                                            href="#"
                                            isActive={item === page}
                                            onClick={e => {
                                                e.preventDefault();
                                                if (item !== page) setPageParam(Number(item));
                                            }}
                                            className="text-foreground no-underline hover:no-underline"
                                            aria-current={item === page ? "page" : undefined}
                                            tabIndex={item === page ? -1 : 0}
                                        >
                                            {item}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        if (page < totalPages) setPageParam(page + 1);
                                    }}
                                    isActive={false}
                                    aria-disabled={page === totalPages}
                                    tabIndex={page === totalPages ? -1 : 0}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

export default Writings;
