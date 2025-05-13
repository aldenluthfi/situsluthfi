import { RowDataPacket } from "mysql2";
import { fetchAllWritingsFromNotion, fetchWritingFromNotionByID } from "../lib/notion";
import pool from "./mysql";

const syncWritingsToDB = async () => {
    const notionData = await fetchAllWritingsFromNotion();

    for (const writing of notionData) {
        await pool.query(
            `
            INSERT INTO writings (id, title, tags, created_at, last_updated, last_synced)
            VALUES (?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            tags = VALUES(tags),
            created_at = VALUES(created_at),
            last_updated = VALUES(last_updated),
            last_synced = VALUES(last_synced)`,
            [
                writing.id,
                writing.title,
                JSON.stringify(writing.tags),
                new Date(writing.createdAt),
                new Date(writing.lastUpdated),
            ]
        );
    }
};

const syncWritingContentToDB = async (id: string) => {
    const writing = await fetchWritingFromNotionByID(id);

    const [rows] = await pool.query(
        `SELECT title FROM writings WHERE id = ?`,
        [writing.id]
    ) as RowDataPacket[];

    const title = rows && Array.isArray(rows) && rows.length > 0 ? rows[0].title : null;

    await pool.query(
        `
        INSERT INTO writing_content (id, title, content, last_synced)
        VALUES (?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
        content = VALUES(content),
        last_synced = VALUES(last_synced)
        `,
        [writing.id, title, writing.content]
    );
};

const syncDatabase = async () => {
    try {
        await syncWritingsToDB();
        console.log("Writings synced to DB successfully.");
    } catch (error) {
        console.error("Error syncing writings to DB:", error);
    }

}

syncDatabase()
    .then(() => {
        console.log("Database sync completed.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error during database sync:", error);
        process.exit(1);
    });
