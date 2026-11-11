import type { Dispatch, SetStateAction } from "react";
import type { Theme } from "../types/Theme";
import { personal_info } from "../data/manual_data";
import { useLanguage } from "../i18n/LanguageContext";
import { tr } from "../i18n/language";
import DarkButton from "./DarkButton";
import Icon from "./Icon";
import LanguageButton from "./LanguageButton";
import LinkButton from "./LinkButton";

interface Props {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
}

// Every control in the bar shares the flag toggle's height
const HEIGHT = "h-8.5 min-w-8.5";

// App bar: name chip and headline on the left, the main links and site
// settings on the right. Button labels drop to icons on phones
export default function Header({ theme, setTheme }: Props) {
  const { lang, t } = useLanguage();

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 bg-surface border-b-2 border-border">
      <div className="flex flex-col lg:flex-row lg:items-center gap-x-4 gap-y-1 min-w-0 text-left">
        <h1 className="w-fit px-2 py-0.5 bg-brand-yellow text-ink border-2 border-ink shadow-hard-sm text-base md:text-lg font-bold uppercase leading-snug">
          {personal_info.name}
        </h1>
        <p className="text-[13px] text-text-2">{tr(personal_info.headline, lang)}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <LinkButton href={personal_info.cv} download label={t.contact.downloadCv} className={HEIGHT}>
          <Icon name="download" />
          <span className="hidden sm:inline">{t.contact.downloadCv}</span>
        </LinkButton>
        <LinkButton href={tr(personal_info.linkedin, lang)} label={t.contact.linkedin} className={HEIGHT}>
          <Icon name="linkedin" />
          <span className="hidden sm:inline-flex items-center gap-1.5">
            {t.contact.linkedin} <Icon name="external" />
          </span>
        </LinkButton>
        <LinkButton href={personal_info.github} label={t.contact.github} className={HEIGHT}>
          <Icon name="github" />
          <span className="hidden sm:inline-flex items-center gap-1.5">
            {t.contact.github} <Icon name="external" />
          </span>
        </LinkButton>
        <LanguageButton />
        <DarkButton theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
}
