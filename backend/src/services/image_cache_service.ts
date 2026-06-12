import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const CACHE_DIR = path.join(__dirname, "../../assets/cached-images");

const NOTION_URL_REGEX = /https?:\/\/www\.notion\.so\/image\/[^\?)]+/g;

export type ImageCacheResult = {
    processedContent: string;
    cachedCount: number;
    failedCount: number;
};

export const extractNotionImageUrls = (content: string): string[] => {
    const urls: string[] = [];
    let match;
    while ((match = NOTION_URL_REGEX.exec(content)) !== null) {
        urls.push(match[0]);
    }
    NOTION_URL_REGEX.lastIndex = 0;
    return [...new Set(urls)];
};

const getExtensionFromContentType = (contentType: string | null): string => {
    const mapping: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/gif": ".gif",
        "image/webp": ".webp",
        "image/svg+xml": ".svg",
    };
    return mapping[contentType || ""] || ".jpg";
};

const generateImageFilename = (url: string, contentType: string | null): string => {
    const hash = crypto.createHash("md5").update(url).digest("hex");
    const ext = getExtensionFromContentType(contentType);
    return `${hash}${ext}`;
};

export const cacheImage = async (
    url: string,
    writingSlug: string
): Promise<{ localPath: string; filename: string } | null> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch image: ${url}, status: ${response.status}`);
            return null;
        }

        const contentType = response.headers.get("content-type");
        const buffer = await response.arrayBuffer();

        const writingCacheDir = path.join(CACHE_DIR, writingSlug);
        await fs.mkdir(writingCacheDir, { recursive: true });

        const filename = generateImageFilename(url, contentType);
        const localPath = path.join(writingCacheDir, filename);

        await fs.writeFile(localPath, Buffer.from(buffer));
        console.log(`Cached image: ${url} -> ${localPath}`);

        return { localPath, filename };
    } catch (error) {
        console.error(`Error caching image ${url}:`, error);
        return null;
    }
};

const replaceNotionUrlsWithLocal = (
    content: string,
    urlToFilename: Map<string, string>,
    writingSlug: string
): string => {
    return content.replace(NOTION_URL_REGEX, (match) => {
        const filename = urlToFilename.get(match);
        if (filename) {
            return `/api/images/${writingSlug}/${filename}`;
        }
        console.warn(`No local filename mapping found for URL: ${match}`);
        return match;
    });
};

export const processMarkdownImages = async (
    content: string,
    writingSlug: string
): Promise<ImageCacheResult> => {
    const urls = extractNotionImageUrls(content);

    if (urls.length === 0) {
        return { processedContent: content, cachedCount: 0, failedCount: 0 };
    }

    console.log(`Found ${urls.length} Notion image(s) in content for "${writingSlug}"`);

    const urlToFilename = new Map<string, string>();
    let cachedCount = 0;
    let failedCount = 0;

    for (const url of urls) {
        const result = await cacheImage(url, writingSlug);
        if (result) {
            urlToFilename.set(url, result.filename);
            cachedCount++;
        } else {
            failedCount++;
        }
    }

    const processedContent = replaceNotionUrlsWithLocal(content, urlToFilename, writingSlug);

    return { processedContent, cachedCount, failedCount };
};
