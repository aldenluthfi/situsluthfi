import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSettings } from "@/components/custom/theme-settings";
import {
    IconSearch
} from "@tabler/icons-react";
import { ScrollProgress } from '@/components/animate-ui/components/scroll-progress';

interface HeaderProps {
    onSearchClick: () => void;
}

export function Header({ onSearchClick }: HeaderProps) {
    return (
        <header className="fixed top-0 flex z-1000 w-screen bg-background justify-center">
            <nav className="flex justify-between items-start h-20 pt-1 w-full desktop:w-desktop">
                <div className="z-30 pl-6 w-48 my-auto">
                    <Link to="/" className="font-heading text-2xl ultrawide:text-3xl">
                        aldenluth.fi
                    </Link>
                </div>

                <div className="hidden w-full tablet:flex justify-center my-auto">
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
                <div className="flex items-center justify-end w-48 my-auto gap-3 mr-14 tablet:mr-16">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onSearchClick}
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
            <ScrollProgress className="bg-primary h-1" />
        </header>
    );
}

export default Header;
