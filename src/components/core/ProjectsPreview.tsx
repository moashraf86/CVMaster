import { useFormStore } from "../../store/useFormStore";
import { Project } from "../../types/types";

export const ProjectsPreview: React.FC = () => {
  const { formData } = useFormStore();
  const projects = formData.projects || [];

  // remove bullets from the description
  const removeBulletPoints = (description: string) => {
    return description.replace(/• /g, "");
  };

  // process experience data to display in the component
  const processedProjects = projects.map((project: Project) => ({
    ...project,
    description: removeBulletPoints(project.description),
  }));

  // check if there are no projects
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="mb-4 font-roboto">
      <h3 className="text-lg font-bold border-b border-primary mb-2">
        Projects
      </h3>
      {/* // !Error frequently comes from here */}
      {projects &&
        processedProjects.map((project: Project, index: number) => (
          <div key={index} className="mb-2">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold underline">
                <a href={project.link}>{project.title}</a>
              </h4>{" "}
              |
              {project.skills && (
                <p className="text-sm italic">
                  {project.skills.map((skill: string, index: number) => (
                    <span>
                      {index === project.skills.length - 1
                        ? skill
                        : `${skill}, `}
                    </span>
                  ))}
                </p>
              )}
            </div>
            <ul className="whitespace-pre-line list-disc ps-4 ms-4">
              {project.description
                .split("\n")
                .map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
            </ul>
          </div>
        ))}
    </section>
  );
};
