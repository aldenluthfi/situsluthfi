import { Router } from "express";
import { getUserRepositories, getRepositoryByName, syncRepositories } from "../../controllers/github_controller";

const router = Router();

router.get("/repositories", getUserRepositories);
router.get("/repositories/sync", syncRepositories);
router.get("/repositories/:name", getRepositoryByName);

export default router;
