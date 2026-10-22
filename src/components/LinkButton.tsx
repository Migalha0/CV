import type { ReactNode } from "react";
import { buttonClasses, type ButtonVariant } from "../scripts/button_classes";

interface Props {
  href: string;
  variant?: ButtonVariant;
  download?: boolean;
  title?: string;
  label?: string;
  children: ReactNode;
}

export default function LinkButton({
  href,
  variant = "surface",
  download = false,
  title,
  label,
  children,
}: Props) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      download={download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      title={title}
      aria-label={label}
      className={buttonClasses(variant)}
    >
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
