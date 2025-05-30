import fetch from "node-fetch";
import { GitHubRepository } from "../lib/types";

const GITHUB_API_BASE = "https://api.github.com";
const token = process.env.GITHUB_TOKEN;

if (!token) {
    throw new Error("GITHUB_TOKEN is not set in environment variables");
}

export const fetchRepositoryLanguages = async (languagesUrl: string): Promise<Record<string, number>> => {
    const response = await fetch(languagesUrl, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "SitusLuthfi-Backend/1.0.0"
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    return await response.json() as Record<string, number>;
};

export const fetchAllRepositories = async (): Promise<GitHubRepository[]> => {
    const endpoint = `${GITHUB_API_BASE}/user/repos`;

    let allRepos: GitHubRepository[] = [];
    let page = 1;
    const perPage = 100;

    let hasMore = true;
    while (hasMore) {
        const response = await fetch(`${endpoint}?page=${page}&per_page=${perPage}&sort=updated&direction=desc&type=owner`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "SitusLuthfi-Backend/1.0.0"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const repos = await response.json() as GitHubRepository[];

        if (repos.length === 0) {
            hasMore = false;
        } else {
            const ownedRepos = repos.filter(repo => !repo.archived && !repo.fork);
            const reposWithLanguages = await Promise.all(
                ownedRepos.map(async (repo) => {
                    try {
                        const languages = await fetchRepositoryLanguages(repo.languages_url);
                        return { ...repo, languages };
                    } catch (error) {
                        console.error(`Failed to fetch languages for ${repo.full_name}:`, error);
                        return { ...repo, languages: {} };
                    }
                })
            );

            allRepos = allRepos.concat(reposWithLanguages);
            if (repos.length < perPage) {
                hasMore = false;
            } else {
                page++;
            }
        }
    }

    return allRepos;
};
