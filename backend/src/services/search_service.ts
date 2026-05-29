import { searchUniversalFromES, searchWritingContentsFromES, searchRepositoriesFromES } from "../external/elasticsearch";

export const searchUniversalService = async (query: string, page: number = 1, pageSize: number = 10) => {
    return searchUniversalFromES(query, page, pageSize);
};

export const searchWritingsService = async (query: string, page: number = 1, pageSize: number = 10) => {
    return searchWritingContentsFromES(query, page, pageSize);
};

export const searchRepositoriesService = async (query: string, page: number = 1, pageSize: number = 10) => {
    return searchRepositoriesFromES(query, page, pageSize);
};
