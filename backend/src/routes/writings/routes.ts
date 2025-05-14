import { Router } from "express";
import { getPaginatedWritings, getWritingById, syncWritingById } from "../../controllers/writings_controller";

const router = Router();

router.get("/get_page", getPaginatedWritings);
router.get("/:id", getWritingById);
router.get("/sync/:id", syncWritingById);

export default router;
