import { generatePDFFromLatex, getPDFFromFile } from "../repositories/pdf_repository";

const generateShortHash = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(6, "0").slice(0, 6);
};

export const generateCVPDFService = async (
    latexContent: string,
    filename?: string,
    type?: string,
    mode?: string,
    theme?: string
): Promise<{ pdfUrl: string; pdfFilePath: string }> => {
    if (!latexContent || latexContent.trim() === "") {
        throw new Error("LaTeX content is required");
    }

    const hashInput = `${type || "full"}-${mode || "system"}-${theme || "yellow"}`;
    const contentHash = generateShortHash(hashInput);
    const cleanFilename = filename || "cv";
    const urlSafeFilename = `${cleanFilename}-${contentHash}`;

    const { pdfFilePath } = await generatePDFFromLatex(latexContent, urlSafeFilename);
    const pdfUrl = `/api/pdf/view/${urlSafeFilename}.pdf`;

    return { pdfUrl, pdfFilePath };
};

export const servePDFService = async (filename: string): Promise<{ pdfBuffer: Buffer; originalFilename: string }> => {
    const baseFilename = filename.replace(/\.pdf$/, "");
    const originalFilename = baseFilename.replace(/-[a-f0-9]{6}$/, "") + ".pdf";
    const { pdfBuffer } = await getPDFFromFile(baseFilename);
    return { pdfBuffer, originalFilename };
};
