import { Client, isFullPage } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import pool from "../db/mysql";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_WRITINGS_DATABASE_ID as string;

export const fetchWritingsFromNotion = async () => {
    const database = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: "Tema",
            multi_select: {
                does_not_contain: "Unpublished",
            }
        },
        sorts: [
            {
                property: "Dibuat Pada",
                direction: "descending",
            }
        ]
    });

    const results = database.results
        .filter(isFullPage)
        .filter((page: PageObjectResponse) => !page.archived && !page.in_trash)
        .map((page: any) => {
            const title = page.properties.Judul.title[0].plain_text;
            const tags = page.properties.Tema.multi_select.map((tag: any) => tag.name);
            const createdAt = page.properties["Dibuat Pada"].created_time
            return { id: page.id, title: title, tags: tags, createdAt: createdAt };
        });

    return results;
};

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

export const syncWritingsToDB = async () => {
    const notionData = await fetchWritingsFromNotion();

    for (const writing of notionData) {
        await pool.query(
            `
            INSERT INTO writings (id, title, tags, created_at)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            tags = VALUES(tags),
            created_at = VALUES(created_at)`,
            [
                writing.id,
                writing.title,
                JSON.stringify(writing.tags),
                new Date(writing.createdAt)
            ]
        );
    }

    const [rows] = await pool.query("SELECT * FROM writings ORDER BY created_at DESC");

    return rows
};
