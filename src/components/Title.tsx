import type { ReactNode } from "react";

interface Props {
  url?: string;
  line?: boolean;
  as?: "h1" | "h2" | "h3" | "div";
  id?: string;
  children: ReactNode;
}

export default function Title({
  url,
  line = true,
  as: Tag = "div",
  id,
  children,
}: Props) {
  const urlStyle =
    "block text-ink bg-brand-yellow hover:bg-ink hover:text-brand-yellow hover:border-brand-grey dark:hover:border-transparent underline underline-offset-2 p-1 focus-visible:outline-ink dark:focus-visible:outline-brand-yellow";
  const nonUrlStyle = "text-text";

  const lineStyle = line ? "border-b-2 p-1 pb-0 dark:dotted-b" : "";

  // A linked title stays a heading for screen readers, with the link inside
  return url ? (
    <Tag id={id} className="font-bold text-left">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${lineStyle} ${urlStyle}`}
      >
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </Tag>
  ) : (
    <Tag id={id} className={`font-bold text-left ${lineStyle} ${nonUrlStyle}`}>
      {children}
    </Tag>
  );
}
