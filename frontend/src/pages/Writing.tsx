import type { WritingContentObject, WritingObject } from "@/lib/types";
import { useEffect, useState } from "react";
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

import {
    VideoPlayer,
    VideoPlayerContent,
    VideoPlayerControlBar,
    VideoPlayerPlayButton,
    VideoPlayerTimeDisplay,
    VideoPlayerTimeRange,
} from '@/components/ui/kibo-ui/video-player';
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
            <VideoPlayer
                className="rounded-md self-center justify-self-center"
            >
                <VideoPlayerContent
                    slot="media"
                    src={src}
                    preload="auto"
                    crossOrigin=""
                    loop
                    onLoadedData={() => setLoaded(true)}
                    style={loaded ? {} : { opacity: 0 }}
                />
                <VideoPlayerControlBar>
                    <VideoPlayerPlayButton />
                    <VideoPlayerTimeRange />
                    <VideoPlayerTimeDisplay showDuration />
                </VideoPlayerControlBar>
            </VideoPlayer>
        </div>
    );
}

const Writing: React.FC = () => {
    const params = useParams();
    const [data, setData] = useState<WritingContentObject | WritingObject>();

    const fetchWriting = async () => {
        try {
            const res = await fetch(`/api/writings/${params.id}`);

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
            await fetch(`/api/writings/sync/${params.id}`);
            fetchWriting();
        } catch (error) {
            console.error("Error syncing writing on frontend:", error);
        }
    };

    useEffect(() => {
        fetchWriting();
        handleSync();
    }, [params.id]);

    let nextUlIsToc = false;
    let firstLevelToc = false;
    let isHeader = false;

    return (
        <div className='desktop:w-desktop mx-auto px-12 tablet:px-24 py-28 min-h-screen'>

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
                                        className="underline text-primary-800"
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
                                    return <ul {...rest} >{props.children}</ul>
                                }

                                if (nextUlIsToc && !firstLevelToc) {
                                    firstLevelToc = true;
                                    return (
                                        <Card className="py-4 mb-4 border-primary-600 bg-primary-200/50">
                                            <CardHeader className="-mb-6">
                                                <strong className="font-body-bold">Table of Contents</strong>
                                            </CardHeader>

                                            <CardContent className="flex flex-col space-y-2">
                                                <ul {...rest} className="list-none">{props.children}</ul>
                                            </CardContent>
                                        </Card>
                                    );
                                } else if (nextUlIsToc && firstLevelToc) {
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
                                return <Separator className='mb-4 bg-foreground' />
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
                                    <Card className="my-4 px-6 pt-4 border-primary-600 bg-primary-200/50">
                                        <blockquote className="-mb-4" {...rest}>{props.children}</blockquote>
                                    </Card>
                                );
                            },
                            table(props) {
                                const { node, ...rest } = props;
                                return <Table {...rest}>{props.children}</Table>;
                            },
                            thead(props) {
                                const { node, ...rest } = props;
                                return <TableHeader {...rest}>{props.children}</TableHeader>;
                            },
                            tbody(props) {
                                const { node, ...rest } = props;
                                return <TableBody {...rest}>{props.children}</TableBody>;
                            },
                            tfoot(props) {
                                const { node, ...rest } = props;
                                return <TableFooter {...rest}>{props.children}</TableFooter>;
                            },
                            tr(props) {
                                const { node, ...rest } = props;
                                return <TableRow {...rest}>{props.children}</TableRow>;
                            },
                            th(props) {
                                const { node, ...rest } = props;
                                return <TableHead {...rest}>{props.children}</TableHead>;
                            },
                            td(props) {
                                const { node, ...rest } = props;
                                return <TableCell {...rest}>{props.children}</TableCell>;
                            },
                            caption(props) {
                                const { node, ...rest } = props;
                                return <TableCaption {...rest}>{props.children}</TableCaption>;
                            },
                        }}
                    >
                        {(data as WritingContentObject)?.content.replace("> **Table of Contents**", "# Table of Contents")}
                    </ReactMarkdown>
                </>
            )}
        </div>
    );
}

export default Writing;