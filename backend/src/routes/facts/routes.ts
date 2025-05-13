import { Router } from "express";
import { getRandomFact } from "../../controllers/facts_controller";

const router = Router();

router.get("/", getRandomFact);

export default router;
