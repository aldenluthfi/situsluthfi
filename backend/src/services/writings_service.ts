import { getPaginatedWritingsFromDB, getWritingContentByIdFromDB, syncWritingByIdFromAPI, syncWritingsFromAPI } from "../repositories/writings_repository";

export const getPaginatedWritingsService = async (pageSize: number, page: number) => {
    return getPaginatedWritingsFromDB(pageSize, page);
};

export const getWritingByIdService = async (id: string) => {
    return getWritingContentByIdFromDB(id);
};

export const syncWritingByIdService = async (id: string) => {
    await syncWritingByIdFromAPI(id);
};

export const syncWritingsService = async () => {
    await syncWritingsFromAPI();
};
