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

type IndexObject = {
    type: string;
}

export type WritingContentIndexObject = WritingObject & WritingContentObject & IndexObject;

export type GitHubRepository = {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    clone_url: string;
    ssh_url: string;
    languages_url: string;
    language: string | null;
    languages: Record<string, number>;
    stargazers_count: number;
    forks_count: number;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    private: boolean;
    fork: boolean;
    archived: boolean;
    disabled: boolean;
    topics: string[];
    default_branch: string;
    size: number;
    open_issues_count: number;
    homepage: string | null;
    license: {
        key: string;
        name: string;
        url: string | null;
    } | null;
    readme: string;
    cover_light_url?: string;
    cover_dark_url?: string;
};

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
};

export type RepositoryIndexObject = RepositoryObject & IndexObject;