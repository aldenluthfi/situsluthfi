import { Client, isFullPage } from "@notionhq/client";
import {
    CreatedTimePropertyItemObjectResponse,
    LastEditedTimePropertyItemObjectResponse,
    MultiSelectPropertyItemObjectResponse,
    PageObjectResponse,
    RichTextItemResponse
} from "@notionhq/client/build/src/api-endpoints";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const notionToMarkdown = new NotionToMarkdown({ notionClient: notion });

export const fetchAllWritingsFromNotion = async () => {
    const database = await notion.databases.query({
        database_id: process.env.NOTION_WRITINGS_DATABASE_ID as string,
        filter: {
            property: "Tema",
            multi_select: {
                does_not_contain: "Unpublished",
            }
        },
        sorts: [
            {
                property: "Dibuat Pada",
                direction: "descending",
            }
        ]
    });

    const results = database.results
        .filter(isFullPage)
        .filter((page: PageObjectResponse) => !page.archived && !page.in_trash)
        .map((page: PageObjectResponse) => {
            const title = (
                page.properties.Judul as
                { type: "title"; title: Array<RichTextItemResponse> }
            ).title[0].plain_text;
            const tags = (
                page.properties.Tema as
                MultiSelectPropertyItemObjectResponse
            ).multi_select.map((tag) => tag.name);
            const createdAt = (
                page.properties["Dibuat Pada"] as
                CreatedTimePropertyItemObjectResponse
            ).created_time
            const lastUpdated = (
                page.properties["Suntingan Terakhir"] as
                LastEditedTimePropertyItemObjectResponse
            ).last_edited_time;
            return {
                id: page.id,
                title: title,
                tags: tags,
                createdAt: createdAt,
                lastUpdated: lastUpdated,
            };
        });

    return results;
};

export const fetchWritingFromNotionById = async (id: string) => {
    const page = await notionToMarkdown.pageToMarkdown(id);
    const markdownString = notionToMarkdown.toMarkdownString(page);

    return {
        id: id,
        content: markdownString,
    }
};
