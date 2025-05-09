import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator"
import { DynamicIcon } from "lucide-react/dynamic";
import type { IconName } from "lucide-react/dynamic";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useState } from 'react';

const Footer = () => {
    const email = "placeholder";
    const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    const [showLinks, setShowLinks] = useState(false);

    const links: { name: string; icon: IconName; url: string }[] = [
        {
            name: "Instagram",
            icon: "instagram",
            url: "https://instagram.com/",
        },
        {
            name: "Twitter",
            icon: "twitter",
            url: "https://twitter.com/",
        },
        {
            name: "GitHub",
            icon: "github",
            url: "https://github.com/",
        },
        {
            name: "LinkedIn",
            icon: "linkedin",
            url: "https://linkedin.com/",
        },
    ];

    const copyEmail = () => {
        navigator.clipboard.writeText(email);
        toast("Email Copied!");
    };

    const handleLinksClick = () => {
        setShowLinks(true);
    };

    const handleLinksClose = () => {
        setShowLinks(false);
    };

    return (
        <footer className="bottom-0 flex w-full justify-center bg-primary-200">
            <nav className="flex justify-between flex-col w-full desktop:w-desktop p-6">
                <div className="flex max-tablet:flex-col max-tablet:space-y-4 tablet:justify-between tablet:items-end pb-6">
                    <Link to="/" className="px-3 font-heading text-2xl text-foreground w-1/5 h-full">
                        aldenluth.fi
                    </Link>
                    <ul className="flex tablet:justify-end gap-2">
                        <li>
                            {!isMobile ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={copyEmail} variant="ghost" size={"icon"}>
                                            <DynamicIcon name="mail" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Email</TooltipContent>
                                </Tooltip>
                            ) : (
                                <Button onClick={copyEmail} variant="ghost" size={"icon"}>
                                    <DynamicIcon name="mail" />
                                </Button>
                            )}
                        </li>
                        <li className="flex max-tablet:flex-row-reverse gap-2">
                            {(() => {
                                if (!isMobile) {
                                    if (showLinks) {
                                        return (
                                            <>
                                                {links.map(link => (
                                                    <Tooltip key={link.name}>
                                                        <TooltipTrigger asChild>
                                                            <Button asChild variant="ghost" size={"icon"}>
                                                                <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                                                                    <DynamicIcon name={link.icon} />
                                                                </a>
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{link.name}</TooltipContent>
                                                    </Tooltip>
                                                ))}
                                                <Button variant="ghost" size="icon" onClick={handleLinksClose} aria-label="Close">
                                                    <DynamicIcon name="x" />
                                                </Button>
                                            </>
                                        );
                                    } else {
                                        return (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size={"icon"} onClick={handleLinksClick}>
                                                        <DynamicIcon name="link" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Links</TooltipContent>
                                            </Tooltip>
                                        );
                                    }
                                } else if (showLinks) {
                                    return (
                                        <>
                                            {links.map(link => (
                                                <Button asChild variant="ghost" size={"icon"} key={link.name}>
                                                    <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                                                        <DynamicIcon name={link.icon} />
                                                    </a>
                                                </Button>
                                            ))}
                                            <Button variant="ghost" size="icon" onClick={handleLinksClose} aria-label="Close">
                                                <DynamicIcon name="x" />
                                            </Button>
                                        </>
                                    );
                                } else {
                                    return (
                                        <Button variant="ghost" size={"icon"} onClick={handleLinksClick}>
                                            <DynamicIcon name="link"/>
                                        </Button>
                                    );
                                }
                            })()}
                        </li>
                        <li>
                            {!isMobile ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size={"icon"}>
                                            <Link to="/license">
                                                <DynamicIcon name="scan-text" />
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>License</TooltipContent>
                                </Tooltip>
                            ) : (
                                <Button variant="ghost" size={"icon"}>
                                    <Link to="/license">
                                        <DynamicIcon name="scan-text" />
                                    </Link>
                                </Button>
                            )}
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
