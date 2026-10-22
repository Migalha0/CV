// "surface" sits on the themed page, "brand" sits on a yellow background
export type ButtonVariant = "surface" | "brand";

// Shared with CopyButton so links and buttons look identical
export function buttonClasses(variant: ButtonVariant) {
  const shadow =
    variant === "surface"
      ? "shadow-[3px_3px_0_0_var(--theme-shadow)]"
      : "shadow-[3px_3px_0_0_var(--brand-ink)]";

  return `
                ${shadow}
                bg-brand-yellow text-ink border-ink
                hover:bg-ink hover:text-brand-yellow
                inline-flex items-center gap-1.5
                w-fit px-2 py-0.5
                border-2
                text-sm font-bold
                hover:cursor-pointer
                active:translate-x-[3px] active:translate-y-[3px] active:shadow-none
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
            `;
}
