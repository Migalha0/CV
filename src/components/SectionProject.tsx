import Icon from "./Icon";
import { useEffect, useState } from "react";

import Grid from "./Grid";
import Card from "./Card";

import {
  excluded_repos,
  featured_repos,
  personal_info,
} from "../data/manual_data";
import { getRepos } from "../scripts/github_scraper";
import { extractTags } from "../scripts/parse_tags";
import { useLanguage } from "../i18n/LanguageContext";

import type { Repository } from "../types/Repository";

// Featured repos first (in their listed order), then everything else by last push
function sortRepos(repos: Repository[]): Repository[] {
  const rank = (repo: Repository) => {
    const index = featured_repos.indexOf(repo.name);
    return index === -1 ? featured_repos.length : index;
  };

  return repos
    .filter((repo) => !repo.fork && !excluded_repos.includes(repo.name))
    .sort(
      (a, b) => rank(a) - rank(b) || b.pushed_at.localeCompare(a.pushed_at),
    );
}

// "UK_Crime_Map" -> "UK Crime Map"
function displayName(name: string) {
  return name.replace(/[_-]+/g, " ").trim();
}

function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="
        flex flex-col gap-3 w-full h-48 p-4
        bg-surface border-2 border-border shadow-hard
        animate-pulse motion-reduce:animate-none
      "
    >
      <div className="h-6 w-2/3 bg-track" />
      <div className="h-3 w-full bg-track" />
      <div className="h-3 w-5/6 bg-track" />
    </div>
  );
}

export default function SectionProject() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    let cancelled = false;

    async function fetchRepos() {
      try {
        const data = await getRepos();

        if (!cancelled) {
          setRepos(sortRepos(data));
        }
      } catch {
        if (!cancelled) {
          setError(true);
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
    return (
      <Grid id="projects" title={t.sections.projects} busy>
        <span role="status" className="sr-only">
          {t.projects.loading}
        </span>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid id="projects" title={t.sections.projects}>
        <div className="col-span-full flex flex-col gap-2 items-start text-left border-2 border-border p-4 bg-surface shadow-hard">
          <span className="font-bold">{t.projects.error}</span>
          <a
            href={personal_info.github}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {t.projects.seeOnGithub} <Icon name="external" />
            <span className="sr-only">{t.opensInNewTab}</span>
          </a>
        </div>
      </Grid>
    );
  }

  return (
    <Grid id="projects" title={t.sections.projects}>
      {repos.map((repo) => {
        const { text, tags } = extractTags(repo.description ?? "");

        return (
          <Card
            key={repo.id}
            url={repo.html_url}
            repo={repo.name}
            homepage={repo.homepage}
            language={repo.language}
            title_string={displayName(repo.name)}
            description={text}
            tags={tags}
          />
        );
      })}
    </Grid>
  );
}
