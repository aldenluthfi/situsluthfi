import { useSearchParams } from "react-router-dom"
import FilterBar from "@/components/filter-bar"
import Section from "@/components/section"
import Timeline from "@/components/timeline"
import { resume, TOPICS, type Topic } from "@/lib/resume"

export default function Resume() {
  const [params, setParams] = useSearchParams()
  const raw = params.get("topic")
  const topic = TOPICS.find((t) => t === raw) ?? null

  return (
    <Section
      command={topic ? `grep ${topic} cv.md` : "cat cv.md"}
      aside={
        <FilterBar
          options={[...TOPICS]}
          allLast
          value={topic}
          onChange={(t) => setParams(t ? { topic: t } : {}, { replace: true, preventScrollReset: true })}
        />
      }
    >
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
