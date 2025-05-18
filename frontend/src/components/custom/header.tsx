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
import * as React from "react";

export function Header() {
    const [open, setOpen] = React.useState(false);

    return (
        <header className="fixed flex z-10 w-screen bg-background justify-center">
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
                <CommandInput placeholder="Search..." />
                <CommandList className="py-1">
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
                    <CommandEmpty>No results found.</CommandEmpty>
                </CommandList>
            </CommandDialog>
            <ScrollProgress className="bg-primary h-1"/>
        </header>
    );
}

export default Header;
