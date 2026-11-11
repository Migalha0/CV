import { professional_experience } from "../data/manual_data";
import Card from "./Card";
import Grid from "./Grid";
import { useLanguage } from "../i18n/LanguageContext";
import { tr } from "../i18n/language";

// "01-2023 : 10-2025" -> "Jan 2023 – Oct 2025"
function formatPeriod(period: string, months: string[]) {
  return period
    .split(":")
    .map((date) => {
      const [month, year] = date.trim().split("-");
      return `${months[Number(month) - 1] ?? month} ${year}`;
    })
    .join(" – ");
}

export default function SectionExperience() {
  const { lang, t } = useLanguage();

  return (
    <Grid id="experience" title={t.sections.experience} layout="list">
      {professional_experience.map((job) => (
        <Card
          key={`${job.company}-${job.time}`}
          title_string={tr(job.role, lang)}
          meta={job.company}
          aside={formatPeriod(job.time, t.months)}
          description={tr(job.summary, lang)}
          chips={job.stack.split(",").map((tech) => tech.trim())}
        />
      ))}
    </Grid>
  );
}
