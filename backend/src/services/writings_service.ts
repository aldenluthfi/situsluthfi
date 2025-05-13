import { getPaginatedWritingsFromDB, getWritingContentById } from "../repositories/writings_repository";

export const getPaginatedWritingsService = async (pageSize: number, page: number) => {
  return getPaginatedWritingsFromDB(pageSize, page);
};

export const getWritingByIdService = async (id: string) => {
  return getWritingContentById(id);
};
