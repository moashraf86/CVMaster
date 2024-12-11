import { useResume } from "../../store/useResume";
import { Project } from "../../types/types";

export const ProjectsPreview: React.FC = () => {
  const {
    resumeData: { projects },
  } = useResume();

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
    <section className="space-y-2">
      <h3 className="text-lg font-bold border-b border-primary dark:border-primary-foreground">
        Projects
      </h3>
      {processedExperience.map((project: Project, index: number) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-left flex items-center gap-2">
              <a href={project.website} className="underline">
                <span className="font-bold">{project.name}</span>
              </a>
              {project.keywords.length > 0 && (
                <div className="flex items-center gap-1">
                  |&nbsp;
                  <span>{project.keywords.join(", ")}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p>{project.date}</p>
            </div>
          </div>
          {project.description && <span>{project.description}</span>}
          {project.summary && (
            <div dangerouslySetInnerHTML={{ __html: project.summary }} />
          )}
        </div>
      ))}
    </section>
  );
};
