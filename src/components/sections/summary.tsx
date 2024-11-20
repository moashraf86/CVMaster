import { Textarea } from "../ui/textarea";
import { useResume } from "../../store/useResume";
import { Summary } from "../../types/types";
import { Text } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

// form default values

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
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    e.currentTarget.style.height = "auto";
    e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
  };

  return (
    <section className="grid gap-y-6" id="summary">
      <header className="flex items-center gap-4">
        <Text />
        <h2 className="text-2xl font-bold">Summary</h2>
      </header>
      <Textarea
        rows={5}
        placeholder="I am a software engineer with 5 years of experience in building web applications. I have a strong understanding of web technologies and have worked with various front-end and back-end frameworks."
        value={content}
        onChange={handleChange}
      />
    </section>
  );
};
