import { useState } from "react"
import { api } from "@/lib/api"
import { cvLatex, type Rgb } from "@/lib/cv-latex"
import type { Topic } from "@/lib/resume"
import { useTheme } from "@/lib/theme"
import type { Fact } from "@/lib/types"

export type CvPdf = {
  topic: Topic | null
  file: string
  phase: "compiling" | "ready" | "error"
  url?: string
  error?: string
  /** Something to read while xelatex runs. */
  fact?: Fact
}

/** Resolves a theme token (oklch, var() chains and all) to sRGB by painting it. */
function tokenRgb(token: string, fallback: Rgb): Rgb {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true })
  if (!value || !ctx) return fallback
  ctx.fillStyle = value
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r, g, b]
}

/** Compiles the CV for `topic` on the backend, in the page's current colors. */
export function useCvPdf() {
  const { hue, dark } = useTheme()
  const [pdf, setPdf] = useState<CvPdf | null>(null)

  const generate = async (topic: Topic | null) => {
    const file = topic ? `alden-luthfi-cv-${topic}` : "alden-luthfi-cv"
    // Updates for a request that has since been superseded are dropped.
    const update = (patch: Partial<CvPdf>) => setPdf((current) => (current?.file === file ? { ...current, ...patch } : current))

    setPdf({ topic, file, phase: "compiling" })
    api.getRandomFact().then((fact) => update({ fact }), () => {})

    const latexContent = cvLatex(topic, {
      background: tokenRgb("--background", dark ? [24, 24, 27] : [250, 250, 250]),
      foreground: tokenRgb("--foreground", dark ? [250, 250, 250] : [24, 24, 27]),
      highlight: tokenRgb("--primary-700", [234, 179, 8]),
    })

    try {
      const { pdfUrl } = await api.generateCv({
        latexContent,
        filename: file,
        type: topic ?? "full",
        mode: dark ? "dark" : "light",
        theme: hue,
      })
      update({ phase: "ready", url: pdfUrl })
    } catch (error) {
      update({ phase: "error", error: error instanceof Error ? error.message : "couldn't compile the pdf." })
    }
  }

  return { pdf, generate }
}
