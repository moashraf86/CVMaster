import { usePdfSettings, useResume } from "../../store/useResume";
import { Experience } from "../../types/types";

export const ExperiencePreview: React.FC = () => {
  const {
    resumeData: { experience, sectionTitles },
    hiddenItemIds,
  } = useResume();

  const {
    pdfSettings: { lineHeight, fontSize },
  } = usePdfSettings();

  // filter out hidden items
  const visibleExperience = experience.filter(
    (exp) => !hiddenItemIds.includes(exp.id)
  );

  // remove bullets from the description
  const removeBulletPoints = (summary: string) => {
    return summary.replace(/• /g, "");
  };

  // process experience data to display in the component
  const processedExperience = visibleExperience.map((exp: Experience) => ({
    ...exp,
    summary: removeBulletPoints(exp.summary),
  }));

  if (!visibleExperience || visibleExperience.length === 0) {
    return null;
  }

  return (
    <section className="space-y-0.5">
      <h3
        className="font-bold border-b border-neutral-400 mb-1"
        style={{ fontSize: fontSize + 4 }}
      >
        {sectionTitles.experience}
      </h3>
      {visibleExperience &&
        processedExperience.map((exp: Experience) => (
          <div key={exp.id}>
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="font-bold" style={{ fontSize: fontSize + 2 }}>
                  {exp.name}
                </span>
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
                style={{ lineHeight: `${lineHeight * 0.25}rem` }}
                dangerouslySetInnerHTML={{ __html: exp.summary }}
              />
            )}
          </div>
        ))}
    </section>
  );
};
