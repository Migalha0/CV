export interface Repository {
    id: number;
    name: string;
    html_url: string;
    image_url: string | null;
    description: string | null;
}