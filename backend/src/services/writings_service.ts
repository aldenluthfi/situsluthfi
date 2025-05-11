import { getPaginatedWritingsFromDB, syncWritingsToDB } from "../repositories/writings_repository";

export const fetchWritingsService = async () => {
  return syncWritingsToDB();
};

export const getPaginatedWritingsService = async (pageSize: number, page: number) => {
  return getPaginatedWritingsFromDB(pageSize, page);
};
