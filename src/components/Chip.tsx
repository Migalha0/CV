import type { CSSProperties, ReactNode } from "react";

interface Props {
  children: ReactNode;
  prefix?: string;
  // Yellow chip with a glasses-glare glint, for tags worth noticing (#AI)
  highlight?: boolean;
  // Seconds before the first glint, so highlighted chips don't flash in sync
  glareDelay?: number;
}

// One chip style for every list of skills, stacks and tags
export default function Chip({ children, prefix, highlight = false, glareDelay = 0 }: Props) {
  return (
    <span
      style={highlight ? ({ "--glare-delay": `${glareDelay}s` } as CSSProperties) : undefined}
      className={`
        inline-flex items-center
        w-fit max-w-full
        px-1.5 py-0.5
        border-2
        text-xs font-semibold text-left leading-snug
        ${highlight ? "glare bg-brand-yellow border-ink text-ink font-bold" : "bg-track border-line text-text"}
      `}
    >
      {prefix}
      {children}
    </span>
  );
}
