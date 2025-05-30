import { searchUniversalFromES, searchWritingContentsFromES, searchRepositoriesFromES } from "../external/elasticsearch";

export const searchUniversal = async (query: string, page: number = 1, pageSize: number = 10) => {
    return searchUniversalFromES(query, page, pageSize);
};

export const searchWritings = async (query: string, page: number = 1, pageSize: number = 10) => {
    return searchWritingContentsFromES(query, page, pageSize);
};

export const searchRepositories = async (query: string, page: number = 1, pageSize: number = 10) => {
    return searchRepositoriesFromES(query, page, pageSize);
};
