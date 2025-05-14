import { Router } from "express";
import { getPaginatedWritings, getWritingById, syncWritingById, syncWritings } from "../../controllers/writings_controller";

const router = Router();

router.get("/get_page", getPaginatedWritings);
router.get("/sync", syncWritings);
router.get("/sync/:id", syncWritingById);
router.get("/:id", getWritingById);

export default router;
