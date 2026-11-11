import Icon from "./Icon";
import { useEffect, useId, useState, type ReactNode } from "react";
import Chip from "./Chip";
import LinkButton from "./LinkButton";
import ShaderFrame from "./ShaderFrame";
import { hasTag } from "../scripts/parse_tags";
import { useLanguage } from "../i18n/LanguageContext";

interface Props {
  url?: string;
  // GitHub repo name, used to look for a preview.* image in its root
  repo?: string;
  homepage?: string | null;
  language?: string | null;
  title_string: string;
  // Short line under the title, e.g. the company
  meta?: ReactNode;
  // Right-aligned beside the title on wider cards, e.g. a job's dates
  aside?: ReactNode;
  description: string | ReactNode;
  // Plain chips (e.g. a job's stack); tags get a "#" prefix
  chips?: string[];
  tags?: string[];
}

const OWNER = "Migalha0";
// HEAD resolves to each repo's default branch, whether it's main or master
const REF = "HEAD";
const EXTENSIONS = [".jpg", ".png", ".jpeg", ".webp", ".gif"];

// Finds the repo's preview image by trying each extension in turn; null
// until one loads, and stays null when the repo has none
function usePreviewImage(repo?: string) {
  const [extensionIndex, setExtensionIndex] = useState(0);
  const [found, setFound] = useState<string | null>(null);

  const candidate = repo
    ? `https://raw.githubusercontent.com/${OWNER}/${repo}/${REF}/preview${EXTENSIONS[extensionIndex]}`
    : null;

  useEffect(() => {
    if (!candidate) return;

    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (!cancelled) setFound(candidate);
    };
    image.onerror = () => {
      if (!cancelled && extensionIndex < EXTENSIONS.length - 1) {
        setExtensionIndex((index) => index + 1);
      }
    };
    image.src = candidate;

    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [candidate, extensionIndex]);

  return found;
}

export default function Card({
  url,
  repo,
  homepage,
  language,
  title_string,
  meta,
  aside,
  description,
  chips = [],
  tags = [],
}: Props) {
  const { t } = useLanguage();
  const titleId = useId();
  const image = usePreviewImage(repo);

  // #AI cards show the shader through a transparent border and as their shadow
  const isAI = hasTag(tags, "AI");
  // A per-card offset, so the #AI glints across the page don't fire together
  const glareDelay =
    ([...title_string].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 40) / 10;
  const allChips = [...(language ? [language] : []), ...chips];
  const hasActions = Boolean(homepage || url);

  const card = (
    <article
      aria-labelledby={titleId}
      className={`
        flex flex-col h-full
        bg-surface text-text text-left
        border-2
        ${isAI ? "border-transparent bg-clip-padding" : "border-border shadow-hard"}
      `}
    >
      {image && (
        <img
          src={image}
          alt={t.card.screenshotOf(title_string)}
          loading="lazy"
          className="block w-full aspect-video object-cover object-top border-b-2 border-border"
        />
      )}

      <div className="flex flex-col gap-3 flex-1 p-4">
        <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <div className="flex flex-col gap-0.5">
            <h3 id={titleId} className="text-[17px] font-bold leading-snug">
              {title_string}
            </h3>
            {meta && <p className="text-[13px] font-semibold text-text-2">{meta}</p>}
          </div>
          {aside && <p className="font-mono text-[13px] text-text-2 whitespace-nowrap">{aside}</p>}
        </header>

        {description && <div className="text-sm leading-relaxed">{description}</div>}

        {(allChips.length > 0 || tags.length > 0) && (
          <ul className="flex flex-wrap gap-1.5" aria-label={t.card.technologies}>
            {allChips.map((chip) => (
              <li key={chip}>
                <Chip>{chip}</Chip>
              </li>
            ))}
            {tags.map((tag) => (
              <li key={tag}>
                <Chip
                  prefix="#"
                  highlight={hasTag([tag], "AI")}
                  glareDelay={glareDelay}
                >
                  {tag}
                </Chip>
              </li>
            ))}
          </ul>
        )}

        {/* Pinned to the bottom, so actions line up across a row of cards */}
        {hasActions && (
          <div className="flex flex-wrap items-center gap-2 mt-auto pt-2">
            {homepage && (
              <LinkButton href={homepage}>
                {t.card.liveDemo} <Icon name="external" />
              </LinkButton>
            )}
            {url && (
              <LinkButton href={url} label={t.card.onGithub(title_string)}>
                <Icon name="github" /> {t.contact.github} <Icon name="external" />
              </LinkButton>
            )}
          </div>
        )}
      </div>
    </article>
  );

  return isAI ? <ShaderFrame>{card}</ShaderFrame> : card;
}
