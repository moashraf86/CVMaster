import { useEffect } from "react";
import { useResume } from "../../store/useResume";
import { Education } from "../../types/types";

export const EducationPreview: React.FC = () => {
  const {
    resumeData: { education },
  } = useResume();

  // remove bullets from the description
  const removeBulletPoints = (summary: string) => {
    return summary.replace(/• /g, "");
  };

  // process education data to display in the component
  const processedEducation = education.map((edu: Education) => ({
    ...edu,
    summary: removeBulletPoints(edu.summary),
  }));

  useEffect(() => {
    console.log(education);
  }, [education]);

  // IF there are no education, return null
  if (!education || education.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-lg font-bold border-b border-primary mb-2">
        Education
      </h3>
      <div className="space-y-2">
        {processedEducation.map((edu: Education, index: number) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="font-bold">{edu.name}</span>
                <p>
                  {edu.degree && edu.degree + " in"} {edu.studyField}
                </p>
              </div>
              <div className="text-right">{edu.date && <p>{edu.date}</p>}</div>
            </div>
            {edu.summary && (
              <div dangerouslySetInnerHTML={{ __html: edu.summary }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};