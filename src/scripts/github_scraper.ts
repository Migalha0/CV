import type { Repository } from "../types/Repository";

const REPOS_URL = "https://api.github.com/users/Migalha0/repos?per_page=100";
const CACHE_KEY = "repos-cache";

// Unauthenticated GitHub API calls are limited to 60/hour, so reuse the
// response for the rest of the browser session
export async function getRepos(): Promise<Repository[]> {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {
    // Storage unavailable or corrupt, fall through to the network
  }

  const response = await fetch(REPOS_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }

  const repos: Repository[] = await response.json();

  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(repos));
  } catch {
    // Caching is best effort
  }

  return repos;
}
