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
          description={
            <div className="flex flex-col gap-2">
              <p>{job.summary}</p>
              <p>
                <strong>Company:</strong> {job.company}
              </p>
              <p>
                <strong>Time:</strong> {formatPeriod(job.time)}
              </p>
              <p>
                <strong>Stack:</strong> {job.stack}
              </p>
            </div>
          }
        />
      ))}
    </Grid>
  );
}
