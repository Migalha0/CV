import { professional_experience } from "../data/manual_data";
import Card from "./Card";
import Grid from "./Grid";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "01-2023 : 10-2025" -> "Jan 2023 – Oct 2025"
function formatPeriod(period: string) {
  return period
    .split(":")
    .map((date) => {
      const [month, year] = date.trim().split("-");
      return `${MONTHS[Number(month) - 1] ?? month} ${year}`;
    })
    .join(" – ");
}

export default function SectionExperience() {
  return (
    <Grid id="experience" title="PROFESSIONAL EXPERIENCE">
      {professional_experience.map((job) => (
        <Card
          key={`${job.company}-${job.role}`}
          title_string={job.role}
          meta={
            <>
              {job.company}
              <span aria-hidden="true"> · </span>
              <span className="sr-only">, </span>
              <span className="font-normal">{formatPeriod(job.time)}</span>
            </>
          }
          description={job.summary}
          chips={job.stack.split(",").map((tech) => tech.trim())}
        />
      ))}
    </Grid>
  );
}
