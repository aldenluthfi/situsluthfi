import { Router } from "express";
import { fetchWritings, getPaginatedWritings } from "../../controllers/writings_controller";

const router = Router();

router.get("/fetch_all", fetchWritings);
router.get("/get_page", getPaginatedWritings);

export default router;
