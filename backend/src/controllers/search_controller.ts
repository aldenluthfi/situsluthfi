import { Request, Response } from "express";
import { parseSearchFilter, searchService } from "../services/search_service";

export const search = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pagesize as string) || 10;
        const filter = parseSearchFilter(req.query.filter);

        if (!query) {
            res.status(400).json({ error: "Search query is required" });
            return;
        }

        if (!filter) {
            res.status(400).json({ error: "filter must be a comma-separated list of: repos, writings" });
            return;
        }

        const results = await searchService(query, filter, page, pageSize);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in search:", error);
        res.status(500).json({ error: "Failed to perform search" });
    }
};
