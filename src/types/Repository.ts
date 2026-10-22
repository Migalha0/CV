export interface Repository {
    id: number;
    name: string;
    html_url: string;
    homepage: string | null;
    description: string | null;
    language: string | null;
    fork: boolean;
    stargazers_count: number;
    pushed_at: string;
}
