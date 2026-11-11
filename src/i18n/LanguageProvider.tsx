import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { LanguageContext } from "./LanguageContext";
import { detectLang, LOCALES, STORAGE_KEY, type Lang } from "./language";
import { translations } from "./translations";

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  // Only an explicit pick is saved, so visitors who never touch the toggle
  // keep following their browser language
  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The choice just won't persist across visits
    }
  }, []);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = LOCALES[lang];
    document.title = t.meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t.meta.description);
  }, [lang, t]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}
