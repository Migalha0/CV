import { professional_experience } from "../data/manual_data";
import Card from "./Card";
import Grid from "./Grid";

export default function SectionExperience({}){
    return (
        <Grid title="PROFESSIONAL EXPERIENCE">
          {professional_experience.map(job => (
            <Card key={`${job.company}-${job.role}`} title_string={job.role} description={
            <div className="flex flex-col gap-2">
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Time:</strong> {job.time}</p>
                <p><strong>Stack:</strong> {job.stack}</p>
            </div>
          }/>
          ))}
          
        </Grid>
    )
}