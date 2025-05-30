import { Client } from "@elastic/elasticsearch";
import { WritingContentIndexObject } from "../lib/types";

const client = new Client({
    node: process.env.ELASTICSEARCH_URL
});
const WRITINGS_INDEX = process.env.ELASTICSEARCH_WRITINGS_INDEX;

if (!WRITINGS_INDEX) {
    throw new Error("ELASTICSEARCH_WRITINGS_INDEX is not set");
}

export const indexWritingContentToES = async (writing: WritingContentIndexObject) => {
    await client.index({
        index: WRITINGS_INDEX,
        id: writing.id,
        document: writing,
    });
};

export const deleteWritingContentFromES = async (id: string) => {
    await client.delete({
        index: WRITINGS_INDEX,
        id,
    }, { ignore: [404] });
};

export const searchWritingContentsFromES = async (query: string, page: number = 1, pageSize: number = 10) => {
    const from = (page - 1) * pageSize;
    const result = await client.search({
        from,
        size: pageSize,
        query: {
            multi_match: {
                query,
                fields: ["content", "title", "tags"],
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
                }
            }
        }
    });
    return {
        results: result.hits.hits.map(hit => ({
            ...(hit._source ?? {}),
            highlight: hit.highlight
        })),
        total: result.hits.total,
        page,
        pageSize,
        totalPages: Math.ceil(
            (
                typeof result.hits.total === "number"
                    ? result.hits.total
                    : result.hits.total?.value ?? 0
            ) / pageSize
        )
    };
};
