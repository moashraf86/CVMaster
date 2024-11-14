import { Bot, Component, Target } from "lucide-react";
import { Button } from "../ui/button";
import { SectionIcon } from "../sections/shared/SectionIcon";
import { DownloadPDF } from "./DownloadPdf";

export const SidebarNavigation: React.FC = () => {
  // scroll into view
  const scrollIntoView = (id: string) => () => {
    const element = document.getElementById(id);
    // if the element exists, scroll to it
    if (element) {
      console.log(element);

      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="flex flex-col items-center gap-10 py-6 basis-12 shadow-md">
      {/* Logo */}
      <Target className="text-primary" />
      {/* Navigation */}
      <ul>
        <li>
          <Button
            title="Basics"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={scrollIntoView("basics")}
          >
            <SectionIcon section="basics" />
          </Button>
        </li>
        <li>
          <Button
            title="Summary"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={scrollIntoView("summary")}
          >
            <SectionIcon section="summary" />
          </Button>
        </li>
        <li>
          <Button
            title="Experience"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={scrollIntoView("experience")}
          >
            <SectionIcon section="experience" />
          </Button>
        </li>
        <li>
          <Button
            title="Projects"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={scrollIntoView("projects")}
          >
            <SectionIcon section="projects" />
          </Button>
        </li>
        <li>
          <Button
            title="Education"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={scrollIntoView("education")}
          >
            <SectionIcon section="education" />
          </Button>
        </li>
        <li>
          <Button
            title="Skills"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={scrollIntoView("skills")}
          >
            <SectionIcon section="skills" />
          </Button>
        </li>
        <li>
          <Button
            title="Languages"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={scrollIntoView("languages")}
          >
            <SectionIcon section="languages" />
          </Button>
        </li>
        <li>
          <Button
            title="Certifications"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={scrollIntoView("certifications")}
          >
            <SectionIcon section="certifications" />
          </Button>
        </li>
        <li>
          <Button
            title="Awards"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={scrollIntoView("awards")}
          >
            <SectionIcon section="awards" />
          </Button>
        </li>
        <li>
          <Button
            title="Volunteering"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={scrollIntoView("volunteering")}
          >
            <SectionIcon section="volunteering" />
          </Button>
        </li>
      </ul>
      <div className="grid mt-auto">
        <Button
          title="Template"
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Component />
        </Button>
        <DownloadPDF />
        <Button
          title="AI Review"
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Bot />
        </Button>
      </div>
    </aside>
  );
};
