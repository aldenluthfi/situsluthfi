export type FactObject = {
    text: string;
    source: string;
};

export type WritingObject = {
    id: string;
    title: string;
    tags: string[];
    createdAt: string;
    lastUpdated: string;
};

export type WritingContentObject = {
    id: string;
    title: string;
    content: string;
    created_at: string;
    last_updated: string;
    last_synced: string;
};