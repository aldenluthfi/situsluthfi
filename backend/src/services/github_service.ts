import { fetchUserRepositories, fetchRepositoryByName } from "../repositories/github_repository";

export const fetchUserRepositoriesService = async () => {
    return fetchUserRepositories();
};

export const fetchRepositoryByNameService = async (name: string) => {
    return fetchRepositoryByName(name);
};
