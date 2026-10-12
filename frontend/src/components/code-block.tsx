import { useEffect, useState } from "react"

/** Highlights with shiki on the client; plain text until the grammar loads. */
export default function CodeBlock({ code, language }: { code: string; language: string }) {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    import("shiki")
      .then(({ codeToHtml }) =>
        codeToHtml(code, {
          lang: language,
          themes: { light: "github-light", dark: "vitesse-dark" },
          defaultColor: false,
        }),
      )
      .then((result) => !cancelled && setHtml(result))
      .catch(() => {
        // unknown language: keep the plain rendering
      })
    return () => {
      cancelled = true
    }
  }, [code, language])

  return (
    <figure className="my-6 border bg-card text-sm">
      <figcaption className="border-b px-4 py-1.5 text-xs text-muted-foreground">{language}</figcaption>
      {html ? (
        <div className="overflow-x-auto p-4 [&_pre]:!bg-transparent" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="overflow-x-auto p-4">
          <code>{code}</code>
        </pre>
      )}
    </figure>
  )
}
