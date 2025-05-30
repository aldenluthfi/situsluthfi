import { searchUniversal, searchWritings, searchRepositories } from "../repositories/search_repository";

export const searchUniversalService = async (query: string, page: number = 1, pageSize: number = 10) => {
    if (!query || query.trim() === '') {
        throw new Error('Search query is required');
    }
    return searchUniversal(query.trim(), page, pageSize);
};

export const searchWritingsService = async (query: string, page: number = 1, pageSize: number = 10) => {
    if (!query || query.trim() === '') {
        throw new Error('Search query is required');
    }
    return searchWritings(query.trim(), page, pageSize);
};

export const searchRepositoriesService = async (query: string, page: number = 1, pageSize: number = 10) => {
    if (!query || query.trim() === '') {
        throw new Error('Search query is required');
    }
    return searchRepositories(query.trim(), page, pageSize);
};
