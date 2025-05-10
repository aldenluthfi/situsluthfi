import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useState } from 'react';

import {
    IconMail,
    IconBrandInstagram,
    IconBrandX,
    IconBrandGithub,
    IconBrandLinkedin,
    IconX,
    IconLink,
    IconLicense
} from "@tabler/icons-react";

const Footer = () => {
    const email = import.meta.env.VITE_EMAIL;
    const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    const [showLinks, setShowLinks] = useState(false);

    const links: { name: string; icon: string; url: string }[] = [
        {
            name: "Instagram",
            icon: "instagram",
            url: import.meta.env.VITE_INSTAGRAM,
        },
        {
            name: "Twitter",
            icon: "twitter",
            url: import.meta.env.VITE_TWITTER,
        },
        {
            name: "GitHub",
            icon: "github",
            url: import.meta.env.VITE_GITHUB,
        },
        {
            name: "LinkedIn",
            icon: "linkedin",
            url: import.meta.env.VITE_LINKEDIN,
        },
    ];

    const iconMap: Record<string, React.JSX.Element> = {
        mail: <IconMail className="size-6" stroke={1.5} />,
        instagram: <IconBrandInstagram className="size-6" stroke={1.5} />,
        twitter: <IconBrandX className="size-6" stroke={1.5} />,
        github: <IconBrandGithub className="size-6" stroke={1.5} />,
        linkedin: <IconBrandLinkedin className="size-6" stroke={1.5} />,
        x: <IconX className="size-6" stroke={1.5} />,
        link: <IconLink className="size-6" stroke={1.5} />,
        license: <IconLicense className="size-6" stroke={1.5} />,
    };

    const copyEmail = async () => {
        navigator.clipboard.writeText(email);

        toast.promise(
            fetch("http://backend:3000/api/facts")
                .then(response => response.json()
                    .then(data => ({ data, status: response.status }))
                ),
                {
                    loading: <div>
                        Email Copied!
                        <div className="!text-sm !font-body !text-muted-foreground">
                            Fun Fact Loading...
                        </div>
                    </div>,
                    success: ({ data, status }) => ({
                        message: "Email Copied!",
                        description: status === 200 ?
                            <div className="flex flex-col space-y-2 pt-2">
                                <div className="!text-sm !font-body !text-muted-foreground">
                                    Fun Fact #{data.index}
                                </div>
                                <div className="!text-sm !font-body !text-muted-foreground">
                                    {data.text}
                                </div>
                                <div className="!font-body !text-muted-foreground">
                                    <a href={data.source} target="_blank" rel="noopener noreferrer" aria-label={data.source}>Source</a>
                                </div>
                            </div> : "",
                        icon: null
                    }),
                    error: () => ({
                        message: "Email Copied!",
                    }),
                    icon: null,
                    duration: 5000,
                }
        );
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
                    <ul className="flex tablet:justify-end gap-3">
                        <li>
                            {!isMobile ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={copyEmail} variant="ghost" size={"icon"}>
                                            {iconMap["mail"]}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Email</TooltipContent>
                                </Tooltip>
                            ) : (
                                <Button onClick={copyEmail} variant="ghost" size={"icon"}>
                                    {iconMap["mail"]}
                                </Button>
                            )}
                        </li>
                        <li className="flex max-tablet:flex-row-reverse gap-3">
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
                                                                    {iconMap[link.icon]}
                                                                </a>
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{link.name}</TooltipContent>
                                                    </Tooltip>
                                                ))}
                                                <Button variant="ghost" size="icon" onClick={handleLinksClose} aria-label="Close">
                                                    {iconMap["x"]}
                                                </Button>
                                            </>
                                        );
                                    } else {
                                        return (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size={"icon"} onClick={handleLinksClick}>
                                                        {iconMap["link"]}
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
                                                        {iconMap[link.icon]}
                                                    </a>
                                                </Button>
                                            ))}
                                            <Button variant="ghost" size="icon" onClick={handleLinksClose} aria-label="Close">
                                                {iconMap["x"]}
                                            </Button>
                                        </>
                                    );
                                } else {
                                    return (
                                        <Button variant="ghost" size={"icon"} onClick={handleLinksClick}>
                                            {iconMap["link"]}
                                        </Button>
                                    );
                                }
                            })()}
                        </li>
                        <li>
                            {!isMobile ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link to="/license">
                                            <Button variant="ghost" size={"icon"}>
                                                {iconMap["license"]}
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>License</TooltipContent>
                                </Tooltip>
                            ) : (
                                <Link to="/license">
                                    <Button variant="ghost" size={"icon"}>
                                        {iconMap["license"]}
                                    </Button>
                                </Link>
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
