import { FactObject } from "./types";

export const fetchAllFacts = async () => {
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

    return allFacts;
};