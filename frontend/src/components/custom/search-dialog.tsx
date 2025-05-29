import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { isMobile } from "@/lib/utils";
import {
    IconSearch,
    IconFolder,
    IconBook,
    IconPhoto,
    IconPencil
} from "@tabler/icons-react";
import { useCallback, useRef, useState, useEffect } from "react";

interface SearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const selectedItemRef = useRef<HTMLDivElement>(null);
    const searchAbortController = useRef<AbortController | null>(null);

    const navigationItems = [
        { name: 'Projects', href: '/projects', icon: IconFolder, shortcut: 'U' },
        { name: 'Writings', href: '/writings', icon: IconBook, shortcut: 'I' },
        { name: 'Gallery', href: '/gallery', icon: IconPhoto, shortcut: 'O' }
    ];

    const filteredNavigationItems = search
        ? navigationItems.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
        : navigationItems;

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        setSearchLoading(true);
        setSearchError(null);
        setCurrentPage(1);
        setHasMore(false);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (searchAbortController.current) {
            searchAbortController.current.abort("new search input");
        }

        if (!value) {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }

        searchTimeout.current = setTimeout(async () => {
            try {
                const controller = new AbortController();
                searchAbortController.current = controller;

                const res = await fetch(`/api/writings/search?q=${encodeURIComponent(value)}&pagesize=3&page=1`, {
                    signal: controller.signal
                });

                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();

                setSearchResults(data.results || []);
                setHasMore(data.totalPages > 1);
                setSearchLoading(false);
                setSearchError(null);
            } catch (error: any) {
                if (error.name !== "AbortError" && error !== "new search input") {
                    setSearchError(`Failed to search, ${error}`);
                    setSearchLoading(false);
                }
            }
        }, 200);
    }, []);

    const loadMoreResults = useCallback(async () => {
        if (!search || loadingMore) return;

        setLoadingMore(true);
        try {
            const controller = new AbortController();
            searchAbortController.current = controller;

            const nextPage = currentPage + 1;
            const res = await fetch(`/api/writings/search?q=${encodeURIComponent(search)}&pagesize=3&page=${nextPage}`, {
                signal: controller.signal
            });

            if (!res.ok) throw new Error("Failed to fetch");

            const data = await res.json();

            const newResults = data.results || [];
            const combinedResults = [...searchResults, ...newResults];

            setSearchResults(combinedResults);
            setCurrentPage(nextPage);
            setHasMore(nextPage < data.totalPages);
            setLoadingMore(false);
        } catch (error: any) {
            if (error.name !== "AbortError") {
                setLoadingMore(false);
            }
        }
    }, [search, currentPage, loadingMore, searchResults]);

    useEffect(() => {
        if (!open) {
            setSearch("");
            setSearchResults([]);
            setSearchLoading(false);
            setSearchError(null);
            setSelectedIndex(0);
            setCurrentPage(1);
            setHasMore(false);
            setLoadingMore(false);

            if (searchAbortController.current) {
                searchAbortController.current.abort("dialog closed");
            }
        } else {
            setSelectedIndex(0);
        }
    }, [open]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [search, searchResults]);

    useEffect(() => {
        if (selectedItemRef.current && scrollContainerRef.current) {
            selectedItemRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [selectedIndex]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.metaKey && e.key >= '1' && e.key <= '9') {
            e.preventDefault();
            const shortcutIndex = parseInt(e.key) - 1;

            if (shortcutIndex < searchResults.length) {
                const selectedItem = searchResults[shortcutIndex];
                if (selectedItem) {
                    onOpenChange(false);
                    window.location.href = `/writings/${selectedItem.slug}`;
                }
            }
            return;
        }

        if (e.metaKey && (e.key.toLowerCase() === 'u' || e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'o')) {
            e.preventDefault();
            const navItem = navigationItems.find(item => item.shortcut.toLowerCase() === e.key.toLowerCase());
            if (navItem) {
                onOpenChange(false);
                window.location.href = navItem.href;
            }
            return;
        }

        const seeMoreItems = hasMore ? 1 : 0;
        const totalItems = searchResults.length + seeMoreItems + filteredNavigationItems.length;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % totalItems);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev === 0 ? totalItems - 1 : prev - 1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex < searchResults.length) {
                const selectedItem = searchResults[selectedIndex];
                if (selectedItem) {
                    onOpenChange(false);
                    window.location.href = `/writings/${selectedItem.slug}`;
                }
            } else if (hasMore && selectedIndex === searchResults.length) {
                loadMoreResults();
            } else {
                const navIndex = selectedIndex - searchResults.length - seeMoreItems;
                if (navIndex < filteredNavigationItems.length) {
                    onOpenChange(false);
                    window.location.href = filteredNavigationItems[navIndex].href;
                }
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogHeader className="sr-only">
                <DialogTitle>Command Panel</DialogTitle>
                <DialogDescription>Search Anything</DialogDescription>
            </DialogHeader>
            <DialogContent className="overflow-hidden p-0 max-w-lg mx-auto w-11/12 desktop:w-full">
                <div className="bg-popover text-popover-foreground flex h-full w-full flex-col px-1 overflow-hidden rounded-md">
                    <style>{`
                        .search-highlight mark {
                            background-color: var(--primary);
                            color: var(--background);
                            border-radius: 0.25rem;
                            padding: 0rem 0.25rem;
                        }
                    `}</style>

                    <div className="flex h-12 items-center gap-2 border-b px-3">
                        <IconSearch className="size-6" stroke={1.5} />
                        <input
                            className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    </div>

                    <div
                        ref={scrollContainerRef}
                        className="max-h-[30vh] scroll-py-1 overflow-x-hidden overflow-y-auto py-1"
                    >
                        {searchLoading && (
                            <div className="py-6 text-center text-sm">Searching...</div>
                        )}
                        {!searchLoading && !searchError && searchResults.length === 0 && filteredNavigationItems.length === 0 && search && (
                            <div className="py-6 text-center text-sm">Nothing found</div>
                        )}
                        {searchError && !searchLoading && (
                            <div className="text-foreground overflow-hidden p-1">
                                <div className="relative flex cursor-default items-center font-body-bold gap-3 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none opacity-50 pointer-events-none">
                                    {searchError}
                                </div>
                            </div>
                        )}

                        {!searchLoading && !searchError && searchResults.length > 0 && (
                            <>
                                <div className="text-foreground overflow-hidden p-1">
                                    {searchResults.map((item, index) => (
                                        <div
                                            key={item.id}
                                            ref={selectedIndex === index ? selectedItemRef : null}
                                            className={`relative flex cursor-default flex-col gap-1 rounded-sm px-3 py-3 outline-hidden select-none [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 ${
                                                selectedIndex === index
                                                    ? 'bg-primary-200 text-primary-700 [&_svg]:!text-primary-700 [&_svg]:!stroke-primary-700'
                                                    : ''
                                            }`}
                                            onClick={() => {
                                                onOpenChange(false);
                                                window.location.href = `/writings/${item.slug}`;
                                            }}
                                            data-slot="button"
                                        >
                                            <div className="flex items-center justify-between font-body-bold gap-4">
                                                <div className="flex items-center gap-4">
                                                    <IconPencil className="size-6 shrink-0" stroke={1.5} />
                                                    <span
                                                        className="search-highlight"
                                                        dangerouslySetInnerHTML={{
                                                            __html: item.highlight?.title?.[0] || item.title
                                                        }}
                                                    />
                                                </div>
                                                {index + 1 <= 9 && !isMobile && (
                                                    <kbd
                                                        className={`ml-auto rounded-sm py-1 px-2 flex gap-1 items-center text-xs whitespace-nowrap ${selectedIndex === index ? 'bg-primary-300 text-primary-700' : 'bg-muted text-muted-foreground'}`}
                                                    >
                                                        <div className="!text-sm">⌘</div> {index + 1}
                                                    </kbd>
                                                )}
                                            </div>
                                            {item.highlight?.content && (
                                                <div className={`ml-10 text-sm search-highlight ${selectedIndex === index ? 'text-primary-600' : 'text-muted-foreground'}`}>
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: item.highlight.content.join('...')
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {hasMore && (
                                        <div
                                            ref={selectedIndex === searchResults.length ? selectedItemRef : null}
                                            className={`relative flex cursor-default items-center font-body gap-4 rounded-sm px-3 py-3 outline-hidden select-none [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 ${
                                                selectedIndex === searchResults.length
                                                    ? 'bg-primary-200 text-primary-700'
                                                    : 'text-muted-foreground'
                                            }`}
                                            onClick={loadMoreResults}
                                            data-slot="button"
                                        >
                                            {loadingMore ? "Loading..." : "See more..."}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {(searchResults.length > 0 || searchLoading || searchError) && filteredNavigationItems.length > 0 && (
                            <Separator className="my-1 bg-border" />
                        )}

                        {filteredNavigationItems.length > 0 && (
                            <div className="text-foreground overflow-hidden p-1">
                                {filteredNavigationItems.map((item, index) => {
                                    const seeMoreItems = hasMore ? 1 : 0;
                                    const actualIndex = searchResults.length + seeMoreItems + index;
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.name}
                                            ref={selectedIndex === actualIndex ? selectedItemRef : null}
                                            className={`relative flex cursor-default items-center font-body-bold gap-4 rounded-sm px-3 py-3 outline-hidden select-none [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 ${
                                                selectedIndex === actualIndex
                                                    ? 'bg-primary-200 text-primary-700 [&_svg]:!text-primary-700 [&_svg]:!stroke-primary-700'
                                                    : ''
                                            }`}
                                            onClick={() => { onOpenChange(false); window.location.href = item.href; }}
                                            data-slot="button"
                                        >
                                            <Icon className="size-6" stroke={1.5} />
                                            {item.name}
                                            {
                                                 !isMobile && (
                                                    <kbd className={`ml-auto rounded-sm py-1 px-2 flex gap-1 items-center text-xs whitespace-nowrap ${selectedIndex === actualIndex ? 'bg-primary-300 text-primary-700' : 'bg-muted text-muted-foreground'}`}>
                                                        <div className="!text-sm">⌘</div> {item.shortcut}
                                                    </kbd>
                                                 )
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
