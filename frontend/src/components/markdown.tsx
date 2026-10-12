import { isValidElement, type ReactElement, type ReactNode } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import CodeBlock from "@/components/code-block"
import { slugify } from "@/lib/utils"

type HastNode = {
  type: string
  tagName?: string
  value?: string
  children?: HastNode[]
}

const hastText = (node: HastNode): string =>
  node.type === "text" ? (node.value ?? "") : (node.children ?? []).map(hastText).join("")

const nodeText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join("")
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children)
  return ""
}

/** Notion exports a "> **Table of Contents**" marker; vII renders its own sidebar instead. */
const rehypeDropTocMarker = () => (tree: HastNode) => {
  tree.children = (tree.children ?? []).filter(
    (node) => !(node.tagName === "blockquote" && hastText(node).trim().toLowerCase() === "table of contents"),
  )
}

const heading =
  (Tag: "h2" | "h3" | "h4", marks: string) =>
  ({ children }: { children?: ReactNode }) => (
    <Tag id={slugify(nodeText(children))} className="group mt-12 mb-4 scroll-mt-20 font-semibold">
      <span className="text-primary-700/70">{marks} </span>
      {children}
    </Tag>
  )

const isVideo = (href?: string) => !!href && /\.(mp4|webm|ogg)(\?|$)/i.test(href)

const components: Components = {
  // Writings use # for top-level sections; the page title is the only h1.
  h1: heading("h2", "#"),
  h2: heading("h3", "##"),
  h3: heading("h4", "###"),
  h4: heading("h4", "####"),
  p: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
  a: ({ href, children }) =>
    isVideo(href) ? (
      <video src={href} controls preload="metadata" className="my-6 w-full border" />
    ) : (
      <a
        href={href}
        target={href?.startsWith("#") ? undefined : "_blank"}
        rel="noreferrer"
        className="break-words text-primary-700 underline decoration-primary-700/40 underline-offset-4 hover:decoration-primary-700"
      >
        {children}
      </a>
    ),
  // Images arrive wrapped in <p>, so stay within phrasing content.
  img: ({ src, alt }) => (
    <span className="my-8 block">
      <img src={src} alt={alt ?? ""} loading="lazy" className="mx-auto block max-h-[80vh] border" />
      {alt && <span className="mt-2 block text-center text-xs text-muted-foreground">{alt}</span>}
    </span>
  ),
  ul: ({ children }) => <ul className="my-4 list-['–_'] space-y-1 pl-6 marker:text-primary-700">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal space-y-1 pl-6 marker:text-primary-700">{children}</ol>,
  li: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-primary-700/60 bg-primary-700/5 px-5 py-1 text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-dashed" />,
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b px-3 py-2 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-b px-3 py-2 align-top">{children}</td>,
  pre: ({ children }) => {
    const code = children as ReactElement<{ className?: string; children?: ReactNode }>
    const language = /language-([\w+-]+)/.exec(code.props.className ?? "")?.[1] ?? "text"
    return <CodeBlock code={nodeText(code.props.children).replace(/\n$/, "")} language={language} />
  },
  code: ({ children }) => <code className="bg-muted px-1.5 py-0.5 text-[0.9em]">{children}</code>,
}

export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[[rehypeKatex, { output: "mathml" }], rehypeDropTocMarker]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  )
}
