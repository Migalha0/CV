import { type Dispatch, type SetStateAction } from "react";
import type { Theme } from "../types/Theme";

interface Props {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
}

export default function DarkButton({ theme, setTheme }: Props) {
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => {
        setTheme((current) => (current === "light" ? "dark" : "light"));
      }}
      aria-pressed={dark}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      className="
                group relative overflow-hidden
                flex flex-col items-center justify-center gap-2
                w-16 md:w-30 shrink-0 self-stretch
                mr-1.5 mb-1.5
                bg-ink text-brand-yellow
                dark:bg-brand-yellow dark:text-ink
                border-3 border-border
                shadow-[6px_6px_0_0_var(--theme-shadow)]
                hover:cursor-pointer
                hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_0_var(--theme-shadow)]
                active:translate-x-[6px] active:translate-y-[6px] active:shadow-none
                focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border
            "
    >
      {/* Dither fading up from the bottom, mirroring the name card */}
      <div
        aria-hidden="true"
        className="
                    absolute inset-0 pointer-events-none
                    bg-dither
                    [--dither-a:var(--brand-ink)] [--dither-b:var(--brand-yellow)]
                    dark:[--dither-a:var(--brand-yellow)] dark:[--dither-b:var(--brand-grey)]
                    [mask-image:linear-gradient(0deg,#000_-50%,#0000_70%)]
                "
      />

      <div
        className={`w-10 h-10 rounded-full ${dark ? "bg-black" : "bg-yellow-300"}`}
      />

      <span className="relative hidden md:block text-xs font-bold tracking-widest">
        {dark ? "DARK" : "LIGHT"}
      </span>
    </button>
  );
}
