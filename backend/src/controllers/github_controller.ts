import { Request, Response } from "express";
import { fetchUserRepositoriesService, fetchRepositoryByIdService } from "../services/github_service";

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

export const getRepositoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const repository = await fetchRepositoryByIdService(parseInt(id));
        
        if (!repository) {
            res.status(404).json({ error: "Repository not found" });
            return;
        }
        
        res.status(200).json(repository);
    } catch (error) {
        console.error("Error fetching repository:", error);
        res.status(500).json({ error: "Failed to fetch repository" });
    }
};
