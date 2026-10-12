import { useEffect, useState } from "react"
import { isAbortError } from "@/lib/api"

type ApiState<T> =
  | { status: "loading"; data: undefined }
  | { status: "error"; data: undefined }
  | { status: "ready"; data: T }

/** Runs `fetcher` on mount and whenever `key` changes, aborting stale requests. */
export function useApi<T>(fetcher: (signal: AbortSignal) => Promise<T>, key = "") {
  const [state, setState] = useState<ApiState<T>>({ status: "loading", data: undefined })

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: "loading", data: undefined })
    fetcher(controller.signal)
      .then((data) => setState({ status: "ready", data }))
      .catch((error) => {
        if (!isAbortError(error)) setState({ status: "error", data: undefined })
      })
    return () => controller.abort()
    // `fetcher` is expected to be an inline closure; `key` captures what it depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return state
}
