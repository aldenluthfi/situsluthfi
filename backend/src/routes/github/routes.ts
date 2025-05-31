import { Router } from "express";
import { getUserRepositories, getRepositoryByName } from "../../controllers/github_controller";

const router = Router();

router.get("/repositories", getUserRepositories);
router.get("/repositories/:name", getRepositoryByName);

export default router;
