import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { SectionIcon } from "../sections/shared/SectionIcon";
import { ThemeToggler } from "./ThemeToggler";
import { usePdfSettings } from "../../store/useResume";
import { DownloadPDF } from "./DownloadPdf";

export const SidebarNavigation: React.FC = () => {
  const {
    setValue,
    pdfSettings: { showForm },
  } = usePdfSettings();

  // scroll into view function with -16px offset
  const scrollIntoView = (id: string) => () => {
    const element = document.getElementById(id);
    // if the element exists, scroll to it with offset
    if (element) {
      // Find the ScrollArea viewport
      const scrollViewport = document.querySelector(
        "[data-radix-scroll-area-viewport]"
      );

      if (scrollViewport) {
        const elementRect = element.getBoundingClientRect();
        const viewportRect = scrollViewport.getBoundingClientRect();
        const offsetTop =
          elementRect.top - viewportRect.top + scrollViewport.scrollTop - 16;

        scrollViewport.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      } else {
        // Fallback to regular scrollIntoView if ScrollArea not found
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // toggle menu
  const toggleMenu = () => {
    setValue("showForm", !showForm);
  };

  return (
    <aside
      className="flex flex-auto flex-row lg:flex-col items-center justify-between lg:justify-center gap-10 py-3 lg:py-6 px-2 shadow-md lg:border-r border-border bg-card"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Mobile Menu Button */}
      <Button
        title="Toggle menu"
        aria-expanded={showForm}
        aria-controls="navigation-menu"
        variant="ghost"
        size="icon"
        className="rounded-full lg:hidden"
        onClick={toggleMenu}
      >
        {showForm ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Logo */}
      <div className="flex items-center justify-center size-9 dark:invert">
        <img
          src="/logo.svg"
          alt="CV Master"
          className="size-5 object-contain"
        />
      </div>
      {/* Navigation List */}
      <nav>
        <ul
          className="hidden lg:flex flex-col gap-4 mt-auto"
          id="navigation-menu"
          role="menubar"
        >
          <li role="none">
            <Button
              title="Personal Information"
              aria-label="Personal information"
              role="menuitem"
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={scrollIntoView("basics")}
            >
              <SectionIcon section="basics" aria-hidden="true" />
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
      </nav>

      <div className="mt-auto">
        <ThemeToggler />
        <DownloadPDF className="md:hidden" />
      </div>
    </aside>
  );
};
