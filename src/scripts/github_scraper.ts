import type { Repository } from "../types/Repository";

const REPOS_URL = "https://api.github.com/users/Migalha0/repos?per_page=100";
const CACHE_KEY = "repos-cache";
// Long enough to stay far below the rate limit, short enough that repo
// edits (descriptions, tags, homepages) show up without closing the tab
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CachedRepos {
  savedAt: number;
  repos: Repository[];
}

// Unauthenticated GitHub API calls are limited to 60/hour, so reuse the
// response for a few minutes instead of fetching on every load
export async function getRepos(): Promise<Repository[]> {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { savedAt, repos }: CachedRepos = JSON.parse(cached);
      // Entries from the old format have no savedAt and count as expired
      if (Array.isArray(repos) && Date.now() - savedAt < CACHE_TTL_MS) {
        return repos;
      }
    }
  } catch {
    // Storage unavailable or corrupt, fall through to the network
  }

  const response = await fetch(REPOS_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }

  const repos: Repository[] = await response.json();

  try {
    const entry: CachedRepos = { savedAt: Date.now(), repos };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Caching is best effort
  }

  // console.log(repos);
  return repos;
}

// getRepos();
