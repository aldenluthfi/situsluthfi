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
        index: WRITINGS_INDEX,
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

export const searchRepositoriesFromES = async (query: string, page: number = 1, pageSize: number = 10) => {
    const from = (page - 1) * pageSize;
    const result = await client.search({
        index: REPOSITORIES_INDEX,
        from,
        size: pageSize,
        query: {
            multi_match: {
                query,
                fields: ["name^2", "description", "topics"],
                fuzziness: "AUTO"
            }
        },
        highlight: {
            fields: {
                name: {
                    pre_tags: ["<mark>"],
                    post_tags: ["</mark>"]
                },
                description: {
                    fragment_size: 100,
                    number_of_fragments: 1,
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

export const searchUniversalFromES = async (query: string, page: number = 1, pageSize: number = 10) => {
    const from = (page - 1) * pageSize;

    const [writingsResult, repositoriesResult] = await Promise.all([
        client.search({
            index: WRITINGS_INDEX,
            from,
            size: Math.ceil(pageSize / 2),
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
        }),
        client.search({
            index: REPOSITORIES_INDEX,
            from,
            size: Math.floor(pageSize / 2),
            query: {
                multi_match: {
                    query,
                    fields: ["name^2", "description", "topics"],
                    fuzziness: "AUTO"
                }
            },
            highlight: {
                fields: {
                    name: {
                        pre_tags: ["<mark>"],
                        post_tags: ["</mark>"]
                    },
                    description: {
                        fragment_size: 100,
                        number_of_fragments: 1,
                        pre_tags: ["<mark>"],
                        post_tags: ["</mark>"]
                    }
                }
            }
        })
    ]);

    const writingsResults = writingsResult.hits.hits.map(hit => ({
        ...(hit._source ?? {}),
        highlight: hit.highlight,
        _type: 'writing'
    }));

    const repositoriesResults = repositoriesResult.hits.hits.map(hit => ({
        ...(hit._source ?? {}),
        highlight: hit.highlight,
        _type: 'repository'
    }));

    const combinedResults = [...writingsResults, ...repositoriesResults];
    const totalWritings = typeof writingsResult.hits.total === "number"
        ? writingsResult.hits.total
        : writingsResult.hits.total?.value ?? 0;
    const totalRepositories = typeof repositoriesResult.hits.total === "number"
        ? repositoriesResult.hits.total
        : repositoriesResult.hits.total?.value ?? 0;
    const totalCombined = totalWritings + totalRepositories;

    return {
        results: combinedResults,
        total: totalCombined,
        page,
        pageSize,
        totalPages: Math.ceil(totalCombined / pageSize),
        breakdown: {
            writings: {
                count: writingsResults.length,
                total: totalWritings
            },
            repositories: {
                count: repositoriesResults.length,
                total: totalRepositories
            }
        }
    };
};
