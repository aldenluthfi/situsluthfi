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

export type WritingContentIndexObject = IndexObject & WritingContentObject & { title: string, slug: string, tags: string[] };

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
    owner: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: boolean;
    };
    readme: string;
    cover_light_url?: string;
    cover_dark_url?: string;
    icon_map?: Record<string, string>;
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
    icon_map?: Record<string, string>;
};

export type RepositoryIndexObject =  IndexObject & {
    id: number;
    name: string;
    description: string | null;
    topics: string[];
    readme: string;
    html_url: string;
};