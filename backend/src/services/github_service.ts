import { fetchUserRepositories, fetchRepositoryByName } from "../repositories/github_repository";
import { syncRepositoriesToDB, indexAllRepositoriesToES } from "../db/seed";
import { fetchContributionCalendar, ContributionCalendar } from "../external/github";

const CONTRIBUTIONS_TTL_MS = 60 * 60 * 1000;
let contributionsCache: { data: ContributionCalendar; fetchedAt: number } | null = null;

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

export const fetchContributionsService = async () => {
    if (contributionsCache && Date.now() - contributionsCache.fetchedAt < CONTRIBUTIONS_TTL_MS) {
        return contributionsCache.data;
    }

    const data = await fetchContributionCalendar();
    contributionsCache = { data, fetchedAt: Date.now() };
    return data;
};
