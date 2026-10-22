import type { ReactNode } from "react";
import Title from "./Title";

interface Props {
  id: string;
  title: string;
  children: ReactNode;
}

export default function Grid({ id, title, children }: Props) {
  return (
    <section id={id} className="scroll-mt-4 border-l-4 border-border text-text flex flex-col gap-2 pl-2 pr-4 pb-4">
      <Title as="h2">{title}</Title>
      <div
        className={`
                    bg-dots [--dots:var(--theme-grid-pattern)]
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
