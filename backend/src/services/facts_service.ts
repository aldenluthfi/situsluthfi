import { getRandomFactFromDB, syncFactsToDB } from "../repositories/facts_repository";

export const getRandomFactService = async () => {
  return getRandomFactFromDB();
};

export const syncFactsService = async () => {
  return syncFactsToDB();
};
