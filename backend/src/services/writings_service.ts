import { getPaginatedWritingsFromDB, getWritingContentByIdFromDB, syncWritingByIdFromAPI, syncWritingsFromAPI, searchWritingContentsFromAPI } from "../repositories/writings_repository";

export const getPaginatedWritingsService = async (pageSize: number, page: number) => {
    return getPaginatedWritingsFromDB(pageSize, page);
};

export const getWritingByIdService = async (slug: string) => {
    return getWritingContentByIdFromDB(slug);
};

export const syncWritingByIdService = async (slug: string) => {
    await syncWritingByIdFromAPI(slug);
};

export const syncWritingsService = async () => {
    await syncWritingsFromAPI();
};

export const searchWritingContentsService = async (query: string, page: number, pageSize: number) => {
    return searchWritingContentsFromAPI(query, page, pageSize);
};
