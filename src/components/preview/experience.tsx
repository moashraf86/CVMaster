import { usePdfSettings, useResume } from "../../store/useResume";
import { Experience } from "../../types/types";

export const ExperiencePreview: React.FC = () => {
  const {
    resumeData: { experience },
  } = useResume();

  const {
    pdfSettings: { lineHeight },
  } = usePdfSettings();

  // remove bullets from the description
  const removeBulletPoints = (summary: string) => {
    return summary.replace(/• /g, "");
  };

  // process experience data to display in the component
  const processedExperience = experience.map((exp: Experience) => ({
    ...exp,
    summary: removeBulletPoints(exp.summary),
  }));

  if (!experience || experience.length === 0) {
    return null;
  }

  return (
    <section className="space-y-0.5">
      <h3 className="text-lg font-bold border-b border-primary dark:border-primary-foreground mb-1">
        Experience
      </h3>
      {experience &&
        processedExperience.map((exp: Experience, index: number) => (
          <div key={index}>
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="font-bold">{exp.name}</span>
                <div className="flex items-center gap-1">
                  <span>{exp.position}</span>
                  {exp.employmentType && <span> - {exp.employmentType}</span>}
                </div>
              </div>
              <div className="text-right">
                <p>{exp.dateRange}</p>
                <p>{exp.location}</p>
              </div>
            </div>
            {exp.summary && (
              <div
                className={`leading-${lineHeight}`}
                dangerouslySetInnerHTML={{ __html: exp.summary }}
              />
            )}
          </div>
        ))}
    </section>
  );
};
