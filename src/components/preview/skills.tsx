import { useResume } from "../../store/useResume";
import { Skill } from "../../types/types";

export const SkillsPreview: React.FC = () => {
  const {
    resumeData: { skills, sectionTitles },
  } = useResume();

  // IF there are no skills, return null
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-lg font-bold border-b border-primary dark:border-primary-foreground mb-1">
        {sectionTitles.skills}
      </h3>
      <div>
        {skills.map((skill: Skill) => (
          <div key={skill.id}>
            {skill.name && <span className="font-bold">{skill.name}: </span>}
            {skill.keywords.join(", ")}
          </div>
        ))}
      </div>
    </section>
  );
};
