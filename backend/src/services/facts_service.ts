import { getRandomFactFromDB } from "../repositories/facts_repository";

export const getRandomFactService = async () => {
  return getRandomFactFromDB();
};
