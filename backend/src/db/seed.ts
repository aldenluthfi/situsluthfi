import { RowDataPacket } from "mysql2";
import { fetchAllWritingsFromNotion, fetchWritingFromNotionByID } from "../lib/notion";
import pool from "./mysql";
import { fetchAllFacts } from "../lib/facts";

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

    await pool.query(
        `
        INSERT INTO writing_content (id, content, last_synced)
        VALUES (?, ?, NOW())
        ON DUPLICATE KEY UPDATE
        content = VALUES(content),
        last_synced = VALUES(last_synced)
        `,
        [writing.id, writing.content.parent]
    );
};

const syncAllWritingsContentToDB = async () => {
    const [rows] = await pool.query(
        `SELECT id FROM writings`
    ) as Array<RowDataPacket[]>;

    console.log(`Syncing content for ${rows.length} writings...`);

    for (const row of rows) {
        try {
            await syncWritingContentToDB(row.id);
            console.log(`Content synced for writing: ${row.id}`);
        } catch (error) {
            console.error(`Error syncing content for writing ${row.id}:`, error);
        }
    }
};

const syncAllFactsToDB = async () => {

    const allFacts = await fetchAllFacts();

    console.log(`Syncing ${allFacts.length} facts...`);

    for (const fact of allFacts) {
        allFacts.indexOf(fact) === 0 ?
        await pool.query(
            `INSERT INTO facts (id, text, source) VALUES (1,  ?, ?)
             ON DUPLICATE KEY UPDATE text=VALUES(text), source=VALUES(source)`,
            [fact.text, fact.source]
        ) :
        await pool.query(
            `INSERT INTO facts (text, source) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE text=VALUES(text), source=VALUES(source)`,
            [fact.text, fact.source]
        );
    }
}

const syncDatabase = async () => {
    try {
        await syncWritingsToDB();
        await syncAllWritingsContentToDB();
        await syncAllFactsToDB();
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
