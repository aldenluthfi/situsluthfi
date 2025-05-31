import { fetchUserRepositories, fetchRepositoryById } from "../repositories/github_repository";

export const fetchUserRepositoriesService = async () => {
    return fetchUserRepositories();
};

export const fetchRepositoryByIdService = async (id: number) => {
    return fetchRepositoryById(id);
};
