import { useEffect, useRef, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import useMeasure from "react-use-measure";

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

import remarkGfm from 'remark-gfm';
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";

import { IconSparkles, IconCode, IconHeartHandshake, IconSchool, IconCloudLock, IconPalette } from '@tabler/icons-react';

import cvContent from '@/assets/other/cv.md?raw';

interface CVProps {
    type?: "full" | "software" | "cybersecurity" | "design" | "humanitarian" | "tutor";
    className?: string;
    showTabs?: boolean;
    autoPlay?: boolean;
    pauseOnInteract?: boolean;
}

interface ParsedSection {
    type: 'persistent' | 'variable';
    content: string;
    shouldShow: boolean;
}

const CV: React.FC<CVProps> = ({
    type = "full",
    className = "",
    showTabs = false,
    autoPlay = false,
    pauseOnInteract = true
}) => {

    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [direction, setDirection] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [ref] = useMeasure();
    const [prevSections, setPrevSections] = useState<ParsedSection[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const tabs = [
        { id: "full", label: "honestly, anything!", icon: <IconSparkles className='size-6' stroke={1.5} /> },
        { id: "software", label: "a software developer", icon: <IconCode className='size-6' stroke={1.5} /> },
        { id: "cybersecurity", label: "a cybersecurity analyst", icon: <IconCloudLock className='size-6' stroke={1.5} /> },
        { id: "design", label: "a graphic designer", icon: <IconPalette className='size-6' stroke={1.5} /> },
        { id: "humanitarian", label: "a humanitarian volunteer", icon: <IconHeartHandshake className='size-6' stroke={1.5} /> },
        { id: "tutor", label: "an academic tutor", icon: <IconSchool className='size-6' stroke={1.5} /> }
    ];

    const [activeTab, setActiveTab] = useState(() => {
        return tabs.findIndex(tab => tab.id === type);
    });

    const currentType = tabs[activeTab]?.id || "full";
    const currentLabel = tabs[activeTab]?.label || "";

    const parsedSections = useMemo(() => {
        const sections = cvContent.split(/(?=^##)/gm).filter(section => section.trim());

        return sections.map(section => {
            const hasTag = /\[([^\]]+)\]/.test(section);
            const tagMatch = section.match(/\[([^\]]+)\]/);

            const isPersistentSection = section.includes('## Personal Information') ||
                section.includes('## About Me') ||
                section.includes('# Alden Luthfi');

            let shouldShow = true;
            if (hasTag && tagMatch && currentType !== "full") {
                const tags = tagMatch[1].split('|').map(tag => tag.trim());
                shouldShow = tags.includes(currentType);
            }

            return {
                type: (hasTag && !isPersistentSection) ? 'variable' as const : 'persistent' as const,
                content: section,
                shouldShow: isPersistentSection ? true : shouldShow
            };
        });
    }, [currentType]);

    const verticalDirection = useMemo(() => {
        if (prevSections.length === 0) return 0;

        const prevVisibleCount = prevSections.filter(s => s.shouldShow).length;
        const currentVisibleCount = parsedSections.filter(s => s.shouldShow).length;

        return currentVisibleCount > prevVisibleCount ? 1 : currentVisibleCount < prevVisibleCount ? -1 : 0;
    }, [parsedSections, prevSections]);

    const getTextContent = (children: any): string => {
        if (Array.isArray(children)) {
            return children.map(child =>
                typeof child === 'string' ? child :
                    typeof child === 'object' && child?.props?.children ? getTextContent(child.props.children) : ''
            ).join('');
        }
        return typeof children === 'string' ? children : '';
    };

    const shouldShowElement = (children: any, targetType: string): boolean => {
        if (targetType === "full") return true;

        const content = getTextContent(children);
        const tagMatch = content.match(/\[([^\]]+)\]/);
        if (!tagMatch) return true;

        const tags = tagMatch[1].split('|').map(tag => tag.trim());
        return tags.includes(targetType);
    };

    const stripTagsFromChildren = (children: any): any => {
        if (Array.isArray(children)) {
            return children.map((child, index) => {
                if (typeof child === 'string') {
                    if (index === children.length - 1) {
                        return child.replace(/\s*\[[^\]]+\]/, '');
                    }
                    return child;
                }
                return child;
            });
        }
        return typeof children === 'string' ? children.replace(/\s*\[[^\]]+\]/, '') : children;
    };

    const handleTabClick = (newTabIndex: number) => {
        if (newTabIndex !== activeTab && !isAnimating) {
            setPrevSections(parsedSections);
            const newDirection = newTabIndex > activeTab ? 1 : -1;
            setDirection(newDirection);
            setActiveTab(newTabIndex);
            if (pauseOnInteract && autoPlay) {
                setIsPaused(true);
            }
        }
    };
    useEffect(() => {
        if (!autoPlay || isAnimating || isPaused || !showTabs) return;

        const interval = setInterval(() => {
            const nextTab = activeTab === 0 ? tabs.length - 1 : activeTab - 1;
            const newDirection = nextTab < activeTab ? -1 : 1;
            setDirection(newDirection);
            setActiveTab(nextTab);
        }, 3000);

        return () => clearInterval(interval);
    }, [autoPlay, isAnimating, isPaused, activeTab, tabs.length, showTabs]);

    useEffect(() => {
        if (!pauseOnInteract || !autoPlay || !showTabs) return;

        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const notVisible = rect.top > window.innerHeight || rect.bottom < 0;

            if (notVisible && isPaused) {
                setIsPaused(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pauseOnInteract, autoPlay, isPaused, showTabs]);

    const horizontalVariants = {
        initial: (direction: number) => ({
            height: 0,
            x: 300 * direction,
            opacity: 0,
            filter: "blur(4px)",
        }),
        active: {
            height: "auto",
            x: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                height: { duration: 0.2, ease: "easeInOut", bounce: 0.2  },
                x: { duration: 0.4, type: "spring", bounce: 0.2, delay: 0.1, ease: "easeOut" },
                opacity: { duration: 0.4, type: "spring", bounce: 0.2, delay: 0.1, ease: "easeOut" },
                filter: { duration: 0.4, type: "spring", bounce: 0.2, delay: 0.1, ease: "easeOut" },
            }
        },
        exit: (direction: number) => ({
            height: 0,
            x: -300 * direction,
            opacity: 0,
            filter: "blur(4px)",
            transition: {
                x: { duration: 0.4, type: "spring", bounce: 0.2, ease: "easeIn" },
                opacity: { duration: 0.4, type: "spring", bounce: 0.2, ease: "easeIn" },
                filter: { duration: 0.4, type: "spring", bounce: 0.2, ease: "easeIn" },
                height: { duration: 0.2, ease: "easeInOut", delay: 0.3, bounce: 0.2 },
            }
        }),
    };

    const verticalVariants = {
        initial: (direction: number) => ({
            height: 0,
            y: 50 * direction,
            opacity: 0,
        }),
        active: {
            height: "auto",
            y: 0,
            opacity: 1,
            transition: {
                height: { duration: 0.15, ease: "easeInOut", bounce: 0.2  },
                y: { duration: 0.3, type: "spring", bounce: 0.1, delay: 0.05, ease: "easeOut" },
                opacity: { duration: 0.3, type: "spring", bounce: 0.1, delay: 0.05, ease: "easeOut" },
            }
        },
        exit: (direction: number) => ({
            height: 0,
            y: -50 * direction,
            opacity: 0,
            transition: {
                y: { duration: 0.3, type: "spring", bounce: 0.1, ease: "easeIn" },
                opacity: { duration: 0.3, type: "spring", bounce: 0.1, ease: "easeIn" },
                height: { duration: 0.15, ease: "easeInOut", delay: 0.25, bounce: 0.2  },
            }
        }),
    };

    const tabVariants = {
        initial: (direction: number) => ({
            x: 300 * direction,
            opacity: 0,
            filter: "blur(4px)",
        }),
        active: {
            x: 0,
            opacity: 1,
            filter: "blur(0px)",
        },
        exit: (direction: number) => ({
            x: -300 * direction,
            opacity: 0,
            filter: "blur(4px)",
        }),
    };

    return (
        <div ref={containerRef} className={`w-full flex flex-col ${showTabs ? 'items-center' : ''} ${className}`}>
            {showTabs && (
                <>
                    <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2, ease: "easeInOut" }}>
                        <motion.div
                            className="relative h-min w-full mb-8"
                            initial={false}
                        >
                            <div className="p-1" ref={ref}>
                                <AnimatePresence
                                    custom={direction}
                                    mode="popLayout"
                                    onExitComplete={() => setIsAnimating(false)}
                                >
                                    <motion.div
                                        key={activeTab}
                                        variants={tabVariants}
                                        initial="initial"
                                        animate="active"
                                        exit="exit"
                                        custom={direction}
                                        onAnimationStart={() => setIsAnimating(true)}
                                        onAnimationComplete={() => setIsAnimating(false)}
                                        className="font-body text-lg tablet:text-2xl text-center"
                                    >
                                        {currentLabel}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </MotionConfig>

                    <div className="flex gap-2 ultrawide:gap-3 border border-input rounded-lg bg-card p-2 -mb-18 sticky top-28 z-10">
                        {tabs.map((tab, index) => (
                            <Button
                                key={tab.id}
                                onClick={() => handleTabClick(index)}
                                size="icon"
                                style={{ WebkitTapHighlightColor: "transparent" }}
                                className={`bg-transparent shadow-none hover:bg-transparent text-foreground ${activeTab === index ? "text-primary-700 duration-400" : ""
                                    }`}
                            >
                                {activeTab === index && (
                                    <motion.span
                                        layoutId="bubble"
                                        className="absolute inset-0 -z-10 bg-primary-300 shadow-xs text-primary-700 rounded-md"
                                        transition={{ type: "spring", bounce: 0.19, duration: 0.4, ease: "easeInOut" }}
                                    />
                                )}
                                {tab.icon}
                            </Button>
                        ))}
                    </div>
                </>
            )}

            <Card className="w-10/12 mt-28 px-0 py-6 tablet:px-2 tablet:py-8 desktop:px-4 desktop:py-10">
                <CardContent className="overflow-hidden">
                    <div className="space-y-0">
                        {parsedSections.map((section, index) => {
                            const shouldShowSection = section.shouldShow && (isExpanded || section.type === 'persistent');

                            if (section.type === 'persistent') {
                                return (
                                    <AnimatePresence key={`persistent-${index}`} mode="wait">
                                        {shouldShowSection && (
                                            <motion.div
                                                variants={verticalVariants}
                                                initial="initial"
                                                animate="active"
                                                exit="exit"
                                                custom={verticalDirection}
                                                className="overflow-hidden"
                                            >
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        h1(props) {
                                                            const { children, ...rest } = props;
                                                            const cleanChildren = stripTagsFromChildren(children);
                                                            return (
                                                                <h1 {...rest} className="text-2xl tablet:text-3xl desktop:text-4xl font-heading tablet:mb-2 desktop:mb-4 text-center">
                                                                    {cleanChildren}
                                                                </h1>
                                                            );
                                                        },
                                                        h2(props) {
                                                            const { children, ...rest } = props;
                                                            const cleanChildren = stripTagsFromChildren(children);
                                                            return (
                                                                <h2 {...rest} className="text-lg tablet:text-xl desktop:text-2xl font-heading mt-3 tablet:mt-4 desktop:mt-6 mb-1 tablet:mb-2 desktop:mb-3 border-b border-foreground pb-1 tablet:pb-2">
                                                                    {cleanChildren}
                                                                </h2>
                                                            );
                                                        },
                                                        h3(props) {
                                                            const { children, ...rest } = props;
                                                            const shouldShow = shouldShowElement(children, currentType);
                                                            const cleanChildren = stripTagsFromChildren(children);

                                                            if (!shouldShow) return null;

                                                            return (
                                                                <h3 {...rest} className="w-full [&>a]:no-underline [&>a]:text-foreground [&>a]:pointer-events-none text-center mt-2 tablet:mt-3 desktop:mt-4 mb-1 tablet:mb-1 desktop:mb-2 text-sm tablet:text-base desktop:text-lg">
                                                                    {cleanChildren}
                                                                </h3>
                                                            );
                                                        },
                                                        h4(props) {
                                                            const { children, ...rest } = props;
                                                            const shouldShow = shouldShowElement(children, currentType);
                                                            const cleanChildren = stripTagsFromChildren(children);

                                                            if (!shouldShow) return null;

                                                            return (
                                                                <h4 {...rest} className="flex italic [&>strong]:font-body-bold [&>strong]:not-italic [&>strong]:text-foreground [&>strong]:text-sm [&>strong]:tablet:text-base [&>strong]:desktop:text-lg flex-col desktop:flex-row desktop:justify-between w-full mt-1 tablet:mt-2 desktop:mt-3 text-sm tablet:text-base desktop:text-lg">
                                                                    {cleanChildren}
                                                                </h4>
                                                            );
                                                        },
                                                        h5(props) {
                                                            const { children, ...rest } = props;
                                                            const shouldShow = shouldShowElement(children, currentType);
                                                            const cleanChildren = stripTagsFromChildren(children);

                                                            if (!shouldShow) return null;

                                                            return (
                                                                <h4 {...rest} className="flex [&>strong]:text-foreground flex-col desktop:flex-row desktop:justify-between w-full mb-0.5 tablet:mb-1 text-sm tablet:text-base desktop:text-lg">
                                                                    {cleanChildren}
                                                                </h4>
                                                            );
                                                        },
                                                        p(props) {
                                                            const { children, ...rest } = props;
                                                            const shouldShow = shouldShowElement(children, currentType);
                                                            const cleanChildren = stripTagsFromChildren(children);

                                                            if (!shouldShow) return null;

                                                            return (
                                                                <p {...rest} className="mb-1 tablet:mb-2 desktop:mb-3 [&>strong]:text-primary [&>strong]:font-body-bold text-sm tablet:text-base desktop:text-lg">
                                                                    {cleanChildren}
                                                                </p>
                                                            );
                                                        },
                                                        ul(props) {
                                                            const { children, ...rest } = props;
                                                            const shouldShow = shouldShowElement(children, currentType);

                                                            if (!shouldShow) return null;

                                                            return (
                                                                <ul {...rest} className="list-disc pl-6 mb-1 tablet:mb-2 desktop:mb-3 text-sm tablet:text-base desktop:text-lg">
                                                                    {children}
                                                                </ul>
                                                            );
                                                        },
                                                        li(props) {
                                                            const { children, ...rest } = props;
                                                            const shouldShow = shouldShowElement(children, currentType);
                                                            const cleanChildren = stripTagsFromChildren(children);

                                                            if (!shouldShow) return null;

                                                            return (
                                                                <li {...rest} className="[&>strong]:text-primary [&>strong]:font-body-bold text-sm tablet:text-base desktop:text-lg">
                                                                    {cleanChildren}
                                                                </li>
                                                            );
                                                        },
                                                        a(props) {
                                                            const { ...rest } = props;
                                                            return (
                                                                <a
                                                                    {...rest}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-primary underline hover:text-primary-700 transition-colors text-sm tablet:text-base desktop:text-lg"
                                                                >
                                                                    {rest.children}
                                                                </a>
                                                            );
                                                        },
                                                        table(props) {
                                                            const { ...rest } = props;
                                                            return (
                                                                <Table {...rest} className="-ml-2 border-none text-sm tablet:text-base desktop:text-lg">
                                                                    {props.children}
                                                                </Table>
                                                            );
                                                        },
                                                        thead() {
                                                            return null;
                                                        },
                                                        tbody(props) {
                                                            const { ...rest } = props;
                                                            return <TableBody {...rest}>{props.children}</TableBody>;
                                                        },
                                                        tr(props) {
                                                            const { ...rest } = props;
                                                            return <TableRow {...rest} className="border-none hover:bg-transparent align-top">{props.children}</TableRow>;
                                                        },
                                                        th(props) {
                                                            const { ...rest } = props;
                                                            return <TableHead {...rest} className="font-body-bold text-left border-none whitespace-normal align-top">{props.children}</TableHead>;
                                                        },
                                                        td(props) {
                                                            const { ...rest } = props;
                                                            return <TableCell {...rest} className="border-none [&>strong]:text-foreground px-2 py-1 whitespace-normal align-top">{props.children}</TableCell>;
                                                        },
                                                        hr() {
                                                            return <Separator className='w-full my-4 bg-muted' />;
                                                        },
                                                    }}
                                                >
                                                    {section.content}
                                                </ReactMarkdown>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                );
                            } else {
                                return (
                                    <AnimatePresence
                                        key={`variable-${index}`}
                                        custom={direction}
                                        mode="wait"
                                    >
                                        {shouldShowSection && (
                                            <motion.div
                                                variants={horizontalVariants}
                                                initial="initial"
                                                animate="active"
                                                exit="exit"
                                                custom={direction}
                                                className="overflow-hidden"
                                            >

                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        h2(props) {
                                                            const { children, ...rest } = props;
                                                            const cleanChildren = stripTagsFromChildren(children);
                                                            return (
                                                                <h2 {...rest} className="text-lg tablet:text-xl desktop:text-2xl font-heading mt-3 tablet:mt-4 desktop:mt-6 mb-1 tablet:mb-2 desktop:mb-3 border-b border-foreground pb-1 tablet:pb-2">
                                                                    {cleanChildren}
                                                                </h2>
                                                            );
                                                        },
                                                        h3(props) {
                                                            const { children, ...rest } = props;
                                                            const shouldShow = shouldShowElement(children, currentType);
                                                            const cleanChildren = stripTagsFromChildren(children);

                                                            if (!shouldShow) return null;

                                                            return (
                                                                <h3 {...rest} className="w-full [&>a]:no-underline [&>a]:text-foreground [&>a]:pointer-events-none text-center mt-2 tablet:mt-3 desktop:mt-4 mb-1 tablet:mb-1 desktop:mb-2 text-base tablet:text-lg desktop:text-xl">
                                                                    {cleanChildren}
                                                                </h3>
                                                            );
                                                        },
                                                        h4(props) {
                                                            const { children, ...rest } = props;
                                                            const shouldShow = shouldShowElement(children, currentType);
                                                            const cleanChildren = stripTagsFromChildren(children);

                                                            if (!shouldShow) return null;

                                                            return (
                                                                <h4 {...rest} className="flex italic [&>strong]:font-body-bold [&>strong]:not-italic [&>strong]:text-foreground [&>strong]:text-sm [&>strong]:tablet:text-base [&>strong]:desktop:text-lg flex-col desktop:flex-row desktop:justify-between w-full mt-1 tablet:mt-2 desktop:mt-3 text-sm tablet:text-base desktop:text-lg">
                                                                    {cleanChildren}
                                                                </h4>
                                                            );
                                                        },
                                                        h5(props) {
                                                            const { children, ...rest } = props;
                                                            const shouldShow = shouldShowElement(children, currentType);
                                                            const cleanChildren = stripTagsFromChildren(children);

                                                            if (!shouldShow) return null;

                                                            return (
                                                                <h4 {...rest} className="flex [&>strong]:text-foreground flex-col desktop:flex-row desktop:justify-between w-full mb-0.5 tablet:mb-1 text-sm tablet:text-base desktop:text-lg">
                                                                    {cleanChildren}
                                                                </h4>
                                                            );
                                                        },
                                                        p(props) {
                                                            const { children, ...rest } = props;
                                                            const shouldShow = shouldShowElement(children, currentType);
                                                            const cleanChildren = stripTagsFromChildren(children);

                                                            if (!shouldShow) return null;

                                                            return (
                                                                <p {...rest} className="mb-1 tablet:mb-2 desktop:mb-3 [&>strong]:text-primary [&>strong]:font-body-bold text-sm tablet:text-base desktop:text-lg">
                                                                    {cleanChildren}
                                                                </p>
                                                            );
                                                        },
                                                        ul(props) {
                                                            const { children, ...rest } = props;
                                                            const shouldShow = shouldShowElement(children, currentType);

                                                            if (!shouldShow) return null;

                                                            return (
                                                                <ul {...rest} className="list-disc pl-6 mb-1 tablet:mb-2 desktop:mb-3 text-sm tablet:text-base desktop:text-lg">
                                                                    {children}
                                                                </ul>
                                                            );
                                                        },
                                                        li(props) {
                                                            const { children, ...rest } = props;
                                                            const shouldShow = shouldShowElement(children, currentType);
                                                            const cleanChildren = stripTagsFromChildren(children);

                                                            if (!shouldShow) return null;

                                                            return (
                                                                <li {...rest} className="[&>strong]:text-primary [&>strong]:font-body-bold text-sm tablet:text-base desktop:text-lg">
                                                                    {cleanChildren}
                                                                </li>
                                                            );
                                                        },
                                                        a(props) {
                                                            const { ...rest } = props;
                                                            return (
                                                                <a
                                                                    {...rest}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-primary underline hover:text-primary-700 transition-colors text-sm tablet:text-base desktop:text-lg"
                                                                >
                                                                    {rest.children}
                                                                </a>
                                                            );
                                                        },
                                                        table(props) {
                                                            const { ...rest } = props;
                                                            return (
                                                                <Table {...rest} className="-ml-2 border-none text-sm tablet:text-base desktop:text-lg">
                                                                    {props.children}
                                                                </Table>
                                                            );
                                                        },
                                                        thead() {
                                                            return null;
                                                        },
                                                        tbody(props) {
                                                            const { ...rest } = props;
                                                            return <TableBody {...rest}>{props.children}</TableBody>;
                                                        },
                                                        tr(props) {
                                                            const { ...rest } = props;
                                                            return <TableRow {...rest} className="border-none hover:bg-transparent align-top">{props.children}</TableRow>;
                                                        },
                                                        th(props) {
                                                            const { ...rest } = props;
                                                            return <TableHead {...rest} className="font-body-bold text-left border-none whitespace-normal align-top">{props.children}</TableHead>;
                                                        },
                                                        td(props) {
                                                            const { ...rest } = props;
                                                            return <TableCell {...rest} className="border-none [&>strong]:text-foreground px-2 py-1 whitespace-normal align-top">{props.children}</TableCell>;
                                                        },
                                                        hr() {
                                                            return <Separator className='w-full tablet:my-2 desktop:my-4 bg-muted' />;
                                                        },
                                                    }}
                                                >
                                                    {section.content}
                                                </ReactMarkdown>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                );
                            }
                        })}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center -mt-8 tablet:-mt-6 desktop:-mb-4">

                    {!isExpanded && (
                        <div className="flex justify-center mt-6">
                            <Button
                                onClick={() => {setIsExpanded(true); setIsPaused(true)}}
                                variant="outline"
                                className="bg-card hover:bg-muted"
                            >
                                See more, experience and such
                            </Button>
                        </div>
                    )}

                    {isExpanded && (
                        <div className="flex justify-center mt-6">
                            <Button
                                onClick={() => {setIsExpanded(false); setIsPaused(false)}}
                                variant="outline"
                                className="bg-card hover:bg-muted"
                            >
                                Show Less, TL;DR
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default CV;
