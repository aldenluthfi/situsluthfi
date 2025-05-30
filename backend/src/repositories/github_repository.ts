import { fetchAllRepositories } from "../external/github";
import { GitHubRepository } from "../lib/types";

export const fetchUserRepositories = async (): Promise<GitHubRepository[]> => {
    return fetchAllRepositories();
};
