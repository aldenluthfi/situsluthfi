import { Router } from "express";
import { getRandomFact, syncFacts } from "../../controllers/facts_controller";

const router = Router();

router.get("/", getRandomFact);
router.post("/sync", syncFacts);

export default router;
