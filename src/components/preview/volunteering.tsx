import { useEffect } from "react";
import { useResume } from "../../store/useResume";
import { Volunteering } from "../../types/types";

export const VolunteeringPreview: React.FC = () => {
  const {
    resumeData: { volunteering },
  } = useResume();

  // remove bullets from the description
  const removeBulletPoints = (summary: string) => {
    return summary.replace(/• /g, "");
  };

  // process education data to display in the component
  const processedEducation = volunteering.map((vol: Volunteering) => ({
    ...vol,
    summary: removeBulletPoints(vol.summary),
  }));

  useEffect(() => {
    console.log(volunteering);
  }, [volunteering]);

  // IF there are no volunteering, return null
  if (!volunteering || volunteering.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-lg font-bold border-b border-primary dark:border-primary-foreground mb-2">
        Volunteering
      </h3>
      <div className="space-y-2">
        {processedEducation.map((vol: Volunteering, index: number) => (
          <div key={index} className="space-y-2">
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
              <div dangerouslySetInnerHTML={{ __html: vol.summary }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
