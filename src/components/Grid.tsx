import type { ReactNode } from "react";

interface Props {
  id: string;
  title: string;
  busy?: boolean;
  // "cards" fills the row with fixed-min-width cards; "list" is one column
  layout?: "cards" | "list";
  children: ReactNode;
}

// A page section: the template's yellow heading strip over its content
export default function Grid({ id, title, busy, layout = "cards", children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      aria-busy={busy || undefined}
      className="scroll-mt-4 flex flex-col gap-4 pb-10 text-text"
    >
      <h2
        id={`${id}-title`}
        className="px-2.5 py-1 bg-brand-yellow text-ink border-2 border-ink font-bold text-left"
      >
        {title}
      </h2>
      <div
        // pr/pb leave room for the cards' 6px shadow
        className={`
          grid gap-5 pr-1.5 pb-1.5
          ${layout === "list" ? "grid-cols-1" : "grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))]"}
        `}
      >
        {children}
      </div>
    </section>
  );
}
