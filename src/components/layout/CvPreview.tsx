import { HeaderPreview } from "../core/HeaderPreview";
import { SummaryPreview } from "../core/SummaryPreview";
import { ExperiencePreview } from "../core/ExperiencePreview";
import { ProjectsPreview } from "../core/ProjectsPreview";
import { SKillsPreview } from "../core/SkillsPreview";

export const CvPreview: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 w-3/5 min-h-[90dvh]">
      <div className="flex-1 w-full shadow-2xl px-8 py-4">
        <HeaderPreview />
        <SummaryPreview />
        <ExperiencePreview />
        <ProjectsPreview />
        <SKillsPreview />
      </div>
    </div>
  );
};
