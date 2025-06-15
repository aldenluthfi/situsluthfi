import { Router } from "express";
import { generateCVPDF, servePDF } from "../../controllers/pdf_controller";

const router = Router();

router.post("/generate-cv", generateCVPDF);
router.get("/view/:filename", servePDF);

export default router;
