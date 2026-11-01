import { Request, Response } from "express";
import { getPaginatedWritingsService, getWritingByIdService, syncWritingByIdService, syncWritingsService } from "../services/writings_service";

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

export const getWritingById = async (req: Request, res: Response) => {
    try {
        const slug = req.params.slug;
        const result = await getWritingByIdService(slug);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching writing by ID:", error);
        res.status(500).json({ error: "Failed to retrieve writing" });
    }
};

export const syncWritingById = async (req: Request, res: Response) => {
    try {
        const slug = req.params.slug;
        await syncWritingByIdService(slug);
        res.status(200).json({ message: "Writing content synced successfully" });
    } catch (error) {
        console.error("Error syncing writing by ID:", error);
        res.status(500).json({ error: "Failed to sync writing content" });
    }
};

export const syncWritings = async (req: Request, res: Response) => {
    try {
        await syncWritingsService();
        res.status(200).json({ message: "All writings synced successfully" });
    } catch (error) {
        console.error("Error syncing all writings:", error);
        res.status(500).json({ error: "Failed to sync all writings" });
    }
};
