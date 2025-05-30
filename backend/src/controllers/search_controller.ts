import { Request, Response } from "express";
import { searchUniversalService, searchWritingsService, searchRepositoriesService } from "../services/search_service";

export const searchUniversal = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pagesize as string) || 10;

        if (!query) {
            res.status(400).json({ error: "Search query is required" });
            return;
        }

        const results = await searchUniversalService(query, page, pageSize);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in universal search:", error);
        if (error instanceof Error && error.message === "Search query is required") {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Failed to perform search" });
        }
    }
};

export const searchWritings = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pagesize as string) || 10;

        if (!query) {
            res.status(400).json({ error: "Search query is required" });
            return;
        }

        const results = await searchWritingsService(query, page, pageSize);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in writings search:", error);
        if (error instanceof Error && error.message === "Search query is required") {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Failed to search writings" });
        }
    }
};

export const searchRepositories = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pagesize as string) || 10;

        if (!query) {
            res.status(400).json({ error: "Search query is required" });
            return;
        }

        const results = await searchRepositoriesService(query, page, pageSize);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in repositories search:", error);
        if (error instanceof Error && error.message === "Search query is required") {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Failed to search repositories" });
        }
    }
};
