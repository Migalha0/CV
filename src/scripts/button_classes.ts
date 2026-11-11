// "primary" is the yellow action button; "secondary" is a quieter one on the
// page surface, for actions that sit beside a value (like Copy)
export type ButtonVariant = "primary" | "secondary";

// Shared by every link-button and toggle so all controls look identical:
// 2px border, 3px hard shadow, bold uppercase label, press-in on click
export const CONTROL_BASE = `
  inline-flex items-center justify-center gap-1.5
  border-2
  text-[13px] font-bold uppercase tracking-[0.02em]
  shadow-hard-sm
  hover:cursor-pointer
  active:translate-x-[3px] active:translate-y-[3px] active:shadow-none
  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text
`;

export function buttonClasses(variant: ButtonVariant = "primary") {
  const colors = {
    primary: "bg-brand-yellow text-ink border-ink hover:bg-ink hover:text-brand-yellow",
    secondary: "bg-surface text-text border-border hover:bg-text hover:text-surface",
  }[variant];

  return `${CONTROL_BASE} ${colors} w-fit px-2.5 py-1 leading-tight`;
}
