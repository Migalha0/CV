import type { Dispatch, SetStateAction } from "react";
import type { Theme } from "../types/Theme";

interface Props {
    theme: Theme;
    setTheme: Dispatch<SetStateAction<Theme>>;
}

export default function DarkButton({ theme, setTheme }: Props) {
    return (
        <button
            type="button"
            onClick={() =>
                setTheme(current =>
                    current === "light" ? "dark" : "light"
                )
            }
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="
                flex items-center justify-center              
                bg-brand-grey dark:bg-brand-yellow
                hover:cursor-pointer            
                transition-colors
                w-30
            "
        >
            <div className="overflow-hidden bg-brand-yellow w-10 h-10 rounded-full border-3 border-brand-yellow dark:bg-brand-grey dark:border-brand-grey">
                <div className="h-full w-1/2 bg-brand-grey dark:bg-brand-yellow"/>
            </div>
        </button>
    );
}