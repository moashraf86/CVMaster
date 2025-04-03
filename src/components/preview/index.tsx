import { BasicsPreview } from "./basics";
import { EducationPreview } from "./education";
import { ExperiencePreview } from "./experience";
import { ProjectsPreview } from "./projects";
import { SkillsPreview } from "./skills";
import { SummaryPreview } from "./summary";
import { LanguagesPreview } from "./languages";
import { cn } from "../../lib/utils";
import { usePdfSettings, useResume } from "../../store/useResume";
import { CertificationsPreview } from "./certifications";
import { AwardsPreview } from "./awards";
import { VolunteeringPreview } from "./volunteering";

const pageSizeMap = {
  width: 210,
  height: 297, // 297 - 12mm padding top and bottom
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

  const { sectionOrder } = useResume();

  // Page size in pixels
  const WIDTH = pageSizeMap.width * MM_TO_PX;
  const HEIGHT = pageSizeMap.height * MM_TO_PX;

  return (
    <div
      className={cn(
        "relative bg-white text-primary dark:text-primary-foreground",
        `font-${fontFamily}`
      )}
      style={{
        fontSize: `${fontSize || 14}px`,
        width: `${WIDTH}px`,
        minWidth: `${WIDTH}px`,
        minHeight: `${HEIGHT}px`,
      }}
    >
      <div className={cn("flex-1 w-full space-y-1 preview")}>
        <BasicsPreview />
        {sectionOrder.map((sectionId) => {
          switch (sectionId) {
            case "summary":
              return <SummaryPreview key={sectionId} />;
            case "experience":
              return <ExperiencePreview key={sectionId} />;
            case "projects":
              return <ProjectsPreview key={sectionId} />;
            case "skills":
              return <SkillsPreview key={sectionId} />;
            case "education":
              return <EducationPreview key={sectionId} />;
            case "languages":
              return <LanguagesPreview key={sectionId} />;
            case "certifications":
              return <CertificationsPreview key={sectionId} />;
            case "awards":
              return <AwardsPreview key={sectionId} />;
            case "volunteering":
              return <VolunteeringPreview key={sectionId} />;
            default:
              return null;
          }
        })}
      </div>
      {mode === "preview" && (
        <hr
          className={`border-t border-dashed border-gray-400 absolute w-full left-0`}
          style={{
            top: `${HEIGHT}px`,
          }}
        />
      )}
    </div>
  );
};
