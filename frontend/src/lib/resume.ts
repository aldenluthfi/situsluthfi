import cv from "@/content/cv.md?raw"

// cv.md is shared with vI. Lines end in a tag list like `[full | software]`;
// untagged lines show for every topic, `full` is the unfiltered view.

export const TOPICS = ["software", "cybersecurity", "design", "humanitarian", "tutor"] as const
export type Topic = (typeof TOPICS)[number]

/** Sections that read as a log. Projects have their own page; the rest is profile data. */
const SECTIONS = [
  "Education",
  "Work Experience",
  "Volunteering Experience",
  "Organizational Experience",
  "Awards",
  "Certifications",
]

type Tags = string[] | null

export type ResumeEntry = { title: string; org: string; period: string; points: string[] }
export type ResumeSection = { title: string; entries: ResumeEntry[] }

type Point = { text: string; tags: Tags }
type Role = { title: string; period: string; tags: Tags; points: Point[] }
type Org = { name: string; tags: Tags; roles: Role[] }
type Section = { title: string; tags: Tags; orgs: Org[] }

const TAG = /\s*\[([^\]]*)\]\s*$/

function untag(line: string): { text: string; tags: Tags } {
  const match = TAG.exec(line)
  if (!match) return { text: line.trim(), tags: null }
  return {
    text: line.slice(0, match.index).trim(),
    tags: match[1].split("|").map((t) => t.trim()).filter(Boolean),
  }
}

/** `**Bold** rest` → [bold, rest] */
function head(text: string) {
  const match = /^\*\*(.+?)\*\*\s*(.*)$/.exec(text)
  return match ? [match[1], match[2]] : [text, ""]
}

function parse(source: string): Section[] {
  const sections: Section[] = []
  let section: Section | null = null

  for (const raw of source.split("\n")) {
    const { text, tags } = untag(raw)

    if (/^## /.test(raw)) {
      const title = text.slice(3).trim()
      section = SECTIONS.includes(title) ? { title, tags, orgs: [] } : null
      if (section) sections.push(section)
    } else if (!section) {
      continue
    } else if (/^#### /.test(raw)) {
      section.orgs.push({ name: head(text.slice(5))[0], tags, roles: [] })
    } else if (/^##### /.test(raw)) {
      const [title, period] = head(text.slice(6))
      section.orgs.at(-1)?.roles.push({ title, period, tags, points: [] })
    } else if (/^- /.test(raw)) {
      section.orgs.at(-1)?.roles.at(-1)?.points.push({ text: text.slice(2), tags })
    }
  }

  return sections
}

const PARSED = parse(cv)

const shows = (tags: Tags, topic: Topic | null) => topic === null || tags === null || tags.includes(topic)

export function resume(topic: Topic | null): ResumeSection[] {
  return PARSED.filter((section) => shows(section.tags, topic))
    .map((section) => ({
      title: section.title,
      entries: section.orgs
        .filter((org) => shows(org.tags, topic))
        .flatMap((org) =>
          org.roles
            .filter((role) => shows(role.tags, topic))
            .map((role) => ({
              title: role.title,
              org: org.name,
              period: role.period,
              points: role.points.filter((p) => shows(p.tags, topic)).map((p) => p.text),
            })),
        ),
    }))
    .filter((section) => section.entries.length > 0)
}
