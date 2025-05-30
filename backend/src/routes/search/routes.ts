import { Router } from "express";
import { searchUniversal, searchWritings, searchRepositories } from "../../controllers/search_controller";

const router = Router();

router.get("/", searchUniversal);
router.get("/writings", searchWritings);
router.get("/repositories", searchRepositories);

export default router;
