import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/animate-ui/components/tooltip";
import { toast } from "sonner";
import { useState } from 'react';
import { isMobile } from "@/lib/utils";
import { motion, AnimatePresence, delay } from "motion/react";

import {
    IconMail,
    IconBrandInstagram,
    IconBrandX,
    IconBrandGithub,
    IconBrandLinkedin,
    IconX,
    IconLink,
    IconScale
} from "@tabler/icons-react";

const Footer = () => {
    const email = import.meta.env.VITE_EMAIL;
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
        license: <IconScale className="size-6" stroke={1.5} />,
    };

    const copyEmail = async () => {
        navigator.clipboard.writeText(email);

        toast.promise(
            fetch("/api/facts")
                .then(response => response.json()
                    .then(data => ({ data, status: response.status }))
                ),
            {
                loading: <div>
                    Email Copied!
                    <div className="!text-sm !text-muted-foreground">
                        Fun Fact Loading...
                    </div>
                </div>,
                success: ({ data, status }) => ({
                    message: "Email Copied!",
                    description: status === 200 ?
                        <div className="flex flex-col space-y-2 pt-2">
                            <div className="!text-sm !text-muted-foreground">
                                Fun Fact #{data.id}
                            </div>
                            <div className="!text-sm !text-muted-foreground">
                                {data.text}
                            </div>
                            <div className=" !text-muted-foreground">
                                <a className="underline" href={data.source} target="_blank" rel="noopener noreferrer" aria-label={data.source}>Source</a>
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
        <footer className="bottom-0 z-100 flex w-full justify-center bg-primary-200">
            <nav className="flex justify-between flex-col w-full desktop:w-desktop p-6">
                <div className="flex max-tablet:flex-col max-tablet:space-y-4 tablet:justify-between tablet:items-end pb-6">
                    <TooltipProvider openDelay={0} closeDelay={0}>
                        <Link to="/" className=" font-heading text-2xl ultrawide:text-3xl  text-primary-700 w-1/5 h-full">
                            aldenluth.fi
                        </Link>
                        <ul className="flex max-tablet:-ml-3 pl-1.5 tablet:justify-end gap-3">
                            <li>
                                {!isMobile ? (
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                onClick={copyEmail}
                                                variant="ghost"
                                                size="icon"
                                                aria-label="Email"
                                                title="Email"
                                            >
                                                {iconMap["mail"]}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Email</TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <Button
                                        onClick={copyEmail}
                                        variant="ghost"
                                        size={"icon"}
                                        aria-label="Email"
                                        title="Email"
                                    >
                                        {iconMap["mail"]}
                                    </Button>
                                )}
                            </li>
                            <li className="flex max-tablet:flex-row-reverse gap-3">
                                {(() => {
                                    if (!isMobile) {
                                        return (
                                            <>
                                                <AnimatePresence>
                                                    {showLinks && (
                                                        <motion.div
                                                            initial={{ width: 0, opacity: 0 }}
                                                            animate={{ width: "auto", opacity: 1 }}
                                                            exit={{
                                                                width: 0,
                                                                opacity: 0,
                                                                transition: {
                                                                    width: {
                                                                        duration: 0.1,
                                                                        type: "tween",
                                                                        delay: 0.1
                                                                    },
                                                                    opacity: {
                                                                        duration: 0.1,
                                                                        delay: 0.1

                                                                    }
                                                                }
                                                            }}
                                                            transition={{
                                                                width: {
                                                                    duration: 0.3,
                                                                    type: "spring",
                                                                },
                                                                opacity: { duration: 0.1 }
                                                            }}
                                                            className="flex gap-3 overflow-hidden"
                                                        >
                                                            {links.map(link => (
                                                                <Tooltip key={link.name}>
                                                                    <TooltipTrigger>
                                                                        <Button
                                                                            asChild
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            aria-label={link.name}
                                                                            title={link.name}
                                                                        >
                                                                            <a
                                                                                href={link.url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                aria-label={link.name}
                                                                                title={link.name}
                                                                            >
                                                                                {iconMap[link.icon]}
                                                                            </a>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>{link.name}</TooltipContent>
                                                                </Tooltip>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                                {showLinks ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={handleLinksClose}
                                                        aria-label="Close"
                                                        title="Close"
                                                    >
                                                        {iconMap["x"]}
                                                    </Button>
                                                ) : (
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Button
                                                                variant="ghost"
                                                                size={"icon"}
                                                                onClick={handleLinksClick}
                                                                aria-label="Links"
                                                                title="Links"
                                                            >
                                                                {iconMap["link"]}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Links</TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </>
                                        );
                                    } else {
                                        return (
                                            <>
                                                <AnimatePresence>
                                                    {showLinks && (
                                                        <motion.div
                                                            initial={{ width: 0, opacity: 0 }}
                                                            animate={{ width: "auto", opacity: 1 }}
                                                            exit={{
                                                                width: 0,
                                                                opacity: 0,
                                                               transition: {
                                                                    width: {
                                                                        duration: 0.1,
                                                                        type: "tween",
                                                                        delay: 0.1
                                                                    },
                                                                    opacity: {
                                                                        duration: 0.1,
                                                                        delay: 0.1

                                                                    }
                                                                }
                                                            }}
                                                            transition={{
                                                                width: {
                                                                    duration: 0.3,
                                                                    type: "spring"
                                                                },
                                                                opacity: { duration: 0.1 }
                                                            }}
                                                            className="flex gap-3 overflow-hidden"
                                                        >
                                                            {links.map(link => (
                                                                <Button
                                                                    asChild
                                                                    variant="ghost"
                                                                    size={"icon"}
                                                                    key={link.name}
                                                                    aria-label={link.name}
                                                                    title={link.name}
                                                                >
                                                                    <a
                                                                        href={link.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        aria-label={link.name}
                                                                        title={link.name}
                                                                    >
                                                                        {iconMap[link.icon]}
                                                                    </a>
                                                                </Button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                                {showLinks ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={handleLinksClose}
                                                        aria-label="Close"
                                                        title="Close"
                                                    >
                                                        {iconMap["x"]}
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size={"icon"}
                                                        onClick={handleLinksClick}
                                                        aria-label="Links"
                                                        title="Links"
                                                    >
                                                        {iconMap["link"]}
                                                    </Button>
                                                )}
                                            </>
                                        );
                                    }
                                })()}
                            </li>
                            <li>
                                {!isMobile ? (
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label="License"
                                                title="License"
                                            >
                                                <Link to="/license" aria-label="License" title="License">
                                                    {iconMap["license"]}
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>License</TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <Link to="/license" aria-label="License" title="License">
                                        <Button variant="ghost" size={"icon"} aria-label="License" title="License">
                                            {iconMap["license"]}
                                        </Button>
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </TooltipProvider>
                </div>

                <Separator className='bg-primary' />

                <div className="flex pt-6 max-tablet:justify-start tablet:justify-center">
                    <p className="text-sm ultrawide:text-base text-primary-700">
                        <span className="inline-block scale-x-[-1]">&copy;</span> 2025 Alden Luthfi. All rights reversed.
                    </p>
                </div>
            </nav>
        </footer>
    );
};

export default Footer;
