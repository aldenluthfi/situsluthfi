import { Request, Response } from "express";
import { fetchWritingsService, getPaginatedWritingsService } from "../services/writings_service";

export const fetchWritings = async (_req: Request, res: Response) => {
  try {
    const result = await fetchWritingsService();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching writings:", error);
    res.status(500).json({ error: "Failed to retrieve database" });
  }
};

export const getPaginatedWritings = async (req: Request, res: Response) => {
  try {
    const pageSize = parseInt(req.query.pagesize as string, 10) || 10;
    const page = parseInt(req.query.page as string, 10) || 1;
    const result = await getPaginatedWritingsService(pageSize, page);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching paginated writings:", error);
    res.status(500).json({ error: "Failed to retrieve paginated writings" });
  }
};
