import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  size?: "sm" | "md";
  prefix?: string;
}

export default function Chip({ children, size = "md", prefix }: Props) {
  return (
    <span
      className={`
        bg-dots
        flex items-center justify-center
        w-fit max-w-full
        text-left
        border-2 border-border
        font-bold text-text
        bg-chip
        ${size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-1.5 py-1"}
      `}
    >
      {prefix}
      {children}
    </span>
  );
}
