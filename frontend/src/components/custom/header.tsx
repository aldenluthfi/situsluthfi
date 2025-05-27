import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSettings } from "@/components/custom/theme-settings";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
    IconSearch,
    IconFolder,
    IconBook,
    IconPhoto,
    IconPencil
} from "@tabler/icons-react";
import { ScrollProgress } from '@/components/animate-ui/components/scroll-progress';
import { useCallback, useRef, useState, useEffect } from "react";

export function Header() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        setSearchLoading(true);
        setSearchError(null);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (!value) {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }

        searchTimeout.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/writings/search?q=${encodeURIComponent(value)}&pagesize=3&page=1`);

                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();

                setSearchResults(data.results || []);
                setSearchLoading(false);
                setSearchError(null);
            } catch (err) {
                setSearchError("Failed to search");
                setSearchLoading(false);
            }
        }, 200);
    }, []);

    useEffect(() => {
        if (!open) {
            setSearch("");
            setSearchResults([]);
            setSearchLoading(false);
            setSearchError(null);
            setSelectedIndex(0);
        } else {
            setSelectedIndex(0);
        }
    }, [open]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [search, searchResults]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const totalItems = searchResults.length + 3;

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
                    setOpen(false);
                    window.location.href = `/writings/${selectedItem.slug}`;
                }
            } else {

                const navItems = ['/projects', '/writings', '/gallery'];
                const navIndex = selectedIndex - searchResults.length;
                setOpen(false);
                window.location.href = navItems[navIndex];
            }
        }
    };

    useEffect(() => {
        setSelectedIndex(0);
    }, [open]);

    return (
        <header className="fixed top-0 flex z-10 w-screen bg-background justify-center">
            <nav className="flex justify-between items-start h-20 pt-1 w-full desktop:w-desktop">
                <div className="z-30 pl-6 w-48 my-auto">
                    <Link to="/" className="tablet:pl-3 font-heading text-2xl">
                        aldenluth.fi
                    </Link>
                </div>

                <div className="hidden w-full tablet:flex justify-center font-body-bold text-sm my-auto">
                    <ul className="-ml-6 -mr-14 tablet:grid gap-6 grid-cols-3">
                        <li>
                            <Button variant="default" size="default" asChild>
                                <Link to="/projects">Projects</Link>
                            </Button>
                        </li>
                        <li>
                            <Button variant="default" size="default" asChild>
                                <Link to="/writings">Writings</Link>
                            </Button>
                        </li>
                        <li>
                            <Button variant="default" size="default" asChild>
                                <Link to="/gallery">Gallery</Link>
                            </Button>
                        </li>
                    </ul>
                </div>
                <div className="flex items-center justify-end w-48 my-auto gap-2 mr-16">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(true)}
                        className="hover:bg-accent text-foreground"
                        aria-label="Search"
                        title="Search"
                    >
                        <IconSearch className="size-6" stroke={1.5} />
                    </Button>
                    <div className="relative flex -top-4.5">
                        <ThemeSettings />
                    </div>
                </div>
            </nav>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogHeader className="sr-only">
                    <DialogTitle>Command Panel</DialogTitle>
                    <DialogDescription>Search Anything</DialogDescription>
                </DialogHeader>
                <DialogContent className="overflow-hidden p-0 max-w-lg">
                    <div className="bg-popover text-popover-foreground flex h-full w-full flex-col px-1 pb-1 overflow-hidden rounded-md">
                        <div className="flex h-12 items-center gap-2 border-b px-3">
                            <IconSearch className="size-4" stroke={1.5} />
                            <input
                                className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                        </div>

                        <div className="max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto py-1">
                            {searchLoading && (
                                <div className="py-6 text-center text-sm">Searching...</div>
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
                                        <div className="px-2 pb-2 text-xs text-muted-foreground">Search Results</div>
                                        {searchResults.map((item, index) => (
                                            <div
                                                key={item.id}
                                                className={`relative flex cursor-default items-center font-body-bold gap-4 rounded-sm px-3 py-3 outline-hidden select-none [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 ${selectedIndex === index
                                                    ? 'bg-primary-200 text-primary-700 [&_svg]:!text-primary-700 [&_svg]:!stroke-primary-700'
                                                    : ''
                                                    }`}
                                                onClick={() => {
                                                    setOpen(false);
                                                    window.location.href = `/writings/${item.slug}`;
                                                }}
                                                data-slot="button"
                                            >
                                                <IconPencil className="size-4" stroke={1.5} />
                                                {item.title}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {(searchResults.length > 0 || searchLoading || searchError) && (
                                <Separator className="my-1 bg-border" />
                            )}

                            <div className="text-foreground overflow-hidden p-1">
                                <div
                                    className={`relative flex cursor-default items-center font-body-bold gap-4 rounded-sm px-3 py-3 outline-hidden select-none [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 ${selectedIndex === searchResults.length
                                        ? 'bg-primary-200 text-primary-700 [&_svg]:!text-primary-700 [&_svg]:!stroke-primary-700'
                                        : ''
                                        }`}
                                    onClick={() => { setOpen(false); window.location.href = "/projects"; }}
                                    data-slot="button"
                                >
                                    <IconFolder className="size-4" stroke={1.5} />
                                    Projects
                                </div>
                                <div
                                    className={`relative flex cursor-default items-center font-body-bold gap-4 rounded-sm px-3 py-3 outline-hidden select-none [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 ${selectedIndex === searchResults.length + 1
                                        ? 'bg-primary-200 text-primary-700 [&_svg]:!text-primary-700 [&_svg]:!stroke-primary-700'
                                        : ''
                                        }`}
                                    onClick={() => { setOpen(false); window.location.href = "/writings"; }}
                                    data-slot="button"
                                >
                                    <IconBook className="size-4" stroke={1.5} />
                                    Writings
                                </div>
                                <div
                                    className={`relative flex cursor-default items-center font-body-bold gap-4 rounded-sm px-3 py-3 outline-hidden select-none [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 ${selectedIndex === searchResults.length + 2
                                        ? 'bg-primary-200 text-primary-700 [&_svg]:!text-primary-700 [&_svg]:!stroke-primary-700'
                                        : ''
                                        }`}
                                    onClick={() => { setOpen(false); window.location.href = "/gallery"; }}
                                    data-slot="button"
                                >
                                    <IconPhoto className="size-4" stroke={1.5} />
                                    Gallery
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <ScrollProgress className="bg-primary h-1" />
        </header>
    );
}

export default Header;
