import { fetchUserRepositories } from "../repositories/github_repository";

export const fetchUserRepositoriesService = async () => {
    return fetchUserRepositories();
};
