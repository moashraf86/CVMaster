import { usePdfSettings, useResume } from "../../store/useResume";
import { Certification } from "../../types/types";

export const CertificationsPreview: React.FC = () => {
  const {
    resumeData: { certifications },
  } = useResume();

  const {
    pdfSettings: { lineHeight },
  } = usePdfSettings();

  // remove bullets from the description
  const removeBulletPoints = (summary: string) => {
    return summary.replace(/• /g, "");
  };

  // process education data to display in the component
  const processedEducation = certifications.map((cert: Certification) => ({
    ...cert,
    summary: removeBulletPoints(cert.summary),
  }));

  // IF there are no certifications, return null
  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-lg font-bold border-b border-primary dark:border-primary-foreground mb-1">
        Certifications
      </h3>
      <div className="space-y-0.5">
        {processedEducation.map((cert: Certification) => (
          <div key={cert.id}>
            <div className="flex items-center justify-between">
              <div className="text-left">
                {cert.website ? (
                  <a
                    href={cert.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold"
                  >
                    {cert.name}
                  </a>
                ) : (
                  <span className="font-bold">{cert.name}</span>
                )}
                <p>{cert.issuer}</p>
              </div>
              <div className="text-right">
                {cert.date && <p>{cert.date}</p>}
              </div>
            </div>
            {cert.summary && (
              <div
                className={`leading-${lineHeight}`}
                dangerouslySetInnerHTML={{ __html: cert.summary }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
