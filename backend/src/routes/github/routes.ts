import { Router } from "express";
import { getUserRepositories } from "../../controllers/github_controller";

const router = Router();

router.get("/repositories", getUserRepositories);

export default router;
