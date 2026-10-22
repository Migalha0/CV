import { useEffect, useState, type ReactNode } from "react";
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
  description: string | ReactNode;
  tags?: string[];
}

const OWNER = "Migalha0";
const BRANCH = "master";
const EXTENSIONS = [".jpg", ".png", ".jpeg", ".webp", ".gif"];

export default function Card({
  url,
  repo,
  homepage,
  language,
  title_string,
  description,
  tags = [],
}: Props) {
  const [hover, setHover] = useState(false);
  // Click/keyboard toggle, so the preview also works on touch screens
  const [expanded, setExpanded] = useState(false);
  const open = hover || expanded;
  const [extensionIndex, setExtensionIndex] = useState(0);
  const [imagePreview, setImagePreview] = useState(false);

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

  // #AI cards show the shader through a transparent border instead of a solid frame
  const isAI = hasTag(tags, "AI");

  const card = (
    <div
      className={`
                font-poppins flex flex-col gap-2
                w-full h-fit
                bg-surface
                border-3 border-solid
                ${isAI ? "border-transparent bg-clip-padding" : "border-border shadow-hard"}
                p-3 pb-4
                ${imagePreview ? "cursor-pointer md:cursor-auto" : ""}
            `}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      // Touch has no hover, so a tap anywhere on the card toggles the preview
      onClick={(e) => {
        const pointerType = (e.nativeEvent as PointerEvent).pointerType;
        if (!imagePreview || pointerType === "mouse") return;
        if ((e.target as Element).closest("a,button")) return;
        setExpanded((value) => !value);
      }}
    >
      <Title url={url}>{title_string}</Title>

      {homepage && (
        <div className="flex flex-wrap items-center gap-2 mx-2">
          {homepage && <LinkButton href={homepage}>LIVE DEMO ↗</LinkButton>}
        </div>
      )}

      <div className="text-text text-left text-sm mx-2">{description}</div>

      {imagePreview && (
        <button
          type="button"
          aria-expanded={open}
          aria-label={`${open ? "Hide" : "Show"} preview of ${title_string}`}
          className={`
                        w-6 flex items-center justify-center
                        select-none overflow-hidden
                        border-border border-solid
                        transition-[height,background-color]
                        duration-[400ms,175ms]
                        text-text font-bold
                        ${open ? "h-0 border bg-border" : "h-6 border-2"}
                    `}
        >
          V
        </button>
      )}

      {imagePreview && (
        <div
          className={`
                        grid items-start
                        border border-border w-full
                        ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                        overflow-hidden
                        transition-[grid-template-rows,border-color,background-color]
                        duration-[450ms,0ms,0ms]
                    `}
        >
          <div className="overflow-hidden">
            <img
              src={imageUrl!}
              alt={`Preview of ${title_string}`}
              loading="lazy"
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      <div className="flex">
        {language && <Chip size="sm">{language}</Chip>}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mx-2">
            {tags.map((tag) => (
              <Chip key={tag} size="sm" prefix="#">
                {tag}
              </Chip>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return isAI ? <ShaderFrame>{card}</ShaderFrame> : card;
}
