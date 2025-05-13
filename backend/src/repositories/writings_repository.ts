import { RowDataPacket } from "mysql2";
import pool from "../db/mysql";
import { WritingContentObject, WritingObject } from "../lib/types";

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
        results: rows.map((row: RowDataPacket) => ({
            id: row.id,
            title: row.title,
            tags: row.tags,
            createdAt: row.created_at,
            lastUpdated: row.last_updated,
        })) as WritingObject[],
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
    };
};

export const getWritingContentById = async (id: string) => {
    const notionWriting = await pool.query(
        `SELECT
        wc.id, content, title, last_updated, created_at, wc.last_synced
        FROM writing_content wc
        JOIN writings w ON wc.id = w.id
        WHERE wc.id = ?`,
        [id]
    ) as Array<RowDataPacket[]>;

    if (notionWriting.length === 0) {
        throw new Error("Writing not found");
    }

    const writing = (notionWriting[0][0] as WritingContentObject);

    return {
        id: writing.id,
        content: writing.content,
        title: writing.title,
        lastUpdated: writing.last_updated,
        createdAt: writing.created_at,
        lastSynced: writing.last_synced,
    };
};

