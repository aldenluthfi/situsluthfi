import { staticFacts } from "../lib/facts_data";

export const getRandomFactService = async () => {
    const randomIndex = Math.floor(Math.random() * staticFacts.length);
    return staticFacts[randomIndex];
};
