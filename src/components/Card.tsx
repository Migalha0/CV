import Icon from "./Icon";
import { useEffect, useId, useState, type ReactNode } from "react";
import Title from "./Title";
import Chip from "./Chip";
import LinkButton from "./LinkButton";
import ShaderFrame from "./ShaderFrame";
import { hasTag } from "../scripts/parse_tags";

interface Props {
  url?: string;
  // GitHub repo name, used to look for a preview.* image in its root
  repo?: string;
  homepage?: string | null;
  language?: string | null;
  title_string: string;
  // Short line under the title, e.g. company and period
  meta?: ReactNode;
  description: string | ReactNode;
  // Plain chips (e.g. a job's stack); tags get a "#" prefix
  chips?: string[];
  tags?: string[];
}

const OWNER = "Migalha0";
const BRANCH = "master";
const EXTENSIONS = [".jpg", ".png", ".jpeg", ".webp", ".gif"];
// Screens with no hover, where the preview is simply shown open
const NO_HOVER_QUERY = "(hover: none)";

export default function Card({
  url,
  repo,
  homepage,
  language,
  title_string,
  meta,
  description,
  chips = [],
  tags = [],
}: Props) {
  // The preview opens while the mouse is over the card or focus is inside
  // it, so nothing needs a click; touch screens can't hover and always show it
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [noHover, setNoHover] = useState(
    () => window.matchMedia(NO_HOVER_QUERY).matches,
  );
  const open = hover || focused || noHover;
  const [extensionIndex, setExtensionIndex] = useState(0);
  const [imagePreview, setImagePreview] = useState(false);
  const previewId = useId();

  const imageUrl = repo
    ? `https://raw.githubusercontent.com/${OWNER}/${repo}/refs/heads/${BRANCH}/preview${EXTENSIONS[extensionIndex]}`
    : null;

  useEffect(() => {
    if (!imageUrl) return;

    let cancelled = false;

    const image = new Image();

    image.onload = () => {
      if (!cancelled) {
        setImagePreview(true);
      }
    };

    image.onerror = () => {
      if (cancelled) return;

      if (extensionIndex < EXTENSIONS.length - 1) {
        setExtensionIndex((index) => index + 1);
      }
    };

    image.src = imageUrl;

    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [imageUrl, extensionIndex]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(NO_HOVER_QUERY);
    const update = () => setNoHover(mediaQuery.matches);
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  // #AI cards show the shader through a transparent border instead of a solid frame
  const isAI = hasTag(tags, "AI");
  const allChips = [...(language ? [language] : []), ...chips];

  const card = (
    <article
      aria-labelledby={`${previewId}-title`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      className={`
                font-poppins flex flex-col gap-2
                w-full h-fit
                bg-surface
                border-3 border-solid
                ${isAI ? "border-transparent bg-clip-padding" : "border-border shadow-hard"}
                p-3 pb-4
            `}
    >
      <Title as="h3" url={url} id={`${previewId}-title`}>
        {title_string}
      </Title>

      {meta && (
        <p className="text-left text-sm font-semibold text-text mx-2">{meta}</p>
      )}

      {homepage && (
        <div className="flex flex-wrap items-center gap-2 mx-2">
          <LinkButton href={homepage}>
            LIVE DEMO <Icon name="external" />
          </LinkButton>
        </div>
      )}

      <div className="text-text text-left text-sm mx-2">{description}</div>

      {/* One frame holds both the hover hint and the screenshot. Opening,
          the hint folds shut until the frame is a single line, then the
          screenshot unfolds from that line; closing runs the same in reverse.
          The delays chain the two halves in whichever order applies */}
      {imagePreview && (
        <div
          className={`
                        w-full border-2 border-border border-solid
                    `}
        >
          {/* Hint that the card has a screenshot to hover for; not a control */}
          <div
            aria-hidden="true"
            className={`
                        grid
                        ${open ? "grid-rows-[0fr] delay-0" : "grid-rows-[1fr] delay-450"}
                        transition-[grid-template-rows]
                        duration-200 ease-in-out
                    `}
          >
            <div className="overflow-hidden">
              <div className="flex items-center justify-center gap-2 py-1 text-text text-xs font-bold tracking-widest">
                <Icon name="eye" size={16} />
                HOVER TO PREVIEW
              </div>
            </div>
          </div>

          <div
            className={`
                        grid items-start overflow-hidden
                        ${open ? "grid-rows-[1fr] delay-200" : "grid-rows-[0fr] delay-0"}
                        transition-[grid-template-rows]
                        duration-450 ease-in-out
                    `}
          >
            {/* inert while collapsed, so the hidden image isn't read out */}
            <div className="overflow-hidden" inert={!open}>
              <img
                src={imageUrl!}
                alt={`Screenshot of ${title_string}`}
                loading="lazy"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}

      {(allChips.length > 0 || tags.length > 0) && (
        <ul
          className="flex flex-wrap gap-1.5 mx-2"
          aria-label="Technologies and topics"
        >
          {allChips.map((chip) => (
            <li key={chip}>
              <Chip size="sm">{chip}</Chip>
            </li>
          ))}
          {tags.map((tag) => (
            <li key={tag}>
              <Chip size="sm" prefix="#">
                {tag}
              </Chip>
            </li>
          ))}
        </ul>
      )}
    </article>
  );

  return isAI ? <ShaderFrame>{card}</ShaderFrame> : card;
}
