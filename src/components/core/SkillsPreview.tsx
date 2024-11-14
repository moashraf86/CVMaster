import { useResume } from "../../store/useResume";
import { Skill } from "../../types/types";

export const SKillsPreview: React.FC = () => {
  const {
    resumeData: { skills },
  } = useResume();

  // check if there are no skills
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <section className="mb-4 font-roboto">
      <h3 className="text-lg font-bold border-b border-primary mb-2">Skills</h3>
      {skills &&
        skills.map((skill: Skill, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <h4 className="text-lg font-bold">{skill.category}</h4>
            <p>{skill.name}</p>
          </div>
        ))}
    </section>
  );
};
