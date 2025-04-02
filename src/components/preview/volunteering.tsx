import { usePdfSettings, useResume } from "../../store/useResume";
import { Volunteering } from "../../types/types";

export const VolunteeringPreview: React.FC = () => {
  const {
    resumeData: { volunteering },
  } = useResume();

  const {
    pdfSettings: { lineHeight },
  } = usePdfSettings();

  // remove bullets from the description
  const removeBulletPoints = (summary: string) => {
    return summary.replace(/• /g, "");
  };

  // process education data to display in the component
  const processedEducation = volunteering.map((vol: Volunteering) => ({
    ...vol,
    summary: removeBulletPoints(vol.summary),
  }));

  // IF there are no volunteering, return null
  if (!volunteering || volunteering.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-lg font-bold border-b border-primary dark:border-primary-foreground mb-1">
        Volunteering
      </h3>
      <div className="space-y-.5">
        {processedEducation.map((vol: Volunteering) => (
          <div key={vol.id}>
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="font-bold">{vol.name}</span>
                <p>{vol.position}</p>
              </div>
              <div className="text-right">
                {vol.date && <p>{vol.date}</p>}
                {vol.location && <p>{vol.location}</p>}
              </div>
            </div>
            {vol.summary && (
              <div
                className={`leading-${lineHeight}`}
                dangerouslySetInnerHTML={{ __html: vol.summary }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
