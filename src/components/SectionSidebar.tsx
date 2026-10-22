import {
  coding_languages,
  hobbies,
  human_languages,
  nationalities,
  technical_skills,
} from "../data/manual_data";
import Chip from "./Chip";
import Icon from "./Icon";
import Level from "./Level";
import Title from "./Title";
import { useEffect, useRef, useState, type ReactNode } from "react";
import useSwipeDrawer from "../hooks/useSwipeDrawer";

const MOBILE_QUERY = "(max-width: 767px)";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Shared heading + indented body, so every sidebar block is spaced the same
function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <Title as="h2">{title}</Title>
      <div className="pl-2">{children}</div>
    </section>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Chip key={item}>{item}</Chip>
      ))}
    </div>
  );
}

function LevelList({
  items,
}: {
  items: { name: string; proficiency: number }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <Level
          key={item.name}
          title={item.name}
          currentLevel={item.proficiency}
          maxLevel={5}
        />
      ))}
    </div>
  );
}

export default function SideBar({ open, setOpen }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const tabRef = useRef<HTMLButtonElement>(null);

  useSwipeDrawer({ open, setOpen, drawerRef, backdropRef });

  // Only phones have a drawer; on wider screens the panel is always shown
  const [mobile, setMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches,
  );
  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const update = () => setMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const drawerOpen = mobile && open;
  const drawerClosed = mobile && !open;

  // Escape closes the open drawer and hands focus back to its tab
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      tabRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen, setOpen]);

  return (
    <>
      {/* Dithered screen behind the open drawer on phones; tap to close */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`
                md:hidden fixed inset-0 z-10
                bg-dither [--dither-a:rgb(20_21_24/0.6)] [--dither-b:rgb(20_21_24/0.6)]
                transition-[opacity,visibility] duration-200
                ${open ? "opacity-100 visible" : "opacity-0 invisible"}
            `}
      />

      <div
        ref={drawerRef}
        className={`
            z-20
            flex
            fixed
            w-fit
            hide-scrollbar

            h-dvh
            md:h-auto

            transition-transform
            duration-200
            ease-out
            ${open ? "translate-x-0" : "translate-x-[calc(-100%+40px)]"}
            md:translate-x-0
            md:relative

            pointer-events-none
            md:pointer-events-auto
        `}
      >
        {/* The wrapper is full height, so the strip under the tab would swallow
            taps meant for the backdrop or page; only the panel and tab take them */}
        {/* inert while the drawer is shut, so keyboard and screen readers
            skip the off-screen panel */}
        <aside
          id="sidebar"
          aria-label="Skills and profile"
          inert={drawerClosed}
          className={`md:w-80 xl:w-96 w-[90vw] h-full pointer-events-auto`}
        >
          {/* Focusable so keyboard users can scroll it; it has no links */}
          <div
            tabIndex={0}
            className="
            focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-ink dark:focus-visible:outline-brand-yellow
            flex flex-col gap-8
            w-full h-full overflow-y-auto
            p-6 xl:p-8
            bg-brand-yellow dark:bg-brand-grey
            border-r-2 border-border dark:border-brand-yellow
            text-text text-left
          "
          >
            <Block title="CODING LANGUAGES">
              <LevelList items={coding_languages} />
            </Block>

            <Block title="LANGUAGES">
              <LevelList items={human_languages} />
            </Block>

            <Block title="TECHNICAL SKILLS">
              <div className="flex flex-col gap-4">
                {technical_skills.map((category) => (
                  <div key={category.category} className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold">
                      {category.category}
                    </h3>
                    <ChipList items={category.skills} />
                  </div>
                ))}
              </div>
            </Block>

            <Block title="NATIONALITIES">
              <ChipList
                items={nationalities.map((nationality) => nationality.name)}
              />
            </Block>

            <Block title="INTERESTS">
              <ChipList items={hobbies.map((hobby) => hobby.name)} />
            </Block>
          </div>
        </aside>

        {/* Labeled pull tab: the drawer holds profile details, not site
            navigation, so a hamburger icon would promise the wrong thing */}
        <button
          ref={tabRef}
          type="button"
          onClick={() => setOpen(!open)}
          aria-controls="sidebar"
          aria-expanded={open}
          className="
            md:hidden self-start mt-4
            pointer-events-auto
            flex flex-col items-center gap-2
            w-10 py-3
            bg-brand-yellow text-ink border-ink
            dark:bg-brand-grey dark:text-brand-yellow dark:border-brand-yellow
            border-2 border-l-0
            shadow-[3px_3px_0_0_var(--brand-ink)]
            text-xs font-bold tracking-widest
            hover:cursor-pointer
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border
          "
        >
          <Icon
            name="chevron"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
          <span className="[writing-mode:vertical-rl]">
            {open ? "CLOSE" : "SKILLS"}
          </span>
          <span className="sr-only"> panel</span>
        </button>
      </div>
    </>
  );
}
