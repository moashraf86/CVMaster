import { useResume } from "../../store/useResume";
import { Summary } from "../../types/types";
import { Pencil, Text } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState, useRef } from "react";
import { RichTextEditor } from "../core/RichTextEditor";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const SummaryForm: React.FC = () => {
  const {
    setData,
    resumeData: { summary, sectionTitles },
  } = useResume();

  // set default values from the resumeData
  const defaultValues: Summary = summary;

  // set the state for the content and section title
  const [content, setContent] = useState<string>(defaultValues.content || "");
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [sectionTitle, setSectionTitle] = useState<string>(
    sectionTitles["summary"] || "null"
  );

  // set the debounced content and section title
  const debouncedContent = useDebounce(content, 200);

  // Add ref for the input
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Sync local state when store data changes (e.g., after import)
  useEffect(() => {
    setContent(summary?.content || "");
    setSectionTitle(sectionTitles["summary"] || "Summary");
  }, [summary?.content, sectionTitles]);

  // handle input change
  const handleContentChange = (content: string) => {
    setContent(content);
  };

  // handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSectionTitle(e.target.value);
  };

  // save the title to the resumeData
  const saveTitle = () => {
    setIsEditingTitle(false);
    setData({
      sectionTitles: { ...sectionTitles, summary: sectionTitle },
    });
  };

  useEffect(() => {
    if (debouncedContent !== summary?.content) {
      setData({ summary: { ...summary, content: debouncedContent } });
    }
  }, [debouncedContent]);

  return (
    <section className="grid" id="summary" aria-labelledby="summary-heading">
      <header className="flex items-center gap-4 mb-6">
        <Text aria-hidden />
        {isEditingTitle ? (
          <Input
            value={sectionTitle}
            ref={titleInputRef}
            onChange={handleTitleChange}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") saveTitle();
            }}
            className="w-auto"
            autoFocus
          />
        ) : (
          <h2
            className="text-2xl font-bold cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
          >
            {sectionTitle || "Summary"}
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full ms-auto"
          onClick={() => setIsEditingTitle(true)}
          title="Edit title"
        >
          <Pencil />
        </Button>
      </header>
      <RichTextEditor content={content} handleChange={handleContentChange} />
    </section>
  );
};
