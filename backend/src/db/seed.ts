import { RowDataPacket } from "mysql2";
import { fetchAllWritingsFromNotion, fetchWritingContentFromNotionById } from "../external/notion";
import { fetchAllFacts } from "../external/facts";
import { fetchAllRepositories } from "../external/github";
import { indexWritingContentToES, deleteWritingContentFromES, indexRepositoryToES, deleteRepositoryFromES } from "../external/elasticsearch";
import { convert } from "html-to-text";
import removeMd from "remove-markdown";

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
                slugify(writing.title, { lower: true, remove: /[*+~.()""!:@?,]/g }),
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
            `DELETE FROM writing_content WHERE id IN (${idsToDelete.map(() => "?").join(",")})`,
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
            throw error;
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
        content: removeMd(convert(writingRow.content, { preserveNewlines: true })),
        title: writingRow.title,
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
            throw error;
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

    await pool.query(
        `
        WITH ranked_facts AS (
            SELECT
                id,
                ROW_NUMBER() OVER (PARTITION BY text, source ORDER BY id) AS rn
            FROM facts
        )
        DELETE FROM facts
        WHERE id IN (
            SELECT id FROM ranked_facts WHERE rn > 1
        );
        `
    );

    await pool.query(
        `SET @count = 0;
        UPDATE facts SET id = @count:= @count + 1;`
    );
};

export const syncRepositoriesToDB = async () => {
    const repositories = await fetchAllRepositories();

    console.log(`Syncing ${repositories.length} repositories...`);

    const [dbRows] = await pool.query(
        "SELECT id FROM repositories"
    ) as Array<RowDataPacket[]>;

    const dbIds = dbRows.map(row => row.id.toString());
    const newRepoIds = repositories.map(repo => repo.id.toString());

    for (const repo of repositories) {
        await pool.query(
            `
            INSERT INTO repositories (id, name, description, languages, stargazers_count, forks_count, topics, created_at, updated_at, license, html_url, readme, cover_light_url, cover_dark_url, icon_map)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            description = VALUES(description),
            languages = VALUES(languages),
            stargazers_count = VALUES(stargazers_count),
            forks_count = VALUES(forks_count),
            topics = VALUES(topics),
            updated_at = VALUES(updated_at),
            license = VALUES(license),
            html_url = VALUES(html_url),
            readme = VALUES(readme),
            cover_light_url = VALUES(cover_light_url),
            cover_dark_url = VALUES(cover_dark_url),
            icon_map = VALUES(icon_map)`,
            [
                repo.id,
                repo.name,
                repo.description,
                JSON.stringify(repo.languages),
                repo.stargazers_count,
                repo.forks_count,
                JSON.stringify(repo.topics),
                new Date(repo.created_at),
                new Date(repo.updated_at),
                JSON.stringify(repo.license),
                repo.html_url,
                repo.readme,
                repo.cover_light_url || null,
                repo.cover_dark_url || null,
                JSON.stringify(repo.icon_map || {}),
            ]
        );
    }

    const idsToDelete = dbIds.filter(id => !newRepoIds.includes(id));
    if (idsToDelete.length > 0) {
        await pool.query(
            `DELETE FROM repositories WHERE id IN (${idsToDelete.map(() => "?").join(",")})`,
            idsToDelete
        );

        for (const id of idsToDelete) {
            await deleteRepositoryFromES(id);
        }

        console.log(`Deleted ${idsToDelete.length} repositories not present in GitHub.`);
    }
};

export const indexAllRepositoriesToES = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM repositories"
    ) as Array<RowDataPacket[]>;

    console.log(`Indexing ${rows.length} repositories to Elasticsearch...`);

    for (const row of rows) {
        try {
            await indexRepositoryToES({
                id: row.id,
                name: row.name,
                description: row.description,
                topics: row.topics,
                readme: removeMd(convert(row.readme, { preserveNewlines: true })),
                html_url: row.html_url,
                type: "repository",
            });
        } catch (error) {
            console.error(`Error indexing repository ${row.name}:`, error);
            throw error;
        }
    }
};

const waitForConnection = async (maxRetries = 30, retryDelay = 2000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await pool.query("SELECT 1 FROM writings LIMIT 1");
            await pool.query("SELECT 1 FROM repositories LIMIT 1");
            await pool.query("SELECT 1 FROM facts LIMIT 1");
            await pool.query("SELECT 1 FROM writing_content LIMIT 1");

            console.log("Database connection established.");
            return;
        } catch {
            console.error(`Database connection attempt ${i + 1}/${maxRetries} failed. Retrying in ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
    throw new Error("Failed to connect to database after maximum retries");
};

const syncDatabase = async () => {
    try {
        await waitForConnection();
        await syncWritingsToDB();
        await syncAllWritingsContentToDB();
        await syncAllFactsToDB();
        await syncRepositoriesToDB();
        console.log("Data synced to DB successfully.");
        await indexAllWritingContentsToES();
        await indexAllRepositoriesToES();
        console.log("All data indexed to Elasticsearch successfully.");
    } catch (error) {
        console.error("Error syncing data to DB:", error);
        throw error;
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
