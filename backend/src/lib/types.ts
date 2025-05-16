export type FactObject = {
    text: string;
    source: string;
};

export type WritingObject = {
    id: string;
    title: string;
    slug: string;
    tags: string[];
    created_at: string;
    last_updated: string;
};

export type WritingContentObject = {
    id: string;
    content: string;
};