import fetch from "node-fetch";
import pool from "../db/mysql";
import type { FactObject } from "../lib/types";

export const syncFactsToDB = async () => {
    const multiple = 100;
    const totalFacts = 2596;
    const totalPages = Math.ceil(totalFacts / multiple);
    let allFacts: FactObject[] = [];

    for (let page = 0; page < totalPages; page++) {

        const res = await fetch(`https://thefact.space/facts/${page}`);
        if (!res.ok) throw new Error(`Failed to fetch facts page ${page}`);

        const facts = await res.json() as FactObject;

        allFacts = allFacts.concat(facts);
    }

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

    return { inserted: allFacts.length };
};

export const getRandomFactFromDB = async () => {

    const [rows] = await pool.query(
        "SELECT * FROM facts ORDER BY RAND() LIMIT 1"
    );

    if (Array.isArray(rows) && rows.length === 0) {
        await syncFactsToDB();

        const [newRows] = await pool.query(
            "SELECT * FROM facts ORDER BY RAND() LIMIT 1"
        );

        if (Array.isArray(newRows) && newRows.length > 0) {
            return newRows[0];
        }
    }

    if (Array.isArray(rows) && rows.length > 0) {
        return rows[0];
    }

    throw new Error("No facts found in database");
};
