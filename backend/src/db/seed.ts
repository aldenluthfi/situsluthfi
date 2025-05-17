import { RowDataPacket } from "mysql2";
import { fetchAllWritingsFromNotion, fetchWritingFromNotionById } from "../external/notion";
import pool from "./mysql";
import { fetchAllFacts } from "../external/facts";
import slugify from "slugify";

export const syncWritingsToDB = async () => {
    const notionData = await fetchAllWritingsFromNotion();

    console.log(`Syncing ${notionData.length} writings...`);

    const [dbRows] = await pool.query(
        `SELECT id FROM writings`
    ) as Array<RowDataPacket[]>;

    const dbIds = dbRows.map(row => row.id);
    const notionIds = notionData.map(writing => writing.id);

    for (const writing of notionData) {
        await pool.query(
            `
            INSERT INTO writings (id, title, slug, tags, created_at, last_updated)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            tags = VALUES(tags),
            created_at = VALUES(created_at),
            last_updated = VALUES(last_updated)`,
            [
                writing.id,
                writing.title,
                slugify(writing.title, { lower: true, remove: /[*+~.()'"!:@]/g }),
                JSON.stringify(writing.tags),
                new Date(writing.createdAt),
                new Date(writing.lastUpdated),
            ]
        );
    }

    const idsToDelete = dbIds.filter(id => !notionIds.includes(id));
    if (idsToDelete.length > 0) {
        await pool.query(
            `DELETE FROM writings WHERE id IN (${idsToDelete.map(() => '?').join(',')})`,
            idsToDelete
        );

        await pool.query(
            `DELETE FROM writing_content WHERE id IN (${idsToDelete.map(() => '?').join(',')})`,
            idsToDelete
        );

        console.log(`Deleted ${idsToDelete.length} writings not present in Notion.`);
    }
};

export const syncWritingContentToDB = async (idOrSlug: string) => {

    const [rows] = await pool.query(
        `SELECT id FROM writings WHERE id = ? OR slug = ?`,
        [idOrSlug, idOrSlug]
    ) as Array<RowDataPacket[]>;

    const writing = await fetchWritingFromNotionById(rows[0].id);

    await pool.query(
        `
        INSERT INTO writing_content (id, content)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
        content = VALUES(content)
        `,
        [writing.id, writing.content.parent]
    );

    console.log(`Content synced for writing: ${writing.id}`);
};

const syncAllWritingsContentToDB = async () => {
    const [rows] = await pool.query(
        `SELECT id FROM writings`
    ) as Array<RowDataPacket[]>;

    console.log(`Syncing content for ${rows.length} writings...`);

    for (const row of rows) {
        try {
            await syncWritingContentToDB(row.id);
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
};

const syncDatabase = async () => {
    try {
        await syncWritingsToDB();
        await syncAllWritingsContentToDB();
        await syncAllFactsToDB();
        console.log("Writings synced to DB successfully.");
    } catch (error) {
        console.error("Error syncing writings to DB:", error);
    }

};

if (require.main === module) {
    syncDatabase()
        .then(() => {
            console.log("Database sync completed.");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Error during database sync:", error);
            process.exit(1);
        });
}
