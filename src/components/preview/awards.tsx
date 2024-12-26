import { useEffect } from "react";
import { useResume } from "../../store/useResume";
import { Award } from "../../types/types";

export const AwardsPreview: React.FC = () => {
  const {
    resumeData: { awards },
  } = useResume();

  // remove bullets from the description
  const removeBulletPoints = (summary: string) => {
    return summary.replace(/• /g, "");
  };

  // process education data to display in the component
  const processedEducation = awards.map((award: Award) => ({
    ...award,
    summary: removeBulletPoints(award.summary),
  }));

  useEffect(() => {
    console.log(awards);
  }, [awards]);

  // IF there are no awards, return null
  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-lg font-bold border-b border-primary dark:border-primary-foreground mb-2">
        Awards
      </h3>
      <div className="space-y-2">
        {processedEducation.map((award: Award, index: number) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-left">
                {award.website ? (
                  <a
                    href={award.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold"
                  >
                    {award.name}
                  </a>
                ) : (
                  <span className="font-bold">{award.name}</span>
                )}
                <p>{award.issuer}</p>
              </div>
              <div className="text-right">
                {award.date && <p>{award.date}</p>}
              </div>
            </div>
            {award.summary && (
              <div dangerouslySetInnerHTML={{ __html: award.summary }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
