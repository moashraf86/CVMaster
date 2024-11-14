import { Textarea } from "../ui/textarea";
import { useResume } from "../../store/useResume";
import { Summary } from "../../types/types";
import { Text } from "lucide-react";

// form default values
const defaultValues: Summary = {
  content: "",
};

export const SummaryForm: React.FC = () => {
  const {
    setValue,
    resumeData: { summary },
  } = useResume();

  if (!summary || Object.keys(summary).length === 0) {
    setValue("summary", defaultValues);
  }

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue("summary", {
      ...summary,
      content: e.target.value,
    });
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
        value={summary?.content}
        onChange={handleChange}
      />
    </section>
  );
};
