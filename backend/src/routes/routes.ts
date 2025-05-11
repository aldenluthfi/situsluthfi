import { Router } from "express";
import factsRouter from "./facts/routes";
import writingsRouter from "./writings/routes";

const router = Router();

router.use("/facts", factsRouter);
router.use("/writings", writingsRouter);

export default router;
