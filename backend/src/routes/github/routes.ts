import { Router } from "express";
import { getUserRepositories, getRepositoryByName, syncRepositories, getContributions } from "../../controllers/github_controller";

const router = Router();

router.get("/contributions", getContributions);
router.get("/repositories", getUserRepositories);
router.get("/repositories/sync", syncRepositories);
router.get("/repositories/:name", getRepositoryByName);

export default router;
