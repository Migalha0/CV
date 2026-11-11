import Icon from "./Icon";
import { useEffect, useRef, useState } from "react";
import Title from "./Title";
import { useLanguage } from "../i18n/LanguageContext";

// Must match the ids passed to each section's Grid
const SECTIONS = [
  { id: "about", label: "aboutNav" },
  { id: "experience", label: "experienceNav" },
  { id: "projects", label: "projectsNav" },
] as const;

export default function RightRail() {
  const { t } = useLanguage();
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  // Set by a nav click and held until the visitor scrolls on their own, so the
  // smooth scroll (and short sections near the target) can't override the choice
  const lockedRef = useRef(false);

  useEffect(() => {
    let frame = 0;

    // A reading line slides from 30% down the screen (page top) to the bottom
    // edge (page end), and the current section is the last one above it. The
    // last section always wins at the end, even when it can't scroll to the top.
    const update = () => {
      frame = 0;
      if (lockedRef.current) return;

      const scroller = document.scrollingElement ?? document.documentElement;
      const maxScroll = scroller.scrollHeight - window.innerHeight;
      const progress =
        maxScroll > 0
          ? Math.min(1, Math.max(0, scroller.scrollTop / maxScroll))
          : 0;
      const line = window.innerHeight * (0.3 + 0.7 * progress);

      let current: string = SECTIONS[0].id;
      for (const { id } of SECTIONS) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= line) {
          current = id;
        }
      }

      setActive(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Only real input unlocks; a programmatic smooth scroll fires none of these.
    // A nav click's own mousedown/keydown unlocks too, but its click relocks.
    const unlock = () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;
      schedule();
    };
    const inputs = ["wheel", "touchstart", "mousedown", "keydown"] as const;

    // Projects load after mount and change the page's height
    const resizeObserver = new ResizeObserver(schedule);
    const projects = document.getElementById("projects");
    if (projects) resizeObserver.observe(projects);

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    inputs.forEach((type) =>
      window.addEventListener(type, unlock, { passive: true }),
    );

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      inputs.forEach((type) => window.removeEventListener(type, unlock));
    };
  }, []);

  const select = (id: string) => {
    setActive(id);
    lockedRef.current = true;
  };

  return (
    <aside
      aria-label={t.rail.navLabel}
      className="hidden 2xl:flex flex-col gap-8 sticky top-4 self-start w-52 shrink-0 text-left text-text"
    >
      <nav aria-label={t.rail.navLabel} className="flex flex-col gap-2">
        <Title as="h2">{t.rail.navTitle}</Title>
        <ul className="flex flex-col gap-1 pt-1">
          {SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => select(id)}
                aria-current={active === id ? "location" : undefined}
                className={`
                  flex items-center gap-2 px-1.5 py-0.5
                  focus-visible:outline-offset-0
                  text-[13px] font-bold uppercase
                  border-2
                  ${
                    active === id
                      ? "bg-brand-yellow text-ink border-ink"
                      : "border-transparent hover:border-border"
                  }
                `}
              >
                <Icon
                  name="pointer"
                  className={active === id ? "" : "invisible"}
                />
                {t.sections[label]}
              </a>
            </li>
          ))}
        </ul>
      </nav>

    </aside>
  );
}
