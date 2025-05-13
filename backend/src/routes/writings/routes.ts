import { Router } from "express";
import { getPaginatedWritings, getWritingById } from "../../controllers/writings_controller";

const router = Router();

router.get("/get_page", getPaginatedWritings);
router.get("/:id", getWritingById);

export default router;
