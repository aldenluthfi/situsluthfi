import type {
  ContributionCalendar,
  RepositoryObject,
  WritingDetail,
  WritingObject,
} from "@/lib/types"

const BASE = "/api"

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

type Query = Record<string, string | number | undefined>

function buildUrl(path: string, query?: Query) {
  const url = new URL(`${BASE}${path}`, window.location.origin)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  return `${url.pathname}${url.search}`
}

async function request<T>(
  path: string,
  { query, ...init }: RequestInit & { query?: Query } = {},
): Promise<T> {
  const res = await fetch(buildUrl(path, query), init)
  if (!res.ok) {
    throw new ApiError(res.status, `Request to ${path} failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

/** True when a fetch rejection is the result of an intentional abort. */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError"
}

type Paginated<T> = { results: T[]; totalPages: number }

export const api = {
  getWritings: (signal?: AbortSignal) =>
    request<Paginated<WritingObject>>("/writings/get_page", {
      query: { pagesize: 100, page: 1 },
      signal,
    }),

  getWriting: (slug: string, signal?: AbortSignal) =>
    request<WritingDetail>(`/writings/${slug}`, { signal }),

  syncWriting: (slug: string, signal?: AbortSignal) =>
    request<unknown>(`/writings/sync/${slug}`, { signal }),

  getRepositories: (signal?: AbortSignal) =>
    request<{ repositories: RepositoryObject[] }>("/github/repositories", {
      signal,
    }),

  getContributions: (signal?: AbortSignal) =>
    request<ContributionCalendar>("/github/contributions", { signal }),
}
