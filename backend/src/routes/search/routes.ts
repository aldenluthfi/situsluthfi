import { Router } from "express";
import { search } from "../../controllers/search_controller";

const router = Router();

router.get("/", search);

export default router;
