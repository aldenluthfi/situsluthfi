import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSettings } from "@/components/custom/theme-settings";
import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandItem,
    CommandGroup
} from "@/components/ui/command";
import {
    IconSearch,
    IconFolder,
    IconBook,
    IconPhoto
} from "@tabler/icons-react";
import { ScrollProgress } from '@/components/animate-ui/components/scroll-progress';
import { useCallback, useRef, useState, useEffect } from "react";

export function Header() {
    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

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
        }
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
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Search..."
                    value={search}
                    onValueChange={handleSearch}
                />
                <CommandList className="py-1">
                    {search ? (
                        <>
                            {searchLoading && (
                                <CommandGroup>
                                    <CommandItem disabled>Searching...</CommandItem>
                                </CommandGroup>
                            )}
                            {searchError && (
                                <CommandGroup>
                                    <CommandItem disabled>{searchError}</CommandItem>
                                </CommandGroup>
                            )}
                            {searchResults.length > 0 && (
                                <CommandGroup heading="Arbitrary Results">
                                    {searchResults.map((item) => (
                                        <CommandItem
                                            key={item.id}
                                            data-slot="button"
                                            onSelect={() => {
                                                setOpen(false);
                                                window.location.href = `/writings/${item.slug}`;
                                            }}
                                        >
                                            <IconBook className="size-4 mr-2" stroke={1.5} />
                                            {item.title}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                            {searchResults.length === 0 && (
                                <CommandEmpty>No results found.</CommandEmpty>
                            )}
                        </>
                    ) : (
                        <>
                            <CommandGroup>
                                <CommandItem
                                    data-slot="button"
                                    onSelect={() => { setOpen(false); window.location.href = "/projects"; }}
                                >
                                    <IconFolder className="size-4 mr-2" stroke={1.5} />
                                    Projects
                                </CommandItem>
                                <CommandItem
                                    data-slot="button"
                                    onSelect={() => { setOpen(false); window.location.href = "/writings"; }}
                                >
                                    <IconBook className="size-4 mr-2" stroke={1.5} />
                                    Writings
                                </CommandItem>
                                <CommandItem
                                    data-slot="button"
                                    onSelect={() => { setOpen(false); window.location.href = "/gallery"; }}
                                >
                                    <IconPhoto className="size-4 mr-2 " stroke={1.5} />
                                    Gallery
                                </CommandItem>
                            </CommandGroup>
                        </>
                    )}
                </CommandList>
            </CommandDialog>
            <ScrollProgress className="bg-primary h-1"/>
        </header>
    );
}

export default Header;
