import { Router } from "express";
import { getPaginatedWritings, getWritingById, syncWritingById, syncWritings } from "../../controllers/writings_controller";

const router = Router();

router.get("/get_page", getPaginatedWritings);
router.get("/sync", syncWritings);
router.get("/sync/:idOrSlug", syncWritingById);
router.get("/:idOrSlug", getWritingById);

export default router;
