import { Router } from "express";
import factsRouter from "./facts/routes";
import writingsRouter from "./writings/routes";
import githubRouter from "./github/routes";
import searchRouter from "./search/routes";
import pdfRouter from "./pdf/routes";

const router = Router();

router.use("/facts", factsRouter);
router.use("/writings", writingsRouter);
router.use("/github", githubRouter);
router.use("/search", searchRouter);
router.use("/pdf", pdfRouter);

export default router;
