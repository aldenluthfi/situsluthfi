import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export const getPDFFromFile = async (filename: string): Promise<{ pdfBuffer: Buffer }> => {
    const tempDir = path.join(__dirname, "../../temp");
    const pdfFile = path.join(tempDir, `${filename}.pdf`);

    try {
        await fs.access(pdfFile);
        const pdfBuffer = await fs.readFile(pdfFile);
        return { pdfBuffer };
    } catch (error) {
        console.error("Error accessing PDF file:", error);
        throw new Error("PDF file not found");
    }
};

export const generatePDFFromLatex = async (latexContent: string, filename?: string): Promise<{ pdfFilePath: string }> => {
    const tempDir = path.join(__dirname, "../../temp");
    const fontsDir = path.join(tempDir, "fonts");
    const imagesDir = path.join(tempDir, "images");
    const timestamp = Date.now();
    const baseFilename = filename || `cv-${timestamp}`;
    const texFile = path.join(tempDir, `${baseFilename}.tex`);
    const pdfFile = path.join(tempDir, `${baseFilename}.pdf`);

    try {
        await fs.access(pdfFile);
        console.log(`PDF already exists: ${pdfFile}`);
        return { pdfFilePath: pdfFile };
    } catch (error) {
        console.error("PDF file does not exist, proceeding with generation:", error);
    }

    try {
        await fs.mkdir(tempDir, { recursive: true });
        await fs.mkdir(fontsDir, { recursive: true });
        await fs.mkdir(imagesDir, { recursive: true });

        const fontsSourceDir = path.join(__dirname, "../../assets/fonts");
        try {
            const fontFiles = await fs.readdir(fontsSourceDir);
            await Promise.all(
                fontFiles.map(async (fontFile) => {
                    const sourcePath = path.join(fontsSourceDir, fontFile);
                    const destPath = path.join(fontsDir, fontFile);
                    await fs.copyFile(sourcePath, destPath);
                })
            );
        } catch (fontError) {
            console.error("Could not copy fonts:", fontError);
        }

        const imagesSourceDir = path.join(__dirname, "../../assets/images");
        try {
            const imageFiles = await fs.readdir(imagesSourceDir);
            await Promise.all(
                imageFiles.map(async (imageFile) => {
                    const sourcePath = path.join(imagesSourceDir, imageFile);
                    const destPath = path.join(imagesDir, imageFile);
                    await fs.copyFile(sourcePath, destPath);
                })
            );
        } catch (imageError) {
            console.error("Could not copy images:", imageError);
        }

        const adjustedLatexContent = latexContent
            .replace(/Path=\.\.\/fonts\//g, `Path=${fontsDir}/`)
            .replace(/\{\.\.\/images\//g, `{${imagesDir}/`);

        await fs.writeFile(texFile, adjustedLatexContent, "utf8");

        const command = `cd "${tempDir}" && xelatex -interaction=nonstopmode -output-directory="${tempDir}" "${texFile}"`;

        try {
            await execAsync(command);
        } catch (compileError) {
            const logFile = path.join(tempDir, `${baseFilename}.log`);
            let errorDetails = "";
            try {
                const logContent = await fs.readFile(logFile, "utf8");
                const errorMatch = logContent.match(/!(.*?)(?=\n\n|\n$)/s);
                if (errorMatch) {
                    errorDetails = errorMatch[1].trim();
                }
            } catch (logError) {
                console.error("Could not read log file:", logError);
            }

            const error = new Error(`LaTeX compilation failed: ${errorDetails || compileError}`);
            console.error("LaTeX compilation error:", error);
            throw error;
        }

        try {
            await fs.access(pdfFile);
        } catch (accessError) {
            const error = new Error("PDF file was not generated successfully");
            console.error("PDF access error:", accessError);
            throw error;
        }

        const filesToClean = [
            texFile,
            path.join(tempDir, `${baseFilename}.aux`),
            path.join(tempDir, `${baseFilename}.log`),
            path.join(tempDir, `${baseFilename}.out`),
        ];

        try {
            await fs.rm(fontsDir, { recursive: true, force: true });
            await fs.rm(imagesDir, { recursive: true, force: true });
        } catch (cleanupError) {
            console.error("Could not clean up directories:", cleanupError);
        }

        await Promise.all(
            filesToClean.map(file =>
                fs.unlink(file).catch((unlinkError) => {
                    console.error(`Could not clean up file ${file}:`, unlinkError);
                })
            )
        );

        return { pdfFilePath: pdfFile };
    } catch (error) {
        console.error("PDF generation error:", error);
        try {
            await fs.unlink(texFile).catch(() => {});
            await fs.unlink(pdfFile).catch(() => {});
            await fs.rm(fontsDir, { recursive: true, force: true }).catch(() => {});
            await fs.rm(imagesDir, { recursive: true, force: true }).catch(() => {});
        } catch (finalCleanupError) {
            console.error("Final cleanup error:", finalCleanupError);
        }

        throw error;
    }
};
