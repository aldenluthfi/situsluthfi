import { Request, Response } from "express";
import { generateCVPDFService, servePDFService } from "../services/pdf_service";

export const generateCVPDF = async (req: Request, res: Response) => {
    try {
        const { latexContent, filename, type, mode, theme } = req.body;

        if (!latexContent) {
            res.status(400).json({ error: "LaTeX content is required" });
            return;
        }

        const { pdfUrl, pdfFilePath } = await generateCVPDFService(latexContent, filename, type, mode, theme);

        res.json({ pdfUrl });

        setTimeout(async () => {
            try {
                const fs = await import("fs/promises");
                await fs.unlink(pdfFilePath);
                console.log(`Scheduled deletion completed for: ${pdfFilePath}`);
            } catch (deleteError) {
                console.error("Could not delete scheduled PDF file:", deleteError);
            }
        }, 2 * 60 * 60 * 1000);
    } catch (error) {
        console.error("Error generating PDF:", error);
        if (error instanceof Error && error.message.includes("LaTeX compilation failed")) {
            res.status(422).json({ error: "LaTeX compilation failed. Please check your content." });
        } else {
            res.status(500).json({ error: "Failed to generate PDF" });
        }
    }
};

export const servePDF = async (req: Request, res: Response) => {
    try {
        const { filename } = req.params;
        const { pdfBuffer, originalFilename } = await servePDFService(filename);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${originalFilename}"`);
        res.setHeader("Content-Length", pdfBuffer.length);

        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error serving PDF:", error);
        res.status(404).json({ error: "PDF not found" });
    }
};
