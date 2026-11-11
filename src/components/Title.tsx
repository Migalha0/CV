import type { ReactNode } from "react";

interface Props {
  as?: "h2" | "h3" | "div";
  id?: string;
  children: ReactNode;
}

// Small uppercase label over a 2px rule, the template's group heading
export default function Title({ as: Tag = "div", id, children }: Props) {
  return (
    <Tag
      id={id}
      className="text-[11px] font-bold uppercase tracking-[0.06em] text-left text-text border-b-2 border-border pb-1"
    >
      {children}
    </Tag>
  );
}
