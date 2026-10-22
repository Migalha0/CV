import type { ReactNode } from "react";
import FireDither from "./FireDither";

interface Props {
  id: string;
  title: string;
  busy?: boolean;
  children: ReactNode;
}

export default function Grid({ id, title, busy, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      aria-busy={busy || undefined}
      className="scroll-mt-4 border-l-4 border-border text-text flex flex-col gap-2 pl-2 pr-4 pb-4"
    >
      {/* Yellow title block that burns off to the right in pixel flames */}
      <div className="flex bg-brand-grey dark:bg-surface border-b-2 border-border dark:dotted-b">
        <h2
          id={`${id}-title`}
          className="font-bold text-left text-ink bg-brand-yellow px-2 p-1 pb-0"
        >
          {title}
        </h2>
        {/* The name card's fire turned on its side, in yellow. Heat above 1
            keeps it solid where it meets the title, so it breaks up gradually,
            and it fades out across the whole width. Yellow barely shows on
            a light surface, so in light mode the row is dark behind it */}
        <div className="relative flex-1 overflow-clip">
          <FireDither
            direction="right"
            reach={1}
            heat={1.25}
            pulse={0.05}
            cell={1}
            className="text-brand-yellow [mask-image:linear-gradient(90deg,#000,#0000)]"
          />
        </div>
      </div>
      <div
        className={`
                    pt-2 pb-8 pr-2.5 items-start
                    grid
                    grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))]
                    gap-6
                    `}
      >
        {children}
      </div>
    </section>
  );
}
