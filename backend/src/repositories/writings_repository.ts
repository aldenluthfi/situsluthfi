import { RowDataPacket } from "mysql2";
import pool from "../db/mysql";
import { WritingContentObject, WritingObject } from "../lib/types";
import { syncWritingContentToDB, syncWritingsToDB } from "../db/seed";

export const getPaginatedWritingsFromDB = async (pageSize: number, page: number) => {
    const offset = (page - 1) * pageSize;

    const [rows] = await pool.query(
        "SELECT * FROM writings ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [pageSize, offset]
    ) as Array<RowDataPacket[]>;

    const [countRows] = await pool.query(
        "SELECT COUNT(*) as total FROM writings"
    );
    const total = Array.isArray(countRows) && countRows.length > 0 ? (countRows[0] as any).total : 0;

    return {
        results: rows.map((row) => ({
            id: row.id,
            title: row.title,
            slug: row.slug,
            tags: row.tags,
            lastUpdated: row.last_updated,
            createdAt: row.created_at,
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
    };
};

export const getWritingContentByIdFromDB = async (slug: string) => {
    const notionWriting = await pool.query(
        `SELECT
        wc.id, content, tags, title, slug, last_updated, created_at
        FROM writing_content wc
        JOIN writings w ON wc.id = w.id
        WHERE w.slug = ?`,
        [slug]
    ) as Array<RowDataPacket[]>;

    const writing = (notionWriting[0][0] as WritingContentObject | WritingObject);

    return {
        id: writing.id,
        title: (writing as WritingObject).title,
        slug: (writing as WritingObject).slug,
        tags: (writing as WritingObject).tags,
        content: (writing as WritingContentObject).content,
        lastUpdated: (writing as WritingObject).last_updated,
        createdAt: (writing as WritingObject).created_at,
    };
};

export const syncWritingByIdFromAPI = async (slug: string) => {
    await syncWritingContentToDB(slug);
};

export const syncWritingsFromAPI = async () => {
    await syncWritingsToDB();
};

