import { syncWritingContentToDB } from "../db/seed";
import { getPaginatedWritingsFromDB, getWritingContentById } from "../repositories/writings_repository";

export const getPaginatedWritingsService = async (pageSize: number, page: number) => {
  return getPaginatedWritingsFromDB(pageSize, page);
};

export const getWritingByIdService = async (id: string) => {
  return getWritingContentById(id);
};

export const syncWritingByIdService = async (id: string) => {
  await syncWritingContentToDB(id);
};
