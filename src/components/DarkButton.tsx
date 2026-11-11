import { type Dispatch, type SetStateAction } from "react";
import type { Theme } from "../types/Theme";
import { useLanguage } from "../i18n/LanguageContext";
import { buttonClasses } from "../scripts/button_classes";
import Icon from "./Icon";

interface Props {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
}

export default function DarkButton({ theme, setTheme }: Props) {
  const dark = theme === "dark";
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => {
        setTheme((current) => (current === "light" ? "dark" : "light"));
      }}
      aria-pressed={dark}
      // Fixed name + pressed state; a label that flips too would contradict it
      aria-label={t.theme.label}
      title={t.theme.label}
      className={`${buttonClasses("primary")} w-8.5! h-8.5 px-0! py-0!`}
    >
      <Icon name={dark ? "sun" : "moon"} size={16} />
    </button>
  );
}
