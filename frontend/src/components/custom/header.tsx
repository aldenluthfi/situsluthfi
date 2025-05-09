import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSettings } from "@/components/custom/theme-settings";

export function Header() {

    return (
        <header className="fixed flex z-10 w-screen bg-background justify-center">
            <nav className="flex justify-between items-start h-20 w-full desktop:w-desktop">
                <div className="z-30 pl-6 w-48 my-auto">
                    <Link to="/" className="tablet:pl-3 font-heading text-2xl">
                        aldenluth.fi
                    </Link>
                </div>

                <div className="hidden w-full tablet:flex justify-center font-body-bold text-sm my-auto">
                    <ul className="-ml-6 tablet:grid gap-6 grid-cols-3">
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

                <div className="flex pr-6 pt-4 w-48 justify-end">
                    <ThemeSettings />
                </div>

            </nav>
        </header>
    );
}

export default Header;
