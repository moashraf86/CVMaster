import { BasicsPreview } from "./basics";
import { EducationPreview } from "./education";
import { ExperiencePreview } from "./experience";
import { ProjectsPreview } from "./projects";
import { SkillsPreview } from "./skills";
import { SummaryPreview } from "./summary";
import { LanguagesPreview } from "./languages";
import { cn } from "../../lib/utils";
import { usePdfSettings } from "../../store/useResume";
import { CertificationsPreview } from "./certifications";
import { AwardsPreview } from "./awards";
import { VolunteeringPreview } from "./volunteering";

const pageSizeMap = {
  width: 210,
  height: 285, // 297 - 12mm padding top and bottom
};

// MM to PX conversion
const MM_TO_PX = 3.78;

// Preview props type
interface PreviewProps {
  mode: "preview" | "print";
}

export const Page: React.FC<PreviewProps> = ({ mode }) => {
  const {
    pdfSettings: { fontSize, fontFamily },
  } = usePdfSettings();

  // Page size in pixels
  const WIDTH = pageSizeMap.width * MM_TO_PX;
  const HEIGHT = pageSizeMap.height * MM_TO_PX;

  return (
    <div
      className={cn(
        "relative bg-white text-primary dark:text-primary-foreground scale-50 md:scale-100",
        mode === "preview" ? "shadow-2xl" : "shadow-none",
        `font-${fontFamily}`
      )}
      style={{
        fontSize: `${fontSize || 14}px`,
        width: `${WIDTH}px`,
        minWidth: `${WIDTH}px`,
        minHeight: `${HEIGHT}px`,
      }}
    >
      <div
        className={cn(
          "flex-1 w-full space-y-4 preview",
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
        <CertificationsPreview />
        <AwardsPreview />
        <VolunteeringPreview />
      </div>
      {mode === "preview" && (
        <hr
          className={`border-t border-dashed border-gray-400 absolute w-full left-0`}
          style={{
            top: `${1122 - 23 * 2}px`,
          }}
        />
      )}
    </div>
  );
};
