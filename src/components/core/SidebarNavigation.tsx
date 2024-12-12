import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { SectionIcon } from "../sections/shared/SectionIcon";
import { ThemeToggler } from "./ThemeToggler";
import { usePdfSettings } from "../../store/useResume";

export const SidebarNavigation: React.FC = () => {
  const {
    setValue,
    pdfSettings: { showForm },
  } = usePdfSettings();
  // scroll into view
  const scrollIntoView = (id: string) => () => {
    const element = document.getElementById(id);
    // if the element exists, scroll to it
    if (element) {
      console.log(element);

      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // toggle menu
  const toggleMenu = () => {
    setValue("showForm", !showForm);
  };

  return (
    <aside className="flex flex-auto flex-row lg:flex-col items-center justify-between lg:justify-center gap-10 py-3 lg:py-6 px-2 shadow-md lg:border-r border-border bg-card">
      {/* Navigation */}
      <Button
        title="Menu"
        side="right"
        variant="ghost"
        size="icon"
        className="rounded-full lg:hidden"
        onClick={toggleMenu}
      >
        <Menu />
      </Button>
      <ul className="hidden lg:block">
        <li>
          <Button
            title="personal information"
            side="right"
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
            side="right"
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
            side="right"
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
            side="right"
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
            side="right"
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
            side="right"
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
            side="right"
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
            side="right"
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
            side="right"
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
            side="right"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={scrollIntoView("volunteering")}
          >
            <SectionIcon section="volunteering" />
          </Button>
        </li>
      </ul>
      <div className="mt-auto">
        <ThemeToggler />
      </div>
    </aside>
  );
};
