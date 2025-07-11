import { useEffect, useRef, useState, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import useMeasure from "react-use-measure";

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useTheme } from '@/components/custom/theme-provider';
import { toast } from "sonner";

import remarkGfm from 'remark-gfm';
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";

import {
    IconSparkles,
    IconCode,
    IconHeartHandshake,
    IconSchool,
    IconCloudLock,
    IconPalette,
    IconDownload,
    IconEye,
    IconFileCv,
    IconBarrierBlock
} from '@tabler/icons-react';

import cvContent from '@/assets/other/cv.md?raw';
import cvLatexContent from '@/assets/other/cv.texraw?raw';
import { useTimezoneTheme } from "@/hooks/use-timezone-theme"

interface CVProps {
    type?: "full" | "software" | "cybersecurity" | "design" | "humanitarian" | "tutor";
    className?: string;
    showTabs?: boolean;
    autoPlay?: boolean;
    pauseOnInteract?: boolean;
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
    const [isExpanded, setIsExpanded] = useState(false);
    const [visualMode, setVisualMode] = useState(false);
    const { mode, theme } = useTheme();
    const { currentColor, isDarkMode } = useTimezoneTheme();

    const tabs = [
        { id: "full", label: "honestly, anything!", icon: <IconSparkles className='size-6' stroke={1.5} /> },
        { id: "software", label: "a software developer", icon: <IconCode className='size-6' stroke={1.5} /> },
        { id: "cybersecurity", label: "a cybersecurity analyst", icon: <IconCloudLock className='size-6' stroke={1.5} /> },
        { id: "design", label: "a graphic designer", icon: <IconPalette className='size-6' stroke={1.5} /> },
        { id: "humanitarian", label: "a humanitarian volunteer", icon: <IconHeartHandshake className='size-6' stroke={1.5} /> },
        { id: "tutor", label: "an academic tutor", icon: <IconSchool className='size-6' stroke={1.5} /> }
    ];

    const [activeTab, setActiveTab] = useState(() => {
        if (autoPlay) {
            return tabs.length - 1;
        }
        return tabs.findIndex(tab => tab.id === type);
    });

    const currentType = tabs[activeTab]?.id || "full";
    const currentLabel = tabs[activeTab]?.label || "";

    const parsedSections = useMemo(() => {
        const sections = cvContent.split(/(?=^##)/gm).filter(section => section.trim());

        return sections.map(section => {
            const hasTag = /\[([^\]]+)\]\s*$/.test(section.trim());
            const tagMatch = section.match(/\[([^\]]+)\]\s*$/);

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
        const tagMatch = content.match(/\[([^\]]+)\]\s*$/);
        if (!tagMatch) return true;

        const tags = tagMatch[1].split('|').map(tag => tag.trim());
        return tags.includes(targetType);
    };

    const stripTagsFromChildren = (children: any): any => {
        if (Array.isArray(children)) {
            return children.map((child, index) => {
                if (typeof child === 'string') {
                    if (index === children.length - 1) {
                        return child.replace(/\s*\[[^\]]+\]\s*$/, '');
                    }
                    return child;
                }
                return child;
            });
        }
        return typeof children === 'string' ? children.replace(/\s*\[[^\]]+\]\s*$/, '') : children;
    };

    const handleTabClick = (newTabIndex: number) => {
        if (newTabIndex !== activeTab && !isAnimating) {
            const newDirection = newTabIndex > activeTab ? 1 : -1;
            setDirection(newDirection);
            setActiveTab(newTabIndex);
            if (pauseOnInteract && autoPlay) {
                setIsPaused(true);
            }
        }
    };

    const processLatexContent = useMemo(() => {
        const lines = cvLatexContent.split('\n');
        const documentStartIndex = lines.findIndex(line => line.includes('\\begin{document}'));

        const preambleLines = lines.slice(0, documentStartIndex);
        const documentLines = lines.slice(documentStartIndex);

        const filteredPreamble = preambleLines;
        const filteredDocumentLines: string[] = [];
        let skipBlock = false;
        let skipDaftar = false;
        let braceDepth = 0;
        let daftarBraceDepth = 0;
        let skipEntryBlock = false;
        let entryBlockDepth = 0;

        for (const line of documentLines) {
            const tagMatch = line.match(/\[([^\]]+)\]\s*$/);

            if (line.includes('\\daftar{')) {
                if (tagMatch && currentType !== "full") {
                    const tags = tagMatch[1].split('|').map(tag => tag.trim());
                    const shouldInclude = tags.includes(currentType);

                    if (!shouldInclude) {
                        skipDaftar = true;
                        daftarBraceDepth = 0;
                        for (const char of line) {
                            if (char === '{') daftarBraceDepth++;
                            if (char === '}') daftarBraceDepth--;
                        }
                        if (daftarBraceDepth <= 0) skipDaftar = false;
                        continue;
                    }
                }
                filteredDocumentLines.push(line.replace(/\s*\[[^\]]+\]\s*$/g, ''));
                continue;
            }

            if (skipDaftar && line.includes('\\butir{')) {
                for (const char of line) {
                    if (char === '{') daftarBraceDepth++;
                    if (char === '}') daftarBraceDepth--;
                }
                if (daftarBraceDepth <= 0) skipDaftar = false;
                continue;
            }

            if (line.includes('\\entri') || line.includes('\\entriTanpaJudul')) {
                if (tagMatch && currentType !== "full") {
                    const tags = tagMatch[1].split('|').map(tag => tag.trim());
                    const shouldInclude = tags.includes(currentType);

                    if (!shouldInclude) {
                        skipEntryBlock = true;
                        entryBlockDepth = 0;
                        for (const char of line) {
                            if (char === '{') entryBlockDepth++;
                            if (char === '}') entryBlockDepth--;
                        }
                        if (entryBlockDepth > 0) {
                            continue;
                        } else {
                            skipEntryBlock = false;
                            continue;
                        }
                    }
                }
                filteredDocumentLines.push(line.replace(/\s*\[[^\]]+\]\s*$/g, ''));
                continue;
            }

            if (skipEntryBlock) {
                for (const char of line) {
                    if (char === '{') entryBlockDepth++;
                    if (char === '}') entryBlockDepth--;
                }

                if (line.includes('\\daftar{') || line.includes('\\butir{') || entryBlockDepth > 0) {
                    continue;
                } else {
                    skipEntryBlock = false;
                }
            }

            if (line.includes('\\bagian{')) {
                if (tagMatch && currentType !== "full") {
                    const tags = tagMatch[1].split('|').map(tag => tag.trim());
                    const shouldInclude = tags.includes(currentType);

                    if (!shouldInclude) {
                        skipBlock = true;
                        braceDepth = 0;
                        for (const char of line) {
                            if (char === '{') braceDepth++;
                            if (char === '}') braceDepth--;
                        }
                        if (braceDepth <= 0) skipBlock = false;
                        continue;
                    }
                }
                filteredDocumentLines.push(line.replace(/\s*\[[^\]]+\]\s*$/g, ''));
                continue;
            }

            if (tagMatch && !skipBlock && !skipDaftar && !skipEntryBlock) {
                if (currentType !== "full") {
                    const tags = tagMatch[1].split('|').map(tag => tag.trim());
                    const shouldInclude = tags.includes(currentType);

                    if (!shouldInclude) {
                        continue;
                    }
                }

                filteredDocumentLines.push(line.replace(/\s*\[[^\]]+\]\s*$/g, ''));
            } else if (skipBlock) {
                for (const char of line) {
                    if (char === '{') braceDepth++;
                    if (char === '}') braceDepth--;
                }
                if (braceDepth <= 0) skipBlock = false;
                continue;
            } else if (skipDaftar) {
                for (const char of line) {
                    if (char === '{') daftarBraceDepth++;
                    if (char === '}') daftarBraceDepth--;
                }
                if (daftarBraceDepth <= 0) skipDaftar = false;
                continue;
            } else if (!skipBlock && !skipDaftar && !skipEntryBlock) {
                filteredDocumentLines.push(line.replace(/\s*\[[^\]]+\]\s*$/g, ''));
            }
        }

        return [...filteredPreamble, ...filteredDocumentLines].join('\n');
    }, [currentType, cvLatexContent]);

    const themedLatexContent = useMemo(() => {

        const effectiveMode = mode === 'timezone' ? (isDarkMode ? 'dark' : 'light') : mode;
        const colorToUse = mode === 'timezone'
            ? (localStorage.getItem('vite-ui-theme-color') || currentColor)
            : theme;

        const backgroundColor = effectiveMode === 'dark' ? 'RGB}{24, 24, 27' : 'RGB}{250, 250, 250';
        const foregroundColor = effectiveMode === 'dark' ? 'RGB}{250, 250, 250' : 'RGB}{24, 24, 27';

        const colorMap: Record<string, string> = {
            yellow: 'RGB}{234, 179, 8',
            red: 'RGB}{239, 68, 68',
            blue: 'RGB}{59, 130, 246',
            green: 'RGB}{34, 197, 94',
            purple: 'RGB}{168, 85, 247',
            pink: 'RGB}{236, 72, 153',
            orange: 'RGB}{249, 115, 22',
            cyan: 'RGB}{6, 182, 212',
            emerald: 'RGB}{16, 185, 129',
            indigo: 'RGB}{99, 102, 241',
            lime: 'RGB}{132, 204, 22',
            teal: 'RGB}{20, 184, 166',
            violet: 'RGB}{139, 92, 246',
            rose: 'RGB}{244, 63, 94'
        };

        const highlightColor = colorMap[colorToUse] || 'RGB}{234, 179, 8';

        return processLatexContent
            .replace(/\\definecolor\{background\}\{RGB\}\{[^}]+\}/, `\\definecolor{background}{${backgroundColor}}`)
            .replace(/\\definecolor\{foreground\}\{RGB\}\{[^}]+\}/, `\\definecolor{foreground}{${foregroundColor}}`)
            .replace(/\\definecolor\{highlight\}\{RGB\}\{[^}]+\}/, `\\definecolor{highlight}{${highlightColor}}`);
    }, [processLatexContent, mode, theme, currentColor, isDarkMode]);

    const handlePDFGeneration = async () => {
        const factPromise = fetch("/api/facts")
            .then(response => response.ok ? response.json() : Promise.reject("Failed to load fun fact"))
            .catch(() => null);

        toast.promise(
            (async () => {
                // Use localStorage value for timezone mode
                const effectiveTheme = mode === 'timezone' 
                    ? (localStorage.getItem('vite-ui-theme-color') || currentColor)
                    : theme;
                const effectiveMode = mode === 'timezone' ? (isDarkMode ? 'dark' : 'light') : mode;

                const [factData, pdfResponse] = await Promise.allSettled([
                    factPromise,
                    fetch('/api/pdf/generate-cv', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            latexContent: themedLatexContent,
                            filename: `alden-luthfi-cv-${currentType}`,
                            type: currentType,
                            mode: effectiveMode,
                            theme: effectiveTheme
                        })
                    })
                ]);

                const fact = factData.status === 'fulfilled' ? factData.value : null;

                if (pdfResponse.status === 'rejected') {
                    throw new Error('Failed to generate PDF');
                }

                const response = pdfResponse.value;
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                    throw new Error(errorData.error ?? 'Failed to generate PDF');
                }

                const { pdfUrl } = await response.json();
                window.open(pdfUrl, '_blank');

                return { success: true, fact };
            })(),
            {
                loading: `Generating ${currentType === 'full' ? "Full" : "Tailored"} Resume...`,
                success: (data) => ({
                    message: `${currentType === 'full' ? "Full" : "Tailored"} Resume Generated Successfully!`,
                    description: data.fact ? (
                        <div className="flex flex-col space-y-2 pt-2">
                            <div className="!text-sm !text-muted-foreground">
                                Fun Fact #{data.fact.id}
                            </div>
                            <div className="!text-sm !text-muted-foreground">
                                {data.fact.text}
                            </div>
                            <div className="!text-muted-foreground">
                                <a className="underline" href={data.fact.source} target="_blank" rel="noopener noreferrer" aria-label={data.fact.source}>Source</a>
                            </div>
                        </div>
                    ) : null,
                    icon: null
                }),
                error: (error) => ({
                    message: "Failed to Generate Resume",
                    description: (
                        <div className="!text-sm !text-muted-foreground">
                            {error instanceof Error ? error.message : "Please try again."}
                        </div>
                    )
                }),
                icon: null,
                duration: 5000,
            }
        );
    };

    useEffect(() => {
        if (!autoPlay || isAnimating || isPaused || !showTabs || isExpanded) return;

        const interval = setInterval(() => {
            const nextTab = activeTab === 0 ? tabs.length - 1 : activeTab - 1;
            const newDirection = nextTab < activeTab ? -1 : 1;
            setDirection(newDirection);
            setActiveTab(nextTab);
        }, 3000);

        return () => clearInterval(interval);
    }, [autoPlay, isAnimating, isPaused, activeTab, tabs.length, showTabs, isExpanded]);

    useEffect(() => {
        if (isExpanded && autoPlay) {
            setIsPaused(true);
        } else if (!isExpanded && autoPlay) {
            setIsPaused(false);
        }
    }, [isExpanded, autoPlay]);

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
                height: { duration: 0.2, type: "spring", ease: "easeInOut", bounce: 0.2 },
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
                height: { duration: 0.2, type: "tween", ease: "easeInOut", delay: 0.3, bounce: 0.2 },
            }
        }),
    };

    const verticalVariants = {
        initial: () => ({
            height: 0,
            y: 50,
            opacity: 0,
        }),
        active: {
            height: "auto",
            y: 0,
            opacity: 1,
            transition: {
                height: { duration: 0.15, ease: "easeInOut", bounce: 0.2 },
                y: { duration: 0.3, type: "spring", bounce: 0.1, delay: 0.05, ease: "easeOut" },
                opacity: { duration: 0.3, type: "tween", bounce: 0.2, delay: 0.05, ease: "easeOut" },
            }
        },
        exit: () => ({
            height: 0,
            y: -50,
            opacity: 0,
            transition: {
                y: { duration: 0.3, type: "spring", bounce: 0.1, ease: "easeIn" },
                opacity: { duration: 0.3, type: "spring", bounce: 0.1, ease: "easeIn" },
                height: { duration: 0.15, ease: "easeInOut", delay: 0.25, bounce: 0.2 },
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

    const getMarkdownComponents = useMemo((): Components => ({
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
                <h2 {...rest} className="text-lg tablet:text-xl desktop:text-2xl font-heading mt-3 tablet:mt-4 desktop:mt-6 border-b border-foreground pb-1 tablet:pb-2">
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
                <h4 {...rest} className="flex italic [&>strong]:font-bold [&>strong]:not-italic [&>strong]:text-foreground [&>strong]:text-base [&>strong]:tablet:text-lg [&>strong]:desktop:text-xl flex-col desktop:flex-row desktop:justify-between w-full mt-3 text-base tablet:text-lg desktop:text-lg">
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
                <h4 {...rest} className="flex [&>em]:not-italic [&>strong]:text-foreground flex-col desktop:flex-row desktop:justify-between w-full mb-0.5 tablet:mb-1 text-sm tablet:text-base desktop:text-lg">
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
                <p {...rest} className="mb-1 tablet:mb-2 desktop:mb-3 [&>strong]:text-primary [&>strong]:font-bold mt-3 text-sm tablet:text-base desktop:text-lg">
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
                <li {...rest} className="[&>strong]:text-primary [&>strong]:font-bold text-sm tablet:text-base desktop:text-lg">
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
                <Table {...rest} className="-ml-2 border-none text-sm mt-3 tablet:text-base desktop:text-lg">
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
            return <TableHead {...rest} className="font-bold text-left border-none whitespace-normal align-top">{props.children}</TableHead>;
        },
        td(props) {
            const { ...rest } = props;
            return <TableCell {...rest} className="border-none [&>strong]:text-foreground px-2 py-1 whitespace-normal align-top">{props.children}</TableCell>;
        },
        hr() {
            return <Separator className='w-full my-4 bg-muted' />;
        },
    }), [currentType]);

    return (
        <div ref={containerRef} className={`w-full flex flex-col ${showTabs ? 'items-center' : ''} ${className}`}>
            {showTabs && (
                <>
                    <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2, ease: "easeInOut" }}>
                        <motion.div
                            className="relative h-min w-full mb-3 tablet:mb-5 desktop:mb-7"
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
                                        className="text-lg tablet:text-2xl text-center"
                                    >
                                        {currentLabel}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </MotionConfig>

                    <div className="flex gap-3 items-start -mb-18 sticky top-22 tablet:top-24 desktop:top-28 z-10">
                        <div className="border border-input rounded-lg bg-card p-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="bg-transparent hover:bg-transparent text-foreground"
                                title="Toggle Seriousness"
                                onClick={() => setVisualMode(!visualMode)}
                            >
                                {visualMode ? <IconEye className="size-6" stroke={1.5} /> : <IconFileCv className="size-6" stroke={1.5} />}
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 tablet:flex gap-2 ultrawide:gap-3 border border-input rounded-lg bg-card p-2">
                            {tabs.map((tab, index) => (
                                <Button
                                    key={tab.id}
                                    onClick={() => handleTabClick(index)}
                                    size="icon"
                                    name={tab.id}
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

                        <div className="border border-input rounded-lg bg-card p-2">
                            <Button
                                onClick={handlePDFGeneration}
                                size="icon"
                                variant="ghost"
                                className="bg-transparent hover:bg-transparent text-foreground"
                                title="Generate and view PDF"
                            >
                                <IconDownload className="size-6" stroke={1.5} />
                            </Button>
                        </div>
                    </div>
                </>
            )}
            {
                !visualMode ? (
                    <Card className="w-10/12 mt-24 tablet:mt-26 desktop:mt-28 px-0 py-6 tablet:px-2 tablet:py-8 desktop:px-4 desktop:py-10">
                        <CardContent className="overflow-hidden relative">
                            <div className="space-y-0">
                                {parsedSections.map((section, index) => {
                                    const shouldShowSection = section.shouldShow && (isExpanded || section.type === 'persistent');

                                    if (section.type === 'persistent') {
                                        return (
                                            <AnimatePresence key={`persistent-${index}-${type}`} mode="wait">
                                                {shouldShowSection && (
                                                    <motion.div
                                                        variants={verticalVariants}
                                                        initial="initial"
                                                        animate="active"
                                                        exit="exit"
                                                        className="overflow-hidden"
                                                    >
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm]}
                                                            components={getMarkdownComponents}
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
                                                key={`variable-${index}-${type}`}
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
                                                            components={getMarkdownComponents}
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
                            {!isExpanded && <div className="h-70 w-full max-w-desktop absolute bottom-0 bg-gradient-to-b from-transparent to-card" />}
                        </CardContent>
                        <CardFooter className="flex flex-col items-center -mt-8 tablet:-mt-6 desktop:-mb-4">
                            {!isExpanded && (
                                <div className="flex justify-center mt-6">
                                    <Button
                                        onClick={() => setIsExpanded(true)}
                                        variant="ghost"
                                        className="bg-card text-muted-foreground hover:bg-card"
                                    >
                                        See more, experiences et cetera
                                    </Button>
                                </div>
                            )}

                            {isExpanded && (
                                <div className="flex justify-center mt-6">
                                    <Button
                                        onClick={() => setIsExpanded(false)}
                                        variant="ghost"
                                        className="bg-card text-muted-foreground hover:bg-card"
                                    >
                                        See less boring stuff
                                    </Button>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="w-10/12 mt-24 tablet:mt-26 desktop:mt-28 px-0 py-6 tablet:px-2 tablet:py-8 desktop:px-4 desktop:py-10">
                        <CardContent className="text-center flex flex-col items-center justify-center gap-3">
                            <IconBarrierBlock className="size-6" stroke={1.5} />
                            Under construction, please check back later.
                        </CardContent>
                    </Card>
                )
            }
        </div>
    );
};

export default CV;