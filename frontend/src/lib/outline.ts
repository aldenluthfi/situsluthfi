import { slugify } from "@/lib/utils"

/** Section headings (markdown # and ##) for the sidebar, skipping fenced code. */
export function outline(content: string) {
  const items: { id: string; text: string; depth: number }[] = []
  let fenced = false
  for (const line of content.split("\n")) {
    if (line.trimStart().startsWith("```")) fenced = !fenced
    const match = !fenced && /^(#{1,2})\s+(.+?)\s*#*$/.exec(line)
    if (!match) continue
    const text = match[2].replace(/[*_`[\]]/g, "").replace(/\(.*?\)/g, "").trim()
    if (text.toLowerCase() === "table of contents") continue
    items.push({ id: slugify(text), text, depth: match[1].length })
  }
  return items
}
