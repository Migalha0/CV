import { useLanguage } from "../i18n/LanguageContext";
import { LANGS, LOCALES } from "../i18n/language";
import { CONTROL_BASE } from "../scripts/button_classes";
import Flag from "./Flag";

// Each option is named in its own language, so a visitor who can't read the
// current one still finds theirs (screen readers switch voice via lang)
const NAMES = { en: "English", pt: "Português" };

// Segmented control: one flag per language, the current one pressed
export default function LanguageButton() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className="flex border-2 border-ink bg-surface shadow-hard-sm"
    >
      {LANGS.map((option) => {
        const active = option === lang;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLang(option)}
            aria-pressed={active}
            aria-label={NAMES[option]}
            lang={LOCALES[option]}
            title={NAMES[option]}
            className={`
              ${CONTROL_BASE} border-0 shadow-none active:translate-0 h-7.5 px-2
              focus-visible:outline-text focus-visible:-outline-offset-4
              ${active ? "bg-brand-yellow" : "opacity-50 grayscale hover:opacity-100 hover:grayscale-0"}
            `}
          >
            <Flag lang={option} className="outline-1 outline-black/20" />
          </button>
        );
      })}
    </div>
  );
}
