import { RowDataPacket } from "mysql2";
import pool from "../db/mysql";
import { RepositoryObject } from "../lib/types";

export const fetchUserRepositories = async (): Promise<RepositoryObject[]> => {
    const [rows] = await pool.query(
        "SELECT * FROM repositories ORDER BY created_at DESC"
    ) as Array<RowDataPacket[]>;

    return rows.map(row => ({
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
        readme: row.readme,
        cover_light_url: row.cover_light_url,
        cover_dark_url: row.cover_dark_url,
        icon_map: row.icon_map,
    }));
};

export const fetchRepositoryByName = async (name: string): Promise<RepositoryObject | null> => {
    const [rows] = await pool.query(
        "SELECT * FROM repositories WHERE name = ? LIMIT 1",
        [name]
    ) as Array<RowDataPacket[]>;

    if (rows.length === 0) {
        return null;
    }

    const row = rows[0];
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
        readme: row.readme,
        cover_light_url: row.cover_light_url,
        cover_dark_url: row.cover_dark_url,
        icon_map: row.icon_map,
    };
};
