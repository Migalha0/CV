import { useRef, type ReactNode } from "react";
import ShaderStreaks from "./ShaderStreaks";

interface Props {
  id: string;
  title: string;
  busy?: boolean;
  children: ReactNode;
}

export default function Grid({ id, title, busy, children }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      aria-busy={busy || undefined}
      className="scroll-mt-4 border-l-4 border-border text-text flex flex-col gap-2 pl-2 pr-4 pb-4"
    >
      {/* The title sits straight on the paint, which is held solid yellow
          behind it and streams off to the right. The paint is yellow alone,
          so the row behind it gives the second colour in each theme */}
      <div className="relative flex bg-surface dark:bg-brand-grey border-b-2 border-border dark:dotted-b">
        <ShaderStreaks solidRef={titleRef} />
        <h2
          ref={titleRef}
          id={`${id}-title`}
          className="relative font-bold text-left text-ink px-2 p-1 pb-0"
        >
          {title}
        </h2>
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
