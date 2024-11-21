import { useResume } from "../../store/useResume";
import { Summary } from "../../types/types";
import { Text } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { RichTextEditor } from "../core/RichTextEditor";

export const SummaryForm: React.FC = () => {
  const {
    setValue,
    resumeData: { summary },
  } = useResume();

  // set default values for the form
  const defaultValues: Summary = summary;

  const [content, setContent] = useState<string>(defaultValues.content || "");

  const debouncedContent = useDebounce(content, 200);

  useEffect(() => {
    if (debouncedContent !== summary?.content) {
      setValue("summary", {
        ...summary,
        content: debouncedContent,
      });
    }
  }, [debouncedContent, setValue]);

  // handle input change
  const handleChange = (content: string) => {
    console.log(content);
    setContent(content);
  };

  return (
    <section className="grid gap-y-6" id="summary">
      <header className="flex items-center gap-4">
        <Text />
        <h2 className="text-2xl font-bold">Summary</h2>
      </header>
      <RichTextEditor content={content} handleChange={handleChange} />
    </section>
  );
};
