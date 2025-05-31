import { fetchAllRepositories } from "../external/github";
import { GitHubRepository, RepositoryObject } from "../lib/types";
import { RowDataPacket } from "mysql2";
import pool from "../db/mysql";

export const fetchUserRepositories = async (): Promise<GitHubRepository[]> => {
    return fetchAllRepositories();
};

export const fetchRepositoryByName = async (name: string): Promise<RepositoryObject | null> => {
    const [[row]] = await pool.query(
        "SELECT * FROM repositories WHERE name = ?",
        [name]
    ) as Array<RowDataPacket[]>;

    if (!row) {
        return null;
    }

    return {
        id: row.id,
        name: row.name,
        description: row.description,
        languages: row.languages,
        stargazers_count: row.stargazers_count,
        forks_count: row.forks_count,
        topics: row.topics,
        created_at: row.created_at,
        updated_at: row.updated_at,
        license: row.license,
        html_url: row.html_url,
    };
};
