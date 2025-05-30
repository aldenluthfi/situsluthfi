import { Request, Response } from "express";
import { fetchUserRepositoriesService } from "../services/github_service";

export const getUserRepositories = async (req: Request, res: Response) => {
    try {
        const repositories = await fetchUserRepositoriesService();
        res.status(200).json({
            count: repositories.length,
            repositories
        });
    } catch (error) {
        console.error("Error fetching user repositories:", error);
        res.status(500).json({ error: "Failed to fetch repositories" });
    }
};
