import pool from "../db/mysql";

export const getRandomFactFromDB = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM facts ORDER BY RAND() LIMIT 1"
    );

    if (Array.isArray(rows) && rows.length > 0) {
        return rows[0];
    }

    throw new Error("No facts found in database");
};
