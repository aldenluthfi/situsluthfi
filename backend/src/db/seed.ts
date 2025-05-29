import { RowDataPacket } from "mysql2";
import { fetchAllWritingsFromNotion, fetchWritingContentFromNotionById } from "../external/notion";
import { fetchAllFacts } from "../external/facts";
import { indexWritingContentToES, deleteWritingContentFromES } from "../external/elasticsearch";

import slugify from "slugify";
import pool from "./mysql";

export const syncWritingsToDB = async () => {
    const notionData = await fetchAllWritingsFromNotion();

    console.log(`Syncing ${notionData.length} writings...`);

    const [dbRows] = await pool.query(
        "SELECT id FROM writings"
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
            `DELETE FROM writings WHERE id IN (${idsToDelete.map(() => "?").join(",")})`,
            idsToDelete
        );

        await pool.query(
            `DELETE FROM writing_content WHERE id IN (${idsToDelete.map(() => '?').join(',')})`,
            idsToDelete
        );

        for (const id of idsToDelete) {
            await deleteWritingContentFromES(id);
        }

        console.log(`Deleted ${idsToDelete.length} writings not present in Notion.`);
    }
};

export const syncWritingContentToDB = async (slug: string) => {

    const [[row]] = await pool.query(
        "SELECT id FROM writings WHERE slug = ?",
        [slug]
    ) as Array<RowDataPacket[]>;

    if (!row) {
        throw new Error(`Writing with slug "${slug}" not found.`);
    }

    const writing = await fetchWritingContentFromNotionById(row.id);

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
        "SELECT slug FROM writings"
    ) as Array<RowDataPacket[]>;

    console.log(`Syncing content for ${rows.length} writings...`);

    for (const row of rows) {
        try {
            await syncWritingContentToDB(row.slug);
        } catch (error) {
            console.error(`Error syncing content for writing ${row.slug}:`, error);
        }
    }
};

export const indexWritingContentToESBySlug = async (slug: string) => {
    const [[writingRow]] = await pool.query(
        `SELECT w.id, w.title, w.slug, w.tags, w.created_at, w.last_updated, wc.content
         FROM writings w
         LEFT JOIN writing_content wc ON w.id = wc.id
         WHERE w.slug = ?`,
        [slug]
    ) as Array<RowDataPacket[]>;

    if (!writingRow) {
        throw new Error(`Writing with slug "${slug}" not found.`);
    }

    await indexWritingContentToES({
        id: writingRow.id,
        content: writingRow.content,
        title: writingRow.title,
        slug: writingRow.slug,
        tags: writingRow.tags,
        last_updated: writingRow.last_updated,
        created_at: writingRow.created_at,
        type: "writing",
    });

    console.log(`Content indexed to ES for writing: ${writingRow.id}`);
};

export const indexAllWritingContentsToES = async () => {
    const [rows] = await pool.query(
        "SELECT slug FROM writings"
    ) as Array<RowDataPacket[]>;

    console.log(`Indexing content for ${rows.length} writings to Elasticsearch...`);

    for (const row of rows) {
        try {
            await indexWritingContentToESBySlug(row.slug);
        } catch (error) {
            console.error(`Error indexing content for writing ${row.slug}:`, error);
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
        await indexAllWritingContentsToES();
        console.log("All writings indexed to Elasticsearch successfully.");
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
