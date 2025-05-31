import { Router } from "express";
import { getUserRepositories, getRepositoryById } from "../../controllers/github_controller";

const router = Router();

router.get("/repositories", getUserRepositories);
router.get("/repositories/:id", getRepositoryById);

export default router;
