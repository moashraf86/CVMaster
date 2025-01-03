import { useResume } from "../../store/useResume";
import { Summary } from "../../types/types";
import { Edit2, Text } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { RichTextEditor } from "../core/RichTextEditor";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import clsx from "clsx";

export const SummaryForm: React.FC = () => {
  const {
    setData,
    resumeData: { summary },
  } = useResume();

  // set default values for the form
  const defaultValues: Summary = summary;

  const [content, setContent] = useState<string>(defaultValues.content || "");
  const [sectionTitle, setSectionTitle] = useState<string>(
    defaultValues.sectionTitle || ""
  );
  const [titleInputVisible, setTitleInputVisible] = useState<boolean>(false);

  const debouncedContent = useDebounce(content, 200);
  const debouncedSectionTitle = useDebounce(sectionTitle, 200);

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
  };

  return (
    <section className="grid gap-y-6" id="summary">
      <header className="flex items-center gap-4">
        <Text />
        <h2
          className={clsx(`text-2xl font-bold`, titleInputVisible && "hidden")}
        >
          {sectionTitle || "Summary"}
        </h2>
        <Input
          value={sectionTitle}
          placeholder={sectionTitle || "Summary"}
          onChange={handleTitleChange}
          onBlur={toggleTitleInput}
          className={clsx("w-auto", !titleInputVisible && "hidden")}
        />
        <Button
          onClick={toggleTitleInput}
          className="rounded-full ms-auto"
          title="Edit Section Title"
          variant="ghost"
          size="icon"
        >
          <Edit2 />
        </Button>
      </header>
      <RichTextEditor content={content} handleChange={handleContentChange} />
    </section>
  );
};
