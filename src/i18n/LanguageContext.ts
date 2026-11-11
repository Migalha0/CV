import { createContext, useContext } from "react";
import type { Lang } from "./language";
import { translations, type Dictionary } from "./translations";

export interface LanguageValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
}

export const LanguageContext = createContext<LanguageValue>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function useLanguage() {
  return useContext(LanguageContext);
}
