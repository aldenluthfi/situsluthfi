import pool from "../db/mysql";
import { fetchWritingFromNotionByID } from "../lib/notion";

export const getPaginatedWritingsFromDB = async (pageSize: number, page: number) => {
    const offset = (page - 1) * pageSize;

    const [rows] = await pool.query(
        "SELECT * FROM writings ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [pageSize, offset]
    );

    const [countRows] = await pool.query(
        "SELECT COUNT(*) as total FROM writings"
    );
    const total = Array.isArray(countRows) && countRows.length > 0 ? (countRows[0] as any).total : 0;

    return {
        results: rows,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
    };
};

export const getWritingContentById = async (id: string) => {
    const notionWriting = await fetchWritingFromNotionByID(id);

    if (!notionWriting) {
        return null;
    }

    return {
        content: notionWriting.content.parent,
        lastSynced: new Date().toISOString(),
    };
};

