import { useEffect } from "react";
import { useResume } from "../../store/useResume";
import { Experience } from "../../types/types";

export const ExperiencePreview: React.FC = () => {
  const {
    resumeData: { experience },
  } = useResume();

  // remove bullets from the description
  const removeBulletPoints = (summary: string) => {
    return summary.replace(/• /g, "");
  };

  // process experience data to display in the component
  const processedExperience = experience.map((exp: Experience) => ({
    ...exp,
    summary: removeBulletPoints(exp.summary),
  }));

  useEffect(() => {
    console.log(processedExperience);
  }, [experience]);

  if (!experience || experience.length === 0) {
    return null;
  }

  return (
    <section className="space-y-2">
      <h3 className="text-lg font-bold border-b border-primary mb-2">
        Experience
      </h3>
      {experience &&
        processedExperience.map((exp: Experience, index: number) => (
          <div key={index} className="space-y-2">
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
              <div dangerouslySetInnerHTML={{ __html: exp.summary }} />
            )}
          </div>
        ))}
    </section>
  );
};
