export type Lang = "en" | "pt";

// Text that differs per language; plain strings (tech names, etc.) stay as-is
export type Text = string | Record<Lang, string>;

export const LANGS: Lang[] = ["en", "pt"];

// BCP 47 tags for <html lang> and Intl
export const LOCALES: Record<Lang, string> = {
  en: "en-US",
  pt: "pt-BR",
};

export const STORAGE_KEY = "lang";

export function tr(text: Text, lang: Lang): string {
  return typeof text === "string" ? text : text[lang];
}

function isLang(value: unknown): value is Lang {
  return value === "en" || value === "pt";
}

// The visitor's explicit pick wins; otherwise the first browser language we
// support, in their order of preference (["de", "pt-BR"] -> Portuguese).
// Unsupported-only lists fall back to English.
export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // Storage blocked, fall back to the browser languages
  }

  const preferred = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const tag of preferred) {
    const base = tag?.toLowerCase().split("-")[0];
    if (isLang(base)) return base;
  }

  return "en";
}
