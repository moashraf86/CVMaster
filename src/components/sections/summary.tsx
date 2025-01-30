import { useResume } from "../../store/useResume";
import { Summary } from "../../types/types";
import { Edit2, Text } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState, useRef } from "react";
import { RichTextEditor } from "../core/RichTextEditor";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import clsx from "clsx";

export const SummaryForm: React.FC = () => {
  const {
    setData,
    resumeData: { summary },
  } = useResume();

  // set default values from the resumeData
  const defaultValues: Summary = summary;

  // set the state for the content and section title
  const [content, setContent] = useState<string>(defaultValues.content || "");
  const [sectionTitle, setSectionTitle] = useState<string>(
    defaultValues.sectionTitle || ""
  );

  // set the state for the title input visibility
  const [titleInputVisible, setTitleInputVisible] = useState<boolean>(false);

  // set the debounced content and section title
  const debouncedContent = useDebounce(content, 200);
  const debouncedSectionTitle = useDebounce(sectionTitle, 200);

  // Add ref for the input
  const titleInputRef = useRef<HTMLInputElement>(null);

  // handle input change
  const handleContentChange = (content: string) => {
    setContent(content);
  };

  // handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSectionTitle(e.target.value);
  };

  // toggle title input
  const toggleTitleInput = () => {
    setTitleInputVisible(!titleInputVisible);
    // Focus the input when becoming visible
    if (!titleInputVisible) {
      // Use setTimeout to ensure the input is visible before focusing
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 0);
    }
  };

  useEffect(() => {
    if (debouncedContent !== summary?.content) {
      setData({ summary: { ...summary, content: debouncedContent } });
    }
  }, [debouncedContent]);

  useEffect(() => {
    if (debouncedSectionTitle !== summary?.sectionTitle) {
      setData({ summary: { ...summary, sectionTitle: debouncedSectionTitle } });
    }
  }, [debouncedSectionTitle]);

  return (
    <section className="grid" id="summary" aria-labelledby="summary-heading">
      <header className="flex items-center gap-4 mb-6">
        <Text aria-hidden="true" />
        <h2
          className={clsx(`text-2xl font-bold`, titleInputVisible && "hidden")}
          id="summary-heading"
        >
          {sectionTitle || "Summary"}
        </h2>
        <Input
          ref={titleInputRef}
          value={sectionTitle}
          placeholder={sectionTitle || "Summary"}
          onChange={handleTitleChange}
          onBlur={toggleTitleInput}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") {
              titleInputRef.current?.blur();
            }
          }}
          className={clsx("w-auto", !titleInputVisible && "hidden")}
          aria-label="Edit section title"
        />
        <Button
          onClick={toggleTitleInput}
          className="rounded-full ms-auto"
          title="Edit Section Title"
          variant="ghost"
          size="icon"
          aria-label="Edit Section Title"
          aria-controls="summary-title"
          aria-expanded={titleInputVisible}
        >
          <Edit2 />
        </Button>
      </header>
      <RichTextEditor content={content} handleChange={handleContentChange} />
    </section>
  );
};
