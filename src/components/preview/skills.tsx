import { useEffect } from "react";
import { useResume } from "../../store/useResume";
import { Skill } from "../../types/types";

export const SkillsPreview: React.FC = () => {
  const {
    resumeData: { skills },
  } = useResume();

  useEffect(() => {
    console.log(skills);
  }, [skills]);
  // IF there are no skills, return null
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-lg font-bold border-b border-primary dark:border-primary-foreground mb-2">
        Skills
      </h3>
      <div className="space-y-2">
        {skills.map((skill: Skill, index: number) => (
          <div key={index}>
            {skill.name && <span className="font-bold">{skill.name}: </span>}
            {skill.keywords.join(", ")}
          </div>
        ))}
      </div>
    </section>
  );
};
