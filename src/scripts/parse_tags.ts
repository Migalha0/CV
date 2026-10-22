// Matches "#tag" only at the start of a word, so things like "C#" are left alone
const TAG_REGEX = /(^|\s)#([\w-]+)/g;

export function extractTags(description: string): { text: string; tags: string[] } {
    const tags = [...description.matchAll(TAG_REGEX)].map((match) => match[2]);

    const text = description
        .replace(TAG_REGEX, " ")
        .replace(/\s+/g, " ")
        .trim();

    return { text, tags };
}

export function hasTag(tags: string[], name: string): boolean {
    return tags.some((tag) => tag.toLowerCase() === name.toLowerCase());
}
