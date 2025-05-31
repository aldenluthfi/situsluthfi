import { fetchUserRepositories, fetchRepositoryByName } from "../repositories/github_repository";
import { syncRepositoriesToDB, indexAllRepositoriesToES } from "../db/seed";

export const fetchUserRepositoriesService = async () => {
    return fetchUserRepositories();
};

export const fetchRepositoryByNameService = async (name: string) => {
    return fetchRepositoryByName(name);
};

export const syncRepositoriesService = async () => {
    await syncRepositoriesToDB();
    await indexAllRepositoriesToES();
};
