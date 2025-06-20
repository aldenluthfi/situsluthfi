export type WritingObject = {
    id: string;
    title: string;
    slug: string;
    tags: string[];
    createdAt: string;
    lastUpdated: string;
}

export type WritingContentObject = {
    content: string;
    id: string;
}

export type ThemeString = "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
export type ModeString = "light" | "dark" | "system" | "timezone";

export type RepositoryObject = {
    id: number;
    name: string;
    description: string | null;
    languages: Record<string, number>;
    stargazers_count: number;
    forks_count: number;
    topics: string[];
    created_at: string;
    updated_at: string;
    license: { key: string; name: string; url: string; node_id: string; spdx_id: string } | null;
    html_url: string;
    readme: string;
    cover_light_url?: string;
    cover_dark_url?: string;
    icon_map?: Record<string, string>;
}