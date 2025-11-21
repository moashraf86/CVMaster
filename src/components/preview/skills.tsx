import { cn } from "../../lib/utils";
import { usePdfSettings, useResume } from "../../store/useResume";
import { Skill } from "../../types/types";

export const SkillsPreview: React.FC = () => {
  const {
    resumeData: { skills, sectionTitles },
  } = useResume();

  const {
    pdfSettings: { fontSize, lineHeight, skillsLayout },
  } = usePdfSettings();

  // IF there are no skills, return null
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <section>
      <h3
        className="font-bold border-b border-neutral-400 mb-1"
        style={{ fontSize: fontSize + 4 }}
      >
        {sectionTitles.skills}
      </h3>

      <div
        style={{
          lineHeight: `${lineHeight * 0.25}rem`,
        }}
        className={cn("gap-4", {
          grid: skillsLayout !== "inline",
          "grid-cols-[repeat(auto-fit,minmax(0,1fr))]":
            skillsLayout === "grid-col",
          "grid-rows-[repeat(auto-fit,minmax(0,1fr))]":
            skillsLayout === "grid-row",
        })}
      >
        {skillsLayout === "inline" ? (
          <>
            {skills.map((skill: Skill) => (
              <div key={skill.id}>
                {skill.name && (
                  <span className="font-bold">{skill.name}: </span>
                )}
                {skill.keywords.map((keyword, index) => (
                  <span key={keyword}>
                    {keyword}
                    {index !== skill.keywords.length - 1 && ", "}
                  </span>
                ))}
              </div>
            ))}
          </>
        ) : (
          <>
            {skills.map((skill: Skill) => (
              <div key={skill.id}>
                {skill.name && (
                  <span className="font-bold">{skill.name}: </span>
                )}
                <ul className="flex flex-col">
                  {skill.keywords.map((keyword, index) => (
                    <li key={keyword}>
                      {keyword}
                      {index !== skill.keywords.length - 1}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};
