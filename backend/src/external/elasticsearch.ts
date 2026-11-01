import { Client } from "@elastic/elasticsearch";
import { WritingContentIndexObject, RepositoryIndexObject } from "../lib/types";

const client = new Client({
    node: process.env.ELASTICSEARCH_URL
});
const WRITINGS_INDEX = process.env.ELASTICSEARCH_WRITINGS_INDEX;
const REPOSITORIES_INDEX = process.env.ELASTICSEARCH_REPOSITORIES_INDEX;

if (!WRITINGS_INDEX) {
    throw new Error("ELASTICSEARCH_WRITINGS_INDEX is not set");
}

if (!REPOSITORIES_INDEX) {
    throw new Error("ELASTICSEARCH_REPOSITORIES_INDEX is not set");
}

function getTotalHits(total: number | { value: number; relation: string } | undefined): number {
    return typeof total === "number" ? total : total?.value ?? 0;
}

export const indexWritingContentToES = async (writing: WritingContentIndexObject) => {
    await client.index({
        index: WRITINGS_INDEX,
        id: writing.id,
        document: writing,
    });
};

export const clearESIndex = async (index: string) => {
    await client.deleteByQuery({
        index,
        query: { match_all: {} },
        refresh: true,
        ignore_unavailable: true,
    } as Parameters<typeof client.deleteByQuery>[0]);
};

export const clearWritingsIndex = () => clearESIndex(WRITINGS_INDEX!);
export const clearRepositoriesIndex = () => clearESIndex(REPOSITORIES_INDEX!);

export const deleteWritingContentFromES = async (id: string) => {
    await client.delete({
        index: WRITINGS_INDEX,
        id,
    }, { ignore: [404] });
};

export const indexRepositoryToES = async (repository: RepositoryIndexObject) => {
    await client.index({
        index: REPOSITORIES_INDEX,
        id: repository.id.toString(),
        document: repository,
    });
};

export const deleteRepositoryFromES = async (id: string) => {
    await client.delete({
        index: REPOSITORIES_INDEX,
        id,
    }, { ignore: [404] });
};

export type SearchKind = "repos" | "writings";

/** Searches the indices named in `kinds`; each hit is tagged with the index it came from. */
export const searchFromES = async (query: string, kinds: SearchKind[], page: number = 1, pageSize: number = 10) => {
    const from = (page - 1) * pageSize;
    const index = kinds.map((kind) => (kind === "writings" ? WRITINGS_INDEX : REPOSITORIES_INDEX));

    const result = await client.search({
        index,
        from,
        size: pageSize,
        query: {
            multi_match: {
                query,
                fields: ["content", "title^2", "tags", "name^2", "description", "topics", "readme"],
                fuzziness: "AUTO"
            }
        },
        highlight: {
            fields: {
                content: {
                    fragment_size: 50,
                    number_of_fragments: 2,
                    pre_tags: ["<mark>"],
                    post_tags: ["</mark>"]
                },
                title: {
                    pre_tags: ["<mark>"],
                    post_tags: ["</mark>"]
                },
                name: {
                    pre_tags: ["<mark>"],
                    post_tags: ["</mark>"]
                },
                description: {
                    fragment_size: 100,
                    number_of_fragments: 1,
                    pre_tags: ["<mark>"],
                    post_tags: ["</mark>"]
                },
                readme: {
                    fragment_size: 100,
                    number_of_fragments: 1,
                    pre_tags: ["<mark>"],
                    post_tags: ["</mark>"]
                }
            }
        }
    });

    const results = result.hits.hits.map(hit => ({
        ...(hit._source ?? {}),
        highlight: hit.highlight,
        _type: hit._index === WRITINGS_INDEX ? "writing" : "repository"
    }));

    const total = getTotalHits(result.hits.total);

    return {
        results,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
    };
};
