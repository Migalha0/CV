import Grid from "./Grid";

export default function SectionAbout() {
  return (
    <Grid id="about" title="ABOUT ME">
      <div className="col-span-full flex flex-col gap-4 text-left border-2 border-border p-2 bg-surface">
        <div>
          Software developer working mainly with JavaScript and Python, with
          2+ years of professional experience. At Wipro I built front-end for
          a state government service and led the accessibility effort that
          earned it an official web accessibility seal.
        </div>
        <div>
          Graduated in software development and currently taking a
          specialization in cybersecurity at CESAR School, bringing a
          security mindset to the code I write.
        </div>
        <div>
          Looking for: onsite, hybrid, or remote opportunities in software
          engineering, web development, cybersecurity (SOC), data analysis,
          or GIS.
        </div>
        <div>Keen on relocating.</div>
      </div>
    </Grid>
  );
}
