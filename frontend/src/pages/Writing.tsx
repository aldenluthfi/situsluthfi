import type { WritingContentObject, WritingObject } from "@/lib/types";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
    CodeBlock,
    CodeBlockBody,
    CodeBlockContent,
    CodeBlockItem,
    type BundledLanguage,
} from '@/components/ui/kibo-ui/code-block';
import { Separator } from '@/components/ui/separator';
import {
    Card,
    CardHeader,
    CardContent
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import remarkGfm from 'remark-gfm'

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkToc from 'remark-toc';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/animate-ui/radix/accordion"
import {
    MediaPlayer,
    MediaPlayerVideo,
    MediaPlayerControls,
    MediaPlayerPlay,
    MediaPlayerTime,
    MediaPlayerSeek,
    MediaPlayerVolume,
    MediaPlayerFullscreen,
} from "@/components/ui/media-player";
import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconChevronRight } from "@tabler/icons-react";

function ImageWithSkeleton(props: Readonly<React.ImgHTMLAttributes<HTMLImageElement>>) {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="flex flex-col w-full items-center">
            <div className="flex w-full justify-center">
                {!loaded && (
                    <Skeleton className="inset-0 rounded-md self-center max-h-[500px] my-4 w-full h-[300px] object-contain" />
                )}
                <img
                    {...props}
                    onLoad={() => setLoaded(true)}
                    alt={props.alt ?? ""}
                    className="rounded-md self-center justify-self-center my-4 max-h-[500px] object-contain"
                    style={loaded ? {} : { opacity: 0 }}
                />
            </div>
            {props.alt && !/\.(png|jpe?g)$/i.test(props.alt) && (
                <span className="text-xs text-muted-foreground mt-2 text-center">{props.alt}</span>
            )}
        </div>
    );
}

function VideoWithSkeleton({ src }: Readonly<{ src: string }>) {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="my-4 rounded-lg flex w-full justify-center">
            {!loaded && (
                <Skeleton className="inset-0 rounded-md w-full h-[300px] object-contain" />
            )}
            <MediaPlayer
                className="rounded-md self-center justify-self-center w-full max-w-3xl"
            >
                <MediaPlayerVideo
                    src={src}
                    preload="auto"
                    crossOrigin=""
                    loop
                    onLoadedData={() => setLoaded(true)}
                    style={loaded ? {} : { opacity: 0 }}
                />
                <MediaPlayerControls>
                    <MediaPlayerPlay />
                    <MediaPlayerSeek />
                    <MediaPlayerTime />
                    <MediaPlayerVolume expandable />
                    <MediaPlayerFullscreen />
                </MediaPlayerControls>
            </MediaPlayer>
        </div>
    );
}

const HEADER_OFFSET = 80;

const Writing: React.FC = () => {
    const params = useParams();
    const [data, setData] = useState<WritingContentObject | WritingObject>();
    const [toc, setToc] = useState<React.ReactNode>(null);
    const [showFloatingToc, setShowFloatingToc] = useState(false);
    const tocInlineRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!tocInlineRef.current) return;
            const rect = tocInlineRef.current.getBoundingClientRect();
            const shouldShow = rect.bottom < 80;
            setShowFloatingToc(shouldShow);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [toc]);

    const fetchWriting = async () => {
        try {
            const res = await fetch(`/api/writings/${params.slug}`);

            if (!res.ok) {
                setData(undefined);
                return;
            }

            const data = await res.json();
            setData(data);
            document.title = `aldenluth.fi | ${data.title}`;
        } catch (error) {
            console.error("Error fetching writing:", error);
            setData(undefined);
        }
    };

    const handleSync = async () => {
        try {
            await fetch(`/api/writings/sync/${params.slug}`);
            fetchWriting();
        } catch (error) {
            console.error("Error syncing writing on frontend:", error);
        }
    };

    useEffect(() => {
        fetchWriting();
        handleSync();
    }, [params.slug]);

    useEffect(() => {
        function handleAnchorClick(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (target.tagName === "A") {
                const anchor = target as HTMLAnchorElement;
                if (anchor.hash && anchor.hash.startsWith("#")) {
                    const id = decodeURIComponent(anchor.hash.slice(1));
                    const el = document.getElementById(id);
                    if (el) {
                        e.preventDefault();
                        const rect = el.getBoundingClientRect();
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        window.scrollTo({
                            top: rect.top + scrollTop - HEADER_OFFSET,
                            behavior: "smooth"
                        });
                        history.replaceState(null, "", anchor.hash);
                    }
                }
            }
        }
        document.addEventListener("click", handleAnchorClick);
        return () => document.removeEventListener("click", handleAnchorClick);
    }, []);

    let nextUlIsToc = false;
    let nestedToc = false;
    let isHeader = false;

    return (
        <>
            {toc && (
                <div
                    className={`fixed right-0 flex items-center h-full z-50 transition-transform duration-300 ease-in-out`}
                    style={{
                        transform: showFloatingToc
                            ? "translateX(0)"
                            : "translateX(120%)",
                        pointerEvents: showFloatingToc ? "auto" : "none",
                    }}
                >
                    <div className="relative right-0">
                        <Accordion
                            type="single"
                            collapsible
                            className="flex flex-col items-center w-auto"
                        >
                            <AccordionItem value="settings-toggle" className="border-none">
                                <div className="flex flex-row items-stretch pointer-events-auto">
                                    <AccordionTrigger
                                        chevron={false}
                                        aria-label="table of contents"
                                        title="table of contents"
                                        className="relative py-4 z-60 h-full flex items-center justify-center rounded-l-xl text-primary-700 border border-primary-600 bg-primary-200 hover:bg-primary-300 rounded-r-none border-r-0"
                                    >
                                        <IconChevronRight className="size-6" stroke={1.5} />
                                    </AccordionTrigger>
                                    <AccordionContent horizontal className="bg-background mr-4 rounded-r-xl">
                                        <Card
                                            className="border-primary-600 bg-primary-200/50 h-min rounded-l-none border-l-0 pointer-events-auto"
                                        >
                                            <CardHeader className="-mb-6">
                                                <strong className="font-body-bold">Table of Contents</strong>
                                            </CardHeader>
                                            <CardContent className="flex flex-col h-full">
                                                <ScrollArea
                                                    className="h-min floating-toc-ul max-h-[60vh] pointer-events-auto overflow-y-auto w-72"
                                                    showScrollbar={false}
                                                >
                                                    <ul className="!pl-0 list-none">{toc}</ul>
                                                </ScrollArea>
                                            </CardContent>
                                        </Card>
                                        <style>
                                            {`
                                            .floating-toc-ul ul {
                                                padding-left: 1.5rem !important;
                                                list-style-type: none !important;
                                                margin-bottom: 0 !important;
                                            }
                                            `}
                                        </style>
                                    </AccordionContent>
                                </div>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            )}
            <div className='w-screen desktop:w-desktop mx-auto px-12 tablet:px-24 py-28 min-h-screen text-pretty'>
                {!data ? (
                    <div className="space-y-4 mb-8">
                        <Skeleton className="w-3/4 h-10" />
                        <Skeleton className="w-1/2 h-4 mb-16" />
                        {
                            Array.from({ length: 5 }, (_, i) => {
                                const widths = [
                                    "w-full", "w-11/12", "w-10/12", "w-full", "w-11/12", "w-10/12"
                                ];

                                const shuffled = [...widths].sort(() => Math.random() - 0.5);
                                return (
                                    <div className="space-y-4 mb-8" key={i}>
                                        {shuffled.map((w, j) => (
                                            <Skeleton key={j + 1} className={`${w} h-6`} />
                                        ))}
                                    </div>
                                );
                            })
                        }
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col space-y-4 mb-8">
                            <h1 className="text-4xl font-heading">{(data as WritingObject)?.title}</h1>
                            <p className="text-sm text-muted-foreground">
                                {new Date((data as WritingObject)?.createdAt)
                                    .toLocaleDateString(
                                        "en-GB",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )}
                            </p>
                        </div>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath, [remarkToc, { heading: 'Table of Contents' }]]}
                            rehypePlugins={[[rehypeKatex, { output: "mathml" }]]}
                            components={{
                                h1(props) {
                                    const { node, ...rest } = props;
                                    let text = '';
                                    if (typeof rest.children === 'string') {
                                        text = rest.children;
                                    } else if (Array.isArray(rest.children)) {
                                        text = rest.children
                                            .map((child) => {
                                                if (typeof child === 'string') {
                                                    return child;
                                                }
                                                return child.props.children;
                                            })
                                            .join('');
                                    }
                                    const id = text
                                        .toLowerCase()
                                        .replace(/\s+/g, '-')
                                        .replace(/[^\w-]+/g, '');

                                    if (id === "table-of-contents") {
                                        nextUlIsToc = true;
                                        return null;
                                    } else if (nextUlIsToc) {
                                        nextUlIsToc = false;
                                    }

                                    isHeader = true;

                                    return <h1 {...rest} id={id} className="text-2xl font-heading my-2">{rest.children}</h1>;
                                },
                                h2(props) {
                                    const { node, ...rest } = props;
                                    let text = '';
                                    if (typeof rest.children === 'string') {
                                        text = rest.children;
                                    } else if (Array.isArray(rest.children)) {
                                        text = rest.children
                                            .map((child) => {
                                                if (typeof child === 'string') {
                                                    return child;
                                                }
                                                return child.props.children;
                                            })
                                            .join('');
                                    }

                                    isHeader = true;

                                    const id = text
                                        .toLowerCase()
                                        .replace(/\s+/g, '-')
                                        .replace(/[^\w-]+/g, '');
                                    return <h2 {...rest} id={id} className="text-xl font-heading my-4">{rest.children}</h2>;
                                },
                                h3(props) {
                                    const { node, ...rest } = props;
                                    let text = '';
                                    if (typeof rest.children === 'string') {
                                        text = rest.children;
                                    } else if (Array.isArray(rest.children)) {
                                        text = rest.children
                                            .map((child) => {
                                                if (typeof child === 'string') {
                                                    return child;
                                                }
                                                return child.props.children;
                                            })
                                            .join('');
                                    }

                                    isHeader = true;

                                    const id = text
                                        .toLowerCase()
                                        .replace(/\s+/g, '-')
                                        .replace(/[^\w-]+/g, '');
                                    return <h3 {...rest} id={id} className="text-lg font-heading my-4">{rest.children}</h3>;
                                },
                                p(props) {
                                    const { node, ...rest } = props

                                    if (isHeader) {
                                        isHeader = false;
                                    }

                                    return <div {...rest} className="mb-2.5" />
                                },
                                a(props) {
                                    const { node, ...rest } = props
                                    const href = rest.href;

                                    if (href && /\.(mp4|webm|ogg)/i.test(href)) {
                                        return <VideoWithSkeleton src={href} />;
                                    }

                                    return (
                                        <a
                                            {...rest}
                                            {...(!href?.startsWith("#") ? { target: "_blank" } : {})}
                                            rel="noopener noreferrer"
                                            className={`w-full break-words ${href?.startsWith("#") ? "" : "break-all"} underline text-primary-800`}
                                        >
                                            {rest.children}
                                        </a>
                                    );
                                },
                                img(props) {
                                    return <ImageWithSkeleton {...props} />;
                                },
                                strong(props) {
                                    const { node, ...rest } = props
                                    return <strong {...rest} className="font-body-bold">{rest.children}</strong>
                                },
                                ul(props) {
                                    const { node, ...rest } = props

                                    if (rest.className?.includes("contains-task-list")) {
                                        return <ul {...rest} className="">{props.children}</ul>
                                    }

                                    if (nextUlIsToc && !nestedToc) {
                                        nestedToc = true;
                                        if (!toc) setToc(props.children);
                                        return (
                                            <div ref={tocInlineRef}>
                                                <Card className="w-full py-4 mb-4 border-primary-600 bg-primary-200/50" id="table-of-contents">
                                                    <CardHeader className="-mb-6">
                                                        <strong className="font-body-bold">Table of Contents</strong>
                                                    </CardHeader>
                                                    <CardContent className="flex flex-col space-y-2">
                                                        <ul {...rest} className="list-none">{props.children}</ul>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        );
                                    } else if (nextUlIsToc && nestedToc) {
                                        return (
                                            <ul {...rest} className="pl-6 list-none">{props.children}</ul>
                                        );
                                    }

                                    return <ul {...rest} className="list-disc pl-6 mb-4">{props.children}</ul>
                                },
                                ol(props) {
                                    const { node, ...rest } = props
                                    return <ol {...rest} className="list-decimal pl-6 flex space-y-2 flex-col" />
                                },
                                hr() {
                                    return <Separator className='w-full mb-4 bg-foreground' />
                                },
                                code(props) {
                                    const { node, ...rest } = props;
                                    if (isHeader) {
                                        isHeader = false;
                                        return <code {...rest} className="text-primary" />;
                                    }
                                    return <code {...rest} className="text-sm text-primary" />;
                                },
                                pre(props) {
                                    const { node, ...rest } = props;
                                    let codeString = '';
                                    let language = 'bash';
                                    if (
                                        rest.children
                                    ) {
                                        const codeElement = rest.children as React.ReactElement<any>;
                                        if (typeof codeElement.props.children === 'string') {
                                            codeString = codeElement.props.children.trim();
                                        }

                                        if (typeof codeElement.props.className === 'string') {
                                            const match = codeElement.props.className.match(/language-(\w+)/);
                                            if (match) {
                                                language = match[1];
                                            }
                                        }
                                    }
                                    const result = (
                                        <CodeBlock
                                            className="my-4 bg-card border-border"
                                            value={language}
                                            data={[
                                                {
                                                    language,
                                                    filename: "example",
                                                    code: codeString,
                                                },
                                            ]}
                                        >
                                            <CodeBlockBody>
                                                {(item) => (
                                                    <CodeBlockItem value={item.language} key={item.language} lineNumbers={false}>
                                                        <CodeBlockContent language={item.language as BundledLanguage}>
                                                            {item.code}
                                                        </CodeBlockContent>
                                                    </CodeBlockItem>
                                                )}
                                            </CodeBlockBody>
                                        </CodeBlock>
                                    );

                                    return result
                                },
                                blockquote(props) {
                                    const { node, ...rest } = props
                                    return (
                                        <Card className="w-full my-4 px-6 pt-4 border-primary-600 bg-primary-200/50">
                                            <blockquote className="-mb-4" {...rest}>{props.children}</blockquote>
                                        </Card>
                                    );
                                },
                                table(props) {
                                    const { node, ...rest } = props;
                                    return <Table {...rest} >{props.children}</Table>;
                                },
                                thead(props) {
                                    const { node, ...rest } = props;
                                    return <TableHeader {...rest} >{props.children}</TableHeader>;
                                },
                                tbody(props) {
                                    const { node, ...rest } = props;
                                    return <TableBody {...rest} >{props.children}</TableBody>;
                                },
                                tfoot(props) {
                                    const { node, ...rest } = props;
                                    return <TableFooter {...rest} >{props.children}</TableFooter>;
                                },
                                tr(props) {
                                    const { node, ...rest } = props;
                                    return <TableRow {...rest} >{props.children}</TableRow>;
                                },
                                th(props) {
                                    const { node, ...rest } = props;
                                    return <TableHead {...rest} >{props.children}</TableHead>;
                                },
                                td(props) {
                                    const { node, ...rest } = props;
                                    return <TableCell {...rest} >{props.children}</TableCell>;
                                },
                                caption(props) {
                                    const { node, ...rest } = props;
                                    return <TableCaption {...rest} >{props.children}</TableCaption>;
                                },
                            }}
                        >
                            {(data as WritingContentObject)?.content.replace("> **Table of Contents**", "# Table of Contents")}
                        </ReactMarkdown>
                    </>
                )}
            </div>
        </>
    );
}

export default Writing;