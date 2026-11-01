import { searchFromES, type SearchKind } from "../external/elasticsearch";

const KINDS: readonly SearchKind[] = ["repos", "writings"];

/** `?filter=repos,writings` → the kinds to search; absent or empty means all. Null if anything is unknown. */
export const parseSearchFilter = (raw: unknown): SearchKind[] | null => {
    if (raw === undefined || raw === "") return [...KINDS];
    if (typeof raw !== "string") return null;
    const kinds = [...new Set(raw.split(",").map((kind) => kind.trim()).filter(Boolean))];
    return kinds.every((kind): kind is SearchKind => KINDS.includes(kind as SearchKind)) && kinds.length > 0 ? kinds : null;
};

export const searchService = async (query: string, filter: SearchKind[], page: number = 1, pageSize: number = 10) => {
    return searchFromES(query, filter, page, pageSize);
};
