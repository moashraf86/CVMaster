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
import { MM_TO_PX, PAPER_SIZES } from "../../lib/constants";

// Preview props type
interface PreviewProps {
  mode: "preview" | "print";
}

export const Page: React.FC<PreviewProps> = ({ mode }) => {
  const {
    pdfSettings: {
      fontSize,
      fontFamily,
      verticalSpacing,
      margin,
      pageBreakLine,
    },
  } = usePdfSettings();

  const { sectionOrder } = useResume();

  // Page size in pixels
  const WIDTH = PAPER_SIZES.width * MM_TO_PX;
  const HEIGHT = PAPER_SIZES.height * MM_TO_PX;

  return (
    <div
      className={cn("relative bg-white text-black", `font-${fontFamily}`)}
      style={{
        fontSize: `${fontSize || 14}px`,
        fontFamily: fontFamily.charAt(0).toUpperCase() + fontFamily.slice(1),
        width: `${WIDTH}px`,
        minWidth: `${WIDTH}px`,
        minHeight: `${HEIGHT}px`,
      }}
    >
      <div
        className={cn("flex flex-col flex-1 w-full preview", {
          "space-y-1": verticalSpacing === 1,
          "space-y-2": verticalSpacing === 2,
          "space-y-3": verticalSpacing === 3,
          "space-y-4": verticalSpacing === 4,
          "space-y-5": verticalSpacing === 5,
          "space-y-6": verticalSpacing === 6,
          "space-y-7": verticalSpacing === 7,
          "space-y-8": verticalSpacing === 8,
          "space-y-9": verticalSpacing === 9,
          "space-y-10": verticalSpacing === 10,
        })}
      >
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
      {mode === "preview" && pageBreakLine && (
        <hr
          className={`absolute w-full left-0`}
          style={{
            top: `${HEIGHT + margin.VALUE / 2}px`,
            borderTop: "1px dashed transparent",
            borderImage:
              "repeating-linear-gradient(to right, black 0, black 8px, transparent 8px, transparent 16px) 1",
          }}
        />
      )}
    </div>
  );
};
