import { useEffect, useState } from "react";

import Grid from "./Grid";
import Card from "./Card";

import { excluded_repos } from "../data/manual_data";
import { getRepos } from "../scripts/github_scraper";

import type { Repository } from "../types/Repository";

export default function SectionProject() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRepos() {
      try {
        const data = await getRepos();

        if (!cancelled) {
          setRepos(data);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load repositories from GitHub.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchRepos();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <Grid title="PROJECTS">Loading projects...</Grid>;
  }

  if (error) {
    return <Grid title="PROJECTS">{error}</Grid>;
  }

  return (
    <Grid title="PROJECTS">
      {repos
        .filter((repo) => !excluded_repos.includes(repo.name))
        .map((repo) => (
          <Card
            key={repo.id}
            url={repo.html_url}
            title_string={repo.name}
            description={repo.description ?? ""}
          />
        ))}
    </Grid>
  );
}