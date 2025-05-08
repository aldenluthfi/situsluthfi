import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator"
import { DynamicIcon } from "lucide-react/dynamic";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useState } from 'react';

const Footer = () => {
    const email = "placeholder";
    const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

    const [popoverOpen, setPopoverOpen] = useState(false);

    const copyEmail = () => {
        navigator.clipboard.writeText(email);
        setPopoverOpen(true);
        setTimeout(() => setPopoverOpen(false), 1000);
    };

    return (
        <footer className="bottom-0 flex w-full justify-center bg-primary-200">
            <nav className="flex justify-between flex-col w-full desktop:w-desktop p-6">
                <div className="flex max-tablet:flex-col max-tablet:space-y-4 tablet:justify-between tablet:items-end pb-6">
                    <Link to="/" className="px-3 font-heading text-2xl text-foreground w-1/5 h-full">
                        aldenluth.fi
                    </Link>
                    <ul className="flex tablet:justify-end tablet:gap-3">
                        <li>
                            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button onClick={copyEmail} variant="ghost">
                                        {isMobile
                                            ? <DynamicIcon name="mail" className="w-5 h-5" />
                                            : "Email"
                                        }
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto px-3 py-1.5 text-xs" sideOffset={isMobile ? -8 : -2}>
                                    Email Copied!
                                </PopoverContent>
                            </Popover>
                        </li>
                        <li>
                            <Button variant="ghost">
                                {isMobile
                                    ? <DynamicIcon name="link" className="w-5 h-5" />
                                    : "Links"
                                }
                            </Button>
                        </li>
                        <li>
                            <Button variant="ghost">
                                <Link to="/license">
                                    {isMobile
                                        ? <DynamicIcon name="copyleft" className="w-5 h-5" />
                                        : "License"
                                    }
                                </Link>
                            </Button>
                        </li>
                    </ul>
                </div>

                <Separator className='bg-primary-200' />

                <div className="flex pt-6 max-tablet:justify-start tablet:justify-center">
                    <p className="max-tablet:px-3 text-sm font-body text-foreground">
                        <span className="inline-block scale-x-[-1]">&copy;</span> 2025 Alden Luthfi. All rights reversed.
                    </p>
                </div>
            </nav>
        </footer>
    );
};

export default Footer;
