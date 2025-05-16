import { getPaginatedWritingsFromDB, getWritingContentByIdFromDB, syncWritingByIdFromAPI, syncWritingsFromAPI } from "../repositories/writings_repository";

export const getPaginatedWritingsService = async (pageSize: number, page: number) => {
    return getPaginatedWritingsFromDB(pageSize, page);
};

export const getWritingByIdService = async (idOrSlug: string) => {
    return getWritingContentByIdFromDB(idOrSlug);
};

export const syncWritingByIdService = async (idOrSlug: string) => {
    await syncWritingByIdFromAPI(idOrSlug);
};

export const syncWritingsService = async () => {
    await syncWritingsFromAPI();
};
