import pool from "./mysql";
import { clearWritingsIndex, clearRepositoriesIndex } from "../external/elasticsearch";
import { indexAllWritingContentsToES, indexAllRepositoriesToES } from "./seed";

const deduplicateFacts = async () => {
    const [{ affectedRows }] = await pool.query(`
        DELETE f1 FROM facts f1
        INNER JOIN facts f2
        WHERE f1.id > f2.id AND f1.text = f2.text AND f1.source = f2.source
    `) as Array<{ affectedRows: number }>;

    if (affectedRows > 0) {
        console.log(`Removed ${affectedRows} duplicate facts.`);
    } else {
        console.log("No duplicate facts found.");
    }
};

const removeOrphanedWritingContent = async () => {
    const [{ affectedRows }] = await pool.query(`
        DELETE wc FROM writing_content wc
        LEFT JOIN writings w ON wc.id = w.id
        WHERE w.id IS NULL
    `) as Array<{ affectedRows: number }>;

    if (affectedRows > 0) {
        console.log(`Removed ${affectedRows} orphaned writing_content records.`);
    } else {
        console.log("No orphaned writing_content found.");
    }
};

const reindexElasticsearch = async () => {
    console.log("Clearing Elasticsearch indices...");
    await clearWritingsIndex();
    await clearRepositoriesIndex();

    console.log("Re-indexing from database...");
    await indexAllWritingContentsToES();
    await indexAllRepositoriesToES();
    console.log("Elasticsearch re-index complete.");
};

const cleanup = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("Database connection established.");

        await deduplicateFacts();
        await removeOrphanedWritingContent();
        await reindexElasticsearch();

        console.log("Cleanup complete.");
    } catch (error) {
        console.error("Cleanup failed:", error);
        throw error;
    }
};

if (require.main === module) {
    cleanup()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
