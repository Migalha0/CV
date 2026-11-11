import type { ReactNode } from "react";
import { buttonClasses, type ButtonVariant } from "../scripts/button_classes";
import { useLanguage } from "../i18n/LanguageContext";

interface Props {
  href: string;
  variant?: ButtonVariant;
  download?: boolean;
  title?: string;
  label?: string;
  className?: string;
  children: ReactNode;
}

export default function LinkButton({
  href,
  variant = "primary",
  download = false,
  title,
  label,
  className = "",
  children,
}: Props) {
  const external = href.startsWith("http");
  const { t } = useLanguage();

  return (
    <a
      href={href}
      download={download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      title={title}
      aria-label={label}
      className={`${buttonClasses(variant)} ${className}`}
    >
      {children}
      {external && <span className="sr-only">{t.opensInNewTab}</span>}
    </a>
  );
}
