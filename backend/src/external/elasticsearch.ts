import { Client } from "@elastic/elasticsearch";
import { WritingContentIndexObject } from "../lib/types";

const client = new Client({
    node: process.env.ELASTICSEARCH_URL || "http://elasticsearch:9200"
});
const INDEX = process.env.ELASTICSEARCH_INDEX || "writings";

export const indexWritingContentToES = async (writing: WritingContentIndexObject) => {
    await client.index({
        index: INDEX,
        id: writing.id,
        document: writing,
    });
};

export const deleteWritingContentFromES = async (id: string) => {
    await client.delete({
        index: INDEX,
        id,
    }, { ignore: [404] });
};

export const searchWritingContentsFromES = async (query: string, page: number = 1, pageSize: number = 10) => {
    const from = (page - 1) * pageSize;
    const result = await client.search({
        index: INDEX,
        from,
        size: pageSize,
        query: {
            multi_match: {
                query,
                fields: ["content", "title", "tags"],
                fuzziness: "AUTO"
            }
        }
    });
    return {
        results: result.hits.hits.map(hit => hit._source),
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
