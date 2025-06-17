import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { isMobile, isWindows } from "@/lib/utils";
import {
    IconSearch,
    IconFolder,
    IconBook,
    IconPhoto,
    IconPencil,
    IconBarrierBlock
} from "@tabler/icons-react";
import { useCallback, useRef, useState, useEffect } from "react";

interface SearchDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
}

const PAGE_SIZE = 3;

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

                const res = await fetch(`/api/search?q=${encodeURIComponent(value)}&pagesize=${PAGE_SIZE}&page=1`, {
                    signal: controller.signal
                });

                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();

                setSearchResults(data.results ?? []);
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
            const res = await fetch(`/api/search?q=${encodeURIComponent(search)}&pagesize=${PAGE_SIZE}&page=${nextPage}`, {
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
        const handleDialogClose = () => {
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
        };

        const handleDialogOpen = () => {
            setSelectedIndex(0);
        };

        if (!open) {
            handleDialogClose();
        } else {
            handleDialogOpen();
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

    const handleEnterKey = (
        e: React.KeyboardEvent,
        seeMoreItems: number
    ) => {
        if (e.key !== 'Enter') return false;
        e.preventDefault();
        if (selectedIndex < searchResults.length) {
            const selectedItem = searchResults[selectedIndex];
            if (selectedItem) {
                onOpenChange(false);
                if (selectedItem._type === 'writing') {
                    window.location.href = `/writings/${selectedItem.slug}`;
                } else if (selectedItem._type === 'repository') {
                    window.open(selectedItem.html_url, '_blank');
                }
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
        return true;
    };

    const handleShortcutKey = (e: React.KeyboardEvent) => {
        const modifierKey = isWindows ? e.ctrlKey : e.metaKey;

        if (modifierKey && e.key >= '1' && e.key <= '9') {
            e.preventDefault();
            const shortcutIndex = parseInt(e.key) - 1;
            if (shortcutIndex < searchResults.length) {
                const selectedItem = searchResults[shortcutIndex];
                if (selectedItem) {
                    onOpenChange(false);
                    if (selectedItem._type === 'writing') {
                        window.location.href = `/writings/${selectedItem.slug}`;
                    } else if (selectedItem._type === 'repository') {
                        window.open(selectedItem.html_url, '_blank');
                    }
                }
            }
            return true;
        }

        return false;
    };

    const handleArrowNavigation = (
        e: React.KeyboardEvent,
        totalItems: number
    ) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % totalItems);
            return true;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev === 0 ? totalItems - 1 : prev - 1));
            return true;
        }
        return false;
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const seeMoreItems = hasMore ? 1 : 0;
        const totalItems =
            searchResults.length + seeMoreItems + filteredNavigationItems.length;

        if (handleShortcutKey(e)) return;
        if (handleArrowNavigation(e, totalItems)) return;
        handleEnterKey(e, seeMoreItems);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogHeader className="sr-only">
                <DialogTitle>Command Panel</DialogTitle>
                <DialogDescription>Search Anything</DialogDescription>
            </DialogHeader>
            <DialogContent className="overflow-hidden p-0 max-w-lg mx-auto w-11/12 desktop:w-full tablet:top-1/2 tablet:-translate-y-1/2 top-1/4 -translate-y-1/4">
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
                            className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:opacity-50"
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
                                <div className="relative flex items-center font-bold gap-3 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none opacity-50 pointer-events-none">
                                    {searchError}
                                </div>
                            </div>
                        )}

                        {!searchLoading && !searchError && searchResults.length > 0 && (
                            <div className="text-foreground overflow-hidden p-1 gap-2 flex flex-col">
                                {searchResults.map((item, index) => {
                                    const isWriting = item._type === 'writing';
                                    const isRepository = item._type === 'repository';
                                    const Icon = isWriting ? IconPencil : IconBarrierBlock;

                                    return (
                                        <div
                                            key={`${item._type}-${item.id}`}
                                            ref={selectedIndex === index ? selectedItemRef : null}
                                            className={`group relative flex flex-col gap-1 rounded-sm px-3 py-3 outline-hidden select-none hover:bg-primary-200 hover:text-primary-700 hover:[&_svg]:!text-primary-700 hover:[&_svg]:!stroke-primary-700 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 ${selectedIndex === index
                                                    ? 'bg-primary-200 text-primary-700 [&_svg]:!text-primary-700 [&_svg]:!stroke-primary-700'
                                                    : ''
                                                }`}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            onClick={() => {
                                                onOpenChange(false);
                                                if (isWriting) {
                                                    window.location.href = `/writings/${item.slug}`;
                                                } else if (isRepository) {
                                                    window.open(item.html_url, '_blank');
                                                }
                                            }}
                                            data-slot="button"
                                        >
                                            <div className="flex items-center justify-between font-bold gap-4">
                                                <div className="flex items-center gap-4">
                                                    <Icon className="size-6 shrink-0" stroke={1.5} />
                                                    <span
                                                        className="search-highlight"
                                                        dangerouslySetInnerHTML={{
                                                            __html: item.highlight?.title?.[0] || item.highlight?.name?.[0] || item.title || item.name
                                                        }}
                                                    />
                                                </div>
                                                {index + 1 <= 9 && !isMobile && (
                                                    <kbd
                                                        className={`ml-auto font-mono rounded-sm py-1 px-2 flex gap-1 items-center text-xs whitespace-nowrap group-hover:bg-primary-300 group-hover:text-primary-700 ${selectedIndex === index ? 'bg-primary-300 text-primary-700' : 'bg-muted text-muted-foreground'}`}
                                                    >
                                                        <div className="!text-sm">⌘</div> {index + 1}
                                                    </kbd>
                                                )}
                                            </div>
                                            {(item.highlight?.content || item.highlight?.description ) && (
                                                <div className={`ml-10 text-sm search-highlight group-hover:text-primary-600 ${selectedIndex === index ? 'text-primary-600' : 'text-muted-foreground'}`}>
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: (item.highlight?.content || item.highlight?.description || []).join('...')
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {hasMore && (
                                    <div
                                        ref={selectedIndex === searchResults.length ? selectedItemRef : null}
                                        className={`relative flex items-center text-sm gap-4 rounded-sm px-3 py-3 outline-hidden select-none hover:bg-primary-200 hover:text-primary-700 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 ${selectedIndex === searchResults.length
                                                ? 'bg-primary-200 text-primary-700'
                                                : 'text-muted-foreground'
                                            }`}
                                        onMouseEnter={() => setSelectedIndex(searchResults.length)}
                                        onClick={loadMoreResults}
                                        data-slot="button"
                                    >
                                        {loadingMore ? "Loading..." : "See more..."}
                                    </div>
                                )}
                            </div>
                        )}

                        {(searchResults.length > 0 || searchLoading || searchError) && filteredNavigationItems.length > 0 && (
                            <Separator className="my-1 bg-border" />
                        )}

                        {filteredNavigationItems.length > 0 && (
                            <div className="text-foreground overflow-hidden p-1 gap-2 flex flex-col">
                                {filteredNavigationItems.map((item, index) => {
                                    const seeMoreItems = hasMore ? 1 : 0;
                                    const actualIndex = searchResults.length + seeMoreItems + index;
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.name}
                                            ref={selectedIndex === actualIndex ? selectedItemRef : null}
                                            className={`group relative flex items-center gap-4 rounded-sm px-3 py-3 outline-hidden select-none hover:bg-primary-200 hover:text-primary-700 hover:[&_svg]:!text-primary-700 hover:[&_svg]:!stroke-primary-700 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 ${selectedIndex === actualIndex
                                                    ? 'bg-primary-200 text-primary-700 [&_svg]:!text-primary-700 [&_svg]:!stroke-primary-700'
                                                    : ''
                                                }`}
                                            onMouseEnter={() => setSelectedIndex(actualIndex)}
                                            onClick={() => { onOpenChange(false); window.location.href = item.href; }}
                                            data-slot="button"
                                        >
                                            <Icon className="size-6" stroke={1.5} />
                                            {item.name}
                                            {
                                                !isMobile && (
                                                    <kbd className={`ml-auto font-mono rounded-sm py-1 px-2 flex gap-1 items-center text-xs whitespace-nowrap group-hover:bg-primary-300 group-hover:text-primary-700 ${selectedIndex === actualIndex ? 'bg-primary-300 text-primary-700' : 'bg-muted text-muted-foreground'}`}>
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
