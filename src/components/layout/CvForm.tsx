import { usePdfSettings, useResume } from "../../store/useResume";
import { BasicsInfo } from "../sections/basics";
import { SummaryForm } from "../sections/summary";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { SectionBase } from "../sections/shared/SectionBase";
import { SidebarNavigation } from "../core/SidebarNavigation";
import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { useLockBodyScroll, useWindowSize } from "@uidotdev/usehooks";

export const CvForm: React.FC = () => {
  const { resumeData } = useResume();
  const {
    setValue,
    pdfSettings: { showForm },
  } = usePdfSettings();
  const ref = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  useLockBodyScroll();

  useEffect(() => {
    // track the window inner width
    if (windowSize.width !== null && windowSize.width < 1024 && showForm) {
      setValue("showForm", false);
    } else if (
      windowSize.width !== null &&
      windowSize.width >= 1024 &&
      !showForm
    ) {
      setValue("showForm", true);
    }
  }, [windowSize]);

  return (
    <div className="flex max-h-screen overflow-hidden bg-card border-r border-border ">
      <SidebarNavigation />
      <ScrollArea
        ref={ref}
        className={cn(
          "!absolute top-[60px] left-0 transform -translate-x-full w-full h-full z-50 lg:block lg:!static lg:translate-x-0 lg:w-auto bg-card transition-transform duration-300",
          showForm && "translate-x-0"
        )}
      >
        <div className="grid gap-y-6 p-6">
          <BasicsInfo />
          <Separator />
          <SummaryForm />
          <Separator />
          <SectionBase
            id="experience"
            name="Experience"
            itemsCount={resumeData.experience?.length || 0}
          />
          <Separator />
          <SectionBase
            id="projects"
            name="Projects"
            itemsCount={resumeData.projects?.length || 0}
          />
          <Separator />
          <SectionBase
            id="education"
            name="Education"
            itemsCount={resumeData.education?.length || 0}
          />
          <Separator />
          <SectionBase
            id="skills"
            name="Skills"
            itemsCount={resumeData.skills?.length || 0}
          />
          <Separator />
          <SectionBase
            id="languages"
            name="Languages"
            itemsCount={resumeData.languages?.length || 0}
          />
          <SectionBase
            id="certifications"
            name="Certifications"
            itemsCount={resumeData.certifications?.length || 0}
          />
          <Separator />
          <SectionBase
            id="awards"
            name="Awards"
            itemsCount={resumeData.awards?.length || 0}
          />
          <Separator />
          <SectionBase
            id="volunteering"
            name="Volunteering"
            itemsCount={resumeData.volunteering?.length || 0}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
