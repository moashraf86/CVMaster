import { usePdfSettings, useResume } from "../../store/useResume";
import { Award } from "../../types/types";

export const AwardsPreview: React.FC = () => {
  const {
    resumeData: { awards, sectionTitles },
  } = useResume();

  const {
    pdfSettings: { lineHeight, fontSize },
  } = usePdfSettings();

  // remove bullets from the description
  const removeBulletPoints = (summary: string) => {
    return summary.replace(/• /g, "");
  };

  // process education data to display in the component
  const processedEducation = awards.map((award: Award) => ({
    ...award,
    summary: removeBulletPoints(award.summary),
  }));

  // IF there are no awards, return null
  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <section>
      <h3
        className="font-bold border-b border-neutral-400 mb-1"
        style={{ fontSize: fontSize + 4 }}
      >
        {sectionTitles.awards}
      </h3>
      <div className="space-y-0.5">
        {processedEducation.map((award: Award) => (
          <div key={award.id}>
            <div className="flex items-center justify-between">
              <div className="text-left">
                {award.website ? (
                  <a
                    href={award.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold"
                    style={{ fontSize: fontSize + 2 }}
                  >
                    {award.name}
                  </a>
                ) : (
                  <span
                    className="font-bold"
                    style={{ fontSize: fontSize + 2 }}
                  >
                    {award.name}
                  </span>
                )}
                <p>{award.issuer}</p>
              </div>
              <div className="text-right">
                {award.date && <p>{award.date}</p>}
              </div>
            </div>
            {award.summary && (
              <div
                style={{ lineHeight: `${lineHeight * 0.25}rem` }}
                dangerouslySetInnerHTML={{ __html: award.summary }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
