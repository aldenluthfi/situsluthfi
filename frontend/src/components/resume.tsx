import { useSearchParams } from "react-router-dom"
import FilterBar from "@/components/filter-bar"
import Section, { Prompt } from "@/components/section"
import Timeline from "@/components/timeline"
import { useCvPdf, type CvPdf } from "@/hooks/use-cv-pdf"
import { resume, TOPICS, type Topic } from "@/lib/resume"

function PdfStatus({ pdf }: { pdf: CvPdf }) {
  return (
    <div className="space-y-3 border p-4 text-sm" aria-live="polite">
      <Prompt>xelatex {pdf.file}.tex</Prompt>
      {pdf.phase === "compiling" && <p className="animate-pulse text-muted-foreground">compiling…</p>}
      {pdf.phase === "error" && <p className="text-muted-foreground">failed: {pdf.error?.toLowerCase()}</p>}
      {pdf.phase === "ready" && pdf.url && (
        <p className="flex gap-4">
          <a href={pdf.url} target="_blank" rel="noreferrer" className="text-primary-700 hover:underline">
            open {pdf.file}.pdf ↗
          </a>
          <a href={pdf.url} download={`${pdf.file}.pdf`} className="text-muted-foreground transition-colors hover:text-primary-700">
            save ↓
          </a>
        </p>
      )}
      {pdf.fact && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          fun fact #{pdf.fact.id}: {pdf.fact.text}{" "}
          <a href={pdf.fact.source} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-primary-700">
            source
          </a>
        </p>
      )}
    </div>
  )
}

export default function Resume() {
  const [params, setParams] = useSearchParams()
  const raw = params.get("topic")
  const topic = TOPICS.find((t) => t === raw) ?? null
  const { pdf, generate } = useCvPdf()
  // A PDF built for another topic no longer matches what's on screen.
  const current = pdf?.topic === topic ? pdf : null

  return (
    <Section
      command={topic ? `grep ${topic} cv.md` : "cat cv.md"}
      aside={
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <FilterBar
            options={[...TOPICS]}
            allLast
            value={topic}
            onChange={(t) => setParams(t ? { topic: t } : {}, { replace: true, preventScrollReset: true })}
          />
          <button
            type="button"
            onClick={() => generate(topic)}
            disabled={current?.phase === "compiling"}
            title={`compile ${topic ?? "the full"} cv as a pdf in the current colors`}
            className="border border-primary-700/50 px-2 py-0.5 text-xs leading-5 text-primary-700 transition-colors hover:bg-primary-700/10 disabled:opacity-50"
          >
            pdf
          </button>
        </div>
      }
    >
      {current && <PdfStatus pdf={current} />}
      <div className="space-y-12">
        {resume(topic as Topic | null).map((section) => (
          <div key={section.title} className="space-y-6">
            <h3 className="text-xs font-normal tracking-widest text-muted-foreground uppercase">{section.title}</h3>
            <Timeline items={section.entries} />
          </div>
        ))}
      </div>
    </Section>
  )
}
