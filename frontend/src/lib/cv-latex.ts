import cv from "@/content/cv.md?raw"
import template from "@/content/cv.tex?raw"
import { head, shows, untag, type Tags, type Topic } from "@/lib/resume"

// Turns cv.md into the LaTeX the backend compiles, so the PDF can never drift
// from the page. Every section is included (the page skips Projects and the
// profile tables); tags filter it exactly like the page does.

export type Rgb = [number, number, number]
export type CvColors = { background: Rgb; foreground: Rgb; highlight: Rgb }

/** Bullet marks, one per role in document order, so a role keeps its mark across topics. */
const SYMBOLS = [
  "\\lambda", "\\Sigma", "\\Phi", "\\Omega", "\\Pi", "\\Delta", "\\exists", "\\forall", "\\nabla",
  "\\mathbb{N}", "\\mathbb{Z}", "\\mathbb{Q}", "\\mathbb{A}", "\\mathbb{R}", "\\mathbb{C}", "\\mathbb{H}",
  "\\mathbb{P}", "\\alpha", "\\beta", "\\gamma", "\\epsilon", "\\theta", "\\mu", "\\psi",
].map((s) => `$${s}$`)

type Point = { text: string; tags: Tags }
type Role = { title: string; rest: string; tags: Tags; symbol: string; points: Point[] }
type Block =
  | { kind: "text"; text: string }
  | { kind: "table"; rows: [string, string][] }
  | { kind: "org"; name: string; rest: string; tags: Tags; roles: Role[] }
type Section = { title: string; tags: Tags; blocks: Block[] }

const SPECIAL: Record<string, string> = {
  "\\": "\\textbackslash{}",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}",
}

function escape(text: string) {
  return text.replace(/[\\~^&%$#_{}]/g, (c) => SPECIAL[c] ?? `\\${c}`)
}

/** `**bold**` → highlighted, `[text](url)` → link, `_…_` around links dropped. */
function inline(text: string) {
  const md = text.replace(/_\[/g, "[").replace(/\)_/g, ")")
  let out = ""
  let last = 0
  for (const m of md.matchAll(/\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g)) {
    out += escape(md.slice(last, m.index))
    out += m[1] !== undefined ? `\\tekan{${escape(m[1])}}` : `\\href{${m[3].replace(/[%#&]/g, "\\$&")}}{${escape(m[2])}}`
    last = m.index + m[0].length
  }
  return out + escape(md.slice(last))
}

function parse(source: string) {
  let name = ""
  let contact = ""
  let roles = 0
  const sections: Section[] = []

  for (const raw of source.split("\n")) {
    const { text, tags } = untag(raw)
    const section = sections.at(-1)
    const last = section?.blocks.at(-1)

    if (/^# /.test(raw)) name = text.slice(2)
    else if (/^### /.test(raw) && !section) contact = text.slice(4)
    else if (/^## /.test(raw)) sections.push({ title: text.slice(3), tags, blocks: [] })
    else if (!section || !text) continue
    else if (/^#### /.test(raw)) {
      const [org, rest] = head(text.slice(5))
      section.blocks.push({ kind: "org", name: org, rest, tags, roles: [] })
    } else if (/^##### /.test(raw)) {
      const [title, rest] = head(text.slice(6))
      if (last?.kind === "org") last.roles.push({ title, rest, tags, symbol: "", points: [] })
    } else if (/^- /.test(raw)) {
      const role = last?.kind === "org" ? last.roles.at(-1) : undefined
      if (!role) continue
      role.symbol ||= SYMBOLS[roles++ % SYMBOLS.length]
      role.points.push({ text: text.slice(2), tags })
    } else if (text.startsWith("|")) {
      // | **Label** | : | value |; the blank header row and the --- row carry no label.
      const [label, , value] = text.split("|").slice(1, -1).map((cell) => cell.trim())
      if (!label || /^-+$/.test(label)) continue
      const row: [string, string] = [label.replace(/\*\*/g, ""), value ?? ""]
      if (last?.kind === "table") last.rows.push(row)
      else section.blocks.push({ kind: "table", rows: [row] })
    } else if (last?.kind === "text") last.text += ` ${text}`
    else section.blocks.push({ kind: "text", text })
  }

  return { name, contact, sections }
}

const DOCUMENT = parse(cv)

function render(topic: Topic | null) {
  const out = [`\\kepala{${escape(DOCUMENT.name)}}{${inline(DOCUMENT.contact)}}`]

  for (const section of DOCUMENT.sections) {
    if (!shows(section.tags, topic)) continue
    const body: string[] = []

    for (const block of section.blocks) {
      if (block.kind === "text") {
        body.push(`\\small{\n    \\indent ${inline(block.text)}}`)
      } else if (block.kind === "table") {
        const rows = block.rows.map(([label, value]) => `    \\rincian\n    {${escape(label)}}\n    {${inline(value)}}`)
        body.push(`\\perinci{\n${rows.join("\n")}\n}`)
      } else if (shows(block.tags, topic)) {
        block.roles
          .filter((role) => shows(role.tags, topic))
          .forEach((role, i) => {
            // Roles without bullets (degrees, awards) read as plain lines, as in vI.
            const title = role.points.length > 0 ? escape(role.title) : `\\normalfont{${escape(role.title)}}`
            body.push(
              i === 0
                ? `\\entri\n{${escape(block.name)}}\n{${inline(block.rest)}}\n{${title}}\n{${inline(role.rest)}}`
                : `\\entriTanpaJudul\n{${title}}\n{${inline(role.rest)}}`,
            )
            const points = role.points.filter((p) => shows(p.tags, topic))
            if (points.length > 0) {
              const items = points.map((p) => `    \\butir{${role.symbol}}{${inline(p.text)}}`)
              body.push(`\\daftar{\n${items.join("\n")}\n}`)
            }
          })
      }
    }

    // A section whose every entry is filtered out is dropped, heading and all.
    if (body.length === 0) continue
    const prose = section.blocks.every((b) => b.kind !== "org")
    out.push("", `\\bagian{${escape(section.title)}}`, ...(prose ? [] : ["\\vspace{-15pt}"]), ...body)
    out.push(section.blocks.every((b) => b.kind === "text") ? "\\vspace{-5pt}" : "\\vspace{-7.5pt}")
  }

  return out.join("\n")
}

const color = (name: string, [r, g, b]: Rgb) => (tex: string) =>
  tex.replace(new RegExp(`\\\\definecolor\\{${name}\\}\\{RGB\\}\\{[^}]+\\}`), `\\definecolor{${name}}{RGB}{${r}, ${g}, ${b}}`)

/** Full LaTeX source for the CV filtered to `topic` (`null` = everything), in `colors`. */
export function cvLatex(topic: Topic | null, colors: CvColors) {
  const themed = [color("background", colors.background), color("foreground", colors.foreground), color("highlight", colors.highlight)]
    .reduce((tex, apply) => apply(tex), template)
  return themed.replace("%BODY%", () => render(topic))
}
