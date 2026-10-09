import Grid from "./Grid";

export default function SectionAbout({}) {
    return(
        <Grid title="Who am I?">
          <div className="flex flex-col gap-4 text-left border-2 border-black p-2 bg-white">
            <div>
              Full stack software developer specializing in JavaScript and Python with 2+ years of professional experience.
            </div>
            <div>
              Looking for: onsite, hybrid, or remote opportunities in software engineering, web development, data analysis, SOC, or GIS.
            </div>
            <div>
              Keen on relocating.
            </div>
          </div>
        </Grid>
    ) 
}