import { useResume } from "../../store/useResume";
import { BasicsInfo } from "../sections/basics";
import { SummaryForm } from "../sections/summary";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { SectionBase } from "../sections/shared/SectionBase";
import { SidebarNavigation } from "../core/SidebarNavigation";
import { useEffect } from "react";

export const CvForm: React.FC = () => {
  const { resumeData } = useResume();

  useEffect(() => {
    console.log(resumeData);
  }, [resumeData]);

  return (
    <div className="flex max-h-screen overflow-hidden">
      <SidebarNavigation />
      <ScrollArea>
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
