import { usePdfSettings, useResume } from "../../store/useResume";
import { Education } from "../../types/types";

export const EducationPreview: React.FC = () => {
  const {
    resumeData: { education, sectionTitles },
    hiddenItemIds,
  } = useResume();

  const {
    pdfSettings: { lineHeight, fontSize },
  } = usePdfSettings();

  const visibleEducation = education.filter(
    (edu) => !hiddenItemIds.includes(edu.id)
  );

  // remove bullets from the description
  const removeBulletPoints = (summary: string) => {
    return summary.replace(/• /g, "");
  };

  // process education data to display in the component
  const processedEducation = visibleEducation.map((edu: Education) => ({
    ...edu,
    summary: removeBulletPoints(edu.summary),
  }));

  // IF there are no education, return null
  if (!visibleEducation || visibleEducation.length === 0) {
    return null;
  }

  return (
    <section>
      <h3
        className="font-bold border-b border-neutral-400 mb-1"
        style={{ fontSize: fontSize + 4 }}
      >
        {sectionTitles.education}
      </h3>
      <div className="space-y-1">
        {processedEducation.map((edu: Education) => (
          <div key={edu.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="font-bold" style={{ fontSize: fontSize + 2 }}>
                  {edu.name}
                </span>
                <p>
                  {edu.degree && edu.degree + " in"} {edu.studyField}
                </p>
              </div>
              <div className="text-right">{edu.date && <p>{edu.date}</p>}</div>
            </div>
            {edu.summary && (
              <div
                style={{ lineHeight: `${lineHeight * 0.25}rem` }}
                dangerouslySetInnerHTML={{ __html: edu.summary }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
