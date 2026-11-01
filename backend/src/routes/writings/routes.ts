import { Router } from "express";
import { getPaginatedWritings, getWritingById, syncWritingById, syncWritings } from "../../controllers/writings_controller";

const router = Router();

router.get("/get_page", getPaginatedWritings);
router.get("/sync", syncWritings);
router.get("/sync/:slug", syncWritingById);
router.get("/:slug", getWritingById);

export default router;
