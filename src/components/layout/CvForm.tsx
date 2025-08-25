import { useResume } from "../../store/useResume";
import { BasicsInfo } from "../sections/basics";
import { SummaryForm } from "../sections/summary";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { SectionBase } from "../sections/shared/SectionBase";
import { SidebarNavigation } from "../core/SidebarNavigation";

export const CvForm: React.FC = () => {
  const { resumeData } = useResume();

  return (
    <div className="flex grow shrink-0 basis-[40%] 2xl:basis-[35%] max-h-[calc(100vh-104px)] lg:max-h-[calc(100vh-64px)] overflow-hidden bg-card border-r border-border">
      <SidebarNavigation className="hidden lg:flex" />
      <ScrollArea
        className="grow pb-6"
        style={{ paddingBottom: "env(safe-area-inset-top)" }}
      >
        <div className="flex flex-col gap-y-6 p-6">
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
