import { Request, Response } from "express";
import { getRandomFactService, syncFactsService } from "../services/facts_service";

export const getRandomFact = async (_req: Request, res: Response) => {
  try {
    const fact = await getRandomFactService();
    res.status(200).json(fact);
  } catch (error) {
    console.error("Error fetching random fact:", error);
    res.status(500).json({ error: "Failed to fetch facts" });
  }
};

export const syncFacts = async (_req: Request, res: Response) => {
  try {
    const result = await syncFactsService();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error syncing facts:", error);
    res.status(500).json({ error: "Failed to sync facts" });
  }
};
