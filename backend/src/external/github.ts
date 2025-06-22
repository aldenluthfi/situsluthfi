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

export const fetchRepositoryReadme = async (fullName: string): Promise<string> => {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${fullName}/readme`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "SitusLuthfi-Backend/1.0.0"
            }
        });

        if (!response.ok) {
            return "";
        }

        const readmeData = await response.json() as { content: string, encoding: string };

        if (readmeData.encoding === "base64") {
            return Buffer.from(readmeData.content, "base64").toString("utf-8");
        }

        return readmeData.content;
    } catch (error) {
        console.error(`Failed to fetch README for ${fullName}:`, error);
        return "";
    }
};

export const fetchRepositoryCoverImages = async (fullName: string): Promise<{ lightUrl?: string; darkUrl?: string }> => {
    const result: { lightUrl?: string; darkUrl?: string } = {};

    try {
        const lightResponse = await fetch(`${GITHUB_API_BASE}/repos/${fullName}/contents/.github/meta/light.png`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "SitusLuthfi-Backend/1.0.0"
            }
        });

        if (lightResponse.ok) {
            const lightData = await lightResponse.json() as { download_url: string };
            result.lightUrl = lightData.download_url;
        }
    } catch (error) {
        console.error(`Failed to fetch light cover image for ${fullName}:`, error);
    }

    try {
        const darkResponse = await fetch(`${GITHUB_API_BASE}/repos/${fullName}/contents/.github/meta/dark.png`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "SitusLuthfi-Backend/1.0.0"
            }
        });

        if (darkResponse.ok) {
            const darkData = await darkResponse.json() as { download_url: string };
            result.darkUrl = darkData.download_url;
        }
    } catch (error) {
        console.error(`Failed to fetch dark cover image for ${fullName}:`, error);
    }

    return result;
};

export const fetchRepositoryIconMap = async (fullName: string): Promise<Record<string, string>> => {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${fullName}/contents/.github/meta/iconmap.json`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "SitusLuthfi-Backend/1.0.0"
            }
        });

        if (!response.ok) {
            return {};
        }

        const iconMapData = await response.json() as { content: string, encoding: string };

        if (iconMapData.encoding === "base64") {
            const decodedContent = Buffer.from(iconMapData.content, "base64").toString("utf-8");
            return JSON.parse(decodedContent);
        }

        return JSON.parse(iconMapData.content);
    } catch (error) {
        console.error(`Failed to fetch iconmap for ${fullName}:`, error);
        return {};
    }
};

export const fetchAllRepositories = async (): Promise<GitHubRepository[]> => {
    const endpoint = `${GITHUB_API_BASE}/user/repos`;

    let allRepos: GitHubRepository[] = [];
    let page = 1;
    const perPage = 100;

    let hasMore = true;
    while (hasMore) {
        const response = await fetch(`${endpoint}?page=${page}&per_page=${perPage}&sort=created&direction=desc&type=owner`, {
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
            const ownedRepos = repos.filter(repo => 
                !repo.archived && 
                !repo.fork && 
                repo.name !== repo.owner.login
            );
            const reposWithData = await Promise.all(
                ownedRepos.map(async (repo) => {
                    try {
                        const [languages, readme, coverImages, iconMap] = await Promise.all([
                            fetchRepositoryLanguages(repo.languages_url),
                            fetchRepositoryReadme(repo.full_name),
                            fetchRepositoryCoverImages(repo.full_name),
                            fetchRepositoryIconMap(repo.full_name)
                        ]);
                        return {
                            ...repo,
                            languages,
                            readme,
                            cover_light_url: coverImages.lightUrl,
                            cover_dark_url: coverImages.darkUrl,
                            icon_map: iconMap
                        };
                    } catch (error) {
                        console.error(`Failed to fetch data for ${repo.full_name}:`, error);
                        return { ...repo, languages: {}, readme: "", icon_map: {} };
                    }
                })
            );

            allRepos = allRepos.concat(reposWithData);
            if (repos.length < perPage) {
                hasMore = false;
            } else {
                page++;
            }
        }
    }

    return allRepos;
};
