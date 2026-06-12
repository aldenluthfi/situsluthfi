import { Router, Request, Response } from "express";
import { promises as fs } from "fs";
import path from "path";

const router = Router();
const CACHE_DIR = path.join(__dirname, "../../assets/cached-images");

router.get("/:slug/:filename", async (req: Request, res: Response) => {
    const { slug, filename } = req.params;

    if (filename.includes("..") || slug.includes("..")) {
        res.status(400).json({ error: "Invalid filename" });
        return;
    }

    const imagePath = path.join(CACHE_DIR, slug, filename);

    try {
        await fs.access(imagePath);
        res.sendFile(imagePath);
    } catch {
        res.status(404).json({ error: "Image not found" });
    }
});

export default router;