import { BasicsPreview } from "./basics";
import { EducationPreview } from "./education";
import { ExperiencePreview } from "./experience";
import { ProjectsPreview } from "./projects";
import { SkillsPreview } from "./skills";
import { SummaryPreview } from "./summary";
import { LanguagesPreview } from "./languages";
import { cn } from "../../lib/utils";

const pageSizeMap = {
  width: 210,
  height: 297,
};

// MM to PX conversion
const MM_TO_PX = 3.78;

// Preview props type
interface PreviewProps {
  mode: "preview" | "print";
}

export const Preview: React.FC<PreviewProps> = ({ mode }) => {
  // Page size in pixels
  const WIDTH = pageSizeMap.width * MM_TO_PX;
  const HEIGHT = pageSizeMap.height * MM_TO_PX;

  return (
    <div
      className={cn(
        "relative bg-background text-foreground text-sm",
        mode === "preview" ? "shadow-2xl" : "shadow-none"
      )}
      style={{
        width: `${WIDTH}px`,
        minHeight: `${HEIGHT}px`,
        transform: mode === "preview" ? "scale(.8)" : "scale(1)",
      }}
    >
      <div
        className={cn(
          "flex-1 w-full space-y-4 font-roboto ",
          mode === "preview" ? "px-8 py-[23px]" : "px-8 py-0"
        )}
      >
        <BasicsPreview />
        <SummaryPreview />
        <ExperiencePreview />
        <ProjectsPreview />
        <SkillsPreview />
        <EducationPreview />
        <LanguagesPreview />
      </div>
      <hr
        className={`border-t border-dashed border-gray-400 absolute w-full left-0`}
        style={{
          top: `${1122 - 23 * 2}px`,
        }}
      />
    </div>
  );
};
