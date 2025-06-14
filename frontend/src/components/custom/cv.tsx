import { useEffect, useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";

import { Separator } from '@/components/ui/separator';
import remarkGfm from 'remark-gfm';
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";

interface CVProps {
    type?: "full" | "software" | "cybersecurity" | "design" | "humanitarian" | "tutor";
    className?: string;
}

const CV: React.FC<CVProps> = ({
    type = "full",
    className = ""
}) => {
    const [cvContent, setCvContent] = useState<string>("");
    const previousTypeRef = useRef<string>(type);

    const fetchCV = useCallback(async () => {
        try {
            const response = await fetch("/src/assets/other/cv.md");
            if (!response.ok) {
                throw new Error("Failed to fetch CV");
            }
            const content = await response.text();
            setCvContent(content);
        } catch (error) {
            console.error("Error fetching CV:", error);
            setCvContent("");
        }
    }, []);

    useEffect(() => {
        fetchCV();
    }, [fetchCV]);

    const getTextContent = (children: any): string => {
        if (Array.isArray(children)) {
            return children.map(child =>
                typeof child === 'string' ? child :
                typeof child === 'object' && child?.props?.children ? getTextContent(child.props.children) : ''
            ).join('');
        }
        return typeof children === 'string' ? children : '';
    };

    const shouldShowElement = (children: any): boolean => {
        if (type === "full") return true;

        const content = getTextContent(children);

        const tagMatch = content.match(/\[([^\]]+)\]/);
        if (!tagMatch) return true;

        const tags = tagMatch[1].split('|').map(tag => tag.trim());
        return tags.includes(type);
    };

    const shouldAnimate = (children: any): boolean => {
        const currentShow = shouldShowElement(children);
        
        // Check if element was visible with previous type
        const content = getTextContent(children);
        const tagMatch = content.match(/\[([^\]]+)\]/);
        
        let previousShow = true;
        if (previousTypeRef.current !== "full" && tagMatch) {
            const tags = tagMatch[1].split('|').map(tag => tag.trim());
            previousShow = tags.includes(previousTypeRef.current);
        }
        
        // Only animate if visibility changes
        return currentShow !== previousShow;
    };

    const getStableElementId = (children: any): string => {
        const content = getTextContent(children);
        return btoa(content.slice(0, 50)).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
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

    useEffect(() => {
        previousTypeRef.current = type;
    }, [type]);

    return (
        <div className={`w-full ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1(props) {
                        const { children, onDrag, onDragEnd, onDragStart, onAnimationStart, onAnimationEnd, onAnimationIteration, ...rest } = props;
                        const shouldShow = shouldShowElement(children);
                        const animate = shouldAnimate(children);
                        const elementId = getStableElementId(children);
                        const cleanChildren = stripTagsFromChildren(children);

                        return (
                            <AnimatePresence mode="wait">
                                {shouldShow && (
                                    <motion.h1
                                        key={animate ? `h1-${elementId}-${type}` : `h1-${elementId}-stable`}
                                        initial={animate ? { opacity: 0, y: -20 } : false}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={animate ? { opacity: 0, y: -20 } : undefined}
                                        transition={animate ? { duration: 0.3 } : { duration: 0 }}
                                        {...rest}
                                        className="text-4xl font-heading mb-4 text-center"
                                    >
                                        {cleanChildren}
                                    </motion.h1>
                                )}
                            </AnimatePresence>
                        );
                    },
                    h2(props) {
                        const { children, onDrag, onDragEnd, onDragStart, onAnimationStart, onAnimationEnd, onAnimationIteration, ...rest } = props;
                        const shouldShow = shouldShowElement(children);
                        const animate = shouldAnimate(children);
                        const elementId = getStableElementId(children);
                        const cleanChildren = stripTagsFromChildren(children);

                        return (
                            <AnimatePresence mode="wait">
                                {shouldShow && (
                                    <motion.h2
                                        key={animate ? `h2-${elementId}-${type}` : `h2-${elementId}-stable`}
                                        initial={animate ? { opacity: 0, x: -30 } : false}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={animate ? { opacity: 0, x: -30 } : undefined}
                                        transition={animate ? { duration: 0.3, delay: 0.1 } : { duration: 0 }}
                                        {...rest}
                                        className="text-2xl font-heading mt-6 mb-3 border-b border-foreground pb-2"
                                    >
                                        {cleanChildren}
                                    </motion.h2>
                                )}
                            </AnimatePresence>
                        );
                    },
                    h3(props) {
                        const { children, onDrag, onDragEnd, onDragStart, onAnimationStart, onAnimationEnd, onAnimationIteration, ...rest } = props;
                        const shouldShow = shouldShowElement(children);
                        const animate = shouldAnimate(children);
                        const elementId = getStableElementId(children);
                        const cleanChildren = stripTagsFromChildren(children);

                        return (
                            <AnimatePresence mode="wait">
                                {shouldShow && (
                                    <motion.h3
                                        key={animate ? `h3-${elementId}-${type}` : `h3-${elementId}-stable`}
                                        initial={animate ? { opacity: 0, y: 10 } : false}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={animate ? { opacity: 0, y: 10 } : undefined}
                                        transition={animate ? { duration: 0.3 } : { duration: 0 }}
                                        {...rest}
                                        className="w-full [&>a]:no-underline [&>a]:text-foreground [&>a]:pointer-events-none text-center mt-4 mb-2"
                                    >
                                        {cleanChildren}
                                    </motion.h3>
                                )}
                            </AnimatePresence>
                        );
                    },
                    h4(props) {
                        const { children, onDrag, onDragEnd, onDragStart, onAnimationStart, onAnimationEnd, onAnimationIteration, ...rest } = props;
                        const shouldShow = shouldShowElement(children);
                        const animate = shouldAnimate(children);
                        const elementId = getStableElementId(children);
                        const cleanChildren = stripTagsFromChildren(children);

                        return (
                            <AnimatePresence mode="wait">
                                {shouldShow && (
                                    <motion.h4
                                        key={animate ? `h4-${elementId}-${type}` : `h4-${elementId}-stable`}
                                        initial={animate ? { opacity: 0, x: 20 } : false}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={animate ? { opacity: 0, x: 20 } : undefined}
                                        transition={animate ? { duration: 0.3, delay: 0.05 } : { duration: 0 }}
                                        {...rest}
                                        className="flex italic [&>strong]:not-italic [&>strong]:text-foreground [&>strong]:text-lg justify-between w-full mt-3"
                                    >
                                        {cleanChildren}
                                    </motion.h4>
                                )}
                            </AnimatePresence>
                        );
                    },
                    h5(props) {
                        const { children, onDrag, onDragEnd, onDragStart, onAnimationStart, onAnimationEnd, onAnimationIteration, ...rest } = props;
                        const shouldShow = shouldShowElement(children);
                        const animate = shouldAnimate(children);
                        const elementId = getStableElementId(children);
                        const cleanChildren = stripTagsFromChildren(children);

                        return (
                            <AnimatePresence mode="wait">
                                {shouldShow && (
                                    <motion.h4
                                        key={animate ? `h5-${elementId}-${type}` : `h5-${elementId}-stable`}
                                        initial={animate ? { opacity: 0, x: 15 } : false}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={animate ? { opacity: 0, x: 15 } : undefined}
                                        transition={animate ? { duration: 0.3, delay: 0.1 } : { duration: 0 }}
                                        {...rest}
                                        className="flex [&>strong]:text-foreground justify-between w-full mb-1"
                                    >
                                        {cleanChildren}
                                    </motion.h4>
                                )}
                            </AnimatePresence>
                        );
                    },
                    p(props) {
                        const { children, onDrag, onDragEnd, onDragStart, onAnimationStart, onAnimationEnd, onAnimationIteration, ...rest } = props;
                        const shouldShow = shouldShowElement(children);
                        const animate = shouldAnimate(children);
                        const elementId = getStableElementId(children);
                        const cleanChildren = stripTagsFromChildren(children);

                        return (
                            <AnimatePresence mode="wait">
                                {shouldShow && (
                                    <motion.p
                                        key={animate ? `p-${elementId}-${type}` : `p-${elementId}-stable`}
                                        initial={animate ? { opacity: 0, y: 5 } : false}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={animate ? { opacity: 0, y: 5 } : undefined}
                                        transition={animate ? { duration: 0.3, delay: 0.15 } : { duration: 0 }}
                                        {...rest}
                                        className="mb-3 text-justify leading-relaxed"
                                    >
                                        {cleanChildren}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        );
                    },
                    ul(props) {
                        const { children, onDrag, onDragEnd, onDragStart, onAnimationStart, onAnimationEnd, onAnimationIteration, ...rest } = props;
                        const shouldShow = shouldShowElement(children);
                        const animate = shouldAnimate(children);
                        const elementId = getStableElementId(children);

                        return (
                            <AnimatePresence mode="wait">
                                {shouldShow && (
                                    <motion.ul
                                        key={animate ? `ul-${elementId}-${type}` : `ul-${elementId}-stable`}
                                        initial={animate ? { opacity: 0, x: -10 } : false}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={animate ? { opacity: 0, x: -10 } : undefined}
                                        transition={animate ? { duration: 0.3, delay: 0.2 } : { duration: 0 }}
                                        {...rest}
                                        className="list-disc pl-6 mb-3"
                                    >
                                        {children}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        );
                    },
                    li(props) {
                        const { children, onDrag, onDragEnd, onDragStart, onAnimationStart, onAnimationEnd, onAnimationIteration, ...rest } = props;
                        const shouldShow = shouldShowElement(children);
                        const animate = shouldAnimate(children);
                        const elementId = getStableElementId(children);
                        const cleanChildren = stripTagsFromChildren(children);

                        return (
                            <AnimatePresence mode="wait">
                                {shouldShow && (
                                    <motion.li
                                        key={animate ? `li-${elementId}-${type}` : `li-${elementId}-stable`}
                                        initial={animate ? { opacity: 0, x: -5 } : false}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={animate ? { opacity: 0, x: -5 } : undefined}
                                        transition={animate ? { duration: 0.2, delay: 0.1 } : { duration: 0 }}
                                        {...rest}
                                        className="leading-relaxed"
                                    >
                                        {cleanChildren}
                                    </motion.li>
                                )}
                            </AnimatePresence>
                        );
                    },
                    a(props) {
                        const { ...rest } = props;
                        return (
                            <a
                                {...rest}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline hover:text-primary-700 transition-colors"
                            >
                                {rest.children}
                            </a>
                        );
                    },
                    table(props) {
                        const { ...rest } = props;
                        return (
                            <Table {...rest} className="border-none text-base">
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
                        return <TableRow {...rest} className="border-none hover:bg-transparent">{props.children}</TableRow>;
                    },
                    th(props) {
                        const { ...rest } = props;
                        return <TableHead {...rest} className="font-body-bold text-left border-none">{props.children}</TableHead>;
                    },
                    td(props) {
                        const { ...rest } = props;
                        return <TableCell {...rest} className="border-none [&>strong]:text-foreground px-0 py-1">{props.children}</TableCell>;
                    },
                    hr() {
                        return <Separator className='w-full my-4 bg-muted' />;
                    },
                }}
            >
                {cvContent}
            </ReactMarkdown>
        </div>
    );
};

export default CV;
