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
import { useLanguage } from "../i18n/LanguageContext";
import { tr, type Text } from "../i18n/language";

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
      <div>{children}</div>
    </section>
  );
}

function ChipList({ items }: { items: Text[] }) {
  const { lang } = useLanguage();
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => {
        const label = tr(item, lang);
        return <Chip key={label}>{label}</Chip>;
      })}
    </div>
  );
}

function LevelList({
  items,
}: {
  items: { name: Text; proficiency: number }[];
}) {
  const { lang } = useLanguage();
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item) => (
        <Level
          key={tr(item.name, lang)}
          title={tr(item.name, lang)}
          currentLevel={item.proficiency}
          maxLevel={5}
        />
      ))}
    </div>
  );
}

export default function SideBar({ open, setOpen }: Props) {
  const { lang, t } = useLanguage();
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
                bg-ink/60
                transition-[opacity,visibility] duration-200
                ${open ? "opacity-100 visible" : "opacity-0 invisible"}
            `}
      />

      <div
        ref={drawerRef}
        className={`
            z-20
            flex
            fixed top-0 left-0
            w-fit
            hide-scrollbar

            h-dvh
            md:self-start

            transition-transform
            duration-200
            ease-out
            ${open ? "translate-x-0" : "translate-x-[calc(-100%+40px)]"}
            md:translate-x-0
            md:sticky

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
          aria-label={t.sidebar.label}
          inert={drawerClosed}
          className={`md:w-80 xl:w-96 w-[90vw] h-full pointer-events-auto`}
        >
          {/* Focusable so keyboard users can scroll it; it has no links */}
          <div
            tabIndex={0}
            className="
            focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-text
            flex flex-col gap-7
            w-full h-full overflow-y-auto
            p-5 xl:p-6
            bg-surface
            border-r-2 border-border
            text-text text-left
          "
          >
            <Block title={t.sidebar.codingLanguages}>
              <LevelList items={coding_languages} />
            </Block>

            <Block title={t.sidebar.languages}>
              <LevelList items={human_languages} />
            </Block>

            <Block title={t.sidebar.technicalSkills}>
              <div className="flex flex-col gap-4">
                {technical_skills.map((category) => (
                  <div key={tr(category.category, lang)} className="flex flex-col gap-2">
                    <h3 className="text-[13px] font-semibold text-text-2">
                      {tr(category.category, lang)}
                    </h3>
                    <ChipList items={category.skills} />
                  </div>
                ))}
              </div>
            </Block>

            <Block title={t.sidebar.nationalities}>
              <ChipList
                items={nationalities.map((nationality) => nationality.name)}
              />
            </Block>

            <Block title={t.sidebar.interests}>
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
            md:hidden self-center
            pointer-events-auto
            flex flex-col items-center gap-2
            w-10 py-3
            bg-brand-yellow text-ink border-ink
            border-2 border-l-0
            shadow-hard-sm
            text-[11px] font-bold uppercase tracking-[0.06em]
            hover:cursor-pointer
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text
          "
        >
          <Icon
            name="chevron"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
          <span className="[writing-mode:vertical-rl]">
            {open ? t.sidebar.close : t.sidebar.open}
          </span>
          <span className="sr-only">{t.sidebar.panel}</span>
        </button>
      </div>
    </>
  );
}
