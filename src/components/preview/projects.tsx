import { usePdfSettings, useResume } from "../../store/useResume";
import { Project } from "../../types/types";

export const ProjectsPreview: React.FC = () => {
  const {
    resumeData: { projects },
  } = useResume();

  const {
    pdfSettings: { lineHeight },
  } = usePdfSettings();

  // remove bullet points from the summary
  const removeBulletPoints = (summary: string) => {
    return summary.replace(/• /g, "");
  };
  //processed data
  const processedExperience = projects.map((project: Project) => ({
    ...project,
    summary: removeBulletPoints(project.summary),
  }));
  // IF there are no projects, return null
  if (!projects || projects.length === 0) {
    return null;
  }
  return (
    <section className="space-y-0.5">
      <h3 className="text-lg font-bold border-b border-primary dark:border-primary-foreground mb-1">
        Projects
      </h3>
      {processedExperience.map((project: Project) => (
        <div key={project.id}>
          <div className="flex items-center justify-between">
            <div className="text-left flex items-center gap-2">
              {project.website ? (
                <a href={project.website} className="underline" target="_blank">
                  <span className="font-bold">{project.name}</span>
                </a>
              ) : (
                <span className="font-bold">{project.name}</span>
              )}
              {project.keywords.length > 0 && (
                <div className="flex items-center gap-1">
                  |&nbsp;
                  <span className="italic">{project.keywords.join(", ")}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p>{project.date}</p>
            </div>
          </div>
          {project.description && <span>{project.description}</span>}
          {project.summary && (
            <div
              className={`leading-${lineHeight}`}
              dangerouslySetInnerHTML={{ __html: project.summary }}
            />
          )}
        </div>
      ))}
    </section>
  );
};
