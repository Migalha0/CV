import type { ReactNode } from "react";
import Grid from "./Grid";
import CopyButton from "./CopyButton";
import { useLanguage } from "../i18n/LanguageContext";
import { personal_info } from "../data/manual_data";

// The template's stat box: small label over a bold value
function Stat({ label, children, action }: { label: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2 p-2.5 bg-surface border-2 border-border text-left">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[11px] font-semibold text-text-2">{label}</span>
        <span className="text-[15px] font-bold [overflow-wrap:anywhere]">{children}</span>
      </div>
      {action}
    </div>
  );
}

export default function SectionAbout() {
  const { t } = useLanguage();
  const link = "underline decoration-2 underline-offset-2 hover:bg-brand-yellow hover:text-ink";

  return (
    <Grid id="about" title={t.sections.about} layout="list">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Stat
          label={t.stats.email}
          action={<CopyButton variant="secondary" text={personal_info.email} />}
        >
          <a href={`mailto:${personal_info.email}`} className={link}>
            {personal_info.email}
          </a>
        </Stat>
        <Stat label={t.stats.phone}>
          <a
            href={`tel:${personal_info.phone.replace(/[^+\d]/g, "")}`}
            aria-label={t.contact.callLabel(personal_info.phone)}
            className={`${link} font-mono font-semibold`}
          >
            {personal_info.phone}
          </a>
        </Stat>
        <Stat label={t.stats.availability}>{t.stats.workModes}</Stat>
        <Stat label={t.stats.relocation}>{t.stats.relocationValue}</Stat>
      </div>

      <div className="flex flex-col gap-3 p-4 text-left text-[15px] bg-surface border-2 border-border shadow-hard">
        {t.about.map((paragraph) => (
          <p key={paragraph} className="max-w-[72ch] leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </Grid>
  );
}
